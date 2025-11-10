#include "mainwindow.h"
#include <QApplication>
#include <QWebEngineView>
#include <QMainWindow>
#include <QTimer>
#include <QCommandLineParser>
#include <QTextStream>
#include <QSocketNotifier>
#include <QUrl>
#include <iostream>
#include <csignal>
#include <unistd.h>

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

    showMaximized();
}

void WebViewWindow::toggleVisibility() {
    if (isVisible()) {
        hide();
    } else {
        showMaximized();
    }
}

void setupSignalHandlers(WebViewWindow *window) {
    g_window = window;
    signal(SIGUSR1, signalHandler);
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
    setupSignalHandlers(&window);

    return app.exec();
}