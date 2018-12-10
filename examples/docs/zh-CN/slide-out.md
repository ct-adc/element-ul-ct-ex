<script>
  export default {
    data(){
        return {
            visible: false
        };
    },
	methods: {
        show(){
            this.visible = true;
        }
	}
  }
</script>

## SlideOut slide-out

:::demo

```html
<template>
  <el-slide-out
    ref="slideout"
    modal-append-to-body
    :visible.sync="visible"
    width="50%"
    title="添加">
  </el-slide-out>
  <el-button @click="show">弹出浮层</el-button>
</template>
```

:::
