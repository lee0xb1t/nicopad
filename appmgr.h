#ifndef APPMGR_H
#define APPMGR_H

#include <QObject>
#include <QNetworkAccessManager>

class AppManager : public QObject
{
    Q_OBJECT
public:
    explicit AppManager(QObject *parent = nullptr);


private:
    QNetworkAccessManager *m_nam;
};

#endif // APPMGR_H
