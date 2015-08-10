# -*- coding: utf-8 -*-

# Application
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
        print("Create a new album")

    def albumOpen(s):
        """
        Open an existing album
        """
        print("opening album")

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


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    win = Main()
    win.show()
    sys.exit(app.exec_())
