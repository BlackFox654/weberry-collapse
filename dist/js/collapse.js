(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var defaultOptions = {
  collapsingClass: 'is-collapsing',
  collapsedClass: 'is-collapsed',
  toggleData: 'data-open',
  openInitially: false,
  clearHeightShown: true,
  calcHeightShowFn: null,
  handlerShow: function handlerShow() {},
  handlerShown: function handlerShown() {},
  handlerBeforeShow: function handlerBeforeShow() {
    return true;
  },
  handlerHide: function handlerHide() {},
  handlerHidden: function handlerHidden() {},
  handlerBeforeHide: function handlerBeforeHide() {
    return true;
  },
  handlerDestroy: function handlerDestroy() {}
};

var WeberryCollapse =
/*#__PURE__*/
function () {
  function WeberryCollapse(elem, params) {
    _classCallCheck(this, WeberryCollapse);

    if (elem.WeberryCollapse) {
      return elem.WeberryCollapse;
    }

    var options = Object.assign({}, defaultOptions, params);
    this.elem = elem;
    this.options = options;
    this.isOpen = options.openInitially;
    this.showInProgress = false;
    this.hideInProgress = false;
    this.heightInitial = null;
    this.heightFinal = null;
    this.name = elem.getAttribute('id');
    this.toggleElems = [];
    this.animationShow = null;
    this.animationHide = null; //---------------------------------PRIVATE DATA------------------------------------

    this._p = {
      toggleListener: null,
      eventsTag: 0,
      events: {}
    };
    elem.WeberryCollapse = this;
    this.init();
  }

  _createClass(WeberryCollapse, [{
    key: "prepareToShow",
    value: function prepareToShow() {
      this.heightInitial = this.elem.offsetHeight;
      this.heightFinal = this.options.calcHeightShowFn();
    }
  }, {
    key: "setCalcHeightShowFn",
    value: function setCalcHeightShowFn() {
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.calcHeightDefault.bind(this);
      this.options.calcHeightShowFn = fn;
    }
  }, {
    key: "calcHeightDefault",
    value: function calcHeightDefault() {
      var elem = this.elem;
      elem.style.height = 'auto';
      elem.style.display = 'block';
      var height = elem.offsetHeight;
      elem.style.height = '';
      elem.style.display = '';
      return height;
    }
  }, {
    key: "toggle",
    value: function toggle() {
      this.isOpen ? this.hide() : this.show();
    }
  }, {
    key: "init",
    value: function init() {
      if (this.options.calcHeightShowFn) {
        this.setCalcHeightShowFn(this.options.calcHeightShowFn);
      } else {
        this.setCalcHeightShowFn();
      }

      if (this.isOpen) {
        this.prepareToShow();
        (0, _utils.addClass)(this.elem, this.options['collapsedClass']);
      }

      this.toggleElemsInit();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var options = this.options,
          elem = this.elem;
      this.destroyAnimationShow();
      this.destroyAnimationHide();
      this.clearEvents();
      this.toggleElemsDestroy();
      this.resetClassList();
      options.handlerDestroy(elem);
      delete elem.WeberryCollapse;
    }
  }, {
    key: "resetClassList",
    value: function resetClassList() {
      (0, _utils.removeClass)(this.elem, this.options['collapsingClass']);
      (0, _utils.removeClass)(this.elem, this.options['collapsedClass']);
    }
  }, {
    key: "reset",
    value: function reset() {
      var openInitially = this.options.openInitially;
      this.showInProgress = false;
      this.hideInProgress = false;
      this.destroyAnimationShow();
      this.destroyAnimationHide();
      this.isOpen = openInitially;
      this.setCalcHeightShowFn();
      this.toggleElemsSetState(openInitially);

      if (openInitially) {
        this.elem.style.display = '';
        this.elem.style.height = '';
        (0, _utils.removeClass)(this.elem, this.options['collapsingClass']);
        (0, _utils.addClass)(this.elem, this.options['collapsedClass']);
      } else {
        this.resetClassList();
      }
    }
  }, {
    key: "show",
    value: function show() {
      var hideInProgress = this.hideInProgress,
          showInProgress = this.showInProgress,
          options = this.options,
          elem = this.elem;

      if (options.handlerBeforeShow() === false) {
        return;
      }

      if (!showInProgress && !hideInProgress) {
        this.prepareToShow();
      }

      if (this.heightInitial >= this.heightFinal) {
        return;
      }

      this.showInProgress = true;
      this.isOpen = true;
      this.toggleElemsSetState(true);
      this.elem.dispatchEvent(eventShow);
      options.handlerShow();

      if (this.hideInProgress && elem.offsetHeight === this.heightInitial) {
        return;
      }

      this.animateShow();
    }
  }, {
    key: "hide",
    value: function hide() {
      var elem = this.elem,
          options = this.options,
          showInProgress = this.showInProgress;

      if (options.handlerBeforeHide() === false || elem.offsetHeight <= this.heightInitial) {
        return;
      }

      (0, _utils.removeClass)(elem, options['collapsedClass']);
      this.hideInProgress = true;
      this.isOpen = false;
      this.toggleElemsSetState(false);
      elem.dispatchEvent(eventHide);
      options.handlerHide();

      if (showInProgress && elem.offsetHeight === this.heightFinal) {
        return;
      }

      this.animateHide();
    }
  }, {
    key: "animateShow",
    value: function animateShow() {
      var elem = this.elem,
          options = this.options;

      var _self = this;

      var onComplete = function onComplete() {
        (0, _utils.removeClass)(elem, options['collapsingClass']);
        (0, _utils.addClass)(elem, options['collapsedClass']);

        if (options.clearHeightShown) {
          elem.style.height = '';
        }

        _self.showInProgress = false;
        elem.dispatchEvent(eventShown);
        options.handlerShown();

        if (_self.hideInProgress) {
          _self.hideInProgress = false;

          _self.hide();
        }
      };

      if (this.hideInProgress) {
        this.destroyAnimationHide();
        this.hideInProgress = false;
        this.animationShow = (0, _utils.transitionAnimate)(elem, {
          immediately: true,
          animation: function animation() {
            elem.style.height = _self.heightFinal + 'px';
          },
          onComplete: onComplete
        });
      } else {
        this.animationShow = (0, _utils.transitionAnimate)(elem, {
          beforeStart: function beforeStart() {
            elem.style.height = _self.heightInitial + 'px';
            (0, _utils.addClass)(elem, options['collapsingClass']);
          },
          animation: function animation() {
            elem.style.height = _self.heightFinal + 'px';
          },
          onComplete: onComplete
        });
      }
    }
  }, {
    key: "animateHide",
    value: function animateHide() {
      var _self = this;

      var elem = this.elem,
          options = this.options;

      var onComplete = function onComplete() {
        (0, _utils.removeClass)(elem, options['collapsingClass']);
        elem.style.height = '';
        _self.hideInProgress = false;
        elem.dispatchEvent(eventHidden);
        options.handlerHidden();

        if (_self.showInProgress) {
          _self.showInProgress = false;

          _self.show();
        }
      };

      if (this.showInProgress) {
        this.destroyAnimationShow();
        this.showInProgress = false;
        this.animationHide = (0, _utils.transitionAnimate)(elem, {
          immediately: true,
          animation: function animation() {
            elem.style.height = _self.heightInitial + 'px';
          },
          onComplete: onComplete
        });
      } else {
        this.animationHide = (0, _utils.transitionAnimate)(elem, {
          beforeStart: function beforeStart() {
            elem.style.height = _self.heightFinal + 'px';
            (0, _utils.addClass)(elem, _self.options['collapsingClass']);
          },
          animation: function animation() {
            elem.style.height = _self.heightInitial + 'px';
          },
          onComplete: onComplete
        });
      }
    }
  }]);

  return WeberryCollapse;
}(); //---------------------------------Toggle Functions------------------------------------


WeberryCollapse.prototype.toggleElemsInit = function () {
  var _this = this;

  var isOpen = this.isOpen,
      options = this.options,
      _p = this._p,
      name = this.name;
  var targetName = name;
  var toggleElems = Array.from(document.querySelectorAll("[href=\"#".concat(targetName, "\"],[data-target=\"#").concat(targetName, "\"]")));

  var toggleListener = function toggleListener(e) {
    e.preventDefault();

    _this.toggle();
  };

  _p.toggleListener = toggleListener;
  toggleElems.forEach(function (toggleElem) {
    toggleElem.setAttribute(options.toggleData, isOpen);
    toggleElem.addEventListener('click', toggleListener);
  });
  this.toggleElems = toggleElems;
};

WeberryCollapse.prototype.toggleElemsSetState = function (state) {
  var options = this.options,
      toggleElems = this.toggleElems;
  toggleElems.forEach(function (toggleElem) {
    toggleElem.setAttribute(options.toggleData, state);
  });
};

WeberryCollapse.prototype.toggleElemsDestroy = function () {
  var toggleElems = this.toggleElems,
      _p = this._p,
      options = this.options;
  toggleElems.forEach(function (toggleElem) {
    toggleElem.removeAttribute(options.toggleData);
    toggleElem.removeEventListener('click', _p.toggleListener);
  });
}; //---------------------------------ANIMATE FUNCTIONS ------------------------------------


WeberryCollapse.prototype.destroyAnimationShow = function () {
  var animationShow = this.animationShow;
  animationShow && animationShow.destroy && animationShow.destroy();
};

WeberryCollapse.prototype.destroyAnimationHide = function () {
  var animationHide = this.animationHide;
  animationHide && animationHide.destroy && animationHide.destroy();
}; //---------------------------------CUSTOM EVENTS------------------------------------


var eventMap = {
  show: 'wbry.collapse.show',
  shown: 'wbry.collapse.shown',
  hide: 'wbry.collapse.hide',
  hidden: 'wbry.collapse.hidden'
};
var eventShow = new CustomEvent(eventMap.show);
var eventShown = new CustomEvent(eventMap.shown);
var eventHide = new CustomEvent(eventMap.hide);
var eventHidden = new CustomEvent(eventMap.hidden);

WeberryCollapse.prototype.clearEvents = function () {
  var _this2 = this;

  var events = this._p.events;
  Object.keys(events).forEach(function (key) {
    var event = events[key].event;
    var fn = events[key].fn;

    _this2.off(event, fn);
  });
  this._p.events = {};
  this._p.eventsTag = 0;
};

WeberryCollapse.prototype.on = function (event, fn) {
  var _p = this._p;
  _p.events["event".concat(_p.eventsTag)] = {
    event: event,
    fn: fn
  };
  _p.eventsTag += 1;
  this.elem.addEventListener(eventMap[event], fn);
};

WeberryCollapse.prototype.off = function (event, fn) {
  this.elem.removeEventListener(eventMap[event], fn);
};

window.WeberryCollapse = WeberryCollapse;
var _default = WeberryCollapse;
exports["default"] = _default;

},{"./utils":3}],2:[function(require,module,exports){
"use strict";

var _utils = require("./utils");

var _collapse = _interopRequireDefault(require("./collapse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var collapseDom = (0, _utils.domById)('collapse');
var collapseDom1 = (0, _utils.domById)('collapse1');
window.addEventListener('load', function () {
  var collapse = new _collapse["default"](collapseDom, {
    openInitially: true
  });
  var collapse1 = new _collapse["default"](collapseDom1);
});

},{"./collapse":1,"./utils":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transitionAnimate = exports.whichTransitionEvent = exports.domById = exports.arrayByClass = exports.removeClass = exports.addClass = void 0;

var addClass = function addClass(elem, classname) {
  if (classname) {
    if (elem.classList) elem.classList.add(classname);else elem.className += ' ' + classname;
  }
};

exports.addClass = addClass;

var removeClass = function removeClass(elem, classname) {
  if (classname) {
    if (elem.classList) elem.classList.remove(classname);else elem.className = elem.className.replace(new RegExp('(^|\\b)' + classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

exports.removeClass = removeClass;

var arrayByClass = function arrayByClass(classname) {
  var instance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var collection = instance.getElementsByClassName(classname);

  if (collection === undefined) {
    return collection;
  }

  return Array.from(collection);
};

exports.arrayByClass = arrayByClass;

var domById = function domById(id) {
  var instance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return document.getElementById(id);
};

exports.domById = domById;

var whichTransitionEvent = function whichTransitionEvent() {
  var t,
      el = document.createElement('fakeelement');
  var animations = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
};

exports.whichTransitionEvent = whichTransitionEvent;
var transitionEvent = whichTransitionEvent();

var transitionAnimate = function transitionAnimate(el, params) {
  var animation = params.animation;

  var onComplete = params.onComplete || function () {};

  var beforeStart = params.beforeStart || function () {};

  var immediately = params.immediately || false;
  var timeout;

  var transitionEndFn = function transitionEndFn(e) {
    e.stopPropagation();
    el.removeEventListener(transitionEvent, transitionEndFn);
    onComplete();
  };

  beforeStart();
  el.addEventListener(transitionEvent, transitionEndFn);

  if (immediately) {
    animation();
  } else {
    timeout = setTimeout(animation, 50);
  }

  return {
    destroy: function destroy() {
      clearTimeout(timeout);
      el.removeEventListener(transitionEvent, transitionEndFn);
    }
  };
};

exports.transitionAnimate = transitionAnimate;

},{}]},{},[2]);
