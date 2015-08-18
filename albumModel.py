# -*- coding: utf-8 -*-

# Model for displaying Album data
from PySide import QtCore, QtGui

class AlbumModel(QtGui.QFileSystemModel):
    """
    Collect data to display about album files
    """
    def __init__(s):
        super(AlbumModel, s).__init__()

        

if __name__ == "__main__":
    import sys
    # app = QtGui.QApplication(sys.argv)
    # win = Main()
    # win.show()
    # sys.exit(app.exec_())
