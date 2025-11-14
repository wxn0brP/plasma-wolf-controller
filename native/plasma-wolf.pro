QT += core widgets webenginewidgets
QT += gui
CONFIG += qtquickcompiler
CONFIG += c++11

TARGET = build/plasma-wolf
TEMPLATE = app

HEADERS += src/mainwindow.h
SOURCES += src/main.cpp