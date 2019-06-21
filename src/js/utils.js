export const addClass = (elem, classname) => {
  if (classname) {
    if (elem.classList) elem.classList.add(classname);
    else elem.className += ' ' + classname;
  }
};

export const removeClass = (elem, classname) => {
  if (classname) {
    if (elem.classList) elem.classList.remove(classname);
    else elem.className = elem.className.replace(new RegExp('(^|\\b)' + classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

export const arrayByClass = (classname, instance = document) => {
  
  const collection = instance.getElementsByClassName(classname);
  
  if (collection === undefined) {
    return collection;
  }
  
  return Array.from(collection);
};

export const domById = (id, instance = document) => {
  return document.getElementById(id);
};

export const whichTransitionEvent = () => {
  let t,
    el = document.createElement('fakeelement');
  
  const animations = {
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

const transitionEvent = whichTransitionEvent();

export const transitionAnimate = (el, params) => {
  const animation = params.animation;
  const onComplete = params.onComplete || (() => {});
  const beforeStart = params.beforeStart || (() => {});
  
  const immediately = params.immediately || false;
  
  let timeout;
  
  const transitionEndFn = (e) => {
    e.stopPropagation();
    el.removeEventListener(transitionEvent, transitionEndFn);
    onComplete();
  };
  
  beforeStart();
  
  el.addEventListener(transitionEvent, transitionEndFn);
  
  if(immediately) {
    animation();
  } else {
    timeout = setTimeout(animation, 50);
  }
  
  return {
    destroy() {
      clearTimeout(timeout);
      el.removeEventListener(transitionEvent, transitionEndFn);
    }
  }
};