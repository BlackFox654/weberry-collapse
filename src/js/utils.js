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