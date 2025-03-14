/**
 *
 * @authors liwb (you@example.org)
 * @date    2022/01/04 11:33
 * @version variables 参考 http://hui.hundsun.com/frame-config/#see-variables
 */

module.exports = {
  variables: [
    {
      type: 'input',
      label: '服务基础路径-userService',
      name: 'API_HOME_userService',
      required: true,
      tooltip: '后端服务接口地址-userService',
      default: process.env.BUILD_ENV === 'pro' ? 'http://wlhgqki2lstri8qz.apigateway.ant.res.xdhfcloud.com:80' : 'http://b4fo6yxqgfc8n9km.apigateway.antdev.xdcloud.com:8088',
    },
    {
      type: 'input',
      label: '服务基础路径-statisticsService',
      name: 'API_HOME_statisticsService',
      required: true,
      tooltip: '后端服务接口地址-statisticsService',
      default: process.env.BUILD_ENV === 'pro' ? 'http://yhe2gpnyfz1d1xld.apigateway.ant.res.xdhfcloud.com:80' : 'http://hop6xb1r9s2a8req.apigateway.antdev.xdcloud.com:8088',
    },
    {
      type: 'input',
      label: '服务基础路径-activityService',
      name: 'API_HOME_activityService',
      required: true,
      tooltip: '后端服务接口地址-activityService',
      default: process.env.BUILD_ENV === 'pro' ? 'http://z2gcrqccsnkttgle.apigateway.ant.res.xdhfcloud.com:80' : 'http://dlww2jfxo18k83o6.apigateway.antdev.xdcloud.com:8088',
    },
    {
      type: 'input',
      label: '服务基础路径-libraryService',
      name: 'API_HOME_libraryService',
      required: true,
      tooltip: '后端服务接口地址-libraryServiceUrlObj',
      default: process.env.BUILD_ENV === 'pro' ? 'http://sdwkbigclacmwsaw.apigateway.ant.res.xdhfcloud.com:80' : 'http://7q8skcf1kelp6zpo.apigateway.antdev.xdcloud.com:8088',
    },
    {
      type: 'input',
      label: '服务基础路径-equityCenterService',
      name: 'API_HOME_equityCenterService',
      required: true,
      tooltip: '后端服务接口地址-equityCenterService',
      default: process.env.BUILD_ENV === 'pro' ? 'http://mnpjvnd1brtiw8od.apigateway.ant.res.xdhfcloud.com:80' : 'http://oezspffnlmikunij.apigateway.antdev.xdcloud.com:8088',
    },
    {
      type: 'input',
      label: '服务基础路径-xindaServive',
      name: 'API_HOME_xindaServive',
      required: true,
      tooltip: '后端服务接口地址-xindaServive',
      default: process.env.BUILD_ENV === 'pro' ? 'http://i3jpowayodsqh6ab.apigateway.ant.res.xdhfcloud.com:80' : 'http://kwuhdb0ru8njw3rm.apigateway.antdev.xdcloud.com:8088',
    },
    {
      type: 'input',
      label: '服务基础路径-fileUploadService',
      name: 'API_HOME_fileUploadService',
      required: true,
      tooltip: '后端服务接口地址-fileUploadService',
      default: process.env.BUILD_ENV === 'pro' ? 'http://172.23.49.84:8088' : 'http://192.168.129.56:8080',
    },
    {
      type: 'input',
      label: '服务基础路径-activityUploadService',
      name: 'API_HOME_activityUploadService',
      required: true,
      tooltip: '后端服务接口地址-activityUploadService',
      default: process.env.BUILD_ENV === 'pro' ? 'http://172.23.49.84:8088' : 'http://192.168.129.53:8080',
    },
    {
      type: 'input',
      label: '服务基础路径-rightUploadService',
      name: 'API_HOME_rightUploadService',
      required: true,
      tooltip: '后端服务接口地址-rightUploadService',
      default: process.env.BUILD_ENV === 'pro' ? 'http://172.23.49.84:8088' : 'http://192.168.129.55:8080',
    },
    {
      type: 'input',
      label: '服务基础路径-userUploadService',
      name: 'API_HOME_userUploadService',
      required: true,
      tooltip: '后端服务接口地址-userUploadService',
      default: process.env.BUILD_ENV === 'pro' ? 'http://172.23.49.84:8088' : 'http://192.168.129.54:8080',
    },
  ],
};
