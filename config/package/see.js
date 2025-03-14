const fs = require('fs-extra');
const path = require('path');
const { generateSeePackageZip } = require('@winner-fed/winner-deploy');
const {
  generateSeePackageInfo, copyDistToDocker, copyPackageToDistZip, removeDir,
} = require('../utils');

// 系统分类，必须按照实际项目要求填写
const system = 'jn-activitys';

if (!system) {
  throw new Error('system 不能为空！根据实际项目需求进行命名！');
}

// const resolve = (dir) => path.join(__dirname, './', dir);
// fs.copy(
//   resolve(`../config.local.js`),
//   resolve('../../dist/config.local.js'),
//   console.error,
// );

const type = 'bizframe';
const configName = 'config.local';
const DEST_DIR = path.join(__dirname, '../../dist');
const DEST_ZIP_DIR = path.join(__dirname, '../../dist-zip');
console.log(DEST_DIR, DEST_ZIP_DIR, '11111');
async function init() {
  // 1. 生成 see 发布物的名称及参数
  const { seePackageName, seePackageOptions } = generateSeePackageInfo({ system, type });

  // 2. 移除 package 文件夹
  fs.removeSync('./package');

  // 3. 生成 see 平台发布物
  // 生成 docker 包的同时也生成 see 包
  if (seePackageOptions.seePackageType && seePackageOptions.seePackageType === 'docker') {
    generateSeePackageZip(
      {
        ...seePackageOptions,
        configName,
        seePackageName,
      },
      () => {
        // 拷贝dist 目录里的内容到 docker/html 目录下
        // cp -r dist docker/html 命令的 js 版本
        copyDistToDocker();

        generateSeePackageZip({
          ...seePackageOptions,
          seePackageType: 'web',
          configName,
          seePackageName: seePackageName.replace('-docker', ''),
        });
      },
    );

    return;
  }
  console.log('---------seePackageOptions---------');
  console.log(seePackageOptions);
  console.log('---------seePackageOptions---------');
  console.log('---------configName---------');
  console.log(configName);
  console.log('---------configName---------');
  console.log('---------seePackageName---------');
  console.log(seePackageName);
  console.log('---------seePackageName---------');

  const obj = {
    ...seePackageOptions,
    configName,
    seePackageName,
  };

  console.log('---------generateSeePackageZip---------');
  console.log(obj);
  console.log('---------generateSeePackageZip---------');

  generateSeePackageZip(obj, () => {
    console.log('zip之前');
    // 拷贝 package 目录里的内容到 dist-zip 目录下
    copyPackageToDistZip(() => {
      console.log('zip');
      // 删除原dist，将dist-zip重命名为dist
      removeDir(DEST_DIR);
      fs.renameSync(DEST_ZIP_DIR, DEST_DIR);
    });
  });
}

init().catch((e) => {
  console.log('---------init---------');
  console.error(e);
  console.log('---------init---------');
});
