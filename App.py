# -*- coding: utf-8 -*-

# Application
import os, sys
root = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.join(root, "Application"))
import createAlbum
from Application import album
from PySide import QtCore, QtGui
from GUI.mainWindow import Ui_MainWindow

class Main(QtGui.QMainWindow):
    """
    Run the GUI to power the application
    """
    def __init__(s, parent=None):
        super(Main, s).__init__(parent)
        s.ui = Ui_MainWindow()
        s.ui.setupUi(s)

        # Objects
        s.albums = []

        # Connect up buttons and menus etc
        s.ui.actionNew.triggered.connect(s.albumNew)
        s.ui.actionOpen.triggered.connect(s.albumOpen)
        s.ui.actionCamera.triggered.connect(s.importCamera)
        s.ui.actionFolder.triggered.connect(s.importFolder)
        s.ui.actionImages.triggered.connect(s.importImages)

    def albumNew(s):
        """
        Create a new Album
        """
        def returnData(root, settings):
            alb = album.Album(root)
            root = alb.new(**settings)
            if root:
                s._addAlbum(alb)
        s.newDialog = createAlbum.CreateNew(returnData)
        s.newDialog.show()

    def albumOpen(s):
        """
        Open an existing album
        """
        path = QtGui.QFileDialog.getExistingDirectory(s, "Open an existing Album")
        if path:
            alb = album.Album(path)
            albDir = alb.open()
            if albDir:
                s._addAlbum(alb)
                return
            else:
                s._warn("No album could be found...\nDouble check you're choosing an album?")

    def importCamera(s):
        """
        Import images directly from a Camera
        """
        print("import from camea")

    def importFolder(s):
        """
        Find all images in a folder and import them all
        """
        print("grabbing all images")

    def importImages(s):
        """
        Grab only specified images and import them
        """
        print("importing specific images")

    def _warn(s, message):
        """
        Simple warning
        """
        s.warning = QtGui.QMessageBox.warning(s, "Uh sorry but...", message)

    def _addAlbum(s, album):
        """
        Add album to the GUI and etc
        """
        s.albums.append(album)
        s._warn("Congrats, an album has been added. TODO: add functionality")


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    win = Main()
    win.show()
    sys.exit(app.exec_())
