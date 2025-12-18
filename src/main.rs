// Prevent console window in addition to Slint window in Windows release builds when, e.g., starting the app via file manager. Ignored on other platforms.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::error::Error;

use slint::LogicalPosition;

slint::include_modules!();

fn main() -> Result<(), Box<dyn Error>> {
    let ui = AppWindow::new()?;

    // ui.on_request_increase_value({
    //     let ui_handle = ui.as_weak();
    //     move || {
    //         let ui = ui_handle.unwrap();
    //         ui.set_counter(ui.get_counter() + 1);
    //     }
    // });

    ui.global::<MathHelper>().on_to_percent(|value| value * 100.0);

    ui.on_move_window({
        let h = ui.as_weak();
        move |offset_x, offset_y|{
            let ui = h.unwrap();
            let logical_pos = ui.window().position().to_logical(ui.window().scale_factor());
            ui.window().set_position(LogicalPosition::new(logical_pos.x + offset_x, logical_pos.y + offset_y));
        }
    });

    ui.on_minium_clicked({
        let h = ui.as_weak();
        move ||{
            let ui = h.unwrap();
            ui.window().set_minimized(true);
        }
    });

    ui.on_close_clicked({
        let h = ui.as_weak();
        move ||{
            let ui = h.unwrap();
            ui.hide().unwrap();
        }
    });

    ui.run()?;

    Ok(())
}
