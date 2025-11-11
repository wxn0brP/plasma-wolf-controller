#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QWebEngineView>
#include <QWebEnginePage>
#include <QTextStream>
#include <QDateTime>
#include <QFile>

class LoggingWebPage : public QWebEnginePage {
    Q_OBJECT
public:
    using QWebEnginePage::QWebEnginePage;

protected:
    void javaScriptConsoleMessage(JavaScriptConsoleMessageLevel level,
                                  const QString &message,
                                  int lineNumber,
                                  const QString &sourceID) override
    {
        QString levelStr;
        switch (level) {
            case QWebEnginePage::InfoMessageLevel: levelStr = "INFO"; break;
            case QWebEnginePage::WarningMessageLevel: levelStr = "WARN"; break;
            case QWebEnginePage::ErrorMessageLevel: levelStr = "ERROR"; break;
            default: levelStr = "LOG"; break;
        }

        QTextStream out(stderr);
        out.setCodec("UTF-8");
        out << "[JS " << levelStr << "] "
            << sourceID << ":" << lineNumber
            << " → " << message << "\n";
        out.flush();
    }
};

class WebViewWindow : public QMainWindow {
    Q_OBJECT

public:
    WebViewWindow(const QString &url, QWidget *parent = nullptr);

public slots:
    void toggleVisibility();

private:
    QWebEngineView *view;
};

void setupStdinReader(WebViewWindow *window);

#endif // MAINWINDOW_H