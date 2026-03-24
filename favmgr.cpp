#include "favmgr.h"
#include "cookiemgr.h"

FavManager::FavManager(QObject *parent)
    : QObject{parent}
    , m_nam(new QNetworkAccessManager(this))
{
    m_nam->setCookieJar(CookieManager::instance()->cookieJar());
    connect(m_nam, &QNetworkAccessManager::finished, this, &FavManager::onNetworkFinished);
}

void FavManager::fetchFavList(QString uid) {
    qDebug() << uid;
    QUrl url = QString("https://api.bilibili.com/x/v3/fav/folder/created/list-all");

    // TODO add `page number` and `page size`
    QUrlQuery query;
    query.addQueryItem("up_mid", uid);
    url.setQuery(query);

    QNetworkRequest request(url);
    request.setAttribute(QNetworkRequest::User, FavManager::FetchFavList);
    m_nam->get(request);
}

void FavManager::onNetworkFinished(QNetworkReply *reply) {
    if (!reply) return;

    if (reply->error() == QNetworkReply::NoError) {
        QVariant maker = reply->request().attribute(QNetworkRequest::User);
        if (maker.isValid()) {
            QByteArray jsonData = reply->readAll();

            QJsonParseError error;
            QJsonDocument doc = QJsonDocument::fromJson(jsonData, &error);

            if (error.error != QJsonParseError::NoError) {
                emit favMgrError(error.errorString());
                reply->deleteLater();
                return;
            }

            if (maker.isValid() && maker == FavManager::FetchFavList) {
                if (doc.isObject()) {
                    QJsonObject jsonObj = doc.object();
                    QJsonValue codeVal = jsonObj["code"];
                    QJsonValue msgVal = jsonObj["message"];

                    if (codeVal.toInt(-1) != 0) {
                        emit favMgrError(msgVal.toString(""));
                    } else {
                        QJsonValue dataVal = jsonObj["data"];
                        if (dataVal.isNull()) {
                            emit favMgrError("this fav list is hide");
                        } else if (dataVal.isObject()) {
                            QJsonObject dataObj = dataVal.toObject();
                            onFavListReceived(dataObj);
                        } else {
                            emit favMgrError("url or qrcode_key is not found");
                        }
                    }
                }
            }
        }

    } else {
        emit favMgrError(reply->errorString());
    }

    reply->deleteLater();
}

void FavManager::onFavListReceived(const QJsonObject& jsonObj) {
    int count = jsonObj["count"].toInt(0);
    if (count == 0) {
        emit favMgrError("this fav list is hide");
        return;
    }

    QJsonValue list = jsonObj["list"];
    if (!list.isArray()) {
        return;
    }

    QJsonArray listArr = list.toArray();

    for (int i = 0; i < count; i++) {
        QJsonValue data = listArr[i];
        QJsonObject dataObj = data.toObject();

        FavItem *itemModel = new FavItem;
        itemModel->setFavId(QString::number(dataObj["id"].toInteger()));
        itemModel->setUid(QString::number(dataObj["mid"].toInteger()));
        itemModel->setTitle(dataObj["title"].toString());
        itemModel->setCover(dataObj["cover"].toString());
        itemModel->setCtime(dataObj["ctime"].toInteger(0));

        addItems(itemModel);
    }

    emit favListLoaded();
}

QList<FavItem *> FavManager::items() const
{
    return m_items;
}

qsizetype FavManager::count() const
{
    return m_count;
}

void FavManager::addItems(FavItem *itemModel) {
    itemModel->setParent(this);
    m_items.append(itemModel);
    m_count = m_items.count();
    emit itemsChanged();
    emit countChanged();
}
