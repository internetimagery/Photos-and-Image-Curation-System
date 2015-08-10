# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'createNew.ui'
#
# Created: Tue Aug 11 00:46:59 2015
#      by: pyside-uic 0.2.15 running on PySide 1.2.1
#
# WARNING! All changes made in this file will be lost!

from PySide import QtCore, QtGui

class Ui_Form(object):
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(400, 313)
        self.verticalLayout = QtGui.QVBoxLayout(Form)
        self.verticalLayout.setObjectName("verticalLayout")
        self.label = QtGui.QLabel(Form)
        self.label.setObjectName("label")
        self.verticalLayout.addWidget(self.label)
        self.line = QtGui.QFrame(Form)
        self.line.setFrameShape(QtGui.QFrame.HLine)
        self.line.setFrameShadow(QtGui.QFrame.Sunken)
        self.line.setObjectName("line")
        self.verticalLayout.addWidget(self.line)
        self.horizontalLayout = QtGui.QHBoxLayout()
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.textBrowse = QtGui.QLineEdit(Form)
        self.textBrowse.setObjectName("textBrowse")
        self.horizontalLayout.addWidget(self.textBrowse)
        self.buttonBrowse = QtGui.QPushButton(Form)
        self.buttonBrowse.setObjectName("buttonBrowse")
        self.horizontalLayout.addWidget(self.buttonBrowse)
        self.verticalLayout.addLayout(self.horizontalLayout)
        self.horizontalLayout_2 = QtGui.QHBoxLayout()
        self.horizontalLayout_2.setObjectName("horizontalLayout_2")
        self.label_2 = QtGui.QLabel(Form)
        self.label_2.setObjectName("label_2")
        self.horizontalLayout_2.addWidget(self.label_2)
        self.textStructure = QtGui.QLineEdit(Form)
        self.textStructure.setObjectName("textStructure")
        self.horizontalLayout_2.addWidget(self.textStructure)
        self.buttonHelp = QtGui.QPushButton(Form)
        self.buttonHelp.setObjectName("buttonHelp")
        self.horizontalLayout_2.addWidget(self.buttonHelp)
        self.verticalLayout.addLayout(self.horizontalLayout_2)
        self.horizontalLayout_3 = QtGui.QHBoxLayout()
        self.horizontalLayout_3.setObjectName("horizontalLayout_3")
        self.label_4 = QtGui.QLabel(Form)
        self.label_4.setObjectName("label_4")
        self.horizontalLayout_3.addWidget(self.label_4)
        self.textPhotos = QtGui.QLineEdit(Form)
        self.textPhotos.setObjectName("textPhotos")
        self.horizontalLayout_3.addWidget(self.textPhotos)
        self.label_3 = QtGui.QLabel(Form)
        self.label_3.setObjectName("label_3")
        self.horizontalLayout_3.addWidget(self.label_3)
        self.textTags = QtGui.QLineEdit(Form)
        self.textTags.setObjectName("textTags")
        self.horizontalLayout_3.addWidget(self.textTags)
        self.verticalLayout.addLayout(self.horizontalLayout_3)
        spacerItem = QtGui.QSpacerItem(20, 40, QtGui.QSizePolicy.Minimum, QtGui.QSizePolicy.Expanding)
        self.verticalLayout.addItem(spacerItem)
        self.horizontalLayout_4 = QtGui.QHBoxLayout()
        self.horizontalLayout_4.setObjectName("horizontalLayout_4")
        spacerItem1 = QtGui.QSpacerItem(40, 20, QtGui.QSizePolicy.Expanding, QtGui.QSizePolicy.Minimum)
        self.horizontalLayout_4.addItem(spacerItem1)
        self.buttonCancel = QtGui.QPushButton(Form)
        self.buttonCancel.setObjectName("buttonCancel")
        self.horizontalLayout_4.addWidget(self.buttonCancel)
        self.buttonCreate = QtGui.QPushButton(Form)
        self.buttonCreate.setObjectName("buttonCreate")
        self.horizontalLayout_4.addWidget(self.buttonCreate)
        self.verticalLayout.addLayout(self.horizontalLayout_4)

        self.retranslateUi(Form)
        QtCore.QObject.connect(self.buttonCancel, QtCore.SIGNAL("clicked()"), Form.close)
        QtCore.QMetaObject.connectSlotsByName(Form)

    def retranslateUi(self, Form):
        Form.setWindowTitle(QtGui.QApplication.translate("Form", "Create a New Album", None, QtGui.QApplication.UnicodeUTF8))
        self.label.setText(QtGui.QApplication.translate("Form", "Create a New Album", None, QtGui.QApplication.UnicodeUTF8))
        self.buttonBrowse.setText(QtGui.QApplication.translate("Form", "Browse", None, QtGui.QApplication.UnicodeUTF8))
        self.label_2.setText(QtGui.QApplication.translate("Form", "Folder Structure", None, QtGui.QApplication.UnicodeUTF8))
        self.textStructure.setText(QtGui.QApplication.translate("Form", "%Y/%m/%d", None, QtGui.QApplication.UnicodeUTF8))
        self.buttonHelp.setText(QtGui.QApplication.translate("Form", "?", None, QtGui.QApplication.UnicodeUTF8))
        self.label_4.setText(QtGui.QApplication.translate("Form", "Photo Folder", None, QtGui.QApplication.UnicodeUTF8))
        self.textPhotos.setText(QtGui.QApplication.translate("Form", "Photos", None, QtGui.QApplication.UnicodeUTF8))
        self.label_3.setText(QtGui.QApplication.translate("Form", "Tag Folder", None, QtGui.QApplication.UnicodeUTF8))
        self.textTags.setText(QtGui.QApplication.translate("Form", "Tags", None, QtGui.QApplication.UnicodeUTF8))
        self.buttonCancel.setText(QtGui.QApplication.translate("Form", "Cancel", None, QtGui.QApplication.UnicodeUTF8))
        self.buttonCreate.setText(QtGui.QApplication.translate("Form", "Create", None, QtGui.QApplication.UnicodeUTF8))


if __name__ == "__main__":
    import sys
    app = QtGui.QApplication(sys.argv)
    Form = QtGui.QWidget()
    ui = Ui_Form()
    ui.setupUi(Form)
    Form.show()
    sys.exit(app.exec_())

