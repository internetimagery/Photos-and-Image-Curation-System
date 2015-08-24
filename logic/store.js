(function() {
  var ExifImage, crypto, fs, getEXIFData, moment, parseDir, path, storeFile, utility;

  fs = require("graceful-fs");

  path = require("path");

  crypto = require("crypto");

  moment = require("moment");

  utility = require("./utility");

  ExifImage = require("exif-makernote-fix").ExifImage;

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

  parseDir = function(filePath, structure, stats, exif) {
    var creation, dateTime, match, parseToken, pointer, reg, tokenPath;
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
            } else {
              return "unknown";
            }
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
    return tokenPath.replace(/[\<\>\:\"\'\|]/, "");
  };

  storeFile = function(src, dest, structure, callback) {
    return utility.temp(dest, function(err, tmpFile, fd, done) {
      var exif, hash, srcStream, tmpStream;
      if (err) {
        return callback(err, null);
      } else {
        srcStream = fs.createReadStream(src);
        tmpStream = fs.createWriteStream(tmpFile, {
          fd: fd
        });
        exif = null;
        hash = crypto.createHash("SHA256");
        hash.setEncoding("hex");
        return utility.copy(src, tmpFile, function(data, remote) {
          hash.update(data);
          if (!exif) {
            remote.pause();
            return getEXIFData(data, function(err, exifData) {
              if (err) {
                return console.log("EXIF Warning: " + err.message);
              } else {
                exif = exifData;
                return remote.resume();
              }
            });
          }
        }, function(err) {
          if (err) {
            done(function(err) {
              if (err) {
                return console.log(err.message);
              }
            });
            return callback(err);
          } else {
            return fs.stat(src, function(err, stats) {
              var ext, fileDir, filePath, filename;
              if (err) {
                done(function(err) {
                  if (err) {
                    return console.log(err.message);
                  }
                });
                return callback(err, null);
              } else {
                tmpStream.end();
                hash.end();
                ext = path.extname(src);
                filename = "" + (hash.read()) + "-" + stats.size + (ext.toLowerCase());
                fileDir = path.join(dest, parseDir(src, structure, stats, exif));
                filePath = path.join(fileDir, filename);
                return utility.mkdirs(fileDir, function(err) {
                  if (err) {
                    done(function(err) {
                      if (err) {
                        return console.log(err.message);
                      }
                    });
                    return callback(err, null);
                  } else {
                    return fs.link(tmpFile, filePath, function(err) {
                      if (err && err.code !== "EEXIST") {
                        callback(err, null);
                      } else if (err) {
                        console.log("Duplicate: " + src);
                        callback(null, filePath);
                      } else {
                        callback(null, filePath);
                      }
                      return done(function(err) {
                        if (err) {
                          return console.log(err.message);
                        }
                      });
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  };

  exports.storeFile = storeFile;

}).call(this);
