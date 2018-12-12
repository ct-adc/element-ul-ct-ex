import Vue from 'vue';
import utility from 'ct-utility';

Vue.directive('permission', {
  inserted(el, binding, vnode) {
    let { value } = binding;

    const permission = Vue.prototype.$$permission;

    if (typeof permission === 'undefined') {
      console.error('You have not get permission from api yet, make sure you get permission before in the entry js');
      return;
    }
    if (value && typeof value === String) {
      value = [value];
    }
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value;
      const hasPermission = permissionRoles.every(roleKeyStr=>{
        const isNot = roleKeyStr.indexOf('!') === 0;

        if (isNot) {
          roleKeyStr = roleKeyStr.substr(1);
        }
        const val = utility.base.getObjValByKey(permission, roleKeyStr);

        return isNot ? !val : val;
      });

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      console.error('need roles! Like v-permission="[\'admin\',\'editor\']"');
    }
  }
});
