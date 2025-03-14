/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import { Form, Modal, Input, Radio, Checkbox, Select, message, Empty, Button } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState, useMemo } from "react";
import moment from 'moment'
import UploadModal from '@/components/UploadModal/UploadModal';
import styles from './editPrizeModal.less'
import KeyInfoFormItems from './KeyInfoFormItems';

const { Option } = Select
const FormItem = Form.Item;

const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const formLayoutCheckbox = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const commonVerification = ['relationPrizeType', 'relationPrizeId', 'name']
const newModeVerification = ['productType']
const redTypeVerification = ['price', 'description']

//* * 奖品编辑弹窗 */
function EditPrizeModal( props ) {
    const {
        form: { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsValue, validateFields }, // 表单装饰器
        dataKey,
        dispatch,
        eleObj = {},
        domData = {},
        changeDomData,
        prizeModalVisible, // 控制弹窗显示隐藏
        onChangeVisible, // props的change函数
        editKey, // 编辑位置的标识,
        tableWithPosition = false, // 判断是否为有奖项
        merchantList = [], // 新模式商户列表数据
    } = props

    const prizeData = eleObj[dataKey] || [] // 总奖品列表
    const commonItemsData = getFieldsValue( ['optionPrizeType', 'image', 'itemPosition', 'itemName'] ) // 收集公共数据
    const [merchantOptions, setMerchantOptions] = useState( [] ) // 商户Select选项
    const [rightPrizeOptions, setRightPrizeOptions] = useState( [] )// 奖品Select选项
    const [openPrizeOptions, setOpenPrizeOptions] = useState( [] )// 旧模式奖品Select选项
    const [prizeTypeOptions, setPrizeTypeOptions] = useState( [] ) // 旧模式奖品类型Select选项
    const [formInitData, setFormInitData] = useState( {} ) // 单奖品表单初始化数据
    const [initDataList, setInitDataList] = useState( [] ) // 关联奖品表单初始化数据
    const [editList, setEditList] = useState( [] ) // 编辑列表
    const [addIdlist, setAddIdList] = useState( [] )// 新增的奖品的id列表
    const [deleteIdList, setDeleteIdList] = useState( [] ) // 删除的奖品id列表
    const [addItem, setAddItem] = useState( [] ) // 新增临时保存项
    const [isSaveTag, setIsSaveTag] = useState( false ) // 是否保存的标签

    // 奖项位置数据
    const checkboxOptions = useMemo( () => {
        return !Number.isNaN( tableWithPosition ) && new Array( tableWithPosition ).fill( {} ).map( ( item, index ) => {
            return {
                label: `位置${index + 1}`,
                value: `${index + 1}`
            }
        } )
    }, [tableWithPosition] )

    // 模糊搜索奖品列表
    const getPrizeList = ( rightName, relationPrizeType ) => {
        dispatch( {
            type: 'bees/getPrizeList',
            payload: {
                rightName,
                rightType: relationPrizeType
            },
            successFun: ( res ) => {
                const newOptions = res.map( ( info ) => {
                    return (
                      <Option value={info.rightId} key={info.rightId}>{info.rightName}</Option>
                    )
                } )
                setOpenPrizeOptions( newOptions )
            }
        } );
    }

    // 获取活动奖品类型列表
    const getPrizeTypeList = () => {
        dispatch( {
            type: 'bees/getPrizeTypeList',
            payload: {},
            successFun: ( res ) => {
                const newOptions = res.map( ( info ) => {
                    return (
                      <Option value={info.rightTypeId} key={info.rightTypeId}>{info.rightTypeName}</Option>
                    )
                } )
                setPrizeTypeOptions( newOptions )
            }
        } );
    }

    // 获取新模式商品列表
    const getVisibleGoodsList = ( code, type, productName ) => {
        let merchantId = ''
        if ( merchantList.length ) {
            merchantList.forEach( item => {
                if ( String( item.code ) === code ) {
                    merchantId = item.id
                }
            } )
        }
        dispatch( {
            type: 'bees/getVisibleGoodsList',
            payload: {
                pageNum: 1,
                pageSize: 500,
                merchantId,
                type,
                productName,
            },
            successFun: ( res ) => {
                const newOptions = res.map( ( info, index ) => {
                    return (
                      <Option value={String( info.productId )} key={`${info.productName}_${index}`} title={info.productName}> {info.productName}</Option>
                    )
                } )
                setRightPrizeOptions( newOptions )
            }
        } );
    }

    // 获取商户列表
    const getMerchantList = ( name ) => {
        dispatch( {
            type: 'bees/getMerchantList',
            payload: {
                name
            },
            successFun: ( res ) => {
                const newOptions = res.map( ( info, index ) => {
                    return (
                      <Option value={String( info.code )} key={`${info.name}_${index}`}>{info.name}</Option>
                    )
                } )
                setMerchantOptions( newOptions )
            }
        } );
    }

    // 初始化奖品数据
    const initPrizeInfo = () => {
        if ( !prizeData.length ) return
        const copyEditList = []
        // 初始化编辑列表
        if ( prizeData.length > 0 && editKey ) {
            prizeData.forEach( info => {
                if ( tableWithPosition && info.itemPosition === editKey ) {
                    copyEditList.push( info )
                }
                if ( !tableWithPosition && info.prizeVirtualId === editKey ) {
                    copyEditList.push( info )
                }
            } )
        }

        // 初始化奖品的新旧模式类型
        if ( copyEditList && copyEditList.length > 0 ) {
            copyEditList.forEach( info => {
                if ( info && ( info.expireDays || info.expireTime ) && !info.productType ) {
                    info.awardMode = 'OPEN'
                } else {
                    info.awardMode = 'RIGHT'
                }
            } )
        }
        setEditList( copyEditList ) // 初始化的编辑列表，若是无奖项弹窗则长度为1

        const prizeIdList = []
        // 判断奖品类型
        if ( copyEditList && copyEditList.length > 0 ) {
            copyEditList.forEach( info => {
                if ( info && info.relationPrizeId ) {
                    prizeIdList.push( info.relationPrizeId )
                }
            } )
        }

        // 有无奖项弹窗的数据处理
        if ( !tableWithPosition ) {
            if ( editKey ) {
                const formPrizeData = copyEditList && copyEditList[0] // 获取当前奖品的具体数据
                let optionPrizeType = 'PRIZE'
                if ( prizeIdList ) {
                    optionPrizeType = prizeIdList.length ? 'PRIZE' : 'THANKS'
                }
                formPrizeData.optionPrizeType = optionPrizeType
                setFormInitData( formPrizeData ) // 初始化库存数据&& 设置无奖项奖品数据
            }
        } else if ( editKey ) {
            const newEditList = []
            if ( copyEditList.length ) {
                copyEditList.forEach( ( item ) => {
                    let optionPrizeType = 'PRIZE'
                    if ( prizeIdList ) {
                        optionPrizeType = prizeIdList.length ? 'PRIZE' : 'THANKS'
                    }
                    item.optionPrizeType = optionPrizeType
                    newEditList.push( item )
                } )
            }
            setFormInitData( newEditList[0] )
            setInitDataList( newEditList ) // 设置有奖项奖品数据
        }
    }

    // 给子组件调用的change函数
    const changeToUpdate = ( data ) => {
        let combineData = data
        if ( !editKey ) {
            combineData = Object.assign( commonItemsData, data )
        }

        // data: 单个KeyInfoFormItems 修改之后的数据
        if ( tableWithPosition ) {
            const newDataList = JSON.parse( JSON.stringify( initDataList ) )
            if ( newDataList.length ) {
                newDataList.forEach( ( info ) => {
                    if ( info.id === data.id ) {
                        info = combineData
                    }
                } )
            }
            setInitDataList( newDataList )
            setEditList( newDataList )
        }

        if ( !tableWithPosition ) {
            const newData = JSON.parse( JSON.stringify( combineData ) )
            setFormInitData( newData )
            setEditList( [newData] )
        }
    }

    // 校验
    const onPrizeModalVerification = () => {
        let past = true;
        let verifyMoney = true
        let redFlag = true

        // 公共部分的必填校验
        validateFields( ( errors, values ) => {
            if ( errors ) {
                past = false
                message.error( '奖品中还有未填的必填项！' );
            }
        } );

        if ( !past ) return false

        if ( getFieldValue( 'optionPrizeType' ) === 'PRIZE' && !editList.length && tableWithPosition ) {
            past = false
            message.error( '至少需要有一个奖品～' );
        } else if ( getFieldValue( 'optionPrizeType' ) === 'PRIZE' && editList.length ) {

            editList.forEach( item => {
                // 公共部分校验
                if ( item.productType !== 'COUPON' ) {
                    if ( item.expireType === 'TIME' && !item.expireTime ) past = false
                    if ( item.expireType === 'DAYS' && !item.expireDays ) past = false
                }
                commonVerification.forEach( key => {
                    if ( !item[key] ) past = false
                } )

                // 新模式必填校验
                if ( getFieldValue( 'awardMode' ) === 'RIGHT' ) {
                    newModeVerification.forEach( key => {
                        if ( !item[key] ) past = false
                    } )

                    if ( item.productType === 'RED' ) {
                        redTypeVerification.forEach( citem => {
                            if ( !item[citem] ) past = false
                        } )

                        if ( item.price * item.inventory > item.usrInventory ) {
                            verifyMoney = false
                        }
                        if ( parseFloat( item.price ) < 0.3 ) {
                            redFlag = false
                        }
                    }
                }

                // 判断奖品库存
                if ( item.inventory === undefined || item.inventory === null || item.inventory === '' ) past = false

            } )

            if ( !past ) {
                message.error( '奖品中还有未填的必填项！' );
            }

            if ( !verifyMoney ) {
                past = false
                message.error( '红包金额 * 活动库存应小于可用资金！' );
            }

            if ( !redFlag ) {
                past = false
                message.error( '最小红包金额为0.3！' );
            }
        }
        return past;
    }

    // 塞入概率逻辑项
    const createProbabilityToObj = ( originObj, changeObj ) => {
        const title = 'probability'
        const newChangeObj = changeObj
        Object.keys( originObj ).forEach( ( item, index ) => {
            if ( item[`${title}${index + 1}`] || item[`${title}${index + 1}`] === 0 ) {
                newChangeObj[`${title}${index + 1}`] = 0
            }
        } )
        return newChangeObj
    }

    // 新增
    const onAdd = () => {
        if ( !onPrizeModalVerification() ) return
        const { elements = [] } = domData // 需要替换的数组
        const copyCommonItemsData = getFieldsValue( ['optionPrizeType', 'image', 'itemPosition', 'itemName'] )


        // 整理数据
        const newPrizeData = prizeData  // props传入的奖品数据
        const saveObj = editList[0] // 无奖项奖品的数据保存
        let editObj = {} // 带奖项奖品的数据保存
        let prizeItem = {}
        if ( newPrizeData && newPrizeData.length > 0 && tableWithPosition ) {
            // eslint-disable-next-line prefer-destructuring
            editObj = newPrizeData[0]
        }
        prizeItem = {
            ...saveObj,
            probability: 0,
            prizeVirtualId: Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        }

        if ( getFieldValue( 'optionPrizeType' ) === 'THANKS' ){
            if ( tableWithPosition && Array.isArray( copyCommonItemsData.itemPosition ) ) {
                copyCommonItemsData.itemPosition = copyCommonItemsData.itemPosition.toString()
            }
             setEditList( [copyCommonItemsData] )
             prizeItem = createProbabilityToObj( editObj, prizeItem )
        }

        if ( tableWithPosition ) prizeItem = createProbabilityToObj( newPrizeData, prizeItem )

        // 塞入公共数据
        const copyEditList = []
        editList.forEach( ( item ) => {
            if ( tableWithPosition && Array.isArray( copyCommonItemsData.itemPosition ) ) {
                copyCommonItemsData.itemPosition = copyCommonItemsData.itemPosition.toString()
            }
            if( item.expireTime ){
                item.expireTime = moment( item.expireTime ).format( 'YYYY-MM-DD' )
            }
            copyEditList.push( Object.assign( copyCommonItemsData, item ) )
        } )

        prizeItem = Object.assign( prizeItem, copyCommonItemsData )

        // 拼接更新后的数据对象
        const updateItem = getFieldValue( 'optionPrizeType' ) === 'PRIZE' ? copyEditList : [prizeItem]
        // 最终结果
        const finalObj = tableWithPosition ? updateItem : [prizeItem]

        // 表格数据更新
        const newPrizeList =  [...newPrizeData, ...finalObj]
        const elementsList = elements
        const newEleObj = Object.assign( eleObj, { [dataKey]: newPrizeList } );

        // 替换对应项
        const newElementsList = elementsList.map( item => {
            return item.virtualId === newEleObj.virtualId ? newEleObj : item;
        } );
        // 刷新总数据
        const newDomData = Object.assign( domData, { elements: newElementsList } );
        changeDomData( newDomData );
        setAddIdList( [] )
        setDeleteIdList( [] )
        message.success( '保存成功' )
        onChangeVisible( false )

    }

    // 编辑
    const onEdit = () => {
        if ( !onPrizeModalVerification() ) return
        const { elements = [] } = domData
        // 整理数据
        let newPrizeList = prizeData
        // 整理编辑数据
        if ( editList && editList.length > 0 ) {
            editList.forEach( info => {
                info = Object.assign( info, commonItemsData )
                if ( Array.isArray( info.itemPosition ) ){
                    info.itemPosition = info.itemPosition.toString()
                }
                newPrizeList = newPrizeList.map( item => {
                    return info.prizeVirtualId === item.prizeVirtualId ? info : item
                } )
            } )
        }

        // 整理删除数据
        if ( deleteIdList && deleteIdList.length > 0 ) {
            deleteIdList.forEach( info => {
                newPrizeList = newPrizeList.filter( item => {
                    return info !== item.prizeVirtualId
                } )
            } )
        }

        // 整理添加数据
        if ( addIdlist && addIdlist.length > 0 ) {
            addIdlist.forEach( info => {
                const prizeItem = editList.find( item => {
                    return item.prizeVirtualId === info
                } )
                newPrizeList.push( prizeItem )
            } )
        }

        const elementsList = elements
        const newEleObj = Object.assign( eleObj, { [dataKey]: [...newPrizeList] } );
        // 替换对应项
        const newElementsList = elementsList.map( item => {
            return item.virtualId === newEleObj.virtualId ? newEleObj : item;
        } );
        // 刷新总数据
        const newDomData = Object.assign( domData, { elements: newElementsList } );
        changeDomData( newDomData );
        setAddIdList( [] )
        setDeleteIdList( [] )
        setEditList( [] )
        message.success( '修改成功' )
        onChangeVisible( false )
    }

    // 新增关联奖品
    const onAddPrizeItem = () => {
        const { itemPosition, image, itemName } = formInitData
        const prizeVirtualId = Number( Math.random().toString().substr( 3, 12 ) + Date.now() ).toString( 36 )
        if ( editKey ) {
            let obj = {
                itemPosition,
                image,
                itemName,
                prizeVirtualId,
                probability: 0
            }

            // 塞入概率逻辑
            if ( formInitData ) {
                obj = createProbabilityToObj( formInitData, obj )
            }
            const newEditList = [...editList, obj]
            const newAddIdlist = [...addIdlist, prizeVirtualId]
            setEditList( [...newEditList] )
            setAddIdList( [...newAddIdlist] )
            setInitDataList( [...newEditList] )
        } else if ( !editKey ) {
            const obj = {
                ...addItem,
                prizeVirtualId,
                probability: 0
            }
            let editItem = {}
            if ( prizeData && prizeData.length > 0 ) {
                // eslint-disable-next-line prefer-destructuring
                editItem = prizeData[0]
            }
            // 塞入概率逻辑
            if ( editItem ) obj.editItem = createProbabilityToObj( editItem, obj.editItem )
            const newAddList = [...editList, obj]
            setEditList( newAddList )
            setInitDataList( newAddList )
        }
    }

    // 删除关联奖品
    const onDeletePrizeItem = ( data ) => {
        const newDeleteIdList = JSON.parse( JSON.stringify( deleteIdList ) )
        const newEditList = editList.filter( info => {
            return info.prizeVirtualId !== data.prizeVirtualId
        } )
        newDeleteIdList.push( data.prizeVirtualId )
        setEditList( [...newEditList] )
        setInitDataList( [...newEditList] )
        setDeleteIdList( [...newDeleteIdList] )
    }

    // 弹窗保存操作
    const onPrizeModalConfirm = () => {
        setIsSaveTag( true )
        if ( editKey ) {
            onEdit()
        } else {
            onAdd()
        }
    }

    // 弹框关闭操作
    const onPrizeModalCancel = () => {
        setIsSaveTag( false )
        onChangeVisible( false )
    }

    // 切换发奖模式重置表单
    const resetPrizeFormItem = ( e ) => {
        const { target: { value } } = e
        const keyInfo = tableWithPosition ? initDataList : formInitData
        if ( !tableWithPosition ) {
            keyInfo.relationPrizeType = ''
            keyInfo.relationPrizeId = ''
            keyInfo.inventory = 0
            if ( value === 'RIGHT' ) keyInfo.productType = ''
        }
        if ( tableWithPosition ) {
            if ( keyInfo.length ) {
                keyInfo.forEach( ( item ) => {
                    item.relationPrizeType = ''
                    item.relationPrizeId = ''
                    item.inventory = 0
                    if ( value === 'RIGHT' ) item.productType = ''
                } )
            }
        }
        setFormInitData( keyInfo )
        setFieldsValue( [{ awardMode: value }] )
    }

    // 渲染关键信息表单项
    const renderKeyInfoForm = () => {
        // 根据有无奖项判断当前需要渲染到关键信息节点的数据
        const keyInfo = tableWithPosition ? initDataList : formInitData
        const singlePrizeProps = {
            getPrizeList,
            getPrizeTypeList,
            getVisibleGoodsList,
            getMerchantList,
            merchantOptions,
            rightPrizeOptions,
            openPrizeOptions,
            prizeTypeOptions,
        }
        let keyInfoView = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无奖品，请去添加奖品" />

        keyInfoView = tableWithPosition ?
          <div>
            {
                    keyInfo && keyInfo.map( ( info, index ) => {
                        return (
                          <>
                            <FormItem label={`关联奖品${index + 1}`} {...formLayoutCheckbox}>
                              <div
                                className={styles.associate_prize}
                              >
                                <div className={styles.items_container}>
                                  <KeyInfoFormItems
                                    changeToUpdate={changeToUpdate}
                                    formInitData={info}
                                    isSaveTag={isSaveTag}
                                    awardMode={getFieldValue( 'awardMode' )}
                                    {...singlePrizeProps}
                                    {...props}
                                  />
                                </div>
                                <div className={styles.delete_prize} onClick={() => onDeletePrizeItem( info )}>
                                  删除
                                </div>
                              </div>
                            </FormItem>

                          </>
                        )
                    } )
                }
            {getFieldValue( 'optionPrizeType' ) === 'PRIZE' &&
            <FormItem label="" {...formLayout}>
              <Button
                className={styles.add_prize}
                type="dashed"
                icon="plus"
                onClick={() => onAddPrizeItem()}
              >
                添加奖品
              </Button>
            </FormItem>
                }
          </div>
            :
            (
              <KeyInfoFormItems
                isSaveTag={isSaveTag}
                formInitData={keyInfo}
                changeToUpdate={changeToUpdate}
                awardMode={getFieldValue( 'awardMode' )}
                {...singlePrizeProps}
                {...props}
              />
            )

        return ( keyInfoView )
    }

    // 奖品弹窗表表单
    const renderPrizeForm = () => {
        if ( !formInitData ) return
        const { itemPosition = '', itemName = '', image = '', awardMode = 'RIGHT', optionPrizeType = 'PRIZE' } = formInitData
        const modalFooter = {
            okText: '保存',
            onOk: () => onPrizeModalConfirm(),
            onCancel: () => onPrizeModalCancel(),
        };

        let newCheckboxOptions = []
        // 处理有奖项奖品奖项位置信息
        if ( tableWithPosition ) {
            let unEditList = prizeData
            if ( prizeData.length > 0 && editKey ) {
                unEditList = prizeData.filter( info => {
                    return info.itemPosition.toString() !== editKey
                } )
            }

            // 将已有的且不能更改的坐标点标记出来
            const unCheckList = []
            if ( unEditList && unEditList.length > 0 ) {
                unEditList.forEach( info => {
                    if ( info && info.itemPosition ) {
                        let pointList = info.itemPosition
                        if ( !Array.isArray( info.itemPosition ) && info.itemPosition ) {
                            pointList = info.itemPosition?.split( ',' )
                        }
                        pointList.forEach( item => {
                            unCheckList.push( item )
                        } )
                    }
                } )
            }
            // 限制多选框点击
            newCheckboxOptions = checkboxOptions.map( info => {
                let disabled = false
                if ( unCheckList.includes( info.value ) ) {
                    disabled = true
                }
                return {
                    ...info,
                    disabled
                }
            } )
        }


        return (
          <Modal
            maskClosable={false}
            bodyStyle={{ padding: '28px' }}
            visible={prizeModalVisible}
            title={`${editKey ? '编辑' : '新增'}奖品`}
            width={1040}
            destroyOnClose
            {...modalFooter}
          >
            <>
              <Form {...formLayout} onSubmit={onPrizeModalVerification}>
                <FormItem
                  label={<span className={styles.labelText}>中奖类型</span>}
                >
                  {getFieldDecorator( 'optionPrizeType', {
                                initialValue: optionPrizeType,
                                rules: [{ required: true, message: '' }],
                            } )(
                              <Radio.Group disabled={!!editKey}>
                                <Radio value='PRIZE'>奖品</Radio>
                                <Radio value='THANKS'>谢谢参与</Radio>
                              </Radio.Group>
                            )}
                </FormItem>
                {
                            tableWithPosition &&
                            <div>
                              <FormItem
                                style={{ display: 'flex' }}
                                label={<span className={styles.labelText}>奖项位置</span>}
                              >
                                {getFieldDecorator( 'itemPosition', {
                                        initialValue: itemPosition,
                                        rules: [{ required: true, message: () => { } }],
                                    } )(
                                      <Checkbox.Group
                                        options={newCheckboxOptions}
                                      />
                                    )}
                                <div style={{ color: '#f73232', fontSize: '12px' }}>*不同奖项的序号不能重复</div>
                              </FormItem>
                              <FormItem
                                style={{ display: 'flex' }}
                                label={<span className={styles.labelText}>奖项名称</span>}
                              >
                                {getFieldDecorator( 'itemName', {
                                        initialValue: itemName,
                                        rules: [{ required: true, message: () => { } }],
                                    } )(
                                      <Input
                                        placeholder="请输入奖项名称"
                                        maxLength={20}
                                      />
                                    )}
                              </FormItem>
                            </div>
                        }
                <FormItem
                  label={<span className={styles.labelText}>{tableWithPosition ? '奖项图' : '奖品图'}</span>}
                >
                  {getFieldDecorator( 'image', {
                                initialValue: image,
                                rules: [{ required: true, message: () => { } }],
                            } )(
                              <UploadModal />
                            )}
                </FormItem>
                {
                            getFieldValue( 'optionPrizeType' ) === 'PRIZE' &&
                            <FormItem
                              label={<span className={styles.labelText}>发奖模式</span>}
                            >
                                {getFieldDecorator( 'awardMode', {
                                    initialValue: awardMode,
                                    rules: [{ required: true }],
                                } )(
                                  <Radio.Group onChange={( e ) => resetPrizeFormItem( e )} disabled={!!editKey}>
                                    <Radio value='RIGHT'>新模式</Radio>
                                    <Radio value='OPEN'>旧模式</Radio>
                                  </Radio.Group>
                                )}
                            </FormItem>
                        }
                {getFieldValue( 'optionPrizeType' ) === 'PRIZE' && renderKeyInfoForm()}
              </Form>

            </>
          </Modal>
        )
    }

    useEffect( () => {
        initPrizeInfo()
    }, [] )

    return renderPrizeForm()
}

export default Form.create()( connect( ( { bees } ) => ( {
    prizeList: bees.prizeList,
    prizeTypeList: bees.prizeTypeList,
    merchantList: bees.merchantList,
    merchantVisibleList: bees.merchantVisibleList
} ) )( EditPrizeModal ) )