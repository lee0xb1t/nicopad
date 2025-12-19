use reqwest::{self, blocking::Client};
use serde::Deserialize;
use std::sync::Arc;

#[derive(Debug, Default, Deserialize)]
pub struct VipData {
    #[serde(rename = "type")]
    pub vip_type: i32,
    pub status: i32,
}

#[derive(Debug, Default, Deserialize)]
pub struct UserInfoData {
    pub mid: i32,
    pub name: String,
    pub face: String,
    pub level: i32,
    pub vip: VipData,
}

#[derive(Debug, Default, Deserialize)]
pub struct UserInfoResp {
    pub code: i32,
    pub message: String,
    pub ttl: i32,
    pub data: UserInfoData,
}

pub struct UserApi {
    pub client: Arc<Client>,
}

impl UserApi {
    pub fn myinfo(&self) -> Result<UserInfoResp, Box<dyn std::error::Error>> {
        let resp = self
            .client
            .get("https://api.bilibili.com/x/space/myinfo")
            .send()?;
        let resp = resp.json::<UserInfoResp>()?;
        Ok(resp)
    }
}
