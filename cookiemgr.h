#ifndef COOKIEMGR_H
#define COOKIEMGR_H

#include <QObject>
#include <QNetworkCookieJar>

class CookieManager : public QObject
{
    Q_OBJECT
public:
    static CookieManager *instance() {
        static CookieManager cm;
        return &cm;
    }

    QNetworkCookieJar *cookieJar();

signals:

private:
    explicit CookieManager(QObject *parent = nullptr);

    QNetworkCookieJar m_cookieJar;
};

#endif // COOKIEMGR_H
