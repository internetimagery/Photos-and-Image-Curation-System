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
    if index < paths.length
      # Continue looking
      checkFile = path.join paths[index], searchName
      fs.access checkFile, (err)->
        if err and err.code isnt "ENOENT" then callback err, null
        else if err then moveUp index + 1
        else # Found a file!
          callback null, checkFile
    else
      # File not found
      callback null, null
  moveUp 0

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

# Remove file and all empty directories upward
# Callback (error)
cleanRemove = (filePath, callback)->
  paths = pathSplit path.dirname filePath
  remove = (index)->
    if index < paths.length
      fs.rmdir paths[index], (err)->
        if err and err.code isnt "ENOTEMPTY"
          callback err
        else if err
          callback()
        else
          remove index + 1
  fs.unlink filePath, (err)->
    if err then callback err, null else
      remove 0

# Export functions
exports.searchUp = searchUp
exports.mkdirs = mkdirs
exports.cleanRemove = cleanRemove
