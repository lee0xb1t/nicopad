#include "FavItem.h"

FavItem::FavItem(QObject *parent)
    : QObject{parent}
{}

QString FavItem::favId() const
{
    return m_favId;
}

void FavItem::setFavId(const QString &newFavId)
{
    m_favId = newFavId;
}

QString FavItem::uid() const
{
    return m_uid;
}

void FavItem::setUid(const QString &newUid)
{
    m_uid = newUid;
}

QString FavItem::title() const
{
    return m_title;
}

void FavItem::setTitle(const QString &newTitle)
{
    m_title = newTitle;
}

QString FavItem::cover() const
{
    return m_cover;
}

void FavItem::setCover(const QString &newCover)
{
    m_cover = newCover;
}

qint64 FavItem::ctime() const
{
    return m_ctime;
}

void FavItem::setCtime(qint64 newCtime)
{
    m_ctime = newCtime;
}
