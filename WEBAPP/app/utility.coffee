# Utility functions
fs = require "fs"
path = require "path"

# split a path into its traversal
pathSplit = (pathWhole)->
  paths = []
  next = (location)->
    nextPath = path.dirname location
    paths.push location
    if location isnt nextPath
      next nextPath
  next pathWhole
  return paths

# Search recursively for a file from a location
# Callback (err, path)
searchUp = (searchName, searchDir, callback)->
  # Ascend directories looking for file
  paths = pathSplit searchDir
  moveUp = (index)->
    if index is paths.length
      # File not found
      callback null, null
    else # Nothing found
      checkFile = path.join paths[index], searchName
      fs.access checkFile, (err)->
        if err and err.code isnt "ENOENT" then callback err, null
        else if err then moveUp index + 1
        else # Found a file!
          callback null, checkFile
  moveUp 0

print = (m)->
  console.dir m

# Search down for a file, decending into subfodlers
# Callback (error, matches)
searchDown = (searchName, searchDir, limit, callback)->
  results = []
  moveDown = (location, stop)->
    if stop
      fs.readdir location, (err, files)->
        if err and err.code isnt "ENOTDIR"
          callback err, null
          print location
        print err
        for f in files
          nextDir = path.join location, f
          moveDown nextDir, stop - 1
        print files
      console.log location
  moveDown searchDir, limit


#
# var walk = function(dir, done) {
#   var results = [];
#   fs.readdir(dir, function(err, list) {
#     if (err) return done(err);
#     var pending = list.length;
#     if (!pending) return done(null, results);
#     list.forEach(function(file) {
#       file = path.resolve(dir, file);
#       fs.stat(file, function(err, stat) {
#         if (stat && stat.isDirectory()) {
#           walk(file, function(err, res) {
#             results = results.concat(res);
#             if (!--pending) done(null, results);
#           });
#         } else {
#           results.push(file);
#           if (!--pending) done(null, results);
#         }
#       });
#     });
#   });
# };
#
#
#   
#
#
# searchDown "thing", process.cwd(), 2, (err, matches)->
#   print err
#   print matches

# Create path if it doesn't exist
# Callback (error)
mkdirs = (dirPath, callback)->
  paths = pathSplit dirPath
  move = (index)->
    currDir = paths[index]
    fs.mkdir currDir, (err)->
      if err and err.code isnt "EEXIST" then callback err
      if index
        move index - 1
      else
        callback()
  move paths.length - 1

# Export functions
exports.searchUp = searchUp
exports.mkdirs = mkdirs
