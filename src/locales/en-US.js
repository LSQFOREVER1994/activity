import jiniu from './en-US/jiniu';
import exception from './en-US/exception';
import form from './en-US/form';
import login from './en-US/login';
import menu from './en-US/menu';
import acount from './en-US/acount';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import pwa from './en-US/pwa';
import component from './en-US/component';
import strategyMall from './en-US/strategyMall';
import statistics from './en-US/statistics';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.home.introduce': 'introduce',
  'app.forms.basic.title': 'Basic form',
  'app.forms.basic.description': 'Form pages are used to collect or verify information to users, and basic forms are common in scenarios where there are fewer data items.',
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
  ...statistics,
};
