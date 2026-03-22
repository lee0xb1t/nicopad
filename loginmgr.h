#ifndef LOGINMGR_H
#define LOGINMGR_H

#include <QObject>
#include <QString>
#include <QtNetwork>
#include <QJsonObject>
#include <QTimer>

class LoginManager : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString qrcodeUrl READ qrcodeUrl WRITE setQrcodeUrl NOTIFY qrcodeUrlChanged FINAL)
    Q_PROPERTY(QString statusText READ statusText WRITE setStatusText NOTIFY statusTextChanged FINAL)
    Q_PROPERTY(bool isLoggingIn READ isLoggingIn WRITE setIsLoggingIn NOTIFY isLoggingInChanged FINAL)
public:
    enum LoginAction {
        GetCaptcha,
        Poll,
    };
    Q_ENUM(LoginAction)

    explicit LoginManager(QObject *parent = nullptr);

    Q_INVOKABLE void startLogin();
    Q_INVOKABLE void cancelLogin();

    QString qrcodeUrl() const;
    void setQrcodeUrl(const QString &newQrcodeUrl);

    bool isLoggingIn() const;
    void setIsLoggingIn(bool newIsLoggingIn);

    QString statusText() const;
    void setStatusText(const QString &newStatusText);

public slots:
    void onNetworkFinished(QNetworkReply *reply);
    void onPollTimeout();

signals:
    void loginError(const QString& error);
    void loginSuccess(const QString& refresh_token);
    void qrcodeInvalid();

    void qrcodeUrlChanged();

    void isLoggingInChanged();

    void statusTextChanged();

private:
    void get_captcha();
    void poll(QString qrcodekey);
    void start_poll(QString qrcodekey);
    void handlePoll(QJsonObject jsonObj);
    void onQRCodeReceived(const QString& url, const QString& qrcodekey);

    QNetworkAccessManager *m_nam;
    QTimer *m_timer;
    int m_timerMs;
    QString m_currentQrcodeKey;

    QString m_qrcodeUrl;
    bool m_isLoggingIn;
    QString m_statusText;
};

#endif // LOGINMGR_H
