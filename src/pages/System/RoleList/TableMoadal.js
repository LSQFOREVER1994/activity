import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Checkbox, Icon, Spin } from 'antd';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;
@connect( ( { system } ) => ( {
  treeLoading: system.treeLoading,
} ) )
@Form.create()

class TableMoadal extends PureComponent {
  state = {
    list: [],
    activeKey: null,
    secondKey: null,
    selectBox: {},
    roleCodes:[],
  }

  componentDidMount() {
    this.props.onRef( this )
    this.fetchList();
  }


  fetchList = () => {
    const { dispatch, info: { id } } = this.props;
    dispatch( {
      type: 'system/getMenuTree',
      payload: {
        menuId:1,
        roleGroupId: id
      },
      callBack: ( res ) => {
        const { menuTrees, roleCodes } = res;
        this.setState( {
          list: menuTrees,
          roleCodes
        }, () => {
          this.setInitData();
        } )
      }
    } )
  }

  getData = ()=>{
    return this.handleRoleCode();
  }

  closeModal=()=>{
    this.setState( {
      list: [],
      activeKey: null,
      secondKey: null,
      selectBox: {},
      roleCodes:[],
    } )
  }

  // 进页面初始化
  setInitData = () => {
    const { roleCodes, list, selectBox } = this.state;
    if( roleCodes && roleCodes.length ) {
      list.forEach( ( item, index ) => {
        item.childList.forEach( ( citem, cindex ) => {
          if( citem.childList ) {
            citem.childList.forEach( i => {
              if( roleCodes.indexOf( i.roleCode ) > -1 ) {
                selectBox[`f${index}c${cindex}`] = selectBox[`f${index}c${cindex}`] &&
                selectBox[`f${index}c${cindex}`].length ? [...selectBox[`f${index}c${cindex}`], i.id] : [i.id];
              }
            } )
            if( citem.childList.length && selectBox[`f${index}c${cindex}`] && selectBox[`f${index}c${cindex}`].length && ( selectBox[`f${index}c${cindex}`].length === citem.childList.length ) ) {
              selectBox[`f${index}`] = selectBox[`f${index}`] &&
              selectBox[`f${index}`].length ? [...selectBox[`f${index}`], citem.id] : [citem.id];
            }
          }
        } )
      } )
    }
    this.setState( {
      selectBox,
      time: new Date().getTime(),
    } )
  }

  // 一级菜单点击展开状态
  handleTableRow = ( i ) => {
    if ( i === this.state.activeKey ) {
      this.setState( {
        activeKey: null,
      } )
    } else {
      this.setState( {
        activeKey: i,
      } )
    }
    this.setState( {
      secondKey: null
    } )
  }

  //  二级菜单点击展开状态
  handleSecondRow = ( i, pi ) => {
    if ( i === this.state.secondKey && pi === this.state.activeKey ) {
      this.setState( {
        secondKey: null
      } )
    } else {
      this.setState( {
        activeKey: pi,
        secondKey: i
      } )
    }
  }

  //  三级菜单选择
  handleThreeCheckBox = ( e, index, cindex, citem ) => {
    const { selectBox } = this.state;
    if( typeof cindex === 'number' ) {
      selectBox[`f${index}c${cindex}`] = e;
      if( citem.childList.length === selectBox[`f${index}c${cindex}`].length ) {
        if( selectBox[`f${index}`] && selectBox[`f${index}`].length ) {
          selectBox[`f${index}`] = [...selectBox[`f${index}`], citem.id]
        } else {
          selectBox[`f${index}`] = [citem.id]
        }
        selectBox[`f${index}`] = Array.from( new Set( selectBox[`f${index}`] ) )
      } else if ( selectBox[`f${index}`] && selectBox[`f${index}`].length ) {
        const i = selectBox[`f${index}`].indexOf( citem.id );
        if( i > -1 ) {selectBox[`f${index}`].splice( i, 1 )}
      }
    } else {
      selectBox[`f${index}`] = e
    }
    this.setState( {
      selectBox,
      time: new Date().getTime(),
    }, ()=>this.props.getTreeData() )
  }

  //  二级菜单选择
  handleSecondCheckBox = ( e, index, cindex, citem ) => {
    const { selectBox } = this.state;
    if( !citem.childList.length ) return;
    let ids = [];
    if( e.target.checked ) {
      ids = citem.childList.map( item => item.id );
    }
    selectBox[`f${index}c${cindex}`] = ids;
    this.setState( {
      selectBox,
      time: new Date().getTime(),
    } )
  }

  // 一级菜单选择
  handleFirstCheckbox = ( e, index, citem ) => {
    const { selectBox } = this.state;
    if( !citem.childList.length ) return;
    let ids = [];
    if( e.target.checked ) {
      ids = citem.childList.map( item => item.id );
      citem.childList.forEach( ( child, i ) => {
        if( child.childList && child.childList.length ) {
          selectBox[`f${index}c${i}`] = child.childList.map( item => item.id )
        }
      } )
    } else {
      citem.childList.forEach( ( child, i ) => {
        if( child.childList && child.childList.length ) {
          selectBox[`f${index}c${i}`] = []
        }
      } )
    }
    selectBox[`f${index}`] = ids;
    this.setState( {
      selectBox,
      time: new Date().getTime(),
    }, ()=>this.props.getTreeData() )
  }

  //  获取权限数组
  handleRoleCode = () => {
    const { list, selectBox } = this.state;
    let ids = [];
    const roleList = [];
    Object.keys( selectBox ).forEach( item => {
      if( item.length >= 4 ) {
        ids = [...ids, ...selectBox[item]]
      }
    } )
    list.forEach( ( item ) => {
      item.childList.forEach( citem => {
        citem.childList.forEach( i => {
          if( ids.indexOf( i.id ) > -1 ) {
            roleList.push( i.roleCode )
          }
        } )
      } )
    } )
    return roleList
  }

  //  展示部分选中一级菜单状态
  setIndeterminate = ( name, checked ) => {
    const { selectBox } = this.state;
    let status = false;
    if( !checked ) {
      Object.keys( selectBox ).forEach( ( citem ) => {
        if( citem.length === 4 ) {
          if( selectBox[`${citem}`] && selectBox[`${citem}`].length && citem.indexOf( name ) > -1 ) {
            status = true;
          }
        }
      } )
    }
    return status;
  }

  render() {
    const { treeLoading } = this.props;
    const { list=[], activeKey, secondKey, selectBox } = this.state;

    return (
      <Spin spinning={treeLoading}>
        <div className={styles.tableHeaderbox}>
          <div className={styles.tableItem} style={{ width: 180 }}>模块</div>
          <div className={styles.tableItem} style={{ width: 230 }}>菜单权限</div>
          <div className={styles.tableItem} style={{ flex: 1 }} onClick={this.handleRoleCode}>具体权限</div>
        </div>
        <div className={styles.tableBodyBox}>
          {
            list && list.length > 0 && list.map( ( item, index ) => {
              return (
                <div className={styles.tableItemBox} key={item.id}>
                  <div
                    className={styles.tableItem}
                    style={{ width: 180, justifyContent: index === 0 ? 'center' : '', paddingRight: index === 0 ? '10px' : '' }}
                    onClick={() => { this.handleTableRow( index ) }}
                  >
                    {
                      index > 0 &&
                      <Icon
                        type={activeKey === index ? 'caret-down' : 'caret-right'}
                        className={styles.arrowIcon}
                      />
                    }
                    <Checkbox
                      onChange={( e ) => {this.handleFirstCheckbox( e, index, item )}}
                      checked={
                        selectBox[`f${index}`] && selectBox[`f${index}`].length && selectBox[`f${index}`].length === item.childList.length
                      }
                      indeterminate={
                        selectBox[`f${index}`] && selectBox[`f${index}`].length && selectBox[`f${index}`].length !== item.childList.length ||
                        this.setIndeterminate( `f${index}`, selectBox[`f${index}`] && selectBox[`f${index}`].length &&
                        selectBox[`f${index}`].length === item.childList.length )
                      }
                    >
                      {item.name}
                    </Checkbox>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        width: '100%',
                        overflow: 'hidden',
                        maxHeight: activeKey === index ? ( typeof secondKey === 'number' ? 2000 : item.childList.length * 41 ) : 40,
                        transition: 'all 0.6s'
                      }}
                    >
                      <CheckboxGroup value={selectBox[`f${index}`]} onChange={( e ) => this.handleThreeCheckBox( e, index )} style={{ width: '100%' }}>
                        {item.childList.map( ( citem, cindex ) => {
                        return (
                          <div className={styles.checkBox} style={{ display: 'flex' }} key={citem.id}>
                            <div className={styles.tableItem} style={{ width: 230 }} onClick={() => { this.handleSecondRow( cindex, index ) }}>
                              {
                                citem.childList && citem.childList.length > 3 ?
                                  <Icon
                                    type={activeKey === index && secondKey === cindex ? 'caret-down' : 'caret-right'}
                                    className={styles.arrowIcon}
                                  />
                                :<div style={{ padding:'0 10px 0 30px' }} />
                              }
                              <Checkbox
                                value={citem.id}
                                indeterminate={
                                  selectBox[`f${index}c${cindex}`] && selectBox[`f${index}c${cindex}`].length &&
                                  selectBox[`f${index}c${cindex}`].length !== citem.childList.length
                                }
                                onChange={( e ) => {this.handleSecondCheckBox( e, index, cindex, citem )}}
                              >
                                {citem.name}
                              </Checkbox>
                            </div>
                            <div className={styles.tableItem} style={{ flex: 1 }}>
                              <div
                                className={styles.checkBox}
                                style={{
                                  overflow: 'hidden',
                                  maxHeight: activeKey === index && secondKey === cindex ? ( Math.ceil( citem.childList.length / 3 ) * 40 ) + list.length * 40 : 40,
                                  transition: 'all 0.6s'
                                }}
                              >
                                {
                                  citem.childList && citem.childList.length ?
                                    <CheckboxGroup
                                      style={{ display: 'flex', flexWrap: 'wrap' }}
                                      value={selectBox[`f${index}c${cindex}`]}
                                      onChange={( e ) => this.handleThreeCheckBox( e, index, cindex, citem )}
                                    >
                                      {citem.childList.map( i => {
                                        return (
                                          <Checkbox
                                            style={{ lineHeight: '40px', marginLeft: 16, }}
                                            key={i.id}
                                            value={i.id}
                                            defaultChecked={i.isChoice}
                                          >
                                            {i.name}
                                          </Checkbox>
                                        )
                                      } )}
                                    </CheckboxGroup>
                                  :
                                    <div style={{ display: 'flex', flexWrap: 'wrap', lineHeight: '40px', marginLeft: 16 }}>
                                      --
                                    </div>
                                }
                              </div>
                            </div>
                          </div>
                        )
                      } )}
                      </CheckboxGroup>
                    </div>
                  </div>
                </div>
              )
            } )
          }
        </div>
      </Spin>
    )
  }
}

export default TableMoadal
