var GUI_Menu, Menu, Window, print,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

print = function(m) {
  return console.dir(m);
};

Window = (function() {
  function Window(element) {
    this.element = element;
    this.element.addEventListener("mousemove", this.mousemove);
    this.element.addEventListener("mousedown", this.mousedown);
    this.element.addEventListener("mouseup", this.mouseup);
  }

  Window.prototype.getSize = function() {
    return this.element.getBoundingClientRect();
  };

  Window.prototype.setSize = function(height, width) {
    this.element.width = width;
    return this.element.height = height;
  };

  Window.prototype.mousemove = function(ev) {
    return console.log("moving mouse");
  };

  Window.prototype.mouseup = function(ev) {
    return console.log("mouse up!");
  };

  Window.prototype.mousedown = function(ev) {
    return console.log("mouse down!");
  };

  return Window;

})();

Menu = (function(_super) {
  __extends(Menu, _super);

  function Menu() {
    return Menu.__super__.constructor.apply(this, arguments);
  }

  Menu.prototype.mousedown = function(ev) {
    return console.log("actually down");
  };

  return Menu;

})(Window);

GUI_Menu = new Menu(document.getElementById("menubar"));
