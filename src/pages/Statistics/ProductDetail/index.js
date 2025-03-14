import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Breadcrumb } from 'antd'
import Link from 'umi/link';
import AppDaily from './AppDaily'
import AppInfo from './AppInfo'
import Event from './Event'
import UserRate from './UserRate'

@connect( ( { statistics } ) => {
  return{
    appointAppData: statistics.appointAppData,
  }
} )
class Trends extends PureComponent {

  itemRender = ( route ) => {
    return <Link to={{ pathname: route.pathname, hash: route.path, query: !route.pathname && { appid: this.props.location.query.appid } }}>{route.breadcrumbName}</Link>;
  }

  render() {
    const appId = this.props.appId || this.props.location.query.appid;

    const routes = [
      // {
      //   breadcrumbName: '埋点产品列表',
      //   pathname: window.location.href.indexOf( 'activityData' ) > 0 ? '../statistics/app' : '../',
      // },
      {
        breadcrumbName: '整体趋势',
        children: [
          {
            breadcrumbName: '整体趋势',
            path: 'daily',
            content: () => (
              <div>
                <AppInfo appId={appId} />
                <AppDaily appId={appId} />
              </div>
            )
          },
          // {
          //   breadcrumbName: '渠道分析',
          //   path: 'channel',
          //   content: () => <div>开发中：只有整体趋势和自定义事件有内容</div>
          // },
          {
            breadcrumbName: '自定义事件',
            path: 'event',
            content: () => <Event appId={appId} />
          },
          {
              breadcrumbName: '存留分析',
              path: 'rate',
              content: () => <UserRate appId={appId} />
          },
        ],
      },
    ];

    const current = routes[0].children.find( o => window.location.hash.includes( o.path ) ) || routes[0].children[0];
    routes[0].breadcrumbName = current.breadcrumbName;

    return (
      <div>
        <Breadcrumb routes={routes} style={{ paddingBottom: '10px' }} itemRender={this.itemRender} />
        {
          current.content()
        }
      </div>
    );
  }
}

export default Trends;

