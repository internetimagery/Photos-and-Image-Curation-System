var ArgParse, ExifImage, args, fs, getCreationDate, getMetadata, moment, parser, path, print, src, _;

moment = require("moment");

ExifImage = require("exif").ExifImage;

path = require("path");

fs = require("fs");

_ = require("underscore");

print = function(m) {
  return console.dir(m);
};

getMetadata = function(file, callback) {
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

getCreationDate = function(file, callback) {
  return fs.stat(file, function(err, stats) {
    var creation;
    if (err) {
      return callback(err, null);
    } else {
      creation = stats.birthtime;
      return getMetadata(file, function(err, exif) {
        if (err) {
          console.log(err.message);
          return callback(null, creation);
        } else {
          if (exif && !_.isEmpty(exif.exif)) {
            return print("EMPTY");
          } else if (exif && !_.isEmpty(exif.image)) {
            return print(exif.image);
          } else {
            return print(type(creation));
          }
        }
      });
    }
  });
};

ArgParse = require("argparse/lib/argparse").ArgumentParser;

parser = new ArgParse({
  version: "0.0.1",
  addHelp: true,
  description: "Grab metadata from file."
});

parser.addArgument(["source"], {
  help: "The file to grab data from"
});

args = parser.parseArgs();

src = path.resolve(args.source);

getCreationDate(src, function(err, data) {
  print(err);
  return print(data);
});
