var fs, mkdirs, path, pathSplit, searchUp;

fs = require("fs");

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
    if (index === paths.length) {
      return callback({
        name: "Error",
        message: "File not found."
      }, null);
    } else {
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
      console.log(currDir);
      if (index) {
        return move(index - 1);
      } else {
        return callback();
      }
    });
  };
  return move(paths.length - 1);
};

exports.searchUp = searchUp;

exports.mkdirs = mkdirs;
