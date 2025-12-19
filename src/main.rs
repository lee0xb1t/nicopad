// Prevent console window in addition to Slint window in Windows release builds when, e.g., starting the app via file manager. Ignored on other platforms.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::atomic::AtomicBool;
use std::sync::mpsc::channel;
use std::sync::{Arc, Mutex};
use std::time::Duration;
use std::{error::Error, thread};
use std::rc::Rc;

use image::Rgb;
use qrcode::QrCode;
use slint::{LogicalPosition, SharedString, VecModel, ModelRc};

use nicopad::api::{self, ApiClient, fav};

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

    // user
    ui.on_request_login({
        let h = ui.as_weak();
        let app_state = Arc::clone(&app_state);
        move || {
            let ui = h.unwrap();

            let qrcode = api.qrcode();
            let qrcoderesp = qrcode.generate().expect("Failed to load qrcode url");
            println!("{:#?}", qrcoderesp);

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

                                let face_image = api::load_image(info.data.face.clone()).unwrap();
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

fn create_favlist_model(data: Vec<fav::FavList>) -> ModelRc<FavListModel> {
    let base_model = Rc::new(VecModel::from(data));

    let mapped_model = base_model.map(|item| FavListModel {
        id: SharedString::from(&item.mlid.to_string()),
        title: SharedString::from(&item.title),
    });

    ModelRc::new(mapped_model)
}
