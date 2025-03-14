import React, { useEffect, useMemo, useState } from 'react';
import { Card, Breadcrumb, Menu, Button } from 'antd';
import { connect } from 'dva';
import StatisticsChart from './StatisticsChart';
import DetailTable from './DetailTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './votingData.less';

// 投票统计
function VotingData( props ) {
  const { activityId, activityDetail, dispatch, closeUserActionPage } = props;
  const { elements } = activityDetail;
  
  const [key, setKey] = useState( 'statistics' );
  const [elementsArray, setElementsArray] = useState( [] );
  const [elementId, setElementId] = useState();
  const [domData, setDomData] = useState( {} );
  
  // 获取活动详情信息
  const getBeesInfo = () => {
    dispatch( {
      type: 'thirdDataCenter/getBeesInfo',
      payload: {
        query: {
          activityId
        },
      }
    } );
  }

  useEffect( () => {
    const component = elements?.find( item => {
      if ( item.type === "VOTING" ) return item
      return null
    } )
    
    setElementId( component?.id )
    setDomData( component )
  }, [] )

  useEffect( () => {
    if ( !elementId && !activityId ) {
      getBeesInfo()
    }
  }, [elementId, activityId] )

  useEffect( () => {
    if ( elements ) {
      const ids = []
      elements.forEach( item => {
        if ( item.type === "VOTING" ) {
          ids.push( item.id )
        }
      } );
      setElementsArray( ids )
    }
  }, [elements] )

  const renderBreadcrumbItem = useMemo( () => {
    let menu = false;
    if ( elementsArray?.length > 1 ) {
      menu = (
        <Menu>
          {
            elementsArray?.map( item => {
              return (
                <Menu.Item
                  key={item}
                  onClick={() => {
                    setElementId( item )
                  }}
                >
                  投票统计({item})
                </Menu.Item>
              )
            } )
          }
        </Menu> )
    }

    return (
      <Breadcrumb.Item overlay={menu}>投票统计({elementId})</Breadcrumb.Item>
    );
  }, [elementsArray, elementId] )

  return (
    <GridContent>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>
          <a onClick={() => { closeUserActionPage() }}>数据中心</a>
        </Breadcrumb.Item>
        {renderBreadcrumbItem}
      </Breadcrumb>
      <Card
        bordered={false}
        title='详细信息'
        headStyle={{ fontWeight: 'bold' }}
        bodyStyle={{ padding: '0 32px 40px 32px', margin: '16px' }}
      >
        <Button type={key === 'statistics' ? 'primary' : 'default'} className={styles.chart_button} onClick={() => { setKey( 'statistics' ) }}>题目图表分析</Button>
        <Button type={key === 'detail' ? 'primary' : 'default'} className={styles.chart_button} onClick={() => { setKey( 'detail' ) }}>数据详情</Button>
        {key === 'statistics' && <StatisticsChart id={activityId} elementId={elementId} domData={domData} />}
        {key === 'detail' && <DetailTable id={activityId} elementId={elementId} />}
      </Card>
    </GridContent>
  )
}

export default connect( ( { votingData, thirdDataCenter } ) => ( {
  ...votingData,
  ...thirdDataCenter
} ) )( VotingData );
