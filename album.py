# -*- coding: utf-8 -*-

# Create a folder with data to manage pictures
import os
import utility
import json
import time

class Album(object):
    """
    Create and manage the albums directory structure
    """
    def __init__(s, root, **overrides):
        s.root = root
        s.structure = "Album_Structure.json" # Settings for the albums structure
        if os.path.isdir(root):
            print("hunting for Album")
        else:
            print("Creating Album")
            s.build(overrides)


    """
    Build an Album
    """
    def build(s, overrides):
        settings = { # Default settings
            "last_check"    : time.time(), # last time all files were checked
            "store_root"    : "Storage", # Image stored via content
            "image_root"    : "Photos", # Place for images to be saved
            "tag_root"      : "Tags", # Place for tags to be stored
            "datestore_format"        : "%Y/%m/%d", # folder structure
            "store_format"  : {
                "depth"     : 4,
                "width"     : 10,
                "algorithm" : "sha256"
                }
            }
        settings = dict(settings, **overrides)


# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser, FileType
    parser = ArgumentParser(description="Create a space to store pictures")
    parser.add_argument("-s", help="The file you wish to store", type=str)
    parser.add_argument("-l", help="The filename/id of file to load", type=str)
    args = parser.parse_args()
    root = os.getcwd()
    path = os.path.realpath(os.path.join(root, args.s))
