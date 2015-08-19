var Album, ArgParse, alb, args, fs, parser, path, print, src;

fs = require("fs");

path = require("path");

print = function(m) {
  return console.dir(m);
};

Album = (function() {
  function Album(root) {
    this.root = root;
    this.struct = "Album_Structure.json";
    this.defaults = {
      last_check: new Date(),
      image_root: "Photos",
      tag_root: "Tags",
      format: "<year>/<month>/<day>"
    };
  }

  Album.prototype["new"] = function(overrides) {
    var k, v, _results;
    if (overrides != null) {
      _results = [];
      for (k in overrides) {
        v = overrides[k];
        _results.push(this.defaults[k] = v);
      }
      return _results;
    }
  };

  Album.prototype.searchUp = function(callback) {
    var moveUp;
    moveUp = (function(_this) {
      return function(location) {
        var checkFile, nextLoc;
        print("location " + location);
        nextLoc = path.dirname(location);
        if (location !== nextLoc) {
          checkFile = path.join(location, _this.struct);
          return fs.readFile(checkFile, {
            encoding: "utf8"
          }, function(err, data) {
            if (err && err.code !== "ENOENT") {
              throw err;
            } else if (err) {
              return moveUp(nextLoc);
            } else {
              return print("FOUND FILE!");
            }
          });
        }
      };
    })(this);
    return moveUp(this.root);
  };

  return Album;

})();

ArgParse = require("argparse/lib/argparse").ArgumentParser;

parser = new ArgParse({
  version: "0.0.1",
  addHelp: true,
  description: "Tag file, moving it into folder and linking original file"
});

parser.addArgument(["folder"], {
  help: "The folder to look for an album in."
});

parser.addArgument(["-n"], {
  help: "Create a new album?",
  action: "storeTrue"
});

args = parser.parseArgs();

src = path.resolve(args.folder);

alb = new Album(src);

if (args.n) {
  alb["new"]({
    image_root: "two"
  });
}
