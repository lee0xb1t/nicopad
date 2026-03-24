#include "videolistmodel.h"
#include "cookiemgr.h"

VideoListModel::VideoListModel(QObject *parent)
    : QAbstractListModel(parent)
    , m_nam(new QNetworkAccessManager(this))
    , m_pageNum(1)
    , m_pageSize(20)
    , m_hasMore(false)
{
    m_nam->setCookieJar(CookieManager::instance()->cookieJar());

    connect(m_nam, &QNetworkAccessManager::finished, this, &VideoListModel::onNetworkFinished);
}

QString VideoListModel::favId() const
{
    return m_favId;
}

void VideoListModel::setFavId(const QString &newFavId)
{
    if (m_favId == newFavId)
        return;
    m_favId = newFavId;
    emit favIdChanged();

    setHasMore(false);

    if (!m_items.isEmpty()) {
        beginResetModel(); // 或者使用 removeRows，reset 更简单粗暴
        // qDeleteAll(m_items);
        m_items.clear();
        endResetModel();
        emit itemsChanged();
    }

    setPageNum(1);
    setHasMore(true);

    fetchVideoList();
}

int VideoListModel::pageNum() const
{
    return m_pageNum;
}

void VideoListModel::setPageNum(int newPageNum)
{
    if (m_pageNum == newPageNum)
        return;
    m_pageNum = newPageNum;
    emit pageNumChanged();
}

int VideoListModel::pageSize() const
{
    return m_pageSize;
}

void VideoListModel::setPageSize(int newPageSize)
{
    if (m_pageSize == newPageSize)
        return;
    m_pageSize = newPageSize;
    emit pageSizeChanged();
}

void VideoListModel::onNetworkFinished(QNetworkReply *reply) {
    if (!reply) return;

    if (reply->error() == QNetworkReply::NoError) {
        QVariant maker = reply->request().attribute(QNetworkRequest::User);
        if (maker.isValid()) {
            QByteArray jsonData = reply->readAll();

            QJsonParseError error;
            QJsonDocument doc = QJsonDocument::fromJson(jsonData, &error);

            if (error.error != QJsonParseError::NoError) {
                emit errorMsg(error.errorString());
                reply->deleteLater();
                return;
            }

            if (maker.isValid() && maker == VideoListModel::FetchVideoList) {
                if (doc.isObject()) {
                    QJsonObject jsonObj = doc.object();
                    QJsonValue codeVal = jsonObj["code"];
                    QJsonValue msgVal = jsonObj["message"];

                    if (codeVal.toInt(-1) != 0) {
                        emit errorMsg(msgVal.toString(""));
                    } else {
                        QJsonValue dataVal = jsonObj["data"];
                        if (dataVal.isObject()) {
                            QJsonObject dataObj = dataVal.toObject();
                            onFavListReceived(dataObj);
                        } else {
                            emit errorMsg("url or qrcode_key is not found");
                        }
                    }
                }
            }
        }

    } else {
        emit errorMsg(reply->errorString());
    }

    reply->deleteLater();
}

void VideoListModel::fetchVideoList() {
    QUrl url = QString("https://api.bilibili.com/x/v3/fav/resource/list");
    QUrlQuery query;
    query.addQueryItem("media_id", this->favId());
    query.addQueryItem("ps", QString::number(this->pageSize()));
    query.addQueryItem("pn", QString::number(this->pageNum()));
    url.setQuery(query);

    QNetworkRequest request(url);
    request.setAttribute(QNetworkRequest::User, VideoListModel::FetchVideoList);
    m_nam->get(request);
}

void VideoListModel::onFavListReceived(const QJsonObject& jsonObj) {
    setHasMore(jsonObj["has_more"].toBool());

    QJsonValue mediasVal = jsonObj["medias"];
    if (mediasVal.isNull()) {
        setHasMore(false);
        return;
    }

    if (mediasVal.isArray()) {
        QJsonArray mediasArr = mediasVal.toArray();
        for (int i = 0; i < mediasArr.count(); i++) {
            QJsonValue mediaVal = mediasArr[i];
            QJsonObject mediaObj = mediaVal.toObject();
            VideoItem *item = new VideoItem;
            item->setMediaId(QString::number(mediaObj["id"].toInteger()));
            item->setType(mediaObj["type"].toInt());
            item->setTitle(mediaObj["title"].toString());
            item->setCover(mediaObj["cover"].toString());
            item->setDuration(mediaObj["duration"].toInt());
            item->setAttr(mediaObj["attr"].toInt());
            item->setBvid(mediaObj["bvid"].toString());

            QJsonValue upperVal = mediaObj["upper"];
            if (!upperVal.isNull() && upperVal.isObject()) {
                QJsonObject upperObj = upperVal.toObject();
                item->setUpId(QString::number(upperObj["mid"].toInt()));
                item->setUpName(upperObj["name"].toString());
            }

            addItem(item);
        }
    }

    emit favListLoaded();
}

QHash<int,QByteArray> VideoListModel::roleNames() const {
    QHash<int,QByteArray> roleMap;
    roleMap[MediaIdRole] = "mediaId";
    roleMap[TypeRole] = "type";
    roleMap[TitleRole] = "title";
    roleMap[CoverRole] = "cover";
    roleMap[DurationRole] = "duration";
    roleMap[AttrRole] = "attr";
    roleMap[BvidRole] = "bvid";
    roleMap[UpIdRole] = "upId";
    roleMap[UpNameRole] = "upName";
    return roleMap;
}

int VideoListModel::rowCount(const QModelIndex &parent) const {
    if (parent.isValid())
        return 0;

    return m_items.count();
}

QVariant VideoListModel::data(const QModelIndex &index, int role) const {
    if (!index.isValid())
        return QVariant();

    const auto& item = m_items.at(index.row());

    switch(role) {
    case VideoListModel::MediaIdRole:
        return item->mediaId();
        break;
    case VideoListModel::TypeRole:
        return item->type();
        break;
    case VideoListModel::TitleRole:
        return item->title();
        break;
    case VideoListModel::CoverRole:
        return item->cover();
        break;
    case VideoListModel::DurationRole:
        return item->duration();
        break;
    case VideoListModel::AttrRole:
        return item->attr();
        break;
    case VideoListModel::BvidRole:
        return item->bvid();
        break;
    case VideoListModel::UpIdRole:
        return item->upId();
        break;
    case VideoListModel::UpNameRole:
        return item->upName();
        break;
    }

    return QVariant();
}

void VideoListModel::fetchMore(const QModelIndex &parent) {
    if (parent.isValid()) return;

    setPageNum(pageNum()+1);
    this->fetchVideoList();
}

bool VideoListModel::canFetchMore(const QModelIndex &parent) const {
    if (parent.isValid()) return false;
    return hasMore();
}

bool VideoListModel::hasMore() const
{
    return m_hasMore;
}

void VideoListModel::setHasMore(bool newHasMore)
{
    if (m_hasMore == newHasMore)
        return;
    m_hasMore = newHasMore;
    emit hasMoreChanged();
}

QList<VideoItem *> VideoListModel::items() const
{
    return m_items;
}

void VideoListModel::addItem(VideoItem* item) {
    int index = m_items.count();

    beginInsertRows(QModelIndex(), index, index); // 通知视图即将插入

    item->setParent(this);
    m_items.append(item);

    endInsertRows();

    emit itemsChanged();
}
