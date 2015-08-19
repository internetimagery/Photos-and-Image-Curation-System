var ExifImage, crypto, fs, getEXIFData, moment, parseDir, path, print, storeDir, tmp;

fs = require("fs");

tmp = require("tmp");

path = require("path");

crypto = require("crypto");

moment = require("moment");

ExifImage = require("exif").ExifImage;

tmp.setGracefulCleanup();

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
              case "hour":
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

storeDir = function(filePath, structure, callback) {
  var _tempFileCreated;
  return tmp.file({
    prefix: "photo-"
  }, _tempFileCreated = function(err, tmpPath, fd, cleanTmp) {
    if (err) {
      return callback(err, null);
    } else {
      return fs.stat(filePath, function(err, srcStats) {
        if (err) {
          return callback(err, null);
        } else {
          return parseDir(filePath, structure, function(err, fileDir) {
            var dest, hash, src, srcParts;
            if (err) {
              return console.log(err.message);
            } else {
              srcParts = path.parse(filePath);
              src = fs.createReadStream(filePath);
              dest = fs.createWriteStream(tmpPath, {
                fd: fd
              });
              hash = crypto.createHash("SHA256");
              hash.setEncoding("hex");
              src.on("error", function(err) {
                return callback(err, null);
              });
              dest.on("error", function(err) {
                return callback(err, null);
              });
              src.on("data", function(buffer) {
                hash.update(buffer);
                return dest.write(buffer);
              });
              return src.on("end", function() {
                var filename;
                hash.end();
                dest.end();
                filename = "" + (hash.read()) + "-" + srcStats.size + srcParts.ext;
                return callback(null, {
                  temp: tmpPath,
                  dest: path.join(fileDir, filename)
                });
              });
            }
          });
        }
      });
    }
  });
};

exports.storeDir = storeDir;
