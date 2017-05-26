import { getElements } from './elements';
import { inViewport, getContext } from './viewport';
import { defaults } from './options';

export default class Registry {
  constructor(elements, options) {
    this.elements = getElements(elements);
    this.mapCache = this.elements.map(el => false);
    this.handlers = { enter: [], exit: [] };
    this.options = {
      ...defaults,
      ...options
    };
  }

  update() {
    const map = this.getMap();
    map.forEach((isVisible, index) => {
      const wasVisible = this.mapCache[index];
      this.report(
        this.elements[index],
        (!wasVisible && isVisible),
        (wasVisible && !isVisible)
      );
    });
    this.mapCache = map;
    return this;
  }

  report(element, entered, exited) {
    // Call appropriate handlers...
  }

  on(event, fn) {
    if (event !== 'enter' && event !== 'exit')
      throw new Error(
        'Unsupported event type. Expected "enter" or "exit".'
      );
    this.handlers[event].push(fn);
    return () => {
      const index = this.handlers[event].indexOf(fn);
      this.handlers[event].splice(index, 1);
    };
  }

  getMap() {
    return this.elements.map(el => {
      return this.options.test(
        el.getBoundingClientRect(),
        getContext()
      );
    }, this);
  }
}
