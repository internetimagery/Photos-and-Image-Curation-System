# GUI Manipulation

print = (m)->
  console.dir m


# A GUI element
class Window
  constructor : (@element)->
    @element.addEventListener "mousemove", @mousemove
    @element.addEventListener "mousedown", @mousedown
    @element.addEventListener "mouseup", @mouseup
  getSize : ()->
    @element.getBoundingClientRect()
  setSize : (height, width)->
    @element.width = width
    @element.height = height
  mousemove : (ev)->
    console.log "moving mouse"
  mouseup : (ev)->
    console.log "mouse up!"
  mousedown : (ev)->
    console.log "mouse down!"

class Menu extends Window
  mousedown : (ev)->
    console.log "actually down"

GUI_Menu = new Menu document.getElementById "menubar"

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
