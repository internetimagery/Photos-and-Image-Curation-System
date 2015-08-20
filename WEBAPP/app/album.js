var Album, ArgParse, alb, args, finder, fs, parser, path, print, src, store, utility;

fs = require("fs");

path = require("path");

store = require("./store");

finder = require("findit");

utility = require("./utility");

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
      trash_root: "Trash",
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
          return callback(err, null);
        } else if (filePath != null) {
          return callback({
            name: "Error",
            message: "Cannot create Album inside another"
          }, null);
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

  Album.prototype.add = function(imagePath, callback) {
    var imgRoot;
    if (this.root) {
      imgRoot = path.join(this.root, this.structSettings.image_root);
      return store.storeFile(imagePath, imgRoot, this.structSettings.format, function(err, store) {
        if (err) {
          return callback(err, null);
        } else if (store) {
          return callback(null, store);
        } else {
          return callback({
            name: "Error",
            message: "Not a valid path."
          }, null);
        }
      });
    }
  };

  Album.prototype.tag = function(imagePath, tagName, callback) {
    var tagDir, tagPath;
    if (this.root) {
      tagDir = path.join(this.root, this.structSettings.tag_root, tagName);
      tagPath = path.join(tagDir, path.basename(imagePath));
      return utility.mkdirs(tagDir, function(err) {
        if (err) {
          return callback(err, null);
        } else {
          return fs.link(imagePath, tagPath, function(err) {
            if (err && err.code !== "EEXIST") {
              return callback(err, null);
            } else {
              return callback(null, tagPath);
            }
          });
        }
      });
    }
  };

  Album.prototype.remove = function(imagePath, callback) {
    return fs.stat(imagePath, function(err, stats) {
      var imageID;
      if (err) {
        return callback(err, null);
      } else {
        if (stats.nlink > 1) {
          return imageID = stats.ino;
        }
      }
    });
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

parser.addArgument(["-t"], {
  help: "Image to tag and tag name",
  nargs: 2
});

parser.addArgument(["-r"], {
  help: "Remove a photo / image"
});

args = parser.parseArgs();

alb = new Album();

if (args.n) {
  alb["new"](process.cwd(), {}, function(err, albumPath) {
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
      return alb.add(src, function(err, imgPath) {
        print(err);
        return print(imgPath);
      });
    }
  });
} else if (args.t) {
  src = path.resolve(args.t[0]);
  alb.open(process.cwd(), function(err, albumPath) {
    if (err) {
      return print(err);
    } else if (albumPath) {
      return alb.tag(src, args.t[1], function(err, imgPath) {
        print(err);
        return print(imgPath);
      });
    }
  });
} else if (args.r) {
  src = path.resolve(args.r);
  alb.open(process.cwd(), function(err, albumPath) {
    if (err) {
      return print(err);
    } else if (albumPath) {
      return alb.remove(src, function(err, trashPath) {
        print(err);
        return print(trashPath);
      });
    }
  });
}
