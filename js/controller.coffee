# Attempting to make a statemachine like controller for the gui

StateList = {}
ActiveState = null
# A state
class State
  constructor : (@name)->
    if StateList.hasOwnProperty(@name)
      console.log "State: #{@name}, already exists."
    else
      StateList[@name] = @
      if not ActiveState
        @moveTo @name

  # Change state to next state
  moveTo : (name, args...)->
    if StateList.hasOwnProperty(name)
      ActiveState = StateList[name]
      ActiveState.entered name
    else
      console.log "State: #{name}, could not be found."

  # Fire when entered
  entered : (past)=>
    console.log "Entered #{@name}, from #{past}."

  # Recieve an event
  event : (name)->
    console.log "An unhandled event was fired: #{name}."


# Create a state
new State "something"


console.dir StateList
