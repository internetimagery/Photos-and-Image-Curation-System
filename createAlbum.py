# -*- coding: utf-8 -*-

# Create a new Album GUI
import os
from PySide import QtGui, QtCore
from GUI.createNew import Ui_Form
from GUI.infoDates import Ui_Dialog

class CreateNew(QtGui.QWidget):
    """
    Create a new Album dialog
    """
    def __init__(s, returnFunc):
        super(CreateNew, s).__init__()
        s.ui = Ui_Form()
        s.ui.setupUi(s)
        s.returnFunc = returnFunc

        # Connect up buttons
        s.ui.buttonBrowse.clicked.connect(s.fileDialog)
        s.ui.buttonHelp.clicked.connect(s.helpWindow)
        s.ui.buttonCreate.clicked.connect(s.create)

    def fileDialog(s):
        """
        Open a file dialog
        """
        user = os.path.expanduser("~")
        pics = os.path.join(user, "Pictures")
        if os.path.isdir(pics):
            pathDefault = pics
        else:
            pathDefault = user
        path = QtGui.QFileDialog.getSaveFileName(dir=pathDefault)
        if path:
            s.ui.textBrowse.setText(path[0])

    def helpWindow(s):
        """
        Open helpWindow
        """
        s.help = HelpDialog()
        s.help.show()

    def create(s):
        """
        Validate input and create a new Album!
        """
        def warn(message):
            s.warning = QtGui.QMessageBox.warning(s, "Uh sorry but...", message)
        path = s.ui.textBrowse.text()
        structure = s.ui.textStructure.text()
        photos = s.ui.textPhotos.text()
        tags = s.ui.textTags.text()
        if path:
            if not os.path.exists(path):
                if structure:
                    if photos and tags:
                        s.close()
                        s.returnFunc(path, {
                            "image_root"        : photos,
                            "tag_root"          : tags,
                            "datestore_format"  : structure
                        })
                    else:
                        warn("Please provide appropriate names for your Photos and Tags folders.")
                else:
                    warn("Please provide a structure. Click the ? button for help.")
            else:
                warn("The provided file/folder already exists.\nPlease provide a new filename.")
        else:
            warn("You need to provide a file to save into.")
        print(path, structure, photos, tags)
        # s.close()
        # s.returnFunc("Testing 123")


class HelpDialog(QtGui.QDialog):
    """
    Load up a heplful informational Window
    """
    def __init__(s):
        super(HelpDialog, s).__init__()
        s.ui = Ui_Dialog()
        s.ui.setupUi(s)

    # import sys
    # app = QtGui.QApplication(sys.argv)
    # Dialog = QtGui.QDialog()
    # ui = Ui_Dialog()
    # ui.setupUi(Dialog)
    # Dialog.show()
    # sys.exit(app.exec_())


if __name__ == "__main__":
    import sys
    def test(*text):
        print(text)
    app = QtGui.QApplication(sys.argv)
    win = CreateNew(test)
    win.show()
    sys.exit(app.exec_())
