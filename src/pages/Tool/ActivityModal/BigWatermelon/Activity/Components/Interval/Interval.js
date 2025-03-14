// 分段区间
import React, { PureComponent } from 'react';
import { Input, Icon, message } from 'antd';
import styles from './Interval.css';


class Interval extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      intervalArr: this.setIntervalArr()
    }
  }

  setIntervalArr = () => {
    const { fragmentsList } = this.props;
    if ( fragmentsList && fragmentsList.length ) {
      return [...fragmentsList]
    }
    return [{
      disabled: false,
      rankFrom: null,
      rankTo: null
    }]
  }

  // 添加分段
  addInterval = () => {
    const { intervalArr } = this.state;
    intervalArr.push( {
      minValue: 0,
      maxValue: 99999,
      disabled: false,
      rankFrom: null,
      rankTo: null
    } );

    this.setState( {
      intervalArr: [...intervalArr],
    } );
  }

  // 保存分段
  handleChange = ( index ) => {
    const { intervalArr } = this.state;
    const judge = intervalArr.filter( ( item, fIndex, arr ) => {
      // 最低值比最大值大
      let coincide = false;
      if ( +item.rankFrom >= +item.rankTo ) {
        return true;
      }
      // 最低值或最大值不存在
      if ( !item.rankFrom || !item.rankTo ) {
        return true;
      }
      // 判断分段重合
      arr.forEach( ( v, i ) => {
        if ( +item.rankFrom >= +v.rankFrom && +item.rankFrom <= +v.rankTo && fIndex !== i ) {
          coincide = true;
        }
      } );
      return coincide;
    } );
    if ( !judge.length ) {
      intervalArr[index].disabled = true;
      this.setState( {
        intervalArr: [...intervalArr],
      } );
      this.propsChange( intervalArr );
    } else {
      message.error( '请检查分段值设置是否准确' );
    }
  }

  // 编辑分段
  editorHandle = ( index, hasEdit ) => {
    if ( hasEdit ) {
      const { intervalArr } = this.state;
      intervalArr[index].disabled = false;
      this.setState( {
        intervalArr: [...intervalArr],
      } );
      this.propsChange( intervalArr );
    } else {
      message.error( '该分段已设置奖品，不可编辑' );
    }

  }

  // 删除分段
  deleteHandle = ( index, hasEdit ) => {
    if( hasEdit ) {
      const { intervalArr } = this.state;
      if ( intervalArr.length > 1 ) {
        intervalArr.splice( index, 1 );
        this.setState( {
          intervalArr:[...intervalArr],
        } );
        this.propsChange( intervalArr );
      } else {
        message.error( '最后一条不可删除' );
      }
    } else {
      message.error( '该分段已设置奖品，不可删除' );
    }

  }

  // 最低最高值设置
  OnChange = ( e, index, key ) => {
    const { intervalArr } = this.state;
    if ( e.target.value > 99999 ) {
      intervalArr[index][key] = 99999;
    } else {
      intervalArr[index][key] = e.target.value.replace( /[^\d]+/g, '' );
    }
    this.setState( {
      intervalArr: [...intervalArr]
    } );
  }

  // 触发传递分段数组给父组件表格
  propsChange = ( intervalArr ) => {
    const value = [];
    intervalArr.forEach( ( item ) => {
      if ( item.disabled === true ) {
        value.push( {
          rankFrom: item.rankFrom,
          rankTo: item.rankTo,
          disabled: item.disabled,
        } );
      }
    } );
    return this.props.onChange( value );
  }

  render() {
    const { intervalArr } = this.state;
    const { tableList } = this.props;
    return (
      <div>
        <div className={styles.intervalWrap}>
          {
            intervalArr.map( ( item, index ) => {
              let hasEdit = true;
              hasEdit = tableList.every( list => {
                return list.rankFrom !== item.rankFrom;
              } );
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div className={styles.intervalItem} key={`${index}item`}>
                  <Input
                    placeholder="请输入该分段最低值，最低值是0"
                    precision={0}
                    type='number'
                    min={0}
                    value={item.rankFrom}
                    addonAfter='分'
                    disabled={item.disabled}
                    onChange={( e ) => this.OnChange( e, index, 'rankFrom' )}
                  />&nbsp;&nbsp;至&nbsp;&nbsp;
                  <Input
                    placeholder="请输入该分段最高值，最高值是99999"
                    precision={0}
                    type='number'
                    value={item.rankTo}
                    min={0}
                    max={99999}
                    disabled={item.disabled}
                    onChange={( e ) => this.OnChange( e, index, 'rankTo' )}
                    addonAfter='分'
                  />
                  <div className={styles.editor}>
                    {
                      item.disabled ?
                        <span onClick={() => this.editorHandle( index, hasEdit )}>编辑</span> :
                        <span onClick={() => this.handleChange( index )}>保存</span>
                    }
                    <span onClick={() => this.deleteHandle( index, hasEdit )}>删除</span>
                  </div>

                </div>
              )

            } )
          }
        </div>

        <div className={styles.addItem} onClick={this.addInterval}>
          <Icon
            type="plus-circle"
            style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
          />
                添加分段
        </div>
      </div>

    )
  }
}

export default Interval;