import QtQuick 2.15
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects

Item {
    id: userRootId

    property string uid
    property string name
    property string avatar

    property bool isLogin: false
    property string defaultAvatar: "https://i0.hdslb.com/bfs/face/member/noface.jpg"

    signal userClicked(bool isLogin, string uid)

    width: 199
    height: 70
    Rectangle {
        id: userRectId
        anchors.fill: parent

        border.width: 1
        border.color: "#e4e4e7"

        color: "transparent"

        Rectangle {
            width: parent.width
            height: parent.height-1
            color: parent.color
            anchors.bottom: parent.bottom

            Rectangle {
                anchors.fill: parent
                color: "#fafafa"

                Rectangle {
                    width: layoutId.implicitWidth
                    height: layoutId.implicitHeight
                    color: parent.color
                    anchors.fill: parent
                    anchors.leftMargin: 20

                    RowLayout {
                        id: layoutId
                        spacing: 10
                        anchors.verticalCenter: parent.verticalCenter

                        Rectangle {
                            width: 40
                            height: 40
                            color: "transparent"

                            Image {
                                id: avatarImgId
                                anchors.fill: parent
                                source: isLogin ? avatar : defaultAvatar

                                layer.enabled: true
                                layer.effect: OpacityMask {
                                    maskSource: Item {
                                        width: avatarImgId.width
                                        height: avatarImgId.height
                                        Rectangle {
                                            anchors.centerIn: parent
                                            width: 40
                                            height: 40
                                            radius: 40
                                        }
                                    }
                                }
                            }

                            MouseArea {
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: containsMouse ? Qt.PointingHandCursor : Qt.ArrowCursor
                                onClicked: {
                                    userRootId.userClicked(userRootId.isLogin, userRootId.uid)
                                }
                            }
                        }

                        Rectangle {
                            width: nameTextId.implicitWidth
                            height: 40
                            color: userRectId.color

                            Text {
                                anchors.centerIn: parent
                                id: nameTextId
                                text: isLogin ? name : "Login"
                            }

                            MouseArea {
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: containsMouse ? Qt.PointingHandCursor : Qt.ArrowCursor
                                onClicked: {
                                    userRootId.userClicked(userRootId.isLogin, userRootId.uid)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}
