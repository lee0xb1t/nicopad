use reqwest::{self, blocking::Client};
use std::sync::Arc;

pub mod fav;
pub mod qrcode;
pub mod user;
pub mod video;

pub struct ApiClient {
    client: Arc<Client>,
}

impl ApiClient {
    pub fn new() -> Self {
        Self {
            client: Arc::new(
                Client::builder()
                    .user_agent("NICOPAD/0.0")
                    .cookie_store(true).build().unwrap()
            ),
        }
    }

    pub fn load_image(&self, url: String) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        let resp = self.client.get(url).send()?;
        let resp = resp.bytes()?;
        Ok(resp.to_vec())
    }

    pub fn qrcode(&self) -> qrcode::QRCodeApi {
        qrcode::QRCodeApi {
            client: Arc::clone(&self.client),
        }
    }

    pub fn user(&self) -> user::UserApi {
        user::UserApi {
            client: Arc::clone(&self.client),
        }
    }

    pub fn fav(&self) -> fav::FavApi {
        fav::FavApi {
            client: Arc::clone(&self.client),
        }
    }

    pub fn video(&self, bvid: String) -> video::VideoApi {
        video::VideoApi::new(Arc::clone(&self.client), bvid)
    }
}
