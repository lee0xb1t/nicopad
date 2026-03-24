#ifndef FAVITEMMODEL_H
#define FAVITEMMODEL_H

#include <QObject>
#include <QString>

class FavItem : public QObject
{
    Q_OBJECT
    Q_PROPERTY(QString favId READ favId WRITE setFavId NOTIFY favIdChanged)
    Q_PROPERTY(QString uid READ uid WRITE setUid NOTIFY uidChanged)
    Q_PROPERTY(QString title READ title WRITE setTitle NOTIFY titleChanged)
    Q_PROPERTY(QString cover READ cover WRITE setCover NOTIFY coverChanged)
    Q_PROPERTY(qint64 ctime READ ctime WRITE setCtime NOTIFY ctimeChanged)
public:
    explicit FavItem(QObject *parent = nullptr);

    QString favId() const;
    void setFavId(const QString &newFavId);

    QString uid() const;
    void setUid(const QString &newUid);

    QString title() const;
    void setTitle(const QString &newTitle);

    QString cover() const;
    void setCover(const QString &newCover);

    qint64 ctime() const;
    void setCtime(qint64 newCtime);

signals:
    void favIdChanged();
    void uidChanged();
    void titleChanged();
    void coverChanged();
    void ctimeChanged();

private:
    QString m_favId;
    QString m_uid;
    QString m_title;
    QString m_cover;
    qint64 m_ctime;
};

#endif // FAVITEMMODEL_H
