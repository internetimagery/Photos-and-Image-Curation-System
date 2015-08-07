# -*- coding: utf-8 -*-

# Link a file into a tags directory
import os

class Tags(object):
    """
    Tag files to a folder
    """
    def __init__(s, root):
        s.root = root

    """
    Link a file
    """
    def link(s, filepath, tag):
        if os.path.isfile(filepath):
            filename = os.path.basename(filepath)
            path = os.path.join(s.root, tag)
            if not os.path.isdir(path):
                os.makedirs(path)
            path = os.path.join(path, filename)
            if not os.path.isfile(path):
                os.link(filepath, path)
            return path
        return None


# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser, FileType
    parser = ArgumentParser(description="Create a hardlink to a file")
    parser.add_argument("file", help="The file you wish to extract from", type=str)
    parser.add_argument("tag", help="Tag name", type=str)
    args = parser.parse_args()
    root = os.getcwd()
    path = os.path.realpath(os.path.join(root, args.file))

    app = Tags(root)
    print(app.link(path, args.tag))
