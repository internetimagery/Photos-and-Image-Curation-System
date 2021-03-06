# Utility functions
fs = require "graceful-fs"
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
        if err and err.code isnt "ENOTEMPTY" and err.code isnt "ENOENT"
          callback err
        else if err
          callback()
        else
          remove index + 1
  fs.unlink filePath, (err)->
    if err then callback err, null else
      remove 0

# Create a teporary file in the specified folder
# Callback (error, filename, fd, done) - done = removal function to be called
# Callback done (error)
temp = (source, callback)->
  tmpRoot = path.join source, "tmp"
  mkdirs tmpRoot, (err)->
    if err then callback err, null else
      time = parseInt Date.now() * Math.random()
      # suffix = if suffix then suffix else ".tmp"
      nameCheck = (name)->
        filename = name + ".tmp"
        fileDir = path.join tmpRoot, filename
        fs.open fileDir, "wx", (err, fd)->
          if err and err.code isnt "EEXIST"
            callback err, null, null, null
          else if err
            nameCheck name - 1
          else
            done = (call)-> # Clean up file when done with it
              cleanRemove fileDir, (err)->
                if err and call then call err else if call then call null
            callback null, fileDir, fd, done
      nameCheck time, 0

# Pipe an input into an output while exposing the data along the way
# Callback, data (data, controls) - data as it's streamed, controls to pause
# Callback, end (error) - finished
copy = (src, dest, dataCallback, endCallback)->
  fs.stat dest, (err, stats)->
    if err and endCallback then endCallback err else
      if stats.isDirectory()
        src = path.join dest, path.basename src
      srcStream = fs.createReadStream src
      destStream = fs.createWriteStream dest
      running = true
      pause = ()->
        srcStream.pause()
      resume = ()->
        srcStream.resume()
      error = (err)->
        running = false
        destStream.end()
        if endCallback
          endCallback err
      data = (data)->
        if running
          ok = destStream.write data
          if not ok
            srcStream.pause()
            destStream.once "drain", ()->
              srcStream.resume()
          if dataCallback
            dataCallback data, pause: pause, resume: resume
      end = ()->
        if running
          destStream.end()
          if endCallback
            endCallback null
      srcStream.on "error", error
      destStream.on "error", error
      srcStream.on "data", data
      srcStream.on "end", end


# Export functions
exports.searchUp = searchUp
exports.mkdirs = mkdirs
exports.cleanRemove = cleanRemove
exports.temp = temp
exports.copy = copy
