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
                        favList: favMgr.items

                        onFavClicked: function(favid) {
                            console.log("onFavClicked:", favid)
                            videoListModelId.favId = favid
                            // videoListModelId.fetchVideoList()
                        }
                    }

                    User {
                        id: user
                        // uid: userMgr.uid
                        // name: userMgr.uname
                        // avatar: userMgr.avatarUrl
                        // isLogin: userMgr.isLogin

                        onUserClicked: function(isLogin, uid) {
                            if (!isLogin) {
                                loginMgr.startLogin()
                                dialog.open()
                            } else {

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
                    videoListModel: videoListModelId
                }
            }
        }
    }

    Dialog {
        id: dialog
        anchors.centerIn: parent
        title: "扫描二维码"
        modal: true
        height: 150*2

        standardButtons: Dialog.Ok | Dialog.Cancel

        onAccepted: console.log("Ok clicked")
        onRejected: console.log("Cancel clicked")

        Image {
            width: 150
            height: 150
            fillMode: Image.Stretch
            source: loginMgr.qrcodeImg
        }
    }

    Connections {
        target: loginMgr
        function onIsLoggingInChanged() {
            console.log("loginMgr.isLoggingIn:", loginMgr.isLoggingIn)
        }
        function onStatusTextChanged() {
            console.log("loginMgr.statusText:", loginMgr.statusText)
        }
        function onLoginSuccess(refresh_token) {
            console.log("refresh_token:", refresh_token)
            userMgr.fetchUserData();
        }
        function onQrcodeInvalid() {
            console.log("onQrcodeInvalid")
        }
    }

    Connections {
        target: userMgr
        function onUserDataLoaded() {
            favMgr.fetchFavList(userMgr.uid);
            user.uid = userMgr.uid
            user.name = userMgr.uname
            user.avatar = userMgr.avatarUrl
            user.isLogin = userMgr.isLogin
            user.coins = userMgr.coins
            user.isVip = userMgr.vipStatus
            dialog.close()
        }
    }

    Connections {
        target: favMgr
        function onFavListLoaded() {
            console.log("onFavListLoaded")
            for (let i = 0; i < favMgr.items.length; i++) {
                console.log(favMgr.items[i].title)
            }
        }
        function onFavMgrError(msg) {
            console.log("onFavMgrError:", msg)
        }
    }

    VideoListModel {
        id: videoListModelId
        favId: ""

        onFavListLoaded: function() {
            console.log("onFavListLoaded:", videoListModelId.favId)
        }
    }
}
