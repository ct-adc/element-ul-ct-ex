<template>
  <div class="el-no-permission">
    {{permissionNote}}
    <p class="text-center mt20 f14">
        请联系相关人员进行权限申请，若已配好权限，点击 <el-button type="primary" @click="jumpToIndex">刷新试试</el-button>
    </p>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'ElNoPermission',
  methods: {
    jumpToIndex() {
      window.location = window.location.href.replace(/^([^#]+).*$/, '$1');
    }
  },
  computed: {
    permissionNote() {
      if (typeof Vue.$$permissionNote !== 'undefined') {
        return Vue.permissionNote;
      }
      return '';
    }
  }
};
</script>
