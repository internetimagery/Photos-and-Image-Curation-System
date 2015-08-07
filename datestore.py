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
import time
import fingerprint
import metadata



class DateStore(object):
    """
    Store files in a folder structure based on date
    """
    def __init__(s, root):
        s.root = root # root of the structure
        s.defStruct = "%Y/%m/%d" # Default structure

    """
    Save an image into the structure
    """
    def save(s, filepath, structure=None):
        structure = structure if structure else s.defStruct
        if os.path.isfile(filepath): # Check the requested file exists
            filename, fileExt = os.path.splitext(os.path.basename(filepath))
            with open(filepath, "rb") as f:
                newfile = fingerprint.fingerprint(f) + fileExt # fingerprinted filename
                meta = metadata.extract(f)
            pass
        else:
            raise Exception("File provided doesn't exist: %s" % filepath)





    # def importFile(s, path):
    #     if s.data and s.root:
    #         filename, file_extension = os.path.splitext(path)
    #         if os.path.isfile(path) and file_extension.lower() in s.allowed:
    #             filetime = time.gmtime(os.path.getctime(path)) # Date the file was created originally
    #             with open(path, "rb") as f:
    #                 tags = exifread.process_file(f)
    #                 fp = fingerprint.fingerprint(f)
    #             if tags: # Try for metatags
    #                 reg = re.compile("datetimeoriginal", re.IGNORECASE)
    #                 for tag in tags:
    #                     if reg.search(tag):
    #                         filetime = time.strptime(str(tags[tag]), "%Y:%m:%d %H:%M:%S")
    #             imgpath = os.path.join(
    #                 s.root,
    #                 s.data["image_root"],
    #                 time.strftime(s.data["format"], filetime),
    #                 fp + file_extension)
    #             if os.path.isfile(imgpath):
    #                 print "File is a duplicate. Not importing."
    #             else:
    #                 os.makedirs(os.path.dirname(imgpath))
    #                 shutil.copy2(path, imgpath)
    #         else:
    #             raise OSError, "Could not import file"
    #     else:
    #         raise OSError, "Album not loaded"



# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser
    parser = ArgumentParser(description="Store file in a directory based on date")
    parser.add_argument("file", help="The file you wish to store", type=str)
    parser.add_argument("-s", help="Scheme for directory", type=str)
    args = parser.parse_args()
    root = os.getcwd()
    path = os.path.realpath(os.path.join(root, args.file))

    app = DateStore(root)
    app.save(path)
