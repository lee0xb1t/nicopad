import QtQuick 2.15
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects

Item {
    id: rootId

    required property string currentVid

    required property int index
    required property string mediaId
    required property int type
    required property string title
    required property string cover
    required property int duration
    required property int attr
    required property string bvid
    required property string upId
    required property string upName

    signal choiceVid(string vid)

    width: 500
    height: 300

    Rectangle {
        id: containerParentRectId
        anchors.fill: parent
        radius: 8
        color: currentVid === bvid ? "#f4f4f5" : (videoItemMAId.containsMouse ? "#fafafa" : "transparent")
        border.color: currentVid === bvid ? "#e4e4e7" : (videoItemMAId.containsMouse ? "#f4f4f5" : "transparent")
        border.width: 1

        Rectangle {
            id: containerRectId
            width: parent.width-2
            height: parent.height-2
            color: "transparent"
            anchors.centerIn: parent

            RowLayout {
                width: parent.width
                height: parent.height
                spacing: 20

                Rectangle {
                    width: 20
                    height: playTextId.implicitHeight
                    // anchors.verticalCenter: parent.verticalCenter
                    color: "transparent"

                    Text {
                        id: playTextId
                        color: videoItemMAId.containsMouse ? "#52525b" : "#a1a1aa"
                        anchors.right: parent.right
                        text: index+1
                    }
                }

                Rectangle {
                    width: 45
                    height: 45
                    // anchors.verticalCenter: parent.verticalCenter
                    color: "transparent"

                    Image {
                        id: imgId
                        anchors.fill: parent
                        source: rootId.cover
                        smooth: true
                        mipmap: true
                        fillMode: Image.PreserveAspectCrop

                        layer.enabled: true
                        layer.effect: OpacityMask {
                            maskSource: Item {
                                width:  imgId.width
                                height: imgId.height
                                Rectangle {
                                    anchors.centerIn: parent
                                    width: imgId.width
                                    height: imgId.height
                                    radius: 10
                                }
                            }
                        }
                    }
                }

                Rectangle {
                    Layout.fillWidth: true
                    height: 60
                    // anchors.verticalCenter: parent.verticalCenter
                    color: "transparent"

                    Text {
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                        clip: true
                        width: parent.width
                        text: rootId.title
                    }
                }

                Rectangle {
                    width: 56
                    height: timeTextId.implicitHeight
                    color: "transparent"

                    Text {
                        id: timeTextId
                        color: videoItemMAId.containsMouse ? "#52525b" : "#a1a1aa"
                        text: "05:20"
                    }
                }
            }

            MouseArea {
                id: videoItemMAId
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: containsMouse ? Qt.PointingHandCursor : Qt.ArrowCursor
                onClicked: {
                    choiceVid(rootId.bvid)
                }
            }
        }
    }
}
