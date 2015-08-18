var ArgParse, args, crypto, fingerprint, fs, parser, path, src;

crypto = require("crypto");

fs = require("fs");

path = require("path");

fingerprint = function(file, callback) {
  var fd, hash;
  fd = fs.createReadStream(file);
  hash = crypto.createHash("md5");
  hash.setEncoding("hex");
  fd.on("error", function(err) {
    return callback(err, null);
  });
  fd.on("end", function() {
    hash.end();
    return callback(null, hash.read());
  });
  return fd.pipe(hash);
};

ArgParse = require("argparse/lib/argparse").ArgumentParser;

parser = new ArgParse({
  version: "0.0.1",
  addHelp: true,
  description: "Generate a unique hash from a file"
});

parser.addArgument(["source"], {
  help: "The file to be hashed."
});

args = parser.parseArgs();

src = path.resolve(args.source);

fingerprint(src, function(err, hash) {
  console.dir(err);
  return console.dir(hash);
});
