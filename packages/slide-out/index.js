import SlideOut from './src/main';

/* istanbul ignore next */
SlideOut.install = function(Vue) {
  Vue.component(SlideOut.name, SlideOut);
};

export default SlideOut;
