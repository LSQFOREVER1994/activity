/* eslint-disable import/extensions */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, Breadcrumb } from 'antd';
import { Line } from '@antv/g2plot';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import SearchBar from '@/components/SearchBar';
import styles from './taskRecord.less'

@connect( ( { taskRecord } ) => {
	return { ...taskRecord }
} )

class TaskRecord extends PureComponent {
	constructor( props ) {
		super( props );
		this.manage = React.createRef();
		this.state = {
			pageNum: 1,
			pageSize: 10,
			sortedInfo: {
				columnKey: 'create_time',
				field: 'createTime',
				order: 'descend',
			},
			line: [],
			isMoving: false,
			startX: 0,
			placeX: 0,
		}
		this.searchBar = React.createRef()
		this.searchEleList = [
			{
        key: 'mobile',
        label: '手机号',
        type: 'Input'
      },
      {
        key: 'account',
        label: '资金账号',
        type: 'Input'
      },
      {
        key: 'userNo',
        label: '客户号',
        type: 'Input'
      },
      // {
      //   key: 'accountManager',
      //   label: '客户经理',
      //   type: 'Input'
      // },
			// {
			// 	key: 'name',
			// 	label: '任务名称',
			// 	type: 'Input'
			// },
			{
				key: 'createTime',
				label: '完成时间',
				type: 'RangePicker',
				format: 'YYYY-MM-DD',
				alias: { startTime: 'YYYY-MM-DD 00:00:00', endTime: 'YYYY-MM-DD 23:59:59' }
			}
		]
	}

	componentDidMount() {
		this.getTaskRecord();
		this.getLineData();
	};

	/*  doSameObjValue 数组对象相同值相加去重
		data 需要处理的数组
		resultNum 最终计算结果的键名
		keyName 用于计算判断的键名
		keyValue 用于计算结果的键名 --> 对应的键值为number类型 */
	doSameObjValue = ( data, resultNum, keyName, keyValue ) => {
		const arr = [];
		data.map( item => {
			item.statistics.map( i => {
				const Obj = {};
				Obj.name = item.name.trim();
				Object.assign( Obj, i )
				arr.push( Obj )
				return Obj
			} )
			return arr
		} )
		const warp = new Map();
		arr.forEach( i => {
			const str = keyName.map( v => i[v] ).join( '_' );
			// eslint-disable-next-line no-return-assign, no-param-reassign
			i[resultNum] = keyValue.reduce( ( p, c ) => p += i[c], 0 );
			// eslint-disable-next-line no-unused-expressions
			warp.has( str ) ? warp.get( str )[resultNum] += i[resultNum] : warp.set( str, i );
		} );
		return Array.from( warp ).map( ( [, v] ) => v );
	};

	renderLine = () => {
		const { lineData } = this.props;
		const data = this.doSameObjValue( lineData, 'result', ['name', 'date'], ['count'] );
		data.sort( ( x, y ) => {
			return x.date < y.date ? -1 : 1
		} )
		const line = new Line( 'linedata', {
			data,
			xField: 'date',
			yField: 'result',
			seriesField: 'name',
			slider: {
				start: 0,
				end: 1,
			},
			xAxis: {
				tickCount: 6,
			},
			legend: {
				itemHeight: 25,
				layout: 'horizontal',
				position: 'bottom'
			}
		} );
		this.setState( {
			line
		} )
		line.render();
	}

	hanldeReset = () => {
		const { line } = this.state;
		if ( line.length === 0 ) return
		line.update( {
			slider: {
				start: 0,
				end: 1,
			},
		} )
	}

	getLineData = () => {
		const { dispatch, activityId } = this.props;
		dispatch( {
			type: 'taskRecord/getLineData',
			payload: {
				activityId
			},
			callFunc: () => {
				this.renderLine();
			}
		} );
	}

	getTaskRecord = ( data ) => {
		const { pageNum, pageSize, sortedInfo } = this.state;
		const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
		const { dispatch, activityId } = this.props;
		dispatch( {
			type: 'taskRecord/getTaskRecord',
			payload: {
				activityId,
				...data,
				page:{
					pageNum,
					pageSize,
					orderBy: `${sortedInfo.columnKey} ${sortValue}`,
				}
			}
		} )
	}

	numFormat = ( num ) => {
		const res = num.toString().replace( /\d+/, ( n ) => {
			return n.replace( /(\d)(?=(\d{3})+$)/g, ( $1 ) => {
				return `${$1},`;
			} );
		} )
		return res;
	}

	filterSubmit = ( data ) => {
		this.setState( {
			pageNum: 1
		}, () => {
			this.getTaskRecord( data );
		} )
	}

	tableChange = ( pagination, filters, sorter ) => {
		const { current, pageSize } = pagination;
		const sortObj = { order: 'descend', ...sorter };
		this.setState( {
			pageNum: current,
			pageSize,
			sortedInfo: sortObj,
		}, () => this.getTaskRecord( this.searchBar.current.data ) );
	};

	onGrab = () => {
		document.getElementById( 'innerBox' ).addEventListener( 'mousedown', ( e ) => this.mouseDown( e ), false );
		document.getElementById( 'innerBox' ).addEventListener( 'mousemove', ( e ) => this.mouseMove( e ), false );
		document.getElementById( 'innerBox' ).addEventListener( 'mouseup', ( e ) => this.mouseUp( e ), false );
	}

	mouseDown = ( e ) => {
		const { isMoving } = this.state;
		if ( isMoving ) return
		this.setState( {
			isMoving: true,
			startX: e.screenX,
			placeX: this.manage.current.offsetLeft,
		} );
	}

	mouseMove = ( e ) => {
		const { isMoving, startX, placeX } = this.state;
		if ( !isMoving ) return
		const outerWidth = document.getElementById( 'outerBox' ).clientWidth;
		const innerWidth = document.getElementById( 'innerBox' ).clientWidth;
		if ( isMoving ) {
			const moveX = e.screenX - startX + placeX;
			const moveMax = outerWidth - innerWidth;
			if ( moveX >= 0 ) {
				this.manage.current.style.left = '0px';
			} else if ( moveX < moveMax ) {
				this.manage.current.style.left = `${moveMax}px`;
			} else {
				this.manage.current.style.left = `${moveX}px`;
			}
		}
	}

	mouseUp = () => {
		this.setState( {
			isMoving: false
		} )
	}

	cancleGrab = () => {
		document.getElementById( 'innerBox' ).removeEventListener( 'mousedown', ( e ) => this.mouseDown( e ), false );
		document.getElementById( 'innerBox' ).removeEventListener( 'mousemove', ( e ) => this.mouseMove( e ), false );
		document.getElementById( 'innerBox' ).removeEventListener( 'mouseup', ( e ) => this.mouseUp( e ), false );
		this.setState( {
			isMoving: false
		} )
	}

	renderTopInfo = () => {
		const { lineData } = this.props;
		const infoData = this.doSameObjValue( lineData, 'result', ['name'], ['count'] );
		const box = document.getElementById( 'outerBox' );
		const boxWidth = box && box.clientWidth;
		const taskNum = infoData.length;
		let element = '';
		element = infoData.map( ( item ) => {
			return (
  <div className={styles.info} style={{ width: taskNum <= 5 ? `${boxWidth * 0.19}px` : `${boxWidth * 0.18}px` }} key={item.name}>
    <div className={styles.info_name}>{item.name}</div>
    <div className={styles.info_num}>{this.numFormat( item.result )}</div>
  </div>
			)
		} )
		if ( taskNum <= 5 ) { return <div id='outerBox' className={styles.info_all_box}><div className={styles.info_all}>{element}</div></div> }
		return <div id='outerBox' className={styles.info_more_box}><div id='innerBox' onMouseEnter={this.onGrab} onMouseLeave={this.cancleGrab} ref={this.manage} className={styles.info_more}>{element}</div></div>
	}

	render() {
		const { loading, result: { total, list }, closeUserActionPage, activityId } = this.props;
		const { pageSize, pageNum, sortedInfo } = this.state;
		const paginationProps = {
			showSizeChanger: true,
			showQuickJumper: true,
			pageSize,
			total,
			current: pageNum,
			showTotal: () => {
				return `共 ${total} 条`;
			}
		};
		const orderBy = `${sortedInfo.columnKey} ${sortedInfo.order === 'descend' ? 'desc' : 'asc'}`
		const exportConfig = {
			type: 'activityService',
			ajaxUrl: `task/record/export`,
			xlsxName: '任务完成表.xlsx',
			extraData: { activityId, orderBy },
		}

		const columns = [
			{
        title: <span>手机号</span>,
        dataIndex: 'mobile',
        key: 'mobile',
        render: mobile => <span>{mobile}</span>,
      },
      {
        title: <span>资金账号</span>,
        dataIndex: 'account',
        key: 'account',
        render: account => <span>{account || '--'}</span>,
      },
      {
        title: <span>客户号</span>,
        dataIndex: 'userNo',
        key: 'userNo',
        render: userNo => <span>{userNo || '--'}</span>,
      },
      // {
      //   title: <span>客户经理</span>,
      //   dataIndex: 'accountManager',
      //   key: 'accountManager',
      //   render: accountManager => <span>{accountManager}</span>,
      // },
			{
				title: <span>任务名称</span>,
				align: 'center',
				dataIndex: 'name',
				key: 'name',
				render: name => <span>{name}</span>,
			},
			{
				title: <span>完成时间</span>,
				align: 'center',
				dataIndex: 'createTime',
				key: 'create_time',
				sorter: true,
				sortOrder: sortedInfo.columnKey === 'create_time' && sortedInfo.order,
				sortDirections: ['descend', 'ascend'],
				render: createTime => <span>{createTime || '--'}</span>,
			},
		]

		return (
  <GridContent>
    <Breadcrumb style={{ marginBottom: 20 }}>
      <Breadcrumb.Item>
        <a onClick={() => { closeUserActionPage() }}>数据中心</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>任务完成表</Breadcrumb.Item>
    </Breadcrumb>
    <Card
      bordered={false}
      headStyle={{ fontWeight: 'bold' }}
      title='任务完成情况趋势图'
    >
      <div className={styles.info_title}>任务完成数</div>
      {this.renderTopInfo()}
      <div style={{ marginBottom: 10, textAlign: 'right' }}><Button onClick={this.hanldeReset} size='small'>Reset</Button></div>
      <div id='linedata' />
    </Card>
    <Card
      bordered={false}
      title='详细信息'
      headStyle={{ fontWeight: 'bold' }}
      style={{ marginTop: 18 }}
    >
      <SearchBar
        ref={this.searchBar}
        searchEleList={this.searchEleList}
        searchFun={this.filterSubmit}
        loading={loading}
        exportConfig={exportConfig}
      />
      <Table
        size="middle"
        rowKey="id"
        columns={columns}
        loading={loading}
        pagination={paginationProps}
        dataSource={list}
        onChange={this.tableChange}
      />
    </Card>
  </GridContent>
		);
	};
}

export default TaskRecord;
