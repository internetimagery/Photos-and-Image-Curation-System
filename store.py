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
            "width"     : 10,
            "algorithm" : "sha256"
        }
        settings = dict(settings, **override)
        s.fs = HashFS(s.root, **settings)

    """
    Save a file into storage
    """
    def save(s, filepath):
        if os.path.isfile(filepath):
            filename, ext = os.path.splitext(os.path.basename(filepath))
            address = s.fs.put(filepath, fileExt)
            return {
                "path"      : address.abspath,
                "id"        : address.id + ext
            } if address and not address.is_duplicate else None

    """
    Load a file from the storage
    """
    def load(s, filename):
        fingerprint, ext = os.path.splitext(filename) # Pull the id from filename
        address = s.fs.get(fingerprint)
        return {
            "path"          : address.abspath,
            "id"            : address.id + ext
        } if address else None

# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser, FileType
    parser = ArgumentParser(description="Store a file content addressable")
    parser.add_argument("-s", help="The file you wish to store", type=str)
    parser.add_argument("-l", help="The filename/id of file to load", type=str)
    args = parser.parse_args()
    root = os.getcwd()

    app = Store(root)

    if args.s:
        path = os.path.realpath(os.path.join(root, args.s))
        result = app.save(path)
        for r in result:
            print(r, "::", result[r])
    elif args.l:
        result = app.load(args.l)
        if result:
            for r in result:
                print(r, "::", result[r])
        else:
            print("Not in the store")
