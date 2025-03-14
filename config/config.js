// https://umijs.org/config/
import os, { hostname } from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';
// const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');
const fs = require('fs-extra');

const { pwa, primaryColor } = defaultSettings;
const { APP_TYPE, TEST, BUILD_ENV } = process.env;


if(process.env.ISBUILD) {
  const resolve = (dir) => path.join(__dirname, './', dir);
  fs.copy(
    resolve(process.env.BUILD_ENV === 'pro' ? '../seeConfig/config.pro.js' : '../seeConfig/config.local.js'),
    resolve('../dist/config.local.js'),
    console.error,
  );
}

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      ...(!TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
  // [
  //   'webpack-manifest-plugin',{
  //     // fileName: path.resolve(
  //     //   __dirname,
  //     //   '../../dist',
  //     //   `manifest.${Date.now()}.json`,
  //     // ),
  //     // generate(seed, files, entries) {
  //     //   return files.reduce((manifest, { name, path: manifestFilePath }) => {
  //     //     const { root, dir, base } = path.parse(manifestFilePath);

  //     //     return {
  //     //       ...manifest,
  //     //       [`${name}-${base}`]: { path: manifestFilePath, root, dir },
  //     //     };
  //     //   }, seed);
  //     // },
  //   }
  // ]
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
if (APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  history: 'hash',
  hash: true,
  publicPath:'./',
  plugins,
  define: {
    APP_TYPE: APP_TYPE || '',
    BUILD_ENV
  },
  treeShaking: true,
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  proxy: {
    '/api': {
      target: 'http://192.168.137.50:8088',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // 这里将 /api 替换为空字符串，从而移除它
      },
    },
    // '/fileUpload': {
    //   target: 'http://192.168.129.56:8080',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/fileUpload': '', // 这里将 /api 替换为空字符串，从而移除它
    //   },
    // },
    // '/activityUpload': {
    //   target: 'http://192.168.129.53:8080',
    //   changeOrigin: true,
    //   pathRewrite: {
    //     '^/activityUpload': '', // 这里将 /api 替换为空字符串，从而移除它
    //   },
    // },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  outputPath:'dist', // 打包后输出夹
  // outputPath:`dist-${BUILD_ENV}`, // 打包后输出夹
  chainWebpack: webpackPlugin,
};
