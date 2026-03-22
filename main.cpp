#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
// #include "appmgr.h"
#include "loginmgr.h"

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);

    // AppManager appm(&app);
    LoginManager login_mgr(&app);

    QQmlApplicationEngine engine;

    engine.rootContext()->setContextProperty("loginMgr", &login_mgr);

    QObject::connect(
        &engine,
        &QQmlApplicationEngine::objectCreationFailed,
        &app,
        []() { QCoreApplication::exit(-1); },
        Qt::QueuedConnection);

    engine.addImportPath(":/");
    engine.loadFromModule("nicopad", "Main");

    return QCoreApplication::exec();
}
