import React, { useMemo, useState, useContext } from "react";
import { Input, Icon, Empty } from 'antd'
import styles from './index.less'
import listData from './listData'
import { CommonOperationFun } from '../../../provider'

const filterTypeList = [
      {
        label: '全部',
        value: 'all',
      },
      {
        label: '基础',
        value: 'base',
      },
      {
        label: '抽奖',
        value: 'REWARD_ELEMENT',
      },
      {
        label: '任务',
        value: 'TASK_ELEMENT',
      },
      {
        label: '产品',
        value: 'prize',
      },
      {
        label: '互动',
        value: 'interaction',
      }
    ]
const baceClass = 'componentList'
function ComponentList( { evalDragStart, evalDragEnd } ) {
  const { addComponentsFun } = useContext( CommonOperationFun )
  const [filterType, setFilterType] = useState( 'all' )
  const [searchVal, setSearchVal] = useState( '' )
  const handleClickFIlterType = ( type ) => {
    setFilterType( type )
  }
  const componentListData = useMemo( () => {
    const res = listData.filter( item => {
      let flag = true
      if ( filterType !== 'all' ) {
        flag = item.category === filterType
      }
      if ( flag && searchVal ) {
        flag = item.label.includes( searchVal )
      }
      return flag
    } )
    return res
  }, [filterType, searchVal] )
    return(
      <div className={styles[`${baceClass}Wrap`]}>
        <div>
          <div className={styles[`${baceClass}Search`]}>
            <Input
              value={searchVal}
              onChange={( e ) => {setSearchVal( e.target.value )}}
              placeholder="搜索组件"
              suffix={
                <Icon
                  type="search"
                  style={{
                color: 'rgba(0,0,0,.45)',
              }}
                />
          }
            />
          </div>
          <div className={styles[`${baceClass}FilterTypeWrap`]}>
            <div className={styles[`${baceClass}FilterTypeList`]}>
              {filterTypeList.map( item => (
                <div
                  key={item.value}
                  className={`${styles[`${baceClass}FilterTypeItem`]} ${filterType === item.value ? styles[`${baceClass}FilterTypeItem_active`] : ''}`}
                  onClick={handleClickFIlterType.bind( null, item.value )}
                >
                  <p className={styles[`${baceClass}FilterTypeText`]}>{item.label}</p>
                </div>

            ) )}
            </div>
          </div>
        </div>
        <div className={styles[`${baceClass}ListWrap`]}>
          {
            componentListData.length ? (
              <div className={styles[`${baceClass}List`]}>
                {
                  componentListData.map( item => (
                    <div
                      draggable
                      onDragStart={evalDragStart.bind( null, item )}
                      onDragEnd={evalDragEnd}
                      onDoubleClick={addComponentsFun.bind( null, JSON.parse( JSON.stringify( item ) ) )}
                      key={item.id}
                      className={styles[`${baceClass}Item`]}
                    >
                      <div className={styles[`${baceClass}Img`]}>
                        <img src={item.icon} alt="" />
                      </div>
                      <p>{item.label}</p>
                    </div>
                  ) )
                }
              </div>
            ) : (
              <div className={styles[`${baceClass}Empty`]}>
                <Empty description='暂无组件'  />
              </div>
            )
          }

        </div>
      </div>
    )
}
export default ComponentList
