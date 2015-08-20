var Menu, guiWindow, print,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

print = function(m) {
  return console.dir(m);
};

guiWindow = (function() {
  function guiWindow(element) {
    this.element = element;
    this.mousedown = __bind(this.mousedown, this);
    this.mouseup = __bind(this.mouseup, this);
    this.mousemove = __bind(this.mousemove, this);
    this.element.addEventListener("mousemove", this.mousemove);
    this.element.addEventListener("mousedown", this.mousedown);
    this.element.addEventListener("mouseup", this.mouseup);
    this._dragCheck = false;
  }

  guiWindow.prototype.mousemove = function(ev) {
    return this._dragCheck = true;
  };

  guiWindow.prototype.mouseup = function(ev) {
    if (this._dragCheck) {
      return this.dragged(ev);
    } else {
      return this.clicked(ev);
    }
  };

  guiWindow.prototype.mousedown = function(ev) {
    return this._dragCheck = false;
  };

  guiWindow.prototype.clicked = function(ev) {
    return console.log("Clicked");
  };

  guiWindow.prototype.dragged = function(ev) {
    return console.log("Dragged");
  };

  return guiWindow;

})();

Menu = (function(_super) {
  __extends(Menu, _super);

  function Menu() {
    return Menu.__super__.constructor.apply(this, arguments);
  }

  Menu.prototype.clicked = function(ev) {
    return console.log("hey I got clicked");
  };

  return Menu;

})(guiWindow);

this.GUI_Menu = new Menu(document.getElementById("menubar"));

print(GUI_Menu.clicked);
