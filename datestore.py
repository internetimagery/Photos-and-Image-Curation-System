# -*- coding: utf-8 -*-

# Store file based on its date

# %a  Locale’s abbreviated weekday name.
# %A  Locale’s full weekday name.
# %b  Locale’s abbreviated month name.
# %B  Locale’s full month name.
# %c  Locale’s appropriate date and time representation.
# %d  Day of the month as a decimal number [01,31].
# %H  Hour (24-hour clock) as a decimal number [00,23].
# %I  Hour (12-hour clock) as a decimal number [01,12].
# %j  Day of the year as a decimal number [001,366].
# %m  Month as a decimal number [01,12].
# %M  Minute as a decimal number [00,59].
# %p  Locale’s equivalent of either AM or PM.
# %S  Second as a decimal number [00,61].
# %U  Week number of the year (Sunday as the first day of the week) as a decimal number
# [00,53]. All days in a new year preceding the first Sunday are considered to be in week 0.
# %w  Weekday as a decimal number [0(Sunday),6].
# %W  Week number of the year (Monday as the first day of the week) as a decimal number
# [00,53]. All days in a new year preceding the first Monday are considered to be in week
# 0.
# %x  Locale’s appropriate date representation.
# %X  Locale’s appropriate time representation.
# %y  Year without century as a decimal number [00,99].
# %Y  Year with century as a decimal number.
# %Z  Time zone name (no charact
# %%  A literal ’%’ character.

import os
import re
import time
import fingerprint
import metadata
import utility
# from Vendor.dateutil import parser

class DateStore(object):
    """
    Link files in a folder structure based on date
    """
    def __init__(s, root, structure=None trash="trash"):
        s.root = root # root of the structure
        s.trash = os.path.join(root, trash)
        s.struct = structure if structure else "%Y/%m/%d" # Default structure

    """
    link an image into the structure
    """
    def put(s, filepath):
        if os.path.isfile(filepath): # Check the requested file exists
            filename, ext = os.path.splitext(os.path.basename(filepath))
            with open(filepath, "rb") as f:
                meta = metadata.extract(f)
                f.seek(0) # Return to start of file
                fp = fingerprint.fingerprint(f)
                date = time.gmtime(os.path.getctime(filepath)) # Date file was created
                if meta:
                    reg = re.compile("datetime", re.I)
                    tags = sorted([m for m in meta if reg.search(m)])
                    if tags:
                        try:
                            date = time.strptime(str(meta[tags[0]]), "%Y:%m:%d %H:%M:%S")
                        except ValueError:
                            print("Could not parse date:", meta[tags[0]])
                imgpath = os.path.join(s.root, time.strftime(s.struct, date))
                utility.mkdir(imgpath)
                imgpath = os.path.join(imgpath, fp + ext)
                f.seek(0)
                with open(imgpath, "wb") as w:
                    w.write(f.read())
            return {
                "id"    : fp + ext,
                "path"  : imgpath
                }
        else:
            raise Exception("File provided doesn't exist: %s" % filepath)

    """
    Get a file given its ID
    """
    def get(s, fileID):
        filename, ext = os.path.splitext(os.path.basename(fileID))
        results = utility.SearchDown(s.root, filename, ["trash"])
        return {
            "path"  : results[0],
            "id"    : os.path.basename(results[0])
        } if len(results) == 1 else None

    """
    Remove file from Storage
    """
    def remove(s, fileID):
        result = s.get(fileID) # Test if file is there
        if result:
            utility.mkdir(s.trash)
            trash = utility.unique(os.path.join(s.trash, os.path.basename(result["path"])))
            os.link(result["path"], trash)
            try:
                os.remove(result["path"])
                os.removedirs(os.path.dirname(result["path"]))
            except OSError:
                pass

# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser
    parser = ArgumentParser(description="Store file in a directory based on date")
    parser.add_argument("-i", help="The file you wish to store", type=str)
    parser.add_argument("-o", help="The file you wish to retrieve", type=str)
    parser.add_argument("-r", help="The file you wish to remove", type=str)
    parser.add_argument("-s", help="Scheme for directory", type=str)
    args = parser.parse_args()
    root = os.getcwd()

    app = DateStore(root)
    if args.i:
        path = os.path.realpath(os.path.join(root, args.i))
        print(app.put(path))
    elif args.o:
        print(app.get(args.o))
    elif args.r:
        app.remove(args.r)
