#include "cookiemgr.h"

CookieManager::CookieManager(QObject *parent)
    : QObject{parent}
{}

QNetworkCookieJar *CookieManager::cookieJar() {
    return &m_cookieJar;
}
