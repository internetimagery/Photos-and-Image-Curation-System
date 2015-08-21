(function() {
  var GuiElement, GuiInterractive, sidebarTrigger, testing,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GuiElement = (function() {
    function GuiElement(element) {
      this.element = element;
    }

    return GuiElement;

  })();

  GuiInterractive = (function(_super) {
    __extends(GuiInterractive, _super);

    function GuiInterractive(element) {
      this.element = element;
      this._mouseup = __bind(this._mouseup, this);
      this._mousedown = __bind(this._mousedown, this);
      this._mousemove = __bind(this._mousemove, this);
      this._mouseleave = __bind(this._mouseleave, this);
      GuiInterractive.__super__.constructor.call(this, this.element);
      this.element.addEventListener("mouseleave", this._mouseleave);
      this.element.addEventListener("mousemove", this._mousemove);
      this.element.addEventListener("mousedown", this._mousedown);
      this.element.addEventListener("mouseup", this._mouseup);
      this._mousePressed = false;
      this._dragging = false;
      this._mousePos = null;
      this._dragBuffer = [-5, 5];
    }

    GuiInterractive.prototype._mouseleave = function(ev) {
      this._mousePressed = false;
      return this._dragging = false;
    };

    GuiInterractive.prototype._mousemove = function(ev) {
      var diffX, diffY;
      if (this._dragging) {
        this.dragging(ev);
      }
      if (this._mousePressed && this._mousePos) {
        diffX = this._mousePos.clientX - ev.clientX;
        diffY = this._mousePos.clientY - ev.clientY;
        if (!(this._dragBuffer[0] < diffY && diffY < this._dragBuffer[1])) {
          if (!(this._dragBuffer[0] < diffX && diffX < this._dragBuffer[1])) {
            return this._dragging = true;
          }
        }
      }
    };

    GuiInterractive.prototype._mousedown = function(ev) {
      this._mousePos = ev;
      return this._mousePressed = true;
    };

    GuiInterractive.prototype._mouseup = function(ev) {
      if (this._mousePressed && this._dragging) {
        this.dropped(ev);
      } else if (this._mousePressed) {
        this.clicked(ev);
      }
      this._mousePressed = false;
      return this._dragging = false;
    };

    GuiInterractive.prototype.dragging = function(ev) {
      return console.log("Dragging");
    };

    GuiInterractive.prototype.dropped = function(ev) {
      return console.log("Dropped");
    };

    GuiInterractive.prototype.clicked = function(ev) {
      return console.log("Clicked");
    };

    return GuiInterractive;

  })(GuiElement);

  sidebarTrigger = document.getElementById("show-hide-sidebar");

  testing = new GuiInterractive(sidebarTrigger);

}).call(this);
