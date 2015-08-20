# GUI Manipulation

print = (m)->
  console.dir m


# A GUI element
class GuiWindow
  constructor : (@element)->
    @element.addEventListener "mousemove", @mousemove
    @element.addEventListener "mousedown", @mousedown
    @element.addEventListener "mouseup", @mouseup
    @_dragCheck = false
  mousemove : (ev)=>
    @_dragCheck = true
    # @dragging ev
  mouseup : (ev)=>
    if @_dragCheck
      @dragged ev
    else
      @clicked ev
  mousedown : (ev)=>
    @_dragCheck = false
  clicked : (ev)->
    console.log "Clicked"
  dragged : (ev)->
    console.log "Dragged"
  # dragging : (ev)->
  #   console.log "Dragging!"

class Menu extends GuiWindow
  clicked : (ev)->
    console.log "hey I got clicked"


GUI_Menu = new Menu document.getElementById "menubar"
