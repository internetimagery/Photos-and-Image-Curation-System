# -*- coding: utf-8 -*-

# Create a folder with data to manage pictures
import os
import utility
import json
import time

class Album(object):
    """
    Create the albums directory structure
    """
    def __init__(s, root, **overrides):
        s.root = root
        s.structure = "Album_Structure.json" # Settings for the albums structure
        if os.path.isdir(root):
            s.find()
        else:
            s.build(overrides)

    """
    Build an Album
    """
    def build(s, overrides={}):
        print("Creating Album in ", s.root)
        s.settings = { # Default settings
            "last_check"    : time.time(), # last time all files were checked
            "image_root"    : "Photos", # Place for images to be saved
            "tag_root"      : "Tags", # Place for tags to be stored
            "datestore_format" : "%Y/%m/%d", # folder structure
            }
        s.settings = dict(s.settings, **overrides)
        utility.mkdir(s.root)
        with open(os.path.join(s.root, s.structure), "w") as f:
            json.dump(s.settings, f, indent=4, sort_keys=True)
        for entry in s.settings:
            if "root" in entry:
                utility.mkdir(os.path.join(s.root, s.settings[entry]))

    """
    Find an album
    """
    def find(s):
        root = utility.SearchUp(s.root, s.structure.replace(".", "\\."))
        if root:
            s.root = os.path.dirname(root)
            with open(root, "r") as f:
                s.settings = json.load(f)
        else:
            s.build()

# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser, FileType
    parser = ArgumentParser(description="Create a space to store pictures")
    parser.add_argument("album", help="Path to the Album to work with", type=str)
    args = parser.parse_args()
    root = os.getcwd()
    path = os.path.realpath(os.path.join(root, args.album))

    app = Album(path)
