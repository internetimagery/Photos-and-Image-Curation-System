(function() {
  var fs, path, temp, utility;

  fs = require("fs");

  path = require("path");

  utility = require("./utility");

  temp = function(source, suffix, callback) {
    var tmpRoot;
    tmpRoot = path.join(source, "tmp");
    return utility.mkdirs(tmpRoot, function(err) {
      var nameCheck, time;
      if (err) {
        return callback(err, null);
      } else {
        time = Date.now();
        suffix = suffix ? suffix : ".tmp";
        nameCheck = function(name) {
          var fileDir, filename;
          filename = name + suffix;
          fileDir = path.join(tmpRoot, filename);
          return fs.open(fileDir, "wx", function(err, fd) {
            var done;
            if (err && err.code !== "EEXIST") {
              return callback(err, null, null, null);
            } else if (err) {
              return nameCheck(name - 1);
            } else {
              done = function(call) {
                return utility.cleanRemove(fileDir, function(err) {
                  if (err) {
                    return call(err);
                  } else {
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

}).call(this);
