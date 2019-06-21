import { addClass, removeClass } from './utils';

import { transitionAnimate } from './utils';

const defaultOptions = {
  collapsingClass: 'is-collapsing',
  collapsedClass: 'is-collapsed',
  toggleData: 'data-open',
  
  openInitially: false,
  
  clearHeightShown: true,
  calcHeightShowFn: null,
  
  handlerShow () {},
  handlerShown () {},
  handlerBeforeShow () {
    return true;
  },
  
  handlerHide () {},
  handlerHidden () {},
  handlerBeforeHide () {
    return true;
  },
  
  handlerDestroy () {},
};

class WeberryCollapse {
  constructor (elem, params) {
    
    if (elem.WeberryCollapse) {
      return elem.WeberryCollapse;
    }
    
    const options = Object.assign({}, defaultOptions, params);
    
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
    this.animationHide = null;
    
    //---------------------------------PRIVATE DATA------------------------------------
    
    this._p = {
      toggleListener: null,
      eventsTag: 0,
      events: {}
    };
    
    elem.WeberryCollapse = this;
    
    this.init();
  }
  
  prepareToShow () {
    this.heightInitial = this.elem.offsetHeight;
    this.heightFinal = this.options.calcHeightShowFn();
  }
  
  setCalcHeightShowFn (fn = this.calcHeightDefault.bind(this)) {
    this.options.calcHeightShowFn = fn;
  }
  
  calcHeightDefault () {
    const {elem} = this;
    
    elem.style.height = 'auto';
    elem.style.display = 'block';
    
    const height = elem.offsetHeight;
    
    elem.style.height = '';
    elem.style.display = '';
    
    return height;
  }
  
  toggle () {
    this.isOpen ? this.hide() : this.show();
  }
  
  init () {
    if (this.options.calcHeightShowFn) {
      this.setCalcHeightShowFn(this.options.calcHeightShowFn);
    } else {
      this.setCalcHeightShowFn();
    }
    
    if (this.isOpen) {
      this.prepareToShow();
      addClass(this.elem, this.options['collapsedClass']);
    }
    
    this.toggleElemsInit();
  }
  
  destroy () {
    const {options, elem} = this;
  
    this.destroyAnimationShow();
    this.destroyAnimationHide();
    
    this.clearEvents();
    
    this.toggleElemsDestroy();
    this.resetClassList();
    
    options.handlerDestroy(elem);
    
    delete elem.WeberryCollapse;
  }
  
  resetClassList () {
    removeClass(this.elem, this.options['collapsingClass']);
    removeClass(this.elem, this.options['collapsedClass']);
  }
  
  reset () {
    const {options: {openInitially}} = this;
  
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
      
      removeClass(this.elem, this.options['collapsingClass']);
      addClass(this.elem, this.options['collapsedClass']);
      
    } else {
      this.resetClassList();
    }
  }
  
  show () {
    const {hideInProgress, showInProgress, options, elem} = this;
    
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
  
  hide () {
    const {elem, options, showInProgress} = this;
    
    if (options.handlerBeforeHide() === false || elem.offsetHeight <= this.heightInitial) {
      return;
    }
    
    removeClass(elem, options['collapsedClass']);
    
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
  
  animateShow () {
    const {elem, options} = this;
    
    const _self = this;
    
    const onComplete = () => {
      removeClass(elem, options['collapsingClass']);
      addClass(elem, options['collapsedClass']);
      
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
      
      this.animationShow = transitionAnimate(elem, {
        immediately: true,
        animation () {
          elem.style.height = _self.heightFinal + 'px';
        },
        onComplete
      });
      
    } else {
      
      this.animationShow = transitionAnimate(elem, {
        beforeStart () {
          elem.style.height = _self.heightInitial + 'px';
    
          addClass(elem, options['collapsingClass']);
        },
        animation () {
          elem.style.height = _self.heightFinal + 'px';
        },
        onComplete
      });
    }
  }
  
  animateHide () {
    const _self = this;
    
    const {elem, options} = this;
    
    const onComplete = () => {
      removeClass(elem, options['collapsingClass']);
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
      
      this.animationHide = transitionAnimate(elem, {
        immediately: true,
        animation () {
          elem.style.height = _self.heightInitial + 'px';
        },
        onComplete
      });
      
    } else {
      
      this.animationHide = transitionAnimate(elem, {
        beforeStart () {
          elem.style.height = _self.heightFinal + 'px';
          
          addClass(elem, _self.options['collapsingClass']);
        },
        animation () {
          elem.style.height = _self.heightInitial + 'px';
        },
        onComplete
      });
    }
  }
}

//---------------------------------Toggle Functions------------------------------------

WeberryCollapse.prototype.toggleElemsInit = function () {
  const {isOpen, options, _p, name} = this;
  
  const targetName = name;
  
  let toggleElems = Array.from(document.querySelectorAll(`[href="#${targetName}"],[data-target="#${targetName}"]`));
  
  const toggleListener = (e) => {
    e.preventDefault();
    this.toggle();
  };
  
  _p.toggleListener = toggleListener;
  
  toggleElems.forEach(toggleElem => {
    toggleElem.setAttribute(options.toggleData, isOpen);
    
    toggleElem.addEventListener('click', toggleListener);
  });
  
  this.toggleElems = toggleElems;
};

WeberryCollapse.prototype.toggleElemsSetState = function (state) {
  const {options, toggleElems} = this;
  
  toggleElems.forEach(toggleElem => {
    toggleElem.setAttribute(options.toggleData, state);
  });
};

WeberryCollapse.prototype.toggleElemsDestroy = function () {
  const {toggleElems, _p, options} = this;
  
  toggleElems.forEach(toggleElem => {
    toggleElem.removeAttribute(options.toggleData);
    toggleElem.removeEventListener('click', _p.toggleListener);
  });
};

//---------------------------------ANIMATE FUNCTIONS ------------------------------------

WeberryCollapse.prototype.destroyAnimationShow = function () {
  const {animationShow} = this;
  animationShow && animationShow.destroy && animationShow.destroy();
};

WeberryCollapse.prototype.destroyAnimationHide = function () {
  const {animationHide} = this;
  animationHide && animationHide.destroy && animationHide.destroy();
};

//---------------------------------CUSTOM EVENTS------------------------------------

const eventMap = {
  show: 'wbry.collapse.show',
  shown: 'wbry.collapse.shown',
  hide: 'wbry.collapse.hide',
  hidden: 'wbry.collapse.hidden'
};

const eventShow = new CustomEvent(eventMap.show);
const eventShown = new CustomEvent(eventMap.shown);

const eventHide = new CustomEvent(eventMap.hide);
const eventHidden = new CustomEvent(eventMap.hidden);

WeberryCollapse.prototype.clearEvents = function () {
  const {_p: {events}} = this;
  
  Object.keys(events).forEach((key) => {
    const event = events[key].event;
    const fn = events[key].fn;
    
    this.off(event, fn);
  });
  
  this._p.events = {};
  this._p.eventsTag = 0;
};

WeberryCollapse.prototype.on = function (event, fn) {
  const {_p} = this;
  _p.events[`event${_p.eventsTag}`] = {
    event,
    fn
  };
  
  _p.eventsTag += 1;
  
  this.elem.addEventListener(eventMap[event], fn);
};

WeberryCollapse.prototype.off = function (event, fn) {
  this.elem.removeEventListener(eventMap[event], fn);
};

window.WeberryCollapse = WeberryCollapse;

export default WeberryCollapse;