import permission from './src/permission';
import directive from './src/directive';

export default {
  install(Vue, options) {
    Vue.use(directive);
    permission.config(options);
    // Vue.$permission = permission.get;
    // router暂且放入option
    if (typeof options.router !== 'undefined') {
      permission.route(options.router);
    }
  },
  directive,
  permission: permission.get
};
