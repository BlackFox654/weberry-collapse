import { domById } from './utils';

import WeberryCollapse from './collapse';

const collapseDom = domById('collapse');
const collapseDom1 = domById('collapse1');

window.addEventListener('load', () => {
  const collapse = new WeberryCollapse(collapseDom, {openInitially: true});
  const collapse1 = new WeberryCollapse(collapseDom1);
});