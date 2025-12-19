use reqwest::{self, blocking::Client};
use serde::Deserialize;
use std::sync::Arc;

#[derive(Debug, Default, Deserialize)]
pub struct VipData {
    #[serde(rename = "type")]
    pub vip_type: i32,
    pub status: i32,
}

#[derive(Debug, Default, Deserialize, Clone)]
pub struct FavList {
    #[serde(rename = "id")]
    pub mlid: i64,
    pub fid: i64,
    pub attr: i32,
    pub title: String,
    pub fav_state: i32,
    pub media_count: i32,
}

#[derive(Debug, Default, Deserialize, Clone)]
pub struct FavData {
    pub count: i32,
    pub list: Vec<FavList>,
}

#[derive(Debug, Default, Deserialize)]
pub struct FavResp {
    pub code: i32,
    pub message: String,
    pub ttl: i32,
    pub data: FavData,
}

pub struct FavApi {
    pub client: Arc<Client>,
}

impl FavApi {
    pub fn list_all(
        &self,
        mid: i32,
        mltype: Option<i32>,
        rid: Option<i32>,
        web_location: Option<String>,
    ) -> Result<FavResp, Box<dyn std::error::Error>> {
        let mut url = String::from(format!(
            "https://api.bilibili.com/x/v3/fav/folder/created/list-all?up_mid={}",
            mid
        ));
        if let Some(v) = mltype {
            url.push_str(&format!("&type={}", v));
        }
        if let Some(v) = rid {
            url.push_str(&format!("&rid={}", v));
        }
        if let Some(v) = web_location {
            url.push_str(&format!("&web_location={}", v));
        }
        let resp = self.client.get(url).send()?;
        let resp = resp.json::<FavResp>()?;
        Ok(resp)
    }
}
