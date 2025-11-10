#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QWebEngineView>

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