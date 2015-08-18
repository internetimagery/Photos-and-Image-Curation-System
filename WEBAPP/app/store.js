var ArgParse, args, crypto, fs, parser, path, print, src, storeDir, tmp;

fs = require("fs");

tmp = require("tmp");

path = require("path");

crypto = require("crypto");

tmp.setGracefulCleanup();

print = function(m) {
  return console.dir(m);
};

storeDir = function(filePath, callback) {
  var _tempFileCreated;
  return tmp.file({
    prefix: "photo-"
  }, _tempFileCreated = function(err, tmpPath, fd, cleanTmp) {
    if (err) {
      return callback(err, null);
    } else {
      return fs.stat(filePath, function(err, srcStats) {
        var hash, src, srcParts;
        if (err) {
          return callback(err, null);
        } else {
          srcParts = path.parse(filePath);
          src = fs.createReadStream(filePath);
          hash = crypto.createHash("SHA256");
          hash.setEncoding("hex");
          src.on("error", function(err) {
            return callback(err, null);
          });
          src.on("data", function(buffer) {
            return hash.update(buffer);
          });
          return src.on("end", function() {
            var filename;
            hash.end();
            filename = "" + (hash.read()) + "-" + srcStats.size + srcParts.ext;
            print(filename);
            return print("done");
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
  description: "Generate a path to store or locate the file."
});

parser.addArgument(["source"], {
  help: "The file to be stored."
});

args = parser.parseArgs();

src = path.resolve(args.source);

storeDir(src, function(err, dir) {
  print(err);
  return print(dir);
});
