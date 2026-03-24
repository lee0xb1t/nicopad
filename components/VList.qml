import QtQuick 2.15
import QtQuick.Layouts

Item {
    property string currentVid
    property var videoListModel

    id: rootId

    Rectangle {
        id: logoRectId
        anchors.fill: parent
        color: "transparent"
        border.color: "#fafafa"
        border.width: 1

        Rectangle {
            anchors.bottom: parent.bottom
            width: parent.width
            height: parent.height-1
            color: "#fff"

            Rectangle {
                id: listContainerId
                anchors.fill: parent
                anchors.leftMargin: 20
                anchors.rightMargin: 20
                anchors.topMargin: 4
                anchors.bottomMargin: 4

                // ColumnLayout {
                //     width: parent.width
                //     spacing: 4
                // }

                ListView {
                    anchors.fill: parent
                    spacing: 4
                    clip: true
                    boundsBehavior: Flickable.StopAtBounds

                    model: videoListModel
                    delegate: VItem {
                        id: vitemId
                        width: listContainerId.width
                        height: 66
                        antialiasing: true

                        currentVid: rootId.currentVid

                        onChoiceVid: function (v) {
                            console.log(v)
                            rootId.currentVid = v
                        }
                    }
                }
            }
        }
    }

    ListModel {
        id: mmodel
        ListElement {
            mediaId: "a"
            type: 1
            cover: "https://i0.hdslb.com/bfs/archive/53626a003127a20c68b73f89cb431891b046ba72.jpg"
            duration: 1
            attr: 1
            bvid: "BV19z421q7cH"
            upId: "a"
            upName: "a"
            title: "【4K60帧/Hires无损音质】魔法少女与恶曾是敌人 OP 完整版 「未完成ランデヴー」 Lezel【Full ver./中文字幕】"
        }
        ListElement {
            mediaId: "a"
            type: 1
            cover: "https://i1.hdslb.com/bfs/archive/c7a9bae86be26c0a707843f1073ca3327bf2331f.jpg"
            duration: 1
            attr: 1
            bvid: "BV1BdiMBCEke"
            upId: "a"
            upName: "a"
            title: "“再听这首歌，已物是人非。”—《The Way I Still Love You》"
        }
        ListElement {
            mediaId: "a"
            type: 1
            cover: "https://i1.hdslb.com/bfs/archive/c7a9bae86be26c0a707843f1073ca3327bf2331f.jpg"
            duration: 1
            attr: 1
            bvid: "a"
            upId: "a"
            upName: "a"
            title: "【4K60帧/Hires无损音质】魔法少女与恶曾是敌人 OP 完整版 「未完成ランデヴー」 Lezel【Full ver./中文字幕】"
        }
    }
}
