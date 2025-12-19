use reqwest::{self, blocking::Client};
use serde::Deserialize;
use std::sync::Arc;

#[derive(Debug, Default, Deserialize)]
pub struct QRCodeData {
    pub url: String,
    pub qrcode_key: String,
}

#[derive(Debug, Default, Deserialize)]
pub struct QRCodeResp {
    pub code: i32,
    pub message: String,
    pub ttl: i32,
    pub data: QRCodeData,
}

#[derive(Debug, Default, Deserialize)]
pub struct QRCodePollData {
    pub url: String,
    pub refresh_token: String,
    pub timestamp: i64,
    pub code: i32,
    pub message: String,
}

#[derive(Debug, Default, Deserialize)]
pub struct QRCodePollResp {
    pub code: i32,
    pub message: String,
    pub data: QRCodePollData,
}

pub struct QRCodeApi {
    pub client: Arc<Client>,
}

impl QRCodeApi {
    pub fn generate(&self) -> Result<QRCodeResp, Box<dyn std::error::Error>> {
        let resp = self
            .client
            .get("https://passport.bilibili.com/x/passport-login/web/qrcode/generate")
            .send()?;
        let resp = resp.json::<QRCodeResp>()?;
        Ok(resp)
    }

    pub fn poll(&self, qrcode_key: String) -> Result<QRCodePollResp, Box<dyn std::error::Error>> {
        let resp = self
            .client
            .get(format!(
                "https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key={}",
                qrcode_key
            ))
            .send()?;
        let resp = resp.json::<QRCodePollResp>()?;
        Ok(resp)
    }
}
