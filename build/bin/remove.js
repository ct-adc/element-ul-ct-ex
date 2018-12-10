// 删除一个组件
'use strict';

console.log();
process.on('exit', () => {
  console.log();
});

if (!process.argv[2]) {
  console.error('[组件名]必填 - Please enter new component name');
  process.exit(1);
}

const path = require('path');
const fs = require('fs');
const fileSave = require('file-save');
const componentname = process.argv[2];
var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
const PackagePath = path.resolve(__dirname, '../../packages', componentname);
const Files = [
  {
    filename: path.join('../../examples/docs/zh-CN', `${componentname}.md`)
  },
  {
    filename: path.join('../../test/unit/specs', `${componentname}.spec.js`)
  },
  {
    filename: path.join('../../packages/theme-chalk/src', `${componentname}.scss`)
  },
  {
    filename: path.join('../../types', `${componentname}.d.ts`)
  }
];
// 添加到 components.json
const componentsFile = require('../../components.json');
if (componentsFile[componentname]) {
  delete componentsFile[componentname];
}

// componentsFile[componentname] = `./packages/${componentname}/index.js`;
fileSave(path.join(__dirname, '../../components.json'))
  .write(JSON.stringify(componentsFile, null, '  '), 'utf8')
  .end('\n');

// 创建 package
deleteFolderRecursive(PackagePath);
Files.forEach(file => {
  if (fs.existsSync(path.join(PackagePath, file.filename))) {
    fs.unlinkSync(path.join(PackagePath, file.filename));
  }
});

// 添加到 nav.config.json
const navConfigFile = require('../../examples/nav.config.json');

Object.keys(navConfigFile).forEach(lang => {
  let groups = navConfigFile[lang][4].groups;
  groups[groups.length - 1].list = groups[groups.length - 1].list.filter(item=>{
    return item.path !== `/${componentname}`;
  });
});

fileSave(path.join(__dirname, '../../examples/nav.config.json'))
  .write(JSON.stringify(navConfigFile, null, '  '), 'utf8')
  .end('\n');

console.log('DONE!');
