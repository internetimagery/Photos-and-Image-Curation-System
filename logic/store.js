(function() {
  var ExifImage, crypto, fs, getEXIFData, moment, parseDir, path, print, storeFile, utility;

  fs = require("fs");

  path = require("path");

  crypto = require("crypto");

  moment = require("moment");

  utility = require("./utility");

  ExifImage = require("exif").ExifImage;

  print = function(m) {
    return console.dir(m);
  };

  getEXIFData = function(file, callback) {
    var error;
    try {
      return new ExifImage({
        image: file
      }, function(err, data) {
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, data);
        }
      });
    } catch (_error) {
      error = _error;
      return callback(error, null);
    }
  };

  parseDir = function(filePath, structure, callback) {
    return getEXIFData(filePath, function(err, exif) {
      if (err) {
        console.log("EXIF Warning: " + err.message);
      }
      return fs.stat(filePath, function(err, stats) {
        var creation, dateTime, match, parseToken, pointer, reg, tokenPath;
        if (err) {
          return callback(err, null);
        } else {
          creation = stats.birthtime;
          reg = /^(\d+):(\d+):(\d+)(.+)/;
          if (exif && exif.exif.DateTimeOriginal) {
            creation = new Date(exif.exif.DateTimeOriginal.replace(reg, "$1/$2/$3 $4"));
          } else if (exif && exif.exif.CreateDate) {
            creation = new Date(exif.exif.CreateDate.replace(reg, "$1/$2/$3 $4"));
          }
          dateTime = moment(creation);
          parseToken = function(token) {
            var replaced;
            return replaced = (function() {
              switch (token) {
                case "year":
                  return dateTime.format("YYYY");
                case "month":
                  return dateTime.format("MM");
                case "monthname":
                  return dateTime.format("MMMM");
                case "day":
                  return dateTime.format("DD");
                case "dayname":
                  return dateTime.format("dddd");
                case "12hour":
                  return dateTime.format("hha");
                case "24hour":
                  return dateTime.format("HH");
                case "minute":
                  return dateTime.format("mm");
                case "second":
                  return dateTime.format("ss");
                case "millisecond":
                  return dateTime.format("SSS");
                case "size":
                  return stats.size;
                case "model":
                  if (exif && exif.image.Model) {
                    return exif.image.Model;
                  }
                  break;
                default:
                  return "unknown";
              }
            })();
          };
          reg = /<(\w+)>/g;
          tokenPath = "";
          pointer = 0;
          while (match = reg.exec(structure)) {
            tokenPath += structure.substr(pointer, match.index - pointer);
            pointer = match.index + match[0].length;
            tokenPath += parseToken(match[1]);
          }
          tokenPath += structure.substr(pointer, structure.length - pointer);
          return callback(null, tokenPath.replace(/[\<\>\:\"\'\|]/, ""));
        }
      });
    });
  };

  storeFile = function(src, dest, structure, callback) {
    return fs.stat(src, function(err, srcStats) {
      if (err) {
        return callback(err, null);
      } else {
        return parseDir(src, structure, function(err, fileDir) {
          if (err) {
            console.log(err.message);
          }
          return fs.readFile(src, function(err, data) {
            var ext, filePath, fileRoot, filename, fingerprint, hash;
            if (err) {
              return callback(err, null);
            } else {
              hash = crypto.createHash("SHA256");
              hash.update(data);
              fingerprint = hash.digest("hex");
              ext = path.extname(src);
              filename = "" + fingerprint + "-" + srcStats.size + ext;
              fileRoot = path.join(dest, fileDir);
              filePath = path.join(fileRoot, filename);
              return fs.access(filePath, function(err) {
                if (err && err.code !== "ENOENT") {
                  return callback(err, null);
                } else if (err) {
                  return utility.mkdirs(fileRoot, function(err) {
                    if (err) {
                      return callback(err, null);
                    } else {
                      return fs.writeFile(filePath, data, function(err) {
                        if (err) {
                          return callback(err, null);
                        } else {
                          return callback(null, filePath);
                        }
                      });
                    }
                  });
                } else {
                  console.log("Skipping duplicate: " + filePath);
                  return callback(null, filePath);
                }
              });
            }
          });
        });
      }
    });
  };

  exports.storeFile = storeFile;

}).call(this);
