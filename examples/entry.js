import Vue from 'vue';
import entry from './app';
import VueRouter from 'vue-router';
import Element from 'element-ui-ct';
import 'element-ui-ct/lib/theme-chalk/index.css';
import ElementEx from 'main/index.js';
import 'packages/theme-chalk/src/index.scss';
import routes from './route.config';
import demoBlock from './components/demo-block.vue';
import MainFooter from './components/footer.vue';
import MainHeader from './components/header.vue';
import SideNav from './components/side-nav';
import FooterNav from './components/footer-nav';
import title from './i18n/title.json';

Vue.use(Element);
Vue.use(ElementEx);
Vue.use(VueRouter);
Vue.component('demo-block', demoBlock);
Vue.component('main-footer', MainFooter);
Vue.component('main-header', MainHeader);
Vue.component('side-nav', SideNav);
Vue.component('footer-nav', FooterNav);

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
});

router.afterEach(route => {
  const data = title[route.meta.lang];
  for (let val in data) {
    if (new RegExp('^' + val, 'g').test(route.name)) {
      document.title = data[val];
      return;
    }
  }
  document.title = 'Element';
});
Vue.use(ElementEx.Permission, {
  reqErrorFree: false,
  router: router,
  config: {
    'page1': {
      pageId: 300105,
      code: {
        page: 30010,
        add: 102343,
        edit: 102344,
        editView: 102345
      }
    }
  },
  axios: {
    url: '/permission/get1',
    method: 'get',
    params(pageId) {
      return {
        page: pageId
      };
    }
  }
});
// Vue.$permission('page1').then(()=>{
new Vue({ // eslint-disable-line
  render: h => h(entry),
  router
}).$mount('#app');
// });

