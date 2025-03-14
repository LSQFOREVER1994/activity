import jiniu from './zh-CN/jiniu';
import exception from './zh-CN/exception';
import form from './zh-CN/form';
import login from './zh-CN/login';
import menu from './zh-CN/menu';
import acount from './zh-CN/acount';
import settingDrawer from './zh-CN/settingDrawer';
import settings from './zh-CN/settings';
import pwa from './zh-CN/pwa';
import component from './zh-CN/component';
import strategyMall from './zh-CN/strategyMall';
import action from './zh-CN/action';
import statistics from './zh-CN/statistics';
import website from './zh-CN/website';

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.home.introduce': '介绍',
  'app.forms.basic.title': '基础表单',
  'app.forms.basic.description': '表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。',
  ...jiniu,
  ...exception,
  ...form,
  ...login,
  ...menu,
  ...acount,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...strategyMall,
  ...action,
  ...statistics,
  ...website,
};
