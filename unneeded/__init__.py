# -*- coding: utf-8 -*-
# Run the Application
import os
import sys
from Application.utility import SearchDown
from PyQt4 import QtGui, QtCore
from GUI.mainWindow_UI import Ui_MainWindow

location = os.path.dirname(os.path.realpath(__file__))

class MainWindow(QtGui.QMainWindow):
    """
    Main Window from generated GUI
    """
    def __init__(s, parent=None):
        QtGui.QMainWindow.__init__(s, parent)
        s.ui = Ui_MainWindow()
        s.ui.setupUi(s)

        # connect menu functionality
        menuActions = [
            [s.ui.actionNew,    s.albumNew],
            [s.ui.actionOpen,   s.albumOpen],
            [s.ui.actionCamera, s.importCamera],
            [s.ui.actionFolder, s.importFolder],
            [s.ui.actionImages, s.importImages]
        ]
        for action in menuActions:
            QtCore.QObject.connect(action[0], QtCore.SIGNAL("triggered()"), action[1])

        # Base pictures dir
        s.dirPic = s._picturesDir()

    """
    Get local pictures directory
    """
    def _picturesDir(s):
        home = os.path.expanduser("~")
        if os.path.isdir(home):
            pics = os.path.join(home, "Pictures")
            if os.path.isdir(pics):
                return pics
            return home
        return "/"

    """
    Album New
    """
    def albumNew(s):
        f = QtGui.QFileDialog.getSaveFileName(
            parent=s,
            caption="Save a new album",
            directory=s.dirPic
            )
        # create required files etc
        print "Creating a new album in", f

    """
    Album Open
    """
    def albumOpen(s):
        f = QtGui.QFileDialog.getExistingDirectory(
            parent=s,
            caption="Choose a folder containing an album",
            directory=s.dirPic
            )
        for i in range(10):
            # search for files that show this is an album
            print f
            f = os.path.dirname(str(f))
        print "Loading an album from", f

    """
    Import Camera
    """
    def importCamera(s):
        dialog = QtGui.QDialogButtonBox(s)
        dialog.activateWindow()
        print "Camera button clicked"

    """
    Import Folder
    """
    def importFolder(s):
        f = QtGui.QFileDialog.getExistingDirectory(
            parent=s,
            caption="Import Images from a Folder",
            directory=s.dirPic
            )
        if f and os.path.isdir(f):
            def recurse(root):
                dirs = os.listdir(root)
                result = []
                if dirs:
                    for d in dirs:
                        d = os.path.join(root, d)
                        if os.path.isdir(d):
                            result += recurse(d)
                        else:
                            result.append(d)
                return result
            files = recurse(str(f))
            for t in files:
                print t

    """
    Import Images
    """
    def importImages(s):
        filters = "Images (*.png *.jpg *.jpeg *.tiff *.raw);;Videos (*.avi *.mov *.mp4)"
        f = QtGui.QFileDialog.getOpenFileNames(
            parent=s,
            caption="Import Images",
            directory=s.dirPic,
            filter=filters
            )
        if not f.isEmpty():
            for path in list(f):
                print str(path)

if __name__ == "__main__":
    app = QtGui.QApplication(sys.argv)
    GUI = MainWindow()
    GUI.show()
    sys.exit(app.exec_())
