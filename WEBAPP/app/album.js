var Album, ArgParse, alb, args, fs, parser, path, print, src;

fs = require("fs");

path = require("path");

print = function(m) {
  return console.dir(m);
};

Album = (function() {
  function Album() {
    this.root = "";
    this.struct = "structure.album";
    this.defaults = {
      last_check: new Date(),
      image_root: "Photos",
      tag_root: "Tags",
      format: "<year>/<month>/<day>"
    };
  }

  Album.prototype["new"] = function(rootDir, overrides, callback) {
    var k, v;
    if (overrides != null) {
      for (k in overrides) {
        v = overrides[k];
        this.defaults[k] = v;
      }
    }
    return this.searchUp(this.struct, rootDir, (function(_this) {
      return function(err, filePath) {
        if (err) {
          callback(err);
        } else {

        }
        if (filePath != null) {
          return callback(null);
        } else {
          return fs.mkdir(rootDir, function(err) {
            var structData, structFile;
            if (err && err.code !== "EEXIST") {
              return callback(err);
            } else {
              structFile = path.join(rootDir, _this.struct);
              structData = JSON.stringify(_this.defaults, null, 2);
              return fs.writeFile(structFile, structData, {
                encoding: "utf8"
              }, function(err) {
                if (err) {
                  return callback(err);
                } else {
                  _this.root = rootDir;
                  return callback(rootDir);
                }
              });
            }
          });
        }
      };
    })(this));
  };

  Album.prototype.searchUp = function(searchName, searchDir, callback) {
    var moveUp;
    moveUp = function(location) {
      var checkFile, nextLoc;
      nextLoc = path.dirname(location);
      if (location === nextLoc) {
        return callback(null, null);
      } else {
        checkFile = path.join(location, searchName);
        return fs.access(checkFile, function(err) {
          if (err && err.code !== "ENOENT") {
            return callback(err, null);
          } else if (err) {
            return moveUp(nextLoc);
          } else {
            return callback(null, checkFile);
          }
        });
      }
    };
    return moveUp(searchDir);
  };

  return Album;

})();

ArgParse = require("argparse/lib/argparse").ArgumentParser;

parser = new ArgParse({
  version: "0.0.1",
  addHelp: true,
  description: "Tag file, moving it into folder and linking original file"
});

parser.addArgument(["folder"], {
  help: "The folder to look for an album in."
});

parser.addArgument(["-n"], {
  help: "Create a new album?",
  action: "storeTrue"
});

args = parser.parseArgs();

src = path.resolve(args.folder);

alb = new Album();

if (args.n) {
  alb["new"](src, {
    image_root: "two"
  }, function(albDir) {
    return print(albDir);
  });
}
