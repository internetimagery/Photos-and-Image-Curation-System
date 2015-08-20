var cleanRemove, fs, mkdirs, path, pathSplit, searchUp;

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
        if (err && err.code !== "ENOTEMPTY") {
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

exports.searchUp = searchUp;

exports.mkdirs = mkdirs;

exports.cleanRemove = cleanRemove;
