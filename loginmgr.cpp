#include "loginmgr.h"
#include "cookiemgr.h"
#include <QtNetwork>

LoginManager::LoginManager(QObject *parent)
    : QObject{parent}
    , m_nam(new QNetworkAccessManager(this))
    , m_timer(new QTimer(this))
    , m_timerMs(800)
{
    m_nam->setCookieJar(CookieManager::instance()->cookieJar());

    connect(m_nam, &QNetworkAccessManager::finished, this, &LoginManager::onNetworkFinished);
    connect(m_timer, &QTimer::timeout, this, &LoginManager::onPollTimeout);

}

void LoginManager::startLogin() {
    m_timer->stop();
    setIsLoggingIn(true);
    setStatusText("正在登录");
    setQrcodeUrl("");

    get_captcha();

}

void LoginManager::cancelLogin() {
    m_timer->stop();
}

void LoginManager::get_captcha() {
    QNetworkRequest request(QUrl("https://passport.bilibili.com/x/passport-login/web/qrcode/generate"));
    request.setAttribute(QNetworkRequest::User, LoginManager::GetCaptcha);
    m_nam->get(request);
}

void LoginManager::poll(QString qrcodekey) {
    QUrl url = QUrl("https://passport.bilibili.com/x/passport-login/web/qrcode/poll");

    QUrlQuery query;
    query.addQueryItem("qrcode_key", qrcodekey);
    url.setQuery(query);

    QNetworkRequest request(url);
    request.setAttribute(QNetworkRequest::User, LoginManager::Poll);
    m_nam->get(request);
}


void LoginManager::start_poll(QString qrcodekey) {
    m_currentQrcodeKey = qrcodekey;
    m_timer->start(m_timerMs);
}

void LoginManager::onNetworkFinished(QNetworkReply *reply) {
    if (!reply) return;

    if (reply->error() == QNetworkReply::NoError) {
        QVariant maker = reply->request().attribute(QNetworkRequest::User);
        if (maker.isValid()) {
            QByteArray jsonData = reply->readAll();

            QJsonParseError error;
            QJsonDocument doc = QJsonDocument::fromJson(jsonData, &error);

            if (error.error != QJsonParseError::NoError) {
                emit loginError(error.errorString());
                reply->deleteLater();
                return;
            }

            if (maker.isValid() && maker == LoginManager::GetCaptcha) {
                if (doc.isObject()) {
                    QJsonObject jsonObj = doc.object();
                    QJsonValue codeVal = jsonObj["code"];
                    QJsonValue msgVal = jsonObj["message"];

                    if (codeVal.toInt(-1) != 0) {
                        emit loginError(msgVal.toString(""));
                    } else {
                        QJsonValue dataVal = jsonObj["data"];
                        if (dataVal.isObject()) {
                            QJsonObject dataObj = dataVal.toObject();
                            onQRCodeReceived(
                                dataObj["url"].toString(),
                                dataObj["qrcode_key"].toString()
                                );
                        } else {
                            emit loginError("url or qrcode_key is not found");
                        }
                    }
                }
            } else if (maker == LoginManager::Poll) {
                if (doc.isObject()) {
                    QJsonObject jsonObj = doc.object();
                    handlePoll(jsonObj);
                }
            }
        }

    } else {
        emit loginError(reply->errorString());
    }

    reply->deleteLater();
}

void LoginManager::onPollTimeout() {
    poll(m_currentQrcodeKey);
}

void LoginManager::handlePoll(QJsonObject jsonObj) {
    QJsonValue codeVal = jsonObj["code"];
    QJsonValue msgVal = jsonObj["message"];

    if (codeVal.toInt(-1) != 0) {
        emit loginError(msgVal.toString(""));
    } else {
        QJsonValue dataVal = jsonObj["data"];
        if (dataVal.isObject()) {
            QJsonObject dataObj = dataVal.toObject();
            int code = dataObj["code"].toInt(-1);
            // 0：扫码登录成功
            // 86038：二维码已失效
            // 86090：二维码已扫码未确认
            // 86101：未扫码
            if (code == 0) {
                setStatusText("登录成功");
                setIsLoggingIn(false);
                m_timer->stop();
                emit loginSuccess(dataObj["refresh_token"].toString());
            } else if (code == 86038) {
                setStatusText("二维码已失效");
                setIsLoggingIn(false);
                emit qrcodeInvalid();
                m_timer->stop();
            }

        } else {
            emit loginError("url or qrcode_key is not found");
        }
    }
}


void LoginManager::onQRCodeReceived(const QString& url, const QString& qrcodekey) {
    setQrcodeUrl(url);
    setStatusText("等待扫码");
    start_poll(qrcodekey);
}

QString LoginManager::qrcodeUrl() const
{
    return m_qrcodeUrl;
}

void LoginManager::setQrcodeUrl(const QString &newQrcodeUrl)
{
    if (m_qrcodeUrl == newQrcodeUrl)
        return;
    m_qrcodeUrl = newQrcodeUrl;
    emit qrcodeUrlChanged();
}

bool LoginManager::isLoggingIn() const
{
    return m_isLoggingIn;
}

void LoginManager::setIsLoggingIn(bool newIsLoggingIn)
{
    if (m_isLoggingIn == newIsLoggingIn)
        return;
    m_isLoggingIn = newIsLoggingIn;
    emit isLoggingInChanged();
}

QString LoginManager::statusText() const
{
    return m_statusText;
}

void LoginManager::setStatusText(const QString &newStatusText)
{
    if (m_statusText == newStatusText)
        return;
    m_statusText = newStatusText;
    emit statusTextChanged();
}
