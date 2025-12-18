pub mod qrcode {
    use reqwest::{self};
    use serde::Deserialize;

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
        pub timestamp: i32,
        pub code: i32,
        pub message: i32,
    }

    #[derive(Debug, Default, Deserialize)]
    pub struct QRCodePollResp {
        pub code: i32,
        pub message: String,
        pub data: QRCodePollData,
    }

    pub fn generate() -> Result<QRCodeResp, Box<dyn std::error::Error>> {
        let resp = reqwest::blocking::get(
            "https://passport.bilibili.com/x/passport-login/web/qrcode/generate",
        )?;
        let resp = resp.json::<QRCodeResp>()?;
        Ok(resp)
    }

    pub fn poll(qrcode_key: String) -> Result<QRCodePollResp, Box<dyn std::error::Error>> {
        let resp = reqwest::blocking::get(format!(
            "https://passport.bilibili.com/x/passport-login/web/qrcode/poll?qrcode_key={}",
            qrcode_key
        ))?;
        let resp = resp.json::<QRCodePollResp>()?;
        Ok(resp)
    }
}
