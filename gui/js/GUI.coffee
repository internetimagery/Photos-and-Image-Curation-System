# GUI Manipulation

print = (m)->
  console.dir m


# A GUI element
class guiWindow
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

class Menu extends guiWindow
  clicked : (ev)->
    console.log "hey I got clicked"


@GUI_Menu = new Menu document.getElementById "menubar"
print GUI_Menu.clicked

# flag = 0
# element = document.getElementById "divider"
# element.addEventListener "mousedown", ()->
#   flag = 0
# element.addEventListener "mousemove", ()->
#   flag = 1
# element.addEventListener "mouseup", ()->
#   if flag == 0
#     console.log "click"
#   else if flag == 1
#     console.log "drag"

# GUI_Divider = new Window document.getElementById "divider"
# GUI_Divider.setSize 80, 30
# # Draggable divider that moves the two main windows
# class Divider
#   constructor : ()->
#     body = document.getElementsByTagName "body"
#     @_body = body[0]
#     @_nav = document.getElementById "navigation-wrapper"
#     @_display = document.getElementById "display-wrapper"
#     @_divider = document.getElementById "divider"
#     @_divider.mousedown = @mouseDown
#     print @_divider
#     @updateBody()
#
#   updateBody : ()->
#     @maxSize = @_body.getBoundingClientRect()
#
#   mouseDown : (event)->
#     console.log "clicked"
#     print "clicked"
#     print event
#
# GUI_Divider = new Divider()

# document.onmousemove = mouseMove
