(function() {
  var GuiSidebar, overlayElement, sidebar, sidebarElement, sidebarTrigger,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GuiSidebar = (function(_super) {
    __extends(GuiSidebar, _super);

    function GuiSidebar(trigger, sidebarElement, overlayElement) {
      this.trigger = trigger;
      this.sidebarElement = sidebarElement;
      this.overlayElement = overlayElement;
      this.clicked = __bind(this.clicked, this);
      GuiSidebar.__super__.constructor.call(this, this.trigger);
      this.sidebar = true;
      this.width = "" + this.sidebarElement.offsetWidth + "px";
      this.animating = false;
      this.animation = new Animation(0.5, "overshoot");
    }

    GuiSidebar.prototype.clicked = function(ev) {
      if (!this.animating) {
        if (this.sidebar) {
          this.animating = true;
          return this.animation.run(true, (function(_this) {
            return function(done, step) {
              var placement;
              placement = "" + (parseInt(step.x * 200)) + "px";
              _this.sidebarElement.style.width = placement;
              _this.overlayElement.style.left = placement;
              if (done) {
                _this.animating = false;
                return _this.sidebar = false;
              }
            };
          })(this));
        } else {
          this.animating = true;
          return this.animation.run(false, (function(_this) {
            return function(done, step) {
              var placement;
              placement = "" + (parseInt(step.x * 200)) + "px";
              _this.sidebarElement.style.width = placement;
              _this.overlayElement.style.left = placement;
              if (done) {
                _this.animating = false;
                return _this.sidebar = true;
              }
            };
          })(this));
        }
      }
    };

    return GuiSidebar;

  })(GuiInterractive);

  sidebarTrigger = document.getElementById("show-hide-sidebar");

  sidebarElement = document.getElementById("sidebar-wrapper");

  overlayElement = document.getElementById("main-wrapper");

  sidebar = new GuiSidebar(sidebarTrigger, sidebarElement, overlayElement);

}).call(this);
