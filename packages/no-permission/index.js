import NoPermission from './src/main';

/* istanbul ignore next */
NoPermission.install = function(Vue) {
  Vue.component(NoPermission.name, NoPermission);
};

export default NoPermission;
