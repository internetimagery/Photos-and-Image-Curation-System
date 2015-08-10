#!/usr/bin/python3
# Build thigns automatically!

import os
import subprocess



root = os.path.dirname(os.path.realpath(__file__))

def join(source, dest):
    return os.path.join(source, dest)

if __name__ == "__main__":
    # Process GUIs
    uiDir = os.path.join(root, "GUI")
    for ui in os.listdir(uiDir):
        filename, ext = os.path.splitext(ui)
        if ext == ".ui":
            subprocess.call(["pyside-uic", ui, "-x", "-o", filename + ".py"], cwd=uiDir)
