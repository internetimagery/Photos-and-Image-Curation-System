(function() {
  var ArgParse, args, fs, parser, path, print, root, src, tag;

  fs = require("graceful-fs");

  path = require("path");

  print = function(m) {
    return console.dir(m);
  };

  tag = function(root, file, tag, callback) {
    var tagDir;
    tagDir = path.join(root, tag);
    return fs.mkdir(tagDir, function(err) {
      var fileDir, fileMeta;
      if (err && !err.code === "EEXIST") {
        return callback(err, null);
      } else {
        fileMeta = path.parse(file);
        fileDir = path.join(tagDir, fileMeta.base);
        return fs.unlink(fileDir, function(err) {
          if (err && err.code === !"ENOENT") {
            return callback(err, null);
          } else {
            return fs.link(file, fileDir, function(err) {
              if (err && err.code === !"EEXIST") {
                return callback(err, null);
              } else {
                return callback(null, fileDir);
              }
            });
          }
        });
      }
    });
  };

  ArgParse = require("argparse/lib/argparse").ArgumentParser;

  parser = new ArgParse({
    version: "0.0.1",
    addHelp: true,
    description: "Tag file, moving it into folder and linking original file"
  });

  parser.addArgument(["folder"], {
    help: "The folder tags reside in."
  });

  parser.addArgument(["source"], {
    help: "The file to be tagged."
  });

  parser.addArgument(["tag"], {
    help: "The tag name"
  });

  args = parser.parseArgs();

  root = path.resolve(args.folder);

  src = path.resolve(args.source);

  tag(root, src, args.tag, function(err, path) {
    print(err);
    return print(path);
  });

}).call(this);
