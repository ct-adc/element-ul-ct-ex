## Permission 权限控制

permission对项目权限的控制包括针对路由的权限控制和针对页面中dom（如操作按钮）的权限控制。<br/><br/>
由于permission的使用不像单一的组件，它需要至少在项目中的两个地方进行代码修改。<br/><br/>
故下方的demo不能直接运行，仅供说明permission的使用。

### 使用前提
在入口文件中将配置传入permission

:::demo 
```html
入口文件修改示例
<script>
<!-- 主入口文件 -->
import ElementEx from 'element-ui-ct-ex';
Vue.use(ElementEx.Permission, {
    reqErrorFree: false,
    config: {
        page1: {
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

Vue.$permission('page1').then(()=>{
    new Vue({
        ...
    })
})
</script>
```
:::

### 路由权限控制

:::demo 当对router进行权限控制时 
```html
你可以点击<router-link to="/no-permission">查看无权限页面</router-link>
<script>
<!-- 主入口文件 -->
import ElementEx from 'element-ui-ct-ex';
import router from './router.js';
Vue.use(ElementEx.Permission, {
    reqErrorFree: false,
    router: router,
    config: {
        page1: {
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

Vue.$permission('page1').then(()=>{
    new Vue({
        ...
    })
})

<!-- router.js 在需要控制路由的路径上加入meta信息，用于指定对应的控制权限码-->
new VueRouter(routes: [{
    path: '/',
    redirect: '/app'
}, {
    path: '/app',
    component: App,
    meta: {authCode: 'page'}
}, {
    path: '/edit',
    component: Update,
    meta: {authCode: 'edit'},
    children: [{
        path: 'view',
        component: UpdateView,
        meta: {authCode: 'editView'}
    }]
}]);
</script>
```
:::

### 按钮权限控制

:::demo 在vue的template中使用v-permission
```html
<el-button v-permission="['edit']">编辑权限可用时显示</el-button>
<el-button v-permission="['!edit']">编辑权限不可用时显示</el-button>
<el-button v-permission="['edit', 'editView']">编辑权限和编辑中的查看权限都可用时显示</el-button>
```
:::

### option

此处列出的是使用Vue.use(permission)时传入的option配置

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| option | 权限配置对象指定了权限码、权限获取等方面的配置 | object | - |  |
| - option.noPermission | 没有权限时的提示文字 | string | -| '对不起，您没有该页面的权限' |
| - option.reqErrorFree | 如果屏蔽权限获取失败的提示，则直接提示无权限，否则，提示请求失败提示 | boolean | - | false |
| - option.reqErrorMsg | 当不屏蔽权限获取失败提示时，如果接口请求出错，则返回该提示 | string | - | '获取权限出错，请联系管理员' |
| - option.config | 和后端约定的权限码字典 具体格式[见下方](#option.config) | object | - | {} | 
| - option.axios | axios请求参数 [见下方](#optionaxios) | object | - | [见下方](#optionaxios) | 

### option.config

1. config中的每一项为一个页面的权限码配置，如config['check-record']; 其中check-record称为page-key；

2. 针对一个页面的配置，pageId为该页面的权限获取时用到的标识该页面的Id；如下面的配置中，该值为300105；

3. 针对一个页面的配置，code中每一项表示一个权限；一般地，使用'page'作为页面的权限，其他的作为页面中的操作权限；<br/>
对应的数字称为`权限码`；权限码兼容数字和字符串

```javascript
{
    'check-record': {
        pageId: 300105,
        code: {
            page: 30010,
            add: 102343,
            edit: 102344,
            editView: 102345
        }
    }
}
```

##### option.axios

默认值

```javascript
{
    url: '',
    method: 'get',
    transformResponse: [(response)=>{
        const res = utility.objTransfer.lowerKey(JSON.parse(response));

        if (res.code === 0) {
            return {
                status: true, //是否正确拿到了权限数据
                msg: '', //状态为true时，不会用到msg；
                data: res.data //状态为true时，将权限数据写入到该值中返回；例如[1002,1003,1004]
            };
        }
        return {
            status: false,
            msg: '获取权限出错，请联系管理员', // 状态为false时，如果option.resErrorFree为false,那么将提示该信息
            data: []
        };
    }]
}
```

axios配置和axios官方配置除params为函数外，其他均一致。
对于不同的请求类型的请求参数设置，规则如下：

1. 如果请求为put/post/patch请求，你可以用以下方法来指定请求参数：

    * 指定axios.data

        此时你可以通过设置axios.data为一个方法(参数为pageId)，返回一个处理过后的data；
        或者设置axios.data为一个对象，那么请求时将直接使用这个对象作为axios的data对象；

    * 指定axios.transformResponse

        不管是否指定了data, 你都通过transformRequest做请求主体的数据转变；

2. 如果请求为除put/post/patch外的请求，你可以用以下方法来指定请求参数：

    * 指定axios.params

        此时你可以通过设置axios.params为一个方法(参数为pageId)，返回一个处理过后的params；

    * 指定axios.params

        或者设置axios.params为一个对象，那么请求时将直接使用这个对象作为axios的params对象；

:::tip
如果没有对于请求没有任何请求参数指定，对于put/post/patch请求的请求主体为{pageId: pageId}，其他的请求请求参数为?pageId = [pageId]；
:::

:::warning
注意：请不要设置多余的请求数据处理配置，如当请求为'post'时，除非你真的需要设置params，否则请不要设置。
因为post请求中params是默认不忽略的，也就是说，axios没有禁止post请求不能带query。
:::