#ifndef VIDEOLISTMODEL_H
#define VIDEOLISTMODEL_H

#include <QObject>
#include <QAbstractListModel>
#include <QtNetwork>
#include <QtQml>
#include "models/videoitem.h"

class VideoListModel : public QAbstractListModel
{
    Q_OBJECT
    QML_ELEMENT
    Q_PROPERTY(QString favId READ favId WRITE setFavId NOTIFY favIdChanged)
    Q_PROPERTY(int pageNum READ pageNum WRITE setPageNum NOTIFY pageNumChanged)
    Q_PROPERTY(int pageSize READ pageSize WRITE setPageSize NOTIFY pageSizeChanged)
    Q_PROPERTY(bool hasMore READ hasMore WRITE setHasMore NOTIFY hasMoreChanged)
    Q_PROPERTY(QList<VideoItem*> items READ items NOTIFY itemsChanged)
public:
    enum VideoListModelRoles {
        MediaIdRole = Qt::UserRole+1,
        TypeRole,
        TitleRole,
        CoverRole,
        DurationRole,
        AttrRole,
        BvidRole,
        UpIdRole,
        UpNameRole,
    };
    Q_ENUM(VideoListModelRoles)

    enum RequestType {
        FetchVideoList
    };
    Q_ENUM(RequestType)

    explicit VideoListModel(QObject *parent = nullptr);

    QHash<int,QByteArray> roleNames() const override;
    Q_INVOKABLE int rowCount(const QModelIndex &parent = QModelIndex()) const override;
    Q_INVOKABLE QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const override;
    Q_INVOKABLE void fetchMore(const QModelIndex &parent) override;
    Q_INVOKABLE bool canFetchMore(const QModelIndex &parent) const override;

    Q_INVOKABLE void fetchVideoList();

    QString favId() const;
    void setFavId(const QString &newFavId);

    int pageNum() const;
    void setPageNum(int newPageNum);

    int pageSize() const;
    void setPageSize(int newPageSize);

    bool hasMore() const;
    void setHasMore(bool newHasMore);

    QList<VideoItem *> items() const;
    void addItem(VideoItem* item);

public slots:
    void onNetworkFinished(QNetworkReply *reply);

signals:
    void errorMsg(QString msg);
    void favListLoaded();

    void favIdChanged();

    void pageNumChanged();

    void pageSizeChanged();

    void hasMoreChanged();

    void itemsChanged();

private:
    void onFavListReceived(const QJsonObject& jsonObj);

    QNetworkAccessManager *m_nam;
    QString m_favId;
    int m_pageNum;
    int m_pageSize;
    bool m_hasMore;
    QList<VideoItem *> m_items;
};

#endif // VIDEOLISTMODEL_H
