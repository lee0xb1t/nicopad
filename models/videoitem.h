#ifndef VIDEOITEM_H
#define VIDEOITEM_H

#include <QObject>

class VideoItem : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString mediaId READ mediaId WRITE setMediaId NOTIFY mediaIdChanged)
    Q_PROPERTY(int type READ type WRITE setType NOTIFY typeChanged)
    Q_PROPERTY(QString title READ title WRITE setTitle NOTIFY titleChanged)
    Q_PROPERTY(QString cover READ cover WRITE setCover NOTIFY coverChanged)
    Q_PROPERTY(int duration READ duration WRITE setDuration NOTIFY durationChanged)
    Q_PROPERTY(int attr READ attr WRITE setAttr NOTIFY attrChanged)
    Q_PROPERTY(QString bvid READ bvid WRITE setBvid NOTIFY bvidChanged)
    Q_PROPERTY(QString upId READ upId WRITE setUpId NOTIFY upIdChanged)
    Q_PROPERTY(QString upName READ upName WRITE setUpName NOTIFY upNameChanged)
public:
    explicit VideoItem(QObject *parent = nullptr);

    QString mediaId() const;
    void setMediaId(const QString &newMediaId);

    int type() const;
    void setType(int newType);

    QString title() const;
    void setTitle(const QString &newTitle);

    QString cover() const;
    void setCover(const QString &newCover);

    int duration() const;
    void setDuration(int newDuration);

    int attr() const;
    void setAttr(int newAttr);

    QString bvid() const;
    void setBvid(const QString &newBvid);

    QString upId() const;
    void setUpId(const QString &newUpId);

    QString upName() const;
    void setUpName(const QString &newUpName);

signals:
    void mediaIdChanged();
    void typeChanged();

    void titleChanged();

    void coverChanged();

    void durationChanged();

    void attrChanged();

    void bvidChanged();

    void upIdChanged();

    void upNameChanged();

private:
    QString m_mediaId;
    int m_type;
    QString m_title;
    QString m_cover;
    int m_duration;
    int m_attr;
    QString m_bvid;
    QString m_upId;
    QString m_upName;
};

#endif // VIDEOITEM_H
