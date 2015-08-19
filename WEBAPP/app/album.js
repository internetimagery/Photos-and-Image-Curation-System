var Album, ArgParse, alb, args, fs, parser, path, print, src, store, utility;

fs = require("fs");

path = require("path");

utility = require("./utility");

store = require("./store");

print = function(m) {
  return console.dir(m);
};

Album = (function() {
  function Album() {
    this.root = "";
    this.structName = "structure.album";
    this.structSettings = {
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
        this.structSettings[k] = v;
      }
    }
    return utility.searchUp(this.structName, rootDir, (function(_this) {
      return function(err, filePath) {
        if (err) {
          callback(err);
        } else {

        }
        if (filePath != null) {
          return callback(null);
        } else {
          return utility.mkdirs(rootDir, function(err) {
            var structData, structFile;
            if (err) {
              return callback(err, null);
            } else {
              structFile = path.join(rootDir, _this.structName);
              structData = JSON.stringify(_this.structSettings, null, 2);
              return fs.writeFile(structFile, structData, {
                encoding: "utf8"
              }, function(err) {
                if (err) {
                  return callback(err, null);
                } else {
                  _this.root = rootDir;
                  return callback(null, rootDir);
                }
              });
            }
          });
        }
      };
    })(this));
  };

  Album.prototype.open = function(rootDir, callback) {
    return utility.searchUp(this.structName, rootDir, (function(_this) {
      return function(err, filePath) {
        if (err) {
          return callback(err, null);
        } else if (filePath) {
          return fs.readFile(filePath, {
            encoding: "utf8"
          }, function(err, data) {
            var stats;
            if (err) {
              return callback(err, null);
            } else {
              try {
                stats = JSON.parse(data);
                stats.last_check = new Date(stats.last_check);
                _this.structSettings = stats;
                _this.root = path.dirname(filePath);
                return callback(null, filePath);
              } catch (_error) {
                err = _error;
                return callback(err, null);
              }
            }
          });
        } else {
          return callback({
            name: "Error",
            message: "Could not find Album"
          }, null);
        }
      };
    })(this));
  };

  Album.prototype.insert = function(imagePath, callback) {
    var imgRoot;
    if (this.root) {
      imgRoot = path.join(this.root, this.structSettings.image_root);
      return store.storeDir(imagePath, this.structSettings.format, function(err, dirs) {
        var imgPath;
        if (err) {
          return callback(err, null);
        } else if (dirs) {
          imgPath = path.join(imgRoot, dirs.dest);
          return fs.access(imgPath, function(err) {
            var imgDir;
            if (err && err.code !== "ENOENT") {
              return callback(err, null);
            } else if (err) {
              imgDir = path.dirname(imgPath);
              return utility.mkdirs(imgDir, function(err) {
                if (err) {
                  return callback(err, null);
                } else {
                  return console.dir(dirs);
                }
              });
            } else {
              return callback(null, imgPath);
            }
          });
        } else {
          return callback({
            name: "Error",
            message: "Not a valid path."
          }, null);
        }
      });
    }
  };

  return Album;

})();

ArgParse = require("argparse/lib/argparse").ArgumentParser;

parser = new ArgParse({
  version: "0.0.1",
  addHelp: true,
  description: "Tag file, moving it into folder and linking original file"
});

parser.addArgument(["-n"], {
  help: "Create a new album?",
  action: "storeTrue"
});

parser.addArgument(["-o"], {
  help: "Open existing album?",
  action: "storeTrue"
});

parser.addArgument(["-i"], {
  help: "Insert a photo / image"
});

args = parser.parseArgs();

alb = new Album();

if (args.n) {
  alb["new"](process.cwd(), function(err, albumPath) {
    if (err) {
      return print(err);
    } else {
      return print(albumPath);
    }
  });
} else if (args.o) {
  alb.open(process.cwd(), function(err, albumPath) {
    if (err) {
      return print(err);
    } else {
      return print(albumPath);
    }
  });
} else if (args.i) {
  src = path.resolve(args.i);
  alb.open(process.cwd(), function(err, albumPath) {
    if (err) {
      return print(err);
    } else if (albumPath) {
      return alb.insert(src, function(err, imgPath) {
        print(err);
        return print(imgPath);
      });
    }
  });
}
