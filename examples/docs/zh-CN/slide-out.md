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

## SlideOut 滑层

:::demo 需要设置`visible`属性，它接收`Boolean`，当为`true`时显示 Slideout。Slideout 分为两个部分：`body`和`footer`，`footer`需要具名为`footer`的`slot`。`title`属性用于定义标题，它是可选的，默认值为空。最后，本例还展示了`before-close`的用法。
```html
<el-button @click="show">弹出滑层</el-button>

<el-slide-out
ref="slideout"
:visible.sync="visible"
width="50%"
title="添加">
    <span slot="footer" class="Slideout-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
    </span>
</el-slide-out>

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
```
:::

:::tip
`before-close` 仅当用户通过点击关闭图标或遮罩关闭 Slideout 时起效。如果你在 `footer` 具名 slot 里添加了用于关闭 Slideout 的按钮，那么可以在按钮的点击回调函数里加入 `before-close` 的相关逻辑。
:::

### 自定义内容

Slideout 组件的内容可以是任意的，甚至可以是表格或表单，下面是应用了 Element Table 和 Form 组件的两个样例。

:::demo
```html
<el-button @click="show">弹出滑层</el-button>

<el-slide-out
ref="slideout"
modal-append-to-body
:visible.sync="visible"
width="50%"
title="添加">
    <div slot="body">
        body是一个slot，可以随意定制内容
    </div>
    <span slot="footer" class="Slideout-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
    </span>
</el-slide-out>

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
```
:::

:::tip
如果 `visible` 属性绑定的变量位于 Vuex 的 store 内，那么 `.sync` 不会正常工作。此时需要去除 `.sync` 修饰符，同时监听 Slideout 的 `open` 和 `close` 事件，在事件回调中执行 Vuex 中对应的 mutation 更新 `visible` 属性绑定的变量的值。
:::

### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| visible   | 是否显示 Slideout，支持 .sync 修饰符 | boolean | — | false |
| title     | Slideout 的标题，也可通过具名 slot （见下表）传入 | string    | — | — |
| width     | Slideout 的宽度 | string    | — | 50% |
| modal     | 是否需要遮罩层   | boolean   | — | true |
| modal-append-to-body  | 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Slideout 的父元素上   | boolean   | — | true |
| lock-scroll | 是否在 Slideout 出现时将 body 滚动锁定 | boolean | — | true |
| custom-class      | Slideout 的自定义类名 | string    | — | — |
| close-on-click-modal | 是否可以通过点击 modal 关闭 Slideout | boolean    | — | true |
| close-on-press-escape | 是否可以通过按下 ESC 关闭 Slideout | boolean    | — | true |
| show-close | 是否显示关闭按钮 | boolean    | — | true |
| before-close | 关闭前的回调，会暂停 Slideout 的关闭 | function(done)，done 用于关闭 Slideout | — | — |

### Slot
| name | 说明 |
|------|--------|
| — | Slideout 的内容 |
| title | Slideout 标题区的内容 |
| footer | Slideout 按钮操作区的内容 |

### Events
| 事件名称      | 说明    | 回调参数      |
|---------- |-------- |---------- |
| open  | Slideout 打开的回调 | — |
| opened  | Slideout 打开动画结束时的回调 | — |
| close  | Slideout 关闭的回调 | — |
| closed | Slideout 关闭动画结束时的回调 | — |


### 已知bug

* `closeOnPressEscape只有在modal为true时该值的true才生效`