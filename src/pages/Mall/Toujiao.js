/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable react/no-array-index-key,no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './mall.less';

@connect( ( ) => ( {} ) )

class Toujiao extends PureComponent {
    // 初始化数据
    state = {

    };

    componentDidMount() {};

    render() {
        return (
          <GridContent>
            <div className={styles.mall}>
              <iframe className={styles.iframe} src="https://m.jiniutech.com/v/index.html#/main?dataKey=zntj" />
            </div>
            
          </GridContent>
        );
    };
}

export default Toujiao;