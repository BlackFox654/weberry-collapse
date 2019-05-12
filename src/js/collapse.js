import { addClass, removeClass, whichTransitionEvent } from './utils';

const transitionEvent = whichTransitionEvent();

/**
 *  Default options
 */

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
    
    this.toggleElems = [];
    
    //---------------------------------PRIVATE DATA------------------------------------
    
    this._p = {
      transitionEvent: transitionEvent,
      showTimeout: null,
      hideTimeout: null,
      showTransitionFn: null,
      hideTransitionFn: null,
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
  
  show () {
    const {hideInProgress, options} = this;
    
    if (options.handlerBeforeShow() === false) {
      return;
    }
    
    if (!hideInProgress) {
      this.prepareToShow();
    }
    
    if (this.heightInitial >= this.heightFinal) {
      return;
    }
    
    this.isOpen = true;
    this.toggleElemsSetState(true);
    
    /**
     *  Call listeners event SHOW
     */
    
    this.elem.dispatchEvent(eventShow);
    options.handlerShow();
  
    this.animateShow();
  }
  
  hide () {
    const {elem, options} = this;
    
    if (options.handlerBeforeHide() === false) {
      return;
    }
    
    if (elem.offsetHeight <= this.heightInitial) {
      return;
    }
    
    removeClass(elem, options['collapsedClass']);
    
    this.isOpen = false;
    this.toggleElemsSetState(false);
    
    /**
     *  Call listeners event HIDE
     */
    
    elem.dispatchEvent(eventHide);
    options.handlerHide();
    
    this.animateHide();
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
  
  toggleElemsInit () {
    const {elem, isOpen, options, _p} = this;
    
    let toggleElems;
    
    const target = elem.getAttribute('id');
    
    toggleElems = Array.from(document.querySelectorAll(`[href="#${target}"],[data-target="#${target}"]`));
    
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
    
  }
  
  toggleElemsDestroy () {
    const {toggleElems, _p, options} = this;
    
    toggleElems.forEach(toggleElem => {
      toggleElem.removeAttribute(options.toggleData);
      toggleElem.removeEventListener('click', _p.toggleListener);
    });
  }
  
  toggleElemsSetState (state) {
    const {options, toggleElems} = this;
    
    toggleElems.forEach(toggleElem => {
      toggleElem.setAttribute(options.toggleData, state);
    });
  }
  
  init () {
    if (this.options.calcHeightShowFn) {
      this.setCalcHeightShowFn(this.options.calcHeightShowFn);
    } else {
      this.setCalcHeightShowFn();
    }
    
    if(this.isOpen) {
      removeClass(this.elem, this.options['collapsedClass']);
      this.prepareToShow();
      addClass(this.elem, this.options['collapsedClass']);
    }
    
    this.setShowTransitionFn();
    this.setHideTransitionFn();
    
    this.toggleElemsInit();
  }
  
  destroy () {
    const {options, elem} = this;
    
    this.clearEvents();
    
    this.toggleElemsDestroy();
    this.resetClassList();
    
    this.unBindShowTransitionFn();
    this.unBindHideTransitionFn();
    
    options.handlerDestroy(elem);
    
    delete elem.WeberryCollapse;
  }
  
  resetClassList () {
    removeClass(this.elem, this.options['collapsingClass']);
    removeClass(this.elem, this.options['collapsedClass']);
  }
  
  reset () {
    const {options: {openInitially}} = this;
    
    this.isOpen = openInitially;
    
    this.showInProgress = false;
    this.hideInProgress = false;
    
    this.setCalcHeightShowFn();
    
    this.toggleElemsSetState(openInitially);
    
    this.unBindShowTransitionFn();
    this.unBindHideTransitionFn();
    
    
    if(openInitially) {
    
      this.elem.style.display = '';
      this.elem.style.height = '';
    
      removeClass(this.elem, this.options['collapsingClass']);
      addClass(this.elem, this.options['collapsedClass']);
    
    } else {
    
      this.resetClassList();
    
    }
    
  }
}

//---------------------------------ANIMATE FUNCTIONS ------------------------------------

WeberryCollapse.prototype.animateShow = function () {
  const {elem, _p} = this;
  
  if(this.hideInProgress) {
    this.unBindShowTransitionFn();
    this.unBindHideTransitionFn();
  }
  
  this.showInProgress = true;
  this.hideInProgress = false;
  
  /**
   * Set the height at which the animation begins
   */
  
  if(!this.hideInProgress) {
    elem.style.height = this.heightInitial + 'px';
  }
  
  this.bindShowTransitionFn();
  
  if(this.hideInProgress) {
    
    this.hideInProgress = false;
    elem.style.height = this.heightFinal + 'px';
    
  } else {
    
    addClass(elem, this.options['collapsingClass']);
  
    _p.showTimeout = setTimeout(() => {
      elem.style.height = this.heightFinal + 'px';
    }, 50);
  
  }
  
};

WeberryCollapse.prototype.animateHide = function () {
  const {elem, _p} = this;
  
  if(this.showInProgress) {
    this.unBindShowTransitionFn();
    this.unBindHideTransitionFn();
  }
  
  this.showInProgress = false;
  this.hideInProgress = true;
  
  /**
   * Set the height at which the animation begins
   */
  
  elem.style.height = this.heightFinal + 'px';
  
  this.bindHideTransitionFn();
  
  if(this.showInProgress) {
    
    this.showInProgress = false;
    elem.style.height = this.heightInitial + 'px';
  
  } else {
  
    addClass(elem, this.options['collapsingClass']);
  
    _p.hideTimeout = setTimeout(() => {
      elem.style.height = this.heightInitial + 'px';
    }, 50);
  
  }
};

//---------------------------------TRANSITION END EVENT FUNCTIONS ------------------------------------

WeberryCollapse.prototype.bindShowTransitionFn = function () {
  const {elem, _p} = this;
  elem.addEventListener(_p.transitionEvent, _p.showTransitionFn);
};

WeberryCollapse.prototype.unBindShowTransitionFn = function () {
  const {elem, _p} = this;
  clearTimeout(_p.showTimeout);
  elem.removeEventListener(_p.transitionEvent, _p.showTransitionFn);
};

WeberryCollapse.prototype.bindHideTransitionFn = function () {
  const {elem, _p} = this;
  elem.addEventListener(_p.transitionEvent, _p.hideTransitionFn);
};

WeberryCollapse.prototype.unBindHideTransitionFn = function () {
  const {elem, _p} = this;
  clearTimeout(_p.hideTimeout);
  elem.removeEventListener(_p.transitionEvent, _p.hideTransitionFn);
};

WeberryCollapse.prototype.setShowTransitionFn = function () {
  const {elem, options, _p} = this;
  _p.showTransitionFn = () => {
  
    /**
     * Checking if current height of elem not equal final height
     */
    
    if(this.elem.offsetHeight !== this.heightFinal) {
      return;
    }
  
    elem.removeEventListener(_p.transitionEvent, _p.showTransitionFn);
    
    removeClass(elem, options['collapsingClass']);
    addClass(elem, options['collapsedClass']);
    
    if (options.clearHeightShown) {
      elem.style.height = '';
    }
    
    this.showInProgress = false;
  
    /**
     *  Call listeners event SHOWN
     */
    
    elem.dispatchEvent(eventShown);
    options.handlerShown();
  };
};

WeberryCollapse.prototype.setHideTransitionFn = function () {
  const {elem, options, _p} = this;
  _p.hideTransitionFn = () => {
    
    /**
     * Checking if current height of elem not equal initial height
     */
    
    if(this.elem.offsetHeight !== this.heightInitial) {
      return;
    }
    
    elem.removeEventListener(_p.transitionEvent, _p.hideTransitionFn);
    
    removeClass(elem, options['collapsingClass']);
    elem.style.height = '';
    
    this.hideInProgress = false;
  
    /**
     *  Call listeners event HIDDEN
     */
    
    elem.dispatchEvent(eventHidden);
    options.handlerHidden();
  };
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

WeberryCollapse.prototype.on = function(event, fn) {
  const {_p} = this;
  _p.events[`event${_p.eventsTag}`] = {
    event,
    fn
  };
  
  _p.eventsTag += 1;
  
  this.elem.addEventListener(eventMap[event], fn);
};

WeberryCollapse.prototype.off = function(event, fn) {
  this.elem.removeEventListener(eventMap[event], fn);
};

window.WeberryCollapse = WeberryCollapse;

export default WeberryCollapse;