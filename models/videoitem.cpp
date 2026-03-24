#include "videoitem.h"

VideoItem::VideoItem(QObject *parent)
    : QObject{parent}
{}

QString VideoItem::mediaId() const
{
    return m_mediaId;
}

void VideoItem::setMediaId(const QString &newMediaId)
{
    if (m_mediaId == newMediaId)
        return;
    m_mediaId = newMediaId;
    emit mediaIdChanged();
}

int VideoItem::type() const
{
    return m_type;
}

void VideoItem::setType(int newType)
{
    if (m_type == newType)
        return;
    m_type = newType;
    emit typeChanged();
}

QString VideoItem::title() const
{
    return m_title;
}

void VideoItem::setTitle(const QString &newTitle)
{
    if (m_title == newTitle)
        return;
    m_title = newTitle;
    emit titleChanged();
}

QString VideoItem::cover() const
{
    return m_cover;
}

void VideoItem::setCover(const QString &newCover)
{
    if (m_cover == newCover)
        return;
    m_cover = newCover;
    emit coverChanged();
}

int VideoItem::duration() const
{
    return m_duration;
}

void VideoItem::setDuration(int newDuration)
{
    if (m_duration == newDuration)
        return;
    m_duration = newDuration;
    emit durationChanged();
}

int VideoItem::attr() const
{
    return m_attr;
}

void VideoItem::setAttr(int newAttr)
{
    if (m_attr == newAttr)
        return;
    m_attr = newAttr;
    emit attrChanged();
}

QString VideoItem::bvid() const
{
    return m_bvid;
}

void VideoItem::setBvid(const QString &newBvid)
{
    if (m_bvid == newBvid)
        return;
    m_bvid = newBvid;
    emit bvidChanged();
}

QString VideoItem::upId() const
{
    return m_upId;
}

void VideoItem::setUpId(const QString &newUpId)
{
    if (m_upId == newUpId)
        return;
    m_upId = newUpId;
    emit upIdChanged();
}

QString VideoItem::upName() const
{
    return m_upName;
}

void VideoItem::setUpName(const QString &newUpName)
{
    if (m_upName == newUpName)
        return;
    m_upName = newUpName;
    emit upNameChanged();
}
