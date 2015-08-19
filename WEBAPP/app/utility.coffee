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
      callback name: "Error", message: "File not found.", null
    else # Nothing found
      checkFile = path.join paths[index], searchName
      fs.access checkFile, (err)->
        if err and err.code isnt "ENOENT" then callback err, null
        else if err then moveUp index + 1
        else # Found a file!
          callback null, checkFile
  moveUp 0

#
# # Make a series of folders
# # Callback (error)
# mkdirs = (dirPath, callback)->
#   recurse = (index, dirs, repeat)->
#     if

# # Copy one file to another location even if does't exist
# # Callback (error, filePath)
# saveToPath = (source, dest, callback)->
#   fs.open source, "r", (err, fd)->
#     if err
#       throw err
#     else
#       destSplit = path.parse(dest)
#       dirs = destSplit.dir.split path.sep
#       # Recursively create requested directory
#       recurse = (index, dirs, callback)->
#         if index <= dirs.length
#           dir = dirs[..index].join path.sep
#           fs.mkdir dir, (err)->
#             if err and err.code is not "EEXIST"
#               throw err
#             recurse index + 1, dirs, callback
#         else
#           callback()
#       if dirs.length
#         recurse 1, dirs, ()->
#           srcStream = fs.createReadStream source
#           dstStream = fs.createWriteStream dest
#           srcStream.pipe dstStream
#           callback dest
#

# Export functions
exports.searchUp = searchUp
