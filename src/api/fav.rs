use reqwest::{self, blocking::Client};
use serde::Deserialize;
use std::sync::Arc;


#[derive(Debug, Default, Deserialize, Clone)]
pub struct FavObj {
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
    pub list: Vec<FavObj>,
}

#[derive(Debug, Default, Deserialize)]
pub struct FavResp {
    pub code: i32,
    pub message: String,
    pub ttl: i32,
    pub data: FavData,
}


#[derive(Debug, Default, Deserialize, Clone)]
pub struct MediaUpperObj {
    pub mid: i64,
    pub name: String,
    pub face: String,
}

#[derive(Debug, Default, Deserialize, Clone)]
pub struct MediaObj {
    pub id: i64,
    #[serde(rename = "type")]
    pub mtype: i32,
    pub title: String,
    pub cover: String,
    pub page: i32,
    pub duration: i32,
    pub attr: i32,
    pub bv_id: String,
    pub bvid: String,
    pub upper: MediaUpperObj,
}

#[derive(Debug, Default, Deserialize, Clone)]
pub struct MediaData {
    pub info: FavObj,
    pub has_more: bool,
    pub medias: Vec<MediaObj>,
}

#[derive(Debug, Default, Deserialize)]
pub struct MediaResp {
    pub code: i32,
    pub message: String,
    pub ttl: i32,
    pub data: MediaData,
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
        } else {
            url.push_str("&web_location=333.1387");
        }
        
        let resp = self.client.get(url).send()?;
        let resp = resp.json::<FavResp>()?;
        Ok(resp)
    }

    pub fn media_list(
        &self,
        media_id: String,
        tid: Option<i32>,
        keyword: Option<String>,
        order: Option<String>,
        mtype: Option<i32>,
        pn: Option<i32>,
        ps: Option<i32>,
        platform: Option<String>,
    ) -> Result<MediaResp, Box<dyn std::error::Error>> {
        let mut url = String::from(format!("https://api.bilibili.com/x/v3/fav/resource/list?media_id={}", media_id));

        if let Some(v) = pn {
            url.push_str(&format!("&pn={}", v));
        } else {
            url.push_str("&pn=1");
        }

        if let Some(v) = ps {
            url.push_str(&format!("&ps={}", v));
        } else {
            url.push_str("&ps=36");
        }

        if let Some(v) = tid {
            url.push_str(&format!("&tid={}", v));
        } else {
            url.push_str("&tid=0");
        }

        if let Some(v) = keyword {
            url.push_str(&format!("&keyword={}", v));
        } else {
            url.push_str("&keyword=");
        }

        if let Some(v) = order {
            url.push_str(&format!("&order={}", v));
        } else {
            url.push_str("&order=mtime");
        }

        if let Some(v) = mtype {
            url.push_str(&format!("&type={}", v));
        } else {
            url.push_str("&type=0");
        }

        if let Some(v) = platform {
            url.push_str(&format!("&platform={}", v));
        } else {
            url.push_str("&platform=web");
        }

        url.push_str("&web_location=333.1387");

        let resp = self.client.get(url).send()?;
        let resp = resp.json::<MediaResp>()?;
        Ok(resp)
    }

    pub fn media_list_test(
        &self,
        media_id: String,
        tid: Option<i32>,
        keyword: Option<String>,
        order: Option<String>,
        mtype: Option<i32>,
        pn: Option<i32>,
        ps: Option<i32>,
        platform: Option<String>,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let mut url = String::from(format!("https://api.bilibili.com/x/v3/fav/resource/list?media_id={}", media_id));

        if let Some(v) = pn {
            url.push_str(&format!("&pn={}", v));
        } else {
            url.push_str("&pn=1");
        }

        if let Some(v) = ps {
            url.push_str(&format!("&ps={}", v));
        } else {
            url.push_str("&ps=36");
        }

        if let Some(v) = tid {
            url.push_str(&format!("&tid={}", v));
        } else {
            url.push_str("&tid=0");
        }

        if let Some(v) = keyword {
            url.push_str(&format!("&keyword={}", v));
        } else {
            url.push_str("&keyword=");
        }

        if let Some(v) = order {
            url.push_str(&format!("&order={}", v));
        } else {
            url.push_str("&order=mtime");
        }

        if let Some(v) = mtype {
            url.push_str(&format!("&type={}", v));
        } else {
            url.push_str("&type=0");
        }

        if let Some(v) = platform {
            url.push_str(&format!("&platform={}", v));
        } else {
            url.push_str("&platform=web");
        }

        url.push_str("&web_location=333.1387");

        println!("{}", url);

        let resp = self.client.get(url).send()?;
        let resp = resp.text()?;
        println!("{}", resp.replace("\\", ""));
        Ok(())
    }
}
