(function() {
  var cleanRemove, copy, fs, mkdirs, path, pathSplit, searchUp, temp;

  fs = require("graceful-fs");

  path = require("path");

  pathSplit = function(pathWhole) {
    var next, paths;
    paths = [];
    next = function(location) {
      var nextPath;
      nextPath = path.dirname(location);
      paths.push(location);
      if (location !== nextPath) {
        return next(nextPath);
      }
    };
    next(pathWhole);
    return paths;
  };

  searchUp = function(searchName, searchDir, callback) {
    var moveUp, paths;
    paths = pathSplit(searchDir);
    moveUp = function(index) {
      var checkFile;
      if (index < paths.length) {
        checkFile = path.join(paths[index], searchName);
        return fs.access(checkFile, function(err) {
          if (err && err.code !== "ENOENT") {
            return callback(err, null);
          } else if (err) {
            return moveUp(index + 1);
          } else {
            return callback(null, checkFile);
          }
        });
      } else {
        return callback(null, null);
      }
    };
    return moveUp(0);
  };

  mkdirs = function(dirPath, callback) {
    var move, paths;
    paths = pathSplit(dirPath);
    move = function(index) {
      var currDir;
      currDir = paths[index];
      return fs.mkdir(currDir, function(err) {
        if (err && err.code !== "EEXIST") {
          callback(err);
        }
        if (index) {
          return move(index - 1);
        } else {
          return callback();
        }
      });
    };
    return move(paths.length - 1);
  };

  cleanRemove = function(filePath, callback) {
    var paths, remove;
    paths = pathSplit(path.dirname(filePath));
    remove = function(index) {
      if (index < paths.length) {
        return fs.rmdir(paths[index], function(err) {
          if (err && err.code !== "ENOTEMPTY" && err.code !== "ENOENT") {
            return callback(err);
          } else if (err) {
            return callback();
          } else {
            return remove(index + 1);
          }
        });
      }
    };
    return fs.unlink(filePath, function(err) {
      if (err) {
        return callback(err, null);
      } else {
        return remove(0);
      }
    });
  };

  temp = function(source, callback) {
    var tmpRoot;
    tmpRoot = path.join(source, "tmp");
    return mkdirs(tmpRoot, function(err) {
      var nameCheck, time;
      if (err) {
        return callback(err, null);
      } else {
        time = parseInt(Date.now() * Math.random());
        nameCheck = function(name) {
          var fileDir, filename;
          filename = name + ".tmp";
          fileDir = path.join(tmpRoot, filename);
          return fs.open(fileDir, "wx", function(err, fd) {
            var done;
            if (err && err.code !== "EEXIST") {
              return callback(err, null, null, null);
            } else if (err) {
              return nameCheck(name - 1);
            } else {
              done = function(call) {
                return cleanRemove(fileDir, function(err) {
                  if (err && call) {
                    return call(err);
                  } else if (call) {
                    return call(null);
                  }
                });
              };
              return callback(null, fileDir, fd, done);
            }
          });
        };
        return nameCheck(time, 0);
      }
    });
  };

  copy = function(src, dest, dataCallback, endCallback) {
    return fs.stat(dest, function(err, stats) {
      var data, destStream, end, error, pause, resume, running, srcStream;
      if (err && endCallback) {
        return endCallback(err);
      } else {
        if (stats.isDirectory()) {
          src = path.join(dest, path.basename(src));
        }
        srcStream = fs.createReadStream(src);
        destStream = fs.createWriteStream(dest);
        running = true;
        pause = function() {
          return srcStream.pause();
        };
        resume = function() {
          return srcStream.resume();
        };
        error = function(err) {
          running = false;
          destStream.end();
          if (endCallback) {
            return endCallback(err);
          }
        };
        data = function(data) {
          var ok;
          if (running) {
            ok = destStream.write(data);
            if (!ok) {
              srcStream.pause();
              destStream.once("drain", function() {
                return srcStream.resume();
              });
            }
            if (dataCallback) {
              return dataCallback(data, {
                pause: pause,
                resume: resume
              });
            }
          }
        };
        end = function() {
          if (running) {
            destStream.end();
            if (endCallback) {
              return endCallback(null);
            }
          }
        };
        srcStream.on("error", error);
        destStream.on("error", error);
        srcStream.on("data", data);
        return srcStream.on("end", end);
      }
    });
  };

  exports.searchUp = searchUp;

  exports.mkdirs = mkdirs;

  exports.cleanRemove = cleanRemove;

  exports.temp = temp;

  exports.copy = copy;

}).call(this);
