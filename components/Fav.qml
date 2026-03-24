import QtQuick 2.15
import QtQuick.Layouts
import QtQuick.Shapes

Item {
    property var favList
    signal favClicked(string favid)

    property string commandPath: "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"

    id: favRootId
    width: 199
    height: 365

    Rectangle {
        id: favRect1Id
        anchors.fill: parent
        color: "transparent"

        Rectangle {
            width: parent.width
            height: parent.height-1
            color: favRect1Id.color

            ColumnLayout {
                anchors.centerIn: parent
                spacing: 0

                Rectangle {
                    id: libRectId
                    width: favRootId.width
                    height: 20
                    color: favRect1Id.color

                    RowLayout {
                        spacing: 1

                        Rectangle {
                            width: 20
                            height: libRectId.height
                            color: favRect1Id.color
                        }

                        Rectangle {
                            width: libRectId.height
                            height: libRectId.height
                            color: favRect1Id.color

                            Shape {
                                fillMode: Shape.Stretch
                                width: 10
                                height: 10
                                anchors.centerIn: parent
                                // 启用异步渲染以避免阻塞主线程
                                asynchronous: true

                                // 定义描边样式 (对应 SVG 的 stroke 属性)
                                ShapePath {
                                    strokeWidth: 4.0 // 对应 stroke-width="2"
                                    strokeColor: "#e5e7eb" // 对应 stroke="currentColor" (这里设为黑色，可绑定颜色)
                                    fillColor: "transparent" // 对应 fill="none"

                                    // 设置线条端点和连接风格 (对应 stroke-linecap/join="round")
                                    capStyle: ShapePath.RoundCap
                                    joinStyle: ShapePath.RoundJoin

                                    pathElements: [
                                        PathSvg {
                                            path: favRootId.commandPath
                                        }
                                    ]
                                }
                            }
                        }

                        Rectangle {
                            width: libTextId.implicitWidth
                            height: libRectId.height
                            color: favRect1Id.color

                            Text {
                                id: libTextId
                                text: "LIBRARY"
                                color: "#a1a1aa"
                                font.bold: true
                                font.letterSpacing: 1
                                anchors.centerIn: parent
                            }
                        }
                    }
                }

                Rectangle {
                    width: favRootId.width
                    height: favRootId.height - libRectId.height
                    color: favRect1Id.color

                    border {
                        width: 1
                        color: "red"
                    }

                    FavList {
                        favList: favRootId.favList

                        width: parent.width
                        height: parent.height

                        onFavChoice: function(id) {
                            console.log("In fav.qml:", id)
                            favClicked(id)
                        }
                    }
                }
            }
        }
    }


}
