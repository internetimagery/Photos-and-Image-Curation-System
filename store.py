# -*- coding: utf-8 -*-

# Store file in a content addressable location
import os
from Vendor.hashfs.hashfs import HashFS

class Store(object):
    """
    Store a file addressed by its content. Reducing the chance of duplicates etc
    """
    def __init__(s, root, **override):
        s.root = root
        settings = {
            "depth"     : 4,
            "width"     : 1,
            "algorithm" : "sha256"
        }
        settings = dict(settings, **override)
        s.fs = HashFS(s.root, **settings)

    """
    Save a file into the system
    """
    def save(s, filepath):
        if os.path.isfile(filepath):
            filename, fileExt = os.path.splitext(os.path.basename(filepath))
            print(filename, fileExt)

# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser, FileType
    parser = ArgumentParser(description="Store a file content addressable")
    parser.add_argument("file", help="The file you wish to store", type=str)
    args = parser.parse_args()
    root = os.getcwd()
    path = os.path.realpath(os.path.join(root, args.file))

    app = Store(root)
    print(app.save(path))
