#include "mainwindow.h"
#include <QApplication>
#include <QWebEngineView>
#include <QMainWindow>
#include <QTimer>
#include <QCommandLineParser>
#include <QTextStream>
#include <QSocketNotifier>
#include <QScreen>
#include <QUrl>
#include <iostream>
#include <csignal>
#include <unistd.h>
#include <QSystemTrayIcon>
#include <QMenu>
#include <QAction>
#include <QKeySequence>
#include <fstream>
#include <sys/stat.h>

static WebViewWindow *g_window = nullptr;

void signalHandler(int sig) {
    if (sig == SIGUSR1) {
        QMetaObject::invokeMethod(g_window, "toggleVisibility", Qt::QueuedConnection);
    }
}

WebViewWindow::WebViewWindow(const QString &url, QWidget *parent)
    : QMainWindow(parent), view(new QWebEngineView(this)) {
    setAttribute(Qt::WA_TranslucentBackground);
    setWindowFlags(Qt::FramelessWindowHint | Qt::WindowStaysOnTopHint);

    view->setPage(new QWebEnginePage(view));
    view->page()->setBackgroundColor(Qt::transparent);

    view->load(QUrl(url));
    setCentralWidget(view);

    QScreen *screen = QGuiApplication::primaryScreen();
    QRect screenGeom = screen->geometry();

    int w = static_cast<int>(screenGeom.width());
    int h = static_cast<int>(screenGeom.height() - 50);
    int x = screenGeom.x() + (screenGeom.width() - w) / 2;
    int y = 0;//screenGeom.y() + (screenGeom.height() - h) / 2;

    setGeometry(x, y, w, h);
    show();
}

void WebViewWindow::toggleVisibility() {
    if (isVisible()) {
        hide();
    } else {
        showMaximized();
        QPoint localPos = this->mapFromGlobal(QCursor::pos());
        int x = localPos.x();
        int y = localPos.y();
        std::cout << x << " " << y;
        view->page()->runJavaScript("window._wolf(" + QString::number(x) + ", " + QString::number(y) + ");");
    }
}

void setupSignalHandlers(WebViewWindow *window) {
    g_window = window;
    signal(SIGUSR1, signalHandler);
}

void writePidFile() {
    const char *pidFile = "/tmp/plasma-wolf.pid";
    std::ofstream out(pidFile);
    if(out.is_open()) {
        out << getpid() << std::endl;
        out.close();
        chmod(pidFile, 0666);
    } else {
        qWarning("Error writing pid file");
    }
}

void removePidFile() {
    const char *pidFile = "/tmp/plasma-wolf.pid";
    unlink(pidFile);
}

int main(int argc, char *argv[])
{
    qputenv("QT_QPA_PLATFORM", "xcb"); // Force X11

    QApplication app(argc, argv);

    QCommandLineParser parser;
    parser.addHelpOption();
    parser.addPositionalArgument("url", "URL to open");
    parser.process(app);

    const QStringList args = parser.positionalArguments();
    if (args.isEmpty()) {
        std::cerr << "Usage: " << argv[0] << " <url>" << std::endl;
        return -1;
    }

    QString url = args.first();

    if (!QUrl(url).isValid()) {
        std::cerr << "Invalid URL: " << url.toStdString() << std::endl;
        return -1;
    }

    WebViewWindow window(url);

    writePidFile();
    setupSignalHandlers(&window);
    QObject::connect(&app, &QApplication::aboutToQuit, removePidFile);

    if (!QSystemTrayIcon::isSystemTrayAvailable()) {
        std::cerr << "Tray is not available" << std::endl;
    } else {
        auto *trayIcon = new QSystemTrayIcon(QIcon::fromTheme("applications-internet"), &app);
        auto *menu = new QMenu();

        QAction *toggleAction = menu->addAction("Toggle");
        QObject::connect(toggleAction, &QAction::triggered, &window, &WebViewWindow::toggleVisibility);

        QAction *quitAction = menu->addAction("Exit");
        QObject::connect(quitAction, &QAction::triggered, &app, &QApplication::quit);

        trayIcon->setContextMenu(menu);
        trayIcon->setToolTip("Plasma Wolf");
        trayIcon->show();

        QObject::connect(trayIcon, &QSystemTrayIcon::activated, [&](QSystemTrayIcon::ActivationReason reason) {
            if (reason == QSystemTrayIcon::Trigger) {
                window.toggleVisibility();
            }
        });
    }

    return app.exec();
}