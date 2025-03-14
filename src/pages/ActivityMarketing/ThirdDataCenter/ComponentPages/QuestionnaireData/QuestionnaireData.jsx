import React, { useEffect, useMemo, useState } from 'react';
import { Card, Breadcrumb, Menu, Button } from 'antd';
import { connect } from 'dva';
import StatisticsChart from './StatisticsChart';
import DetailTable from './DetailTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './questionnaireData.less';

// 新问卷统计
function QuestionnaireData( props ) {
  const { activityId, activityDetail, dispatch, closeUserActionPage } = props;
  const { elements } = activityDetail;
  const [key, setKey] = useState( 'statistics' );
  const [elementsArray, setElementsArray] = useState( [] );
  const [elementId, setElementId] = useState();
  
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
      if ( item.type === "QUESTIONNAIRE" ) return item
      return null
    } )
    setElementId( component?.id )
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
        if ( item.type === "QUESTIONNAIRE" ) {
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
                  问卷统计({item})
                </Menu.Item>
              )
            } )
          }
        </Menu> )
    }

    return (
      <Breadcrumb.Item overlay={menu}>问卷统计({elementId})</Breadcrumb.Item>
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
        {key === 'statistics' && <StatisticsChart id={activityId} elementId={elementId} />}
        {key === 'detail' && <DetailTable id={activityId} elementId={elementId} />}
      </Card>
    </GridContent>
  )
}

export default connect( ( { questionnaireData, thirdDataCenter } ) => ( {
  ...questionnaireData,
  ...thirdDataCenter
} ) )( QuestionnaireData );
