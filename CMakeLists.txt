cmake_minimum_required(VERSION 3.16)

project(nicopad VERSION 0.1 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(QT_QML_GENERATE_QMLLS_INI ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 REQUIRED COMPONENTS Quick Network)

qt_standard_project_setup(REQUIRES 6.8)

qt_add_executable(appnicopad
    main.cpp
)

qt_add_qml_module(appnicopad
    URI nicopad
    QML_FILES
        Main.qml
        components/Logo.qml
        components/Fav.qml
        components/FavList.qml
        components/User.qml
        components/Head.qml
        components/VList.qml
        components/VItem.qml
        SOURCES appmgr.h appmgr.cpp
        SOURCES loginmgr.h loginmgr.cpp
        SOURCES cookiemgr.h cookiemgr.cpp
        SOURCES qrcodegen.hpp qrcodegen.cpp
)

# Qt for iOS sets MACOSX_BUNDLE_GUI_IDENTIFIER automatically since Qt 6.1.
# If you are developing for iOS or macOS you should consider setting an
# explicit, fixed bundle identifier manually though.
set_target_properties(appnicopad PROPERTIES
#    MACOSX_BUNDLE_GUI_IDENTIFIER com.example.appnicopad
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)

target_link_libraries(appnicopad
    PRIVATE Qt6::Quick Qt6::Network
)

install(TARGETS appnicopad
    BUNDLE DESTINATION .
    LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
    RUNTIME DESTINATION ${CMAKE_INSTALL_BINDIR}
)