var ArgParse, args, dst, fs, parser, path, print, root, saveToPath, src;

fs = require("fs");

path = require("path");

print = function(m) {
  return console.dir(m);
};

saveToPath = function(source, dest, callback) {
  return fs.open(source, "r", function(err, fd) {
    var destSplit, dirs, recurse;
    if (err) {
      throw "File could not be opened. Does it exist? " + source;
    } else {
      destSplit = path.parse(dest);
      dirs = destSplit.dir.split(path.sep);
      recurse = function(index, dirs, callback) {
        var dir;
        if (index <= dirs.length) {
          dir = dirs.slice(0, +index + 1 || 9e9).join(path.sep);
          return fs.mkdir(dir, function(err) {
            if (err && err.code === !"EEXIST") {
              throw err;
            }
            return recurse(index + 1, dirs, callback);
          });
        } else {
          return callback();
        }
      };
      if (dirs.length) {
        return recurse(1, dirs, function() {
          return print("done");
        });
      }
    }
  });
};

ArgParse = require("argparse/lib/argparse").ArgumentParser;

parser = new ArgParse({
  version: "0.0.1",
  addHelp: true,
  description: "Copy one file to another location"
});

parser.addArgument(["source"], {
  help: "The existing file to be copied"
});

parser.addArgument(["destination"], {
  help: "The location we want to copy into"
});

args = parser.parseArgs();

root = process.cwd();

src = path.join(root, args.source);

dst = path.join(root, args.destination);

saveToPath(src, dst, function(path) {
  return console.dir("Returned path: " + path);
});
