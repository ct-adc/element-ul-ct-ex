// 获取权限内容并写入到Vue.prototype.$$permission中
import utility from 'ct-utility';
import Vue from 'vue';
import axios from 'axios';
import NoPermission from '../../no-permission';

const PERMISSION = {
  _option: {
    noPermission: '对不起，您没有该页面的权限',
    reqErrorFree: false,
    reqErrorMsg: '获取权限出错，请联系管理员',
    config: {},
    axios: {
      url: '',
      method: 'get',
      headers: {
        'If-Modified-Since': 0
      },
      transformResponse: [(response)=>{
        const res = utility.objTransfer.lowerKey(JSON.parse(response));

        if (res.code === 0) {
          return {
            status: true,
            msg: '',
            data: res.data
          };
        }
        return {
          status: false,
          msg: '获取权限出错，请联系管理员',
          data: []
        };
      }]
    }
  },
  /**
     * 解析权限数据，得出属性值为Boolean值的权限对象
     * @param {string} page _option.config中的page-key,用于指出是哪个页面
     * @param {array} permisson 权限码组成的数组
     * @private
     * @returns {object} 权限说明对象，形如{'page-key': {pageId: 3904340, page: true, operate: {edit: false}}}
     */
  _parser(page, permisson = []) {
    const pageConfig = PERMISSION._option.config[page].code;
    const pagePermissionStr = JSON.stringify(pageConfig).replace(/pageId:\d+/g, '').replace(/\d{1,20}/g, (match)=> {
      match = match * 1;
      return (permisson.indexOf(match) > -1 || permisson.indexOf(match + '') > -1).toString();
    });

    return JSON.parse(pagePermissionStr);
  },
  /**
     * 将permission对象混合到vue全局
     * @param {object} permission 权限对象
     * @private
     */
  _mix(permission) {
    Vue.prototype.$$permission = permission;
  },
  _mixNote(note) {
    Vue.prototype.$$permissionNote = note;
  },
  _registerComponent() {
    Vue.component('no-permission', NoPermission);
  },
  /**
     *
     * @param router
     * @param page
     * @private
     */
  route(router) {
    router.addRoutes([{
      path: '/no-permission',
      component: Vue.component('no-permission')
    }]);
    router.beforeEach((to, from, next) => {
      if (to.fullPath === '/no-permission') {
        next();
      } else {
        const requireAuth = to.matched.some(record => {
          return typeof record.meta.authCode !== 'undefined';
        });

        if (requireAuth) {
          const permission = Vue.prototype.$$permission;
          const hasPermission = to.matched.every(record => {
            const authCode = record.meta.authCode;

            if (typeof authCode !== 'undefined') {
              return utility.base.getObjValByKey(permission, authCode);
            }
            return true;
          });

          if (!hasPermission) {
            next({
              path: '/no-permission'
            });
          } else {
            next();
          }
        } else {
          next();
        }
      }
    });
  },
  /**
     * 注入权限配置
     * @param {object} option 权限配置
     * @param {string} option.noPermission 没有权限时的提示文字
     * @param {object} option.config 权限码字典 形如{'page-key': {pageId: 3904340, page: 39043401, operate: {edit: 39043402}}}
     * @param {object} option.ajax ajax配置 同Jquery.ajax配置，其中data为参数是pageId的方法
     * @param {object} option.resFilter 对请求结果的处理函数 参数为响应内容 结果为{status: Boolean, msg: String, data: Object}
     */
  config(option) {
    PERMISSION._option = utility.base.extend(true, {}, PERMISSION._option, option);
    return PERMISSION;
  },
  /**
     * 请求用户在某个页面的权限
     * @param {string} page page-key 对应option.config中的page-key
     * @returns {Promise.<TResult>} 返回请求permission的promise对象
     */
  get(page) {
    const pageId = PERMISSION._option.config[page].pageId;

    // resolveParams whatever the request type is
    if (PERMISSION._option.axios.params) {
      if (typeof PERMISSION._option.axios.params === 'function') {
        PERMISSION._option.axios.params = PERMISSION._option.axios.params(pageId);
      } else {
        PERMISSION._option.axios.params = PERMISSION._option.axios.params;
      }
    }

    const isPostType = ['put', 'post', 'patch'].indexOf(PERMISSION._option.axios.method.toLowerCase()) > -1;

    if (isPostType) {
      if (typeof PERMISSION._option.axios.data === 'undefined') {
        PERMISSION._option.axios.data = {
          pageId: pageId
        };
      } else if (typeof PERMISSION._option.axios.data === 'function') {
        PERMISSION._option.axios.data = typeof PERMISSION._option.axios.data(pageId);
      }
      // 否则就使用PERMISSION._option.axios.data作为请求主体
    } else if (typeof PERMISSION._option.axios.params === 'undefined') {
      PERMISSION._option.axios.params = {
        pageId: pageId
      };
    }
    return axios.request(PERMISSION._option.axios).then(response=>{
      const res = response.data;

      if (res.status) {
        // 当权限被正常返回时，解析出可读的permission对象
        const permission = PERMISSION._parser(page, res.data);

        // 进行Vue全局混合
        PERMISSION._mix(permission);
        PERMISSION._mixNote(PERMISSION._option.noPermission);
        // 返回permission对象 & 无权限时的提示信息
        return window.Promise.resolve({
          permission: permission,
          note: PERMISSION._option.noPermission
        });
      }
      // 当权限没有被正常返回时（即没有拿到权限），返回请求的失败提示
      return window.Promise.reject(res.msg);
    }).catch(msg=> {
      if (typeof msg !== 'string' || msg === '') {
        msg = PERMISSION._option.reqErrorMsg;
      }
      const permission = PERMISSION._parser(page);

      // 将permission对象中的权限设置为无，并进行Vue全局混合
      PERMISSION._mix(permission);
      PERMISSION._mixNote(PERMISSION._option.reqErrorFree ? PERMISSION._option.noPermission : msg);
      // 返回permission对象 & 无权限时的提示信息 注意: 此时提示的是请求错误的提示信息
      return window.Promise.resolve({
        permission: permission,
        note: PERMISSION._option.reqErrorFree ? PERMISSION._option.noPermission : msg
      });
    });
  }
};

PERMISSION._registerComponent();
export default PERMISSION;
