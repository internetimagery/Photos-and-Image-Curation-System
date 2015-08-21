(function() {
  var GuiSidebar, overlayElement, sidebar, sidebarElement, sidebarTrigger,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  GuiSidebar = (function(_super) {
    __extends(GuiSidebar, _super);

    function GuiSidebar(trigger, sidebarElm, overlayElm) {
      this.trigger = trigger;
      this.sidebarElm = sidebarElm;
      this.overlayElm = overlayElm;
      this.clicked = __bind(this.clicked, this);
      GuiSidebar.__super__.constructor.call(this, this.trigger);
      this.sidebar = true;
      this.width = "200px";
      this.animating = false;
      this.animation = new Animation(2, "linear");
    }

    GuiSidebar.prototype.clicked = function(ev) {
      if (!this.animating) {
        if (this.sidebar) {
          console.log("Push sidebar in");
          this.sidebar = false;
          this.animating = true;
          return this.animation.run(true, (function(_this) {
            return function(done, step) {
              sidebarElement.style.width = "" + (parseInt(step.x * 200)) + ".px";
              if (done) {
                _this.animating = false;
                return console.log("done");
              }
            };
          })(this));
        } else {
          console.log("Pull sidebar out");
          return this.sidebar = true;
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
