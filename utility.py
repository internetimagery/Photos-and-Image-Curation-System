# -*- coding: utf-8 -*-

# Various utility functionality
import re, os

def SearchUp(root, filename):
    """
    Search for a file by moving up the tree
    """
    current = ""
    found = ""
    reg = re.compile(filename, re.I)
    while current != root:
        current = root
        for f in os.listdir(current):
            if reg.match(f):
                return os.path.join(current, f)
        root = os.path.dirname(root)
    return None

def SearchDown(root, filename):
    """
    Search for files by moving down the tree
    """
    reg = re.compile(filename, re.I)
    def recurse(base):
        result = []
        files = os.listdir(base)
        if files:
            for f in files:
                path = os.path.join(base, f)
                if os.path.isdir(path):
                    result += recurse(path)
                else:
                    if reg.match(f):
                        result.append(path)
        return result
    return recurse(root)

def link(source, destination):
    """
    Link a file to another file
    """
    if not os.path.isfile(destination):
        os.link(source, destination)
        return destination
    return None

# Command Line functionality
if __name__ == "__main__":
    import os
    from argparse import ArgumentParser, FileType
    parser = ArgumentParser(description="various utility functions")
    parser.add_argument("-i", help="Input", type=str)
    parser.add_argument("-o", help="Output", type=str)
    parser.add_argument("-u", help="Search up for a file UP", action="store_true")
    parser.add_argument("-d", help="Search up for a file DOWN", action="store_true")
    parser.add_argument("-l", help="Link two files", action="store_true")

    args = parser.parse_args()
    root = os.getcwd()

    inp = os.path.realpath(os.path.join(root, args.i)) if args.i else None
    out = os.path.realpath(os.path.join(root, args.o)) if args.o else None

    if args.u:
        if inp and out:
            print(SearchUp(inp, out))
    elif args.d:
        if inp and out:
            print(SearchDown(inp, out))
    elif args.l:
        if inp and out:
            print(link(inp, out))
