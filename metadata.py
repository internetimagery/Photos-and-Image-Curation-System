# -*- coding: utf-8 -*-

# Pull metadata from a file
import time
from Vendor import exifread

def extract(f):
    return exifread.process_file(f, details=False) # Pull out tags from a file

# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser, FileType
    parser = ArgumentParser(description="Extract some metadata from a file")
    parser.add_argument("file", help="The file you wish to extract from", type=FileType("rb"))
    # parser.add_argument("-d", help="Grab the date", action="store_true")
    args = parser.parse_args()
    root = os.getcwd()
    # path = os.path.realpath(os.path.join(root, args.file))
    tags = extract(args.file)
    for tag in tags:
        print(tag, "\t\t\t\t:: ", tags[tag])
