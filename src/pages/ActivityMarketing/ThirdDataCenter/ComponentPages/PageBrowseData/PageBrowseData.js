/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-08-20 15:52:02
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-08-20 16:17:17
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/ThirdDataCenter/ComponentPages/PageBrowseData/PageBrowseData.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Breadcrumb } from 'antd'
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import AppDaily from './AppDaily'
import AppInfo from './AppInfo'
import Event from './Event'
import UserRate from './UserRate'

@connect( ( { statistics } ) => {
  return{
    appointAppData: statistics.appointAppData,
  }
} )
class PageBrowseData extends PureComponent {
  constructor( props ) {
    super( props )
    this.state = {
    };
  }

  render() {
    const { activityId, closeUserActionPage }=this.props;

    return (
      <GridContent>
        <Breadcrumb style={{ marginBottom: 20 }}>
          <Breadcrumb.Item>
            <a onClick={() => { closeUserActionPage() }}>数据中心</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>埋点数据</Breadcrumb.Item>
        </Breadcrumb>
        <AppInfo appId={activityId} />
        <AppDaily appId={activityId} />
        <Event appId={activityId} />
        {/* <UserRate appId={activityId} /> */}
      </GridContent>
    );
  }
}

export default PageBrowseData;

