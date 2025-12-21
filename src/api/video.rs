use md5::digest::block_buffer::Error;
use reqwest::{self, blocking::Client};
use serde::Deserialize;
use std::{char, sync::Arc};

const XOR_CODE: i64 = 23442827791579;
const MASK_CODE: i64 = 2251799813685247;
const MAX_AID: i64 = 1 << 51;
const DATA: &[u8] = b"FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf";
const BASE: i64 = 58;


pub fn bvid2avid(bvid: String) -> Result<i64, String> {
    if !bvid.starts_with("BV") || bvid.len() != 12 {
        return Err(format!("Invalid bvid: {}", bvid));
    }

    let mut bvid_chars = bvid.chars().collect::<Vec<char>>();

    bvid_chars.swap(3, 9);
    bvid_chars.swap(4, 7);

    let bvid_chars = bvid_chars.iter().skip(3).collect::<String>();

    let mut tmp = 0i64;
    for ch in bvid_chars.chars() {
        let idx = DATA.iter()
            .position(|&c| c == ch as u8)
            .ok_or_else(|| format!("Invalid char: {}", ch))? as i64;
        
        tmp = tmp.wrapping_mul(BASE).wrapping_add(idx);
    }
    
    Ok((tmp & MASK_CODE) ^ XOR_CODE)
}

pub struct VideoApi {
    client: Arc<Client>,
    bvid: String,
}

impl VideoApi {
    pub fn new(client: Arc<Client>, bvid: String) -> Self {
        Self {
            client, 
            bvid,
        }
    }

    pub fn playurl(&self, cid: Option<i32>, html5: Option<bool>) -> Result<String, Box<dyn std::error::Error>> {

        let mut url = String::from(format!(
            "https://api.bilibili.com/x/player/wbi/playurl?bvid={}&avid={}",
            self.bvid.clone(), bvid2avid(self.bvid.clone()).unwrap()
        ));

        if let Some(v) = cid {
            url.push_str(&format!("&cid={}", v));
        } else {
            url.push_str("&cid=");
        }

        url.push_str("&qn=127");
        url.push_str("&fnval=4048");
        url.push_str("&fnver=0");
        url.push_str("&fourk=1");
        url.push_str("&gaia_source=pre-load");
        url.push_str("&isGaiaAvoided=true");
        url.push_str("&from_client=BROWSER");

        if let Some(_) = html5 {
            url.push_str("&platform=html5");
            url.push_str("&high_quality=1");
        }

        let resp = self.client.get(url).send()?;
        Ok(resp.text().unwrap())
    }
}
