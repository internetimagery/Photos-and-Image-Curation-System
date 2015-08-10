# -*- coding: utf-8 -*-

# Create a hash "fingerprint" of a file
from hashlib import md5

# Create a unique fingerprint of a file
def fingerprint(f):
    block = 65536
    fingerprint = md5()
    fbuffer = f.read(block)
    while len(fbuffer) > 0:
        #hash
        fingerprint.update(fbuffer)
        fbuffer = f.read(block)
    return fingerprint.hexdigest()


# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser, FileType
    parser = ArgumentParser(description="Create a hash Fingerprint of a file")
    parser.add_argument("file", help="The file you wish to fingerprint", type=FileType("rb"))
    args = parser.parse_args()
    root = os.getcwd()
    print(fingerprint(args.file))
