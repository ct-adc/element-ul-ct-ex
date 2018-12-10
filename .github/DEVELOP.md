### 开发指南

### build目录

```
build
├── bin // 各种基于nodejs的项目构建批处理工具
│   ├── build-entry.js // 将全部组件(/components.json)集合起来生成一个entry(/src/index)文件
│   ├── build-locale.js // 生成./lib中的umd/各种语言版本的.js文件(文件中存储的是一些组件会用到的常量)
│   ├── gen-cssfile.js // 根据全部组件列表(components.json)动态生成 /packages/theme-chalk/src/index.scss(/index.css)
│   ├── gen-indices.js // 生成供全局搜索的索引
│   ├── i18n.js // 根据当前选定的语言将网站中的template(/examples/pages/template/)转化为vue(/examples/pages/{lang}/)组件 
│   ├── iconInit.js // 解析../../packages/theme-chalk/src/icon.scss中的用到的icon写入到../../examples/icon.json
│   ├── new-lang.js // 在项目中加入一种语言 
│   ├── new.js // 在项目中加入一个component
│   ├── template.js // 动态监听templates并实时转为.vue文件
│   └── version.js // 生成/examples/versions.json 提供版本信息
├── config.js 
├── deploy-ci.sh // 上传lib/theme-chalk/dev git仓库
├── deploy-faas.sh // 发布网站，其中faas需要对应支持  (工具为faas-cli)
├── gen-single-config.js // 
├── git-release.sh // 检测dev分支是否和远程一致
├── release.sh // 发布一个版本
├── salad.config.json // salad配置，负责样式（ElemeFE/postcss-salad）
├── strip-tags.js // 工具模块,删除html片段中的指定tag
├── webpack.common.js // 构建组件，生成/dist/element-ui-ct-ex.common.js
├── webpack.component.js // 将每个组件构建成./lib中对应的.js文件
├── webpack.conf.js // 构建组件，生成/dist/index.js
├── webpack.demo.js // 构建网站(examples中的内容)
└── webpack.test.js // karma-webpack的配置项
```

### 单元测试 

* 测试平台 karma
* 测试框架 jasmine(BDD测试)
* 断言库 sinon-chai

karma中还配置了mocha，但目前不知道mocha用在了哪里

### 项目中的npm命令

命令的格式: a:a1其中:类似子任务

```
// 项目初始化
"bootstrap": "yarn || npm i",
// 构建UI网站中用到的各种配置文件
"build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js",
// 构建样式，并拷贝到./lib
"build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
// 把src/下的directives locale mixins transitions utils等构建成lib下对应的文件
"build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
// 生成./lib中的umd/各种语言版本的.js文件(文件中存储的是一些组件会用到的常量)
"build:umd": "node build/bin/build-locale.js",
// 清除各种原因下生成的文件
"clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage",
// 部署UI网站 发布到gh-pages
"deploy": "npm run deploy:build && gh-pages -d examples/element-ui-ct-ex --remote eleme && rimraf examples/element-ui-ct-ex",
// 构建UI网站
"deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui-ct-ex/CNAME",
// 开启开发调试模式,因为template不会被热更，所以自行加入热更逻辑
"dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
// 暂时没啥东西
"dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js",
// 生成最终的文件(总体构建使用该命令)
"dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme",
// 根据当前选定的语言将网站中的template(/examples/pages/template/)转化为vue(/examples/pages/{lang}/)组件
"i18n": "node build/bin/i18n.js",
// 运行eslint检查
"lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet",
// 发布
"pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js && sh build/deploy-faas.sh",
// 运行单元测试
"test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ karma start test/unit/karma.conf.js --single-run",
// watch模式下运行单元测试
"test:watch": "npm run build:theme && karma start test/unit/karma.conf.js"
```

### 修改npm名称

1. 修改build/config.js，将external的目标转到element-ui-ct
2. 修改.bablerc，将element-ui-ct-ex/src的指向由element-ui-ct-ex/lib改为element-ui-ct/lib

