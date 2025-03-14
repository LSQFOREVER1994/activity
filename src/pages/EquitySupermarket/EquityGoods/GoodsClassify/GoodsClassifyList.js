import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Card, Popconfirm, message, Form, Switch, Icon, Button } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import LevelOneModal from './LevelOneModal/LevelOneModal';
import LevelTwoModal from './LevelTwoModal/LevelTwoModal';
import styles from './GoodsClassifyList.less';

@connect( ( { equityGoodsClassify } ) => {
  return {
    ...equityGoodsClassify
  }
} )
@Form.create()
class GoodsClassifyList extends PureComponent {
  formItemLayout = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  }

  constructor( props ) {
    super( props )
    this.state = {
      pageNum: 1,
      pageSize: 10,

      levelOneVisible: false,
      levelTwoVisible: false,
      lineData: {},
      isAdd: false,
      expandedRowKeys: [], // 默认展开行

      parentIds: []
    };
    this.searchBar = React.createRef()
  }

  componentDidMount() {
    this.getGoodsClassifyList()
  }

  // 字数限制
  limitWords = txt => {
    let newStr
    const len = txt.length
    if ( len > 12 ) {
      newStr = `${txt.slice( 0, 12 )}...`
      return newStr
    }
    return txt
  }

  // 初始化默认展开数组
  initExpandKeys = ( list ) => {
    const keyArr = [];
    if ( Array.isArray( list ) && list.length ) {
      list.forEach( ( item ) => { // 这里就可以把要展开的key加进来记住必须是唯一的
        keyArr.push( item.id )
      } )
    }
    this.setState( {
      expandedRowKeys: [...keyArr]
    } )
  }

  // 展开函数
  onExpand = ( expanded, record ) => { // expanded是否展开  record每一项的值
    const { expandedRowKeys } = this.state;
    const newExp = expanded ? [...expandedRowKeys, record.id] : expandedRowKeys.filter( i => i !== record.id );
    this.setState( { expandedRowKeys: [...newExp] } )
  }

  // 自定义展开图标
  customExpandIcon = ( props ) => {
    const { expanded, record, onExpand } = props
    if ( Array.isArray( record.categoryChildren ) && record.categoryChildren.length > 0 ) {
      if ( expanded ) {
        return (
          <a
            style={{ color: 'black', marginRight: 8 }}
            onClick={e => onExpand( props.record, e )}
          >
            <Icon type="minus-square" style={{ fontSize: 12 }} />
          </a>
        )
      }
      return (
        <a
          style={{ color: 'black', marginRight: 8 }}
          onClick={e => onExpand( props.record, e )}
        >
          <Icon type="plus-square" style={{ fontSize: 12 }} />
        </a>
      )
    }
    return <span style={{ marginRight: 8, marginLeft: 12 }} />

  }



  // 筛选表单提交 请求数据
  filterSubmit = ( data ) => {
    const { pageSize } = this.state
    this.setState( {
      pageNum: 1,
      pageSize
    }, () => {
      this.getGoodsClassifyList( data )
    } )
  }

  // 关闭或者开启分类展示点击事件
  handleSortChange = ( id, status ) => {
    const { dispatch } = this.props
    dispatch( {
      type: 'equityGoodsClassify/getGoodsClassifyDownShelf',
      payload: { id, status },
      callBackFunc: ( res ) => {
        if ( res.success ) {
          this.getGoodsClassifyList( this.searchBar.current.data )
          if ( status ) {
            message.success( '开启分类展示成功' )
          } else {
            message.success( '关闭分类展示成功' )
          }
        }
      }
    } )
  }

  // 获取商品分类列表
  getGoodsClassifyList = ( data ) => {
    const { pageNum, pageSize } = this.state
    const { dispatch } = this.props
    dispatch( {
      type: 'equityGoodsClassify/getGoodsClassifyList',
      payload: {
        page:{
          pageNum,
          pageSize,
        },
        ...data
      },
      callBackFunc: res => {
        if ( res.success ) {
          this.initExpandKeys( res.result.list )
        }
      }
    } )
  }

  // 确认删除
  fetchGoodsClassifyRemove = ( id ) => {
    const { dispatch } = this.props
    dispatch( {
      type: 'equityGoodsClassify/fetchGoodsClassifyRemove',
      payload: {
        id
      },
      callBackFunc: ( res ) => {
        const { message: returnMessage, tip } = res
        if ( res.success ) {
          message.success( tip || returnMessage )
          this.getGoodsClassifyList( this.searchBar.current.data )
        }
      }
    } )

  }

  // 获取所有的一级分类id
  getAllLevelOneId = () => {
    const parentIds = []
    const { dispatch } = this.props
    dispatch( {
      type: 'equityGoodsClassify/getAllClassify',
      payload: {},
      callBackFunc: res => {
        if ( res.success ) {
          const list = res.result
          if ( list.length ) {
            list.forEach( v => {
              parentIds.push( { id: v.id, name: v.name, status: v.status } )
            } )
          }
          this.setState( { parentIds } )
        }
      }
    } )
  }

  // 模块显隐控制
  handleModalVisible = ( type, lineData ) => {
    if ( lineData ) {
      switch ( type ) {
        case 'one':
          this.setState( {
            levelOneVisible: !this.state.levelOneVisible,
            lineData,
            isAdd: false
          } )
          break;
        case 'two':
          this.setState( {
            levelTwoVisible: !this.state.levelTwoVisible,
            lineData,
            isAdd: false
          } )
          break;
        default:
          break;
      }
    } else {
      switch ( type ) {
        case 'one':
          this.setState( {
            levelOneVisible: !this.state.levelOneVisible,
            lineData:{}
          } )
          break;
        case 'two':
          this.setState( {
            levelTwoVisible: !this.state.levelTwoVisible,
            lineData:{}
          } )
          break;
        case 'oneAdd':
          this.setState( {
            levelOneVisible: !this.state.levelOneVisible,
            isAdd: true,
            lineData:{}
          } )
          break;
        case 'twoAdd':
          this.setState( {
            levelTwoVisible: !this.state.levelTwoVisible,
            isAdd: true,
            lineData:{}
          } )
          break;
        default:
          break;
      }
    }
  }

  render() {
    const { loading } = this.props;

    const {
      levelOneVisible,
      levelTwoVisible,
      lineData,
      isAdd,
      expandedRowKeys,
      parentIds
    } = this.state

    const { goodsClassifyListResult: { total, list } } = this.props
    const searchEleList = [
      {
        key: 'name',
        label: '分类名称',
        type: 'Input',
      }
    ]
    const { pageSize, pageNum } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      total,
      pageSize,
      current: pageNum,
      showTotal: () => {
        return `共 ${total} 条`;
      },
      onChange: ( page ) => {
        this.setState( {
          pageNum: page
        }, () => this.getGoodsClassifyList( this.searchBar.current.data ) )
      },
      onShowSizeChange: ( current, size ) => {
        this.setState( {
          pageSize: size,
          pageNum: current
        }, () => this.getGoodsClassifyList( this.searchBar.current.data ) )
      }

    };

    const columns = [
      {
        title: <span>分类名称</span>,
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        render: ( name, record ) => {
          return (
            <span className={styles.classify_title}>
              {record.img && <img src={record.img} alt="" />}
              <span>{this.limitWords( name )}</span>
            </span>
          )
        }
      },
      {
        title: <span>是否显示</span>,
        dataIndex: 'status',
        key: 'status',
        render: ( status, record ) => {
          return (
            <Popconfirm
              title={status ? "是否关闭展示" : '是否打开展示'}
              onConfirm={() => {
                this.handleSortChange( record.id, status ? 0 : 1 )
              }}
              okText="是"
              cancelText="否"
            >
              <Switch checked={!!status} />
            </Popconfirm>
          )

        },
      },
      {
        title: <span>排序</span>,
        dataIndex: 'sort',
        key: 'sort',
        render: sort => <span>{sort}</span>,
      },
      {
        title: <span>操作</span>,
        key: 'operation',
        align: 'center',
        width: 120,
        fixed: 'right',
        render: ( _, record ) => {
          const type = record.parentId ? 'two' : 'one'
          return (
            <div className={styles.operate_container}>
              <span onClick={() => {
                if ( record.parentId !== 0 ) {
                  this.getAllLevelOneId()
                }
                this.handleModalVisible( type, record )
              }}
              >编辑
              </span>
              <Popconfirm
                title="是否删除"
                onConfirm={() => this.fetchGoodsClassifyRemove( record.id )}
                okText="是"
                cancelText="否"
              >

                <span style={{ color: 'red' }}>删除</span>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    return (
      <GridContent>
        <Card
          bordered={false}
          title='商品分类'
          bodyStyle={{ padding: '20px 32px 40px 32px' }}
        >
          <div className={styles.global_styles} style={{ display: 'flex' }}>
            <SearchBar
              ref={this.searchBar}
              searchEleList={searchEleList}
              searchFun={this.filterSubmit}
              loading={loading}
            />
            <Button
              type="primary"
              style={{ marginTop: 30, marginRight: 10, }}
              onClick={() => this.handleModalVisible( 'oneAdd' )}
            >
              添加一级分类
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 30, marginRight: 10, }}
              onClick={() => {
                this.handleModalVisible( 'twoAdd' );
                this.getAllLevelOneId();
              }}
            >添加二级分类
            </Button>
          </div>
          <Table
            scroll={{ x: 1000, y: 600 }}
            size="middle"
            childrenColumnName='categoryChildren'
            columns={columns}
            rowKey={( r ) => r.id}
            loading={loading}
            pagination={paginationProps}
            expandedRowKeys={expandedRowKeys}
            onExpand={this.onExpand}
            expandIcon={( props ) => this.customExpandIcon( props )}
            dataSource={list}
          />
        </Card>

        <LevelOneModal
          lineData={lineData}
          isAdd={isAdd}
          getAllLevelOneId={this.getAllLevelOneId}
          levelOneVisible={levelOneVisible}
          handleModalVisible={this.handleModalVisible}
          getNewGoodsClassifyList={() => this.getGoodsClassifyList( this.searchBar.current.data )}
        />

        <LevelTwoModal
          lineData={lineData}
          isAdd={isAdd}
          parentIds={parentIds}
          levelTwoVisible={levelTwoVisible}
          handleModalVisible={this.handleModalVisible}
          getNewGoodsClassifyList={() => this.getGoodsClassifyList( this.searchBar.current.data )}
        />
      </GridContent>
    );
  };
}

export default GoodsClassifyList;
