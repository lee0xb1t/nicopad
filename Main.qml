import QtQuick
import QtQuick.Layouts
import QtQuick.Controls
import "components"

Window {
    id: rootWinId
    width: 800
    height: 580
    visible: true
    color: "#fafafa"

    RowLayout {
        spacing: 0

        Rectangle {
            width: 200
            height: 520
            color: "#fafafa"
            border.color: "#e4e4e7"
            border.width: 1

            Rectangle {
                width: parent.width-1
                height: parent.height
                color: "#fafafa"

                ColumnLayout {
                    anchors.fill: parent
                    spacing: 0

                    Logo {
                    }

                    Fav {
                    }

                    User {
                        onUserClicked: function(isLogin, uid) {
                            if (!isLogin) {
                                dialog.open()
                            }
                        }
                    }
                }
            }
        }

        Rectangle {
            width: 600
            height: 520
            color: "#fff"

            ColumnLayout {
                anchors.fill: parent
                spacing: 0

                Head {
                    width: parent.width
                    height: 50
                }

                VList {
                    width: parent.width
                    height: 470
                }
            }
        }
    }

    Dialog {
        id: dialog
        anchors.centerIn: parent
        title: "扫描二维码"
        modal: true

        standardButtons: Dialog.Ok | Dialog.Cancel

        onAccepted: console.log("Ok clicked")
        onRejected: console.log("Cancel clicked")

        Image {

        }
    }
}
