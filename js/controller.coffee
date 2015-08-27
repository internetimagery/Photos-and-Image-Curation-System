# Attempting to make a statemachine like controller for the gui

StateList = {}
ActiveState = null
# A state
class State
  constructor : (@name)->
    if StateList.indexOf @name < 0
      StateList[@name] = @
    else
      console.log "State: #{@name}, already exists."

  # Change state to next state
  moveTo : (name, args...)->
    if StateList.indexOf name >= 0
      ActiveState = StateList[name]
    else
      console.log "State: #{name}, could not be found."

  # Fire off an event
  event : (name)->
    console.log "An unhandled event was fired: #{name}."
