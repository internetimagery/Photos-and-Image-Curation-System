# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'mainWindow.ui'
#
# Created: Tue Aug 11 14:22:58 2015
#      by: pyside-uic 0.2.15 running on PySide 1.2.1
#
# WARNING! All changes made in this file will be lost!

from PySide import QtCore, QtGui

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        MainWindow.setObjectName("MainWindow")
        MainWindow.resize(800, 600)
        self.centralwidget = QtGui.QWidget(MainWindow)
        self.centralwidget.setObjectName("centralwidget")
        self.verticalLayout = QtGui.QVBoxLayout(self.centralwidget)
        self.verticalLayout.setObjectName("verticalLayout")
        self.splitter = QtGui.QSplitter(self.centralwidget)
        self.splitter.setOrientation(QtCore.Qt.Horizontal)
        self.splitter.setObjectName("splitter")
        self.treeView = QtGui.QTreeView(self.splitter)
        self.treeView.setObjectName("treeView")
        self.scrollArea = QtGui.QScrollArea(self.splitter)
        self.scrollArea.setWidgetResizable(True)
        self.scrollArea.setObjectName("scrollArea")
        self.scrollAreaWidgetContents_2 = QtGui.QWidget()
        self.scrollAreaWidgetContents_2.setGeometry(QtCore.QRect(0, 0, 244, 525))
        self.scrollAreaWidgetContents_2.setObjectName("scrollAreaWidgetContents_2")
        self.scrollArea.setWidget(self.scrollAreaWidgetContents_2)
        self.verticalLayout.addWidget(self.splitter)
        MainWindow.setCentralWidget(self.centralwidget)
        self.menubar = QtGui.QMenuBar(MainWindow)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 800, 26))
        self.menubar.setObjectName("menubar")
        self.menuAlbum = QtGui.QMenu(self.menubar)
        self.menuAlbum.setObjectName("menuAlbum")
        self.menuImport = QtGui.QMenu(self.menubar)
        self.menuImport.setObjectName("menuImport")
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QtGui.QStatusBar(MainWindow)
        self.statusbar.setObjectName("statusbar")
        MainWindow.setStatusBar(self.statusbar)
        self.actionNew = QtGui.QAction(MainWindow)
        self.actionNew.setShortcutContext(QtCore.Qt.WindowShortcut)
        self.actionNew.setObjectName("actionNew")
        self.actionOpen = QtGui.QAction(MainWindow)
        self.actionOpen.setObjectName("actionOpen")
        self.actionCamera = QtGui.QAction(MainWindow)
        self.actionCamera.setObjectName("actionCamera")
        self.actionFolder = QtGui.QAction(MainWindow)
        self.actionFolder.setObjectName("actionFolder")
        self.actionImages = QtGui.QAction(MainWindow)
        self.actionImages.setObjectName("actionImages")
        self.menuAlbum.addAction(self.actionNew)
        self.menuAlbum.addAction(self.actionOpen)
        self.menuImport.addAction(self.actionCamera)
        self.menuImport.addAction(self.actionFolder)
        self.menuImport.addAction(self.actionImages)
        self.menubar.addAction(self.menuAlbum.menuAction())
        self.menubar.addAction(self.menuImport.menuAction())

        self.retranslateUi(MainWindow)
        QtCore.QMetaObject.connectSlotsByName(MainWindow)

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(QtGui.QApplication.translate("MainWindow", "Photo and Image Curation System", None, QtGui.QApplication.UnicodeUTF8))
        self.menuAlbum.setTitle(QtGui.QApplication.translate("MainWindow", "&Album", None, QtGui.QApplication.UnicodeUTF8))
        self.menuImport.setTitle(QtGui.QApplication.translate("MainWindow", "&Import", None, QtGui.QApplication.UnicodeUTF8))
        self.actionNew.setText(QtGui.QApplication.translate("MainWindow", "&New", None, QtGui.QApplication.UnicodeUTF8))
        self.actionNew.setToolTip(QtGui.QApplication.translate("MainWindow", "Create a NEW album", None, QtGui.QApplication.UnicodeUTF8))
        self.actionOpen.setText(QtGui.QApplication.translate("MainWindow", "&Open", None, QtGui.QApplication.UnicodeUTF8))
        self.actionOpen.setToolTip(QtGui.QApplication.translate("MainWindow", "OPEN an existing album", None, QtGui.QApplication.UnicodeUTF8))
        self.actionCamera.setText(QtGui.QApplication.translate("MainWindow", "&Camera", None, QtGui.QApplication.UnicodeUTF8))
        self.actionCamera.setToolTip(QtGui.QApplication.translate("MainWindow", "Import Photos from a Camera", None, QtGui.QApplication.UnicodeUTF8))
        self.actionFolder.setText(QtGui.QApplication.translate("MainWindow", "&Folder", None, QtGui.QApplication.UnicodeUTF8))
        self.actionFolder.setToolTip(QtGui.QApplication.translate("MainWindow", "Import Images from a Folder on your computer", None, QtGui.QApplication.UnicodeUTF8))
        self.actionImages.setText(QtGui.QApplication.translate("MainWindow", "Images", None, QtGui.QApplication.UnicodeUTF8))


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    MainWindow = QtGui.QMainWindow()
    ui = Ui_MainWindow()
    ui.setupUi(MainWindow)
    MainWindow.show()
    sys.exit(app.exec_())

