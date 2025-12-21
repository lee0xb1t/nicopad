// Prevent console window in addition to Slint window in Windows release builds when, e.g., starting the app via file manager. Ignored on other platforms.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;
use std::sync::atomic::AtomicBool;
use std::sync::mpsc::channel;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use std::{error::Error, thread};
use std::rc::Rc;

use image::imageops::FilterType;
use md5::{Md5, Digest};

use image::{EncodableLayout, Rgb};
use qrcode::QrCode;
use slint::{LogicalPosition, SharedString, VecModel, ModelRc};

use nicopad::api::{self, ApiClient, fav, video};

slint::include_modules!();

#[derive(Debug, Default)]
struct AppState {
    poll_url: String,
    refresh_token: String,
    timestamp: i64,

    mid: i32,
    name: String,
    face: String,
    level: i32,
    vip_type: i32,
    status: i32,

    favlist: fav::FavData,
}

fn main() -> Result<(), Box<dyn Error>> {
    std::fs::create_dir_all("./_cache")?;

    let app_state = Arc::new(Mutex::new(AppState::default()));
    let api = Arc::new(api::ApiClient::new());

    let ui = AppWindow::new()?;

    ui.global::<MathHelper>()
        .on_to_percent(|value| value * 100.0);

    ui.on_move_window({
        let h = ui.as_weak();
        move |offset_x, offset_y| {
            let ui = h.unwrap();
            let logical_pos = ui
                .window()
                .position()
                .to_logical(ui.window().scale_factor());
            ui.window().set_position(LogicalPosition::new(
                logical_pos.x + offset_x,
                logical_pos.y + offset_y,
            ));
        }
    });
    ui.on_minium_clicked({
        let h = ui.as_weak();
        move || {
            let ui = h.unwrap();
            ui.window().set_minimized(true);
        }
    });
    ui.on_close_clicked({
        let h = ui.as_weak();
        move || {
            let ui = h.unwrap();
            ui.hide().unwrap();
        }
    });

    // TODO load image
    // ui.on_load_image({
    //     let h: slint::Weak<AppWindow> = ui.as_weak();
    //     move |url: SharedString, img: slint::Image| -> slint::Image {
    //         let ui = h.unwrap();
    //         println!("{}", url.to_string());
            
    //         let buffer = img.to_rgb8();
    //         println!("1");
    //         if let Some(mut b) = buffer {
    //             let image = api::load_image(url.into()).unwrap();
    //             let image = image::load_from_memory(&image).unwrap();
    //             let image = image.resize(200, 110, FilterType::Triangle);
    //             let buffer = slint::SharedPixelBuffer::<slint::Rgb8Pixel>::clone_from_slice(
    //                 image.as_bytes(),
    //                 200,
    //                 110,
    //             );
    //             println!("2");
    //             let simage = slint::Image::from_rgb8(buffer);
    //             println!("3");
    //             // b.make_mut_slice().copy_from_slice(simage.to_rgb8().unwrap().as_slice());
    //             // simage.to_rgb8().unwrap().as_slice();
    //             println!("{}, {}", b.make_mut_slice().len(), simage.to_rgb8().unwrap().as_slice().len());
    //             // b.make_mut_slice().copy_from_slice(simage.to_rgb8().unwrap().as_slice());
    //             let a = simage.to_rgb8().unwrap();
    //             let a = a.as_slice();
    //             unsafe {
    //                 std::ptr::copy_nonoverlapping(a.as_ptr(), b.make_mut_slice().as_mut_ptr(), a.len());
    //             }
                
    //         } else {
    //             println!("buffer is None");
    //         }

    //         // let filename = Path::new(&url).file_name().and_then(|s|s.to_str()).unwrap();
    //         // let file = format!("_cache/{}", filename);
            
    //         // let path = std::path::Path::new(&file);
    //         // if !path.exists() {
    //         //     std::fs::File::create(format!("_cache/{}", filename)).unwrap();
    //         // } else {
    //         //     let filename_clone = filename.to_string().clone();
    //         //     thread::spawn(move || {
    //         //         let image = api::load_image(url.into()).unwrap();
    //         //         let image = image::load_from_memory(&image).unwrap();
    //         //         image.save(format!("_cache/{}", filename_clone)).unwrap();
    //         //     });
    //         // }

    //         slint::Image::default()
            
    //         // let image = api::load_image(url.into()).unwrap();
    //         // let image = image::load_from_memory(&image).unwrap();
    //         // let buffer = slint::SharedPixelBuffer::<slint::Rgb8Pixel>::clone_from_slice(
    //         //     image.as_bytes(),
    //         //     image.width(),
    //         //     image.height(),
    //         // );
    //         // slint::Image::from_rgb8(buffer)
    //     }
    // });

    // user
    ui.on_request_login({
        let h = ui.as_weak();
        let app_state = Arc::clone(&app_state);
        let api = Arc::clone(&api);
        move || {
            let ui = h.unwrap();

            let qrcode = api.qrcode();
            let qrcoderesp = qrcode.generate().expect("Failed to load qrcode url");

            let qrcode = QrCode::new(qrcoderesp.data.url).expect("Failed to create qrcode");
            let qrcode = qrcode.render::<Rgb<u8>>().min_dimensions(200, 200).build();

            let buffer = slint::SharedPixelBuffer::<slint::Rgb8Pixel>::clone_from_slice(
                qrcode.as_raw(),
                qrcode.width(),
                qrcode.height(),
            );

            ui.set_qrcode(slint::Image::from_rgb8(buffer));

            let h = ui.as_weak();
            let app_state = Arc::clone(&app_state);
            let api = Arc::clone(&api);
            on_request_login(h, qrcoderesp.data.qrcode_key, app_state, api);
        }
    });

    // fav
    ui.on_fav_entry_clicked({
        let h = ui.as_weak();
        let api = Arc::clone(&api);

        move |favid| {
            let ui = h.unwrap();

            let h = ui.as_weak();
            let api = Arc::clone(&api);
            on_fav_entry_clicked(h, favid.to_string(), api);
        }
    });

    // play list
    ui.on_play_entry_clicked({
        let h = ui.as_weak();
        let api = Arc::clone(&api);

        move |bvid, title, cover, duration, duration_mins | {
            let ui = h.unwrap();

            let h = ui.as_weak();
            let api = Arc::clone(&api);
            
            let avid = video::bvid2avid(bvid.into()).unwrap();
            println!("avid: {avid}");

            // TODO get video url and anti spider

            // let s = api.video().playurl(bvid.to_string(), None, None);
            // println!("playurl: {}", s.unwrap());
        }
    });


    ui.run()?;

    Ok(())
}

fn on_request_login(
    ui_weak: slint::Weak<AppWindow>,
    qrcode_key: String,
    app_state: Arc<Mutex<AppState>>,
    api: Arc<ApiClient>,
) {
    let (result_tx, result_rx) = channel::<api::qrcode::QRCodePollResp>();
    let is_stop = Arc::new(AtomicBool::new(false));

    let is_stop_clone = Arc::clone(&is_stop);
    let api_clone = Arc::clone(&api);
    let result_tx_clone = result_tx.clone();

    thread::spawn(move || {
        loop {
            thread::sleep(Duration::from_millis(500));

            let poll_resp = api_clone.qrcode()
                .poll(qrcode_key.clone())
                .expect("Failed to poll qrcode status");

            if is_stop_clone.load(std::sync::atomic::Ordering::SeqCst) {
                break;
            }

            result_tx_clone.send(poll_resp).unwrap();
        }
    });

    let is_stop_clone = Arc::clone(&is_stop);
    let app_state_clone = Arc::clone(&app_state);
    let api_clone = Arc::clone(&api);

    slint::invoke_from_event_loop(move || {
        if let Some(ui) = ui_weak.upgrade() {
            let timer = Arc::new(slint::Timer::default());

            let is_stop_clone = Arc::clone(&is_stop_clone);
            let api_clone = Arc::clone(&api_clone);
            let ui_weak = ui.as_weak();

            timer.start(slint::TimerMode::Repeated, Duration::from_millis(500), {
                let t = Arc::clone(&timer);
                move || {
                    if let Ok(r) = result_rx.try_recv() {
                        match r.data.code {
                            0 => {
                                is_stop_clone.store(true, std::sync::atomic::Ordering::SeqCst);
                                t.stop();

                                let mut apps = app_state_clone.lock().unwrap();
                                apps.poll_url = r.data.url;
                                apps.refresh_token = r.data.refresh_token;
                                apps.timestamp = r.data.timestamp;

                                let info = api_clone.user().myinfo().unwrap();
                                apps.mid = info.data.mid;
                                apps.name = info.data.name.clone();
                                apps.face = info.data.face.clone();
                                apps.level = info.data.level;
                                apps.vip_type = info.data.vip.vip_type;
                                apps.status = info.data.vip.status;

                                let face_image = api.load_image(info.data.face.clone()).unwrap();
                                let face_image = image::load_from_memory(&face_image).unwrap();
                                let face_image = slint::SharedPixelBuffer::clone_from_slice(
                                    face_image.as_bytes(),
                                    face_image.width(),
                                    face_image.height(),
                                );

                                if let Some(ui) = ui_weak.upgrade() {
                                    ui.set_is_login(true);
                                    ui.set_is_vip(info.data.vip.status != 0);
                                    ui.set_user_id(info.data.mid);
                                    ui.set_user_name(SharedString::from(info.data.name.clone()));
                                    ui.set_user_image(slint::Image::from_rgb8(face_image));
                                    ui.invoke_close_login_qrcode();
                                }

                                // load fav list
                                let favlist = api.fav().list_all(info.data.mid, None, None, None).unwrap();
                                apps.favlist = favlist.data.clone();

                                let favlist_model = create_favlist_model(favlist.data.list.clone());
                                ui.set_fav_list(favlist_model);
                            }
                            86101 => {
                                // waiting scan code
                            }
                            86090 => {
                                // scanned code
                                if let Some(ui) = ui_weak.upgrade() {
                                    ui.set_is_scan_qrcode(true);
                                }
                            }
                            _ => {
                                is_stop_clone.store(true, std::sync::atomic::Ordering::SeqCst);
                                t.stop();

                                println!("{:#?}", r);
                                panic!("unknown code: {}", r.data.code);
                            }
                        }
                    }
                }
            });
        }
    })
    .unwrap();
}

fn create_favlist_model(data: Vec<fav::FavObj>) -> ModelRc<FavListModel> {
    let base_model = Rc::new(VecModel::from(data));

    let mapped_model = base_model.map(|item| FavListModel {
        id: SharedString::from(&item.mlid.to_string()),
        title: SharedString::from(&item.title),
    });

    ModelRc::new(mapped_model)
}

fn on_fav_entry_clicked(
    ui_weak: slint::Weak<AppWindow>,
    favid: String,
    api: Arc<ApiClient>,
) {
    let mut has_more = true;
    let mut media_list: Vec<fav::MediaObj> = vec![];
    let mut pn = 1;
    while has_more {
        let resp = api.fav().media_list(favid.clone(), None, None, None, None, Some(pn), Some(36), None);
        match resp {
            Ok(r) => {
                let medias = r.data.medias.clone();
                if medias.len() > 0 {
                    for v in medias {
                        media_list.push(v);
                    }
                }
                has_more = r.data.has_more;
                if !has_more {break;}
                pn += 1;
            },
            Err(e) => {
                eprintln!("{:?}", e);
                has_more = false;
                break;
            }
        }
    }
    
    let base_model = Rc::new(VecModel::from(media_list));

    let mapped_model = base_model.map(|item| {
        // let buffer = slint::SharedPixelBuffer::<slint::Rgb8Pixel>::new(200, 110);
        MediaListModel {
            bvid: SharedString::from(&item.bvid),
            title: SharedString::from(&item.title),
            duration: item.duration,
            duration_mins: format!("{}:{:02}", (item.duration as f32 / 60f32).floor() as i32, item.duration % 60).into(),
            cover: item.cover.into(),
            uid: SharedString::from(&item.upper.mid.to_string()),
            uname: SharedString::from(&item.upper.name),
            cover_image: slint::Image::default(),
        }
    });

    let m = ModelRc::new(mapped_model);

    // resp.data.medias
    if let Some(ui) = ui_weak.upgrade() {
        ui.set_play_list(m);
        ui.set_has_more(has_more);
    }
    
}
