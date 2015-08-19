var fs, path, searchUp;

fs = require("fs");

path = require("path");

searchUp = function(searchName, searchDir, callback) {
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

exports.searchUp = searchUp;
