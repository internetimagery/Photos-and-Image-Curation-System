var fs, mkdirs, path, pathSplit, print, searchDown, searchUp;

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
      return callback(null, null);
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

print = function(m) {
  return console.dir(m);
};

searchDown = function(searchName, searchDir, limit, callback) {
  var moveDown, results;
  results = [];
  moveDown = function(location, stop) {
    if (stop) {
      fs.readdir(location, function(err, files) {
        var f, nextDir, _i, _len;
        if (err && err.code !== "ENOTDIR") {
          callback(err, null);
          print(location);
        }
        print(err);
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          f = files[_i];
          nextDir = path.join(location, f);
          moveDown(nextDir, stop - 1);
        }
        return print(files);
      });
      return console.log(location);
    }
  };
  return moveDown(searchDir, limit);
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

exports.searchUp = searchUp;

exports.mkdirs = mkdirs;
