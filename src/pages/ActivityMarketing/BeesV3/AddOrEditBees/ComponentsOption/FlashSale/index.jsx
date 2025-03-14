/*
 * @Author: zq636443 zq636443@163.com
 * @Date: 2024-12-11 11:16:16
 * @LastEditors: zq636443 zq636443@163.com
 * @LastEditTime: 2024-12-11 18:34:45
 * @FilePath: /data_product_cms_ant-pro/src/pages/ActivityMarketing/BeesV3/AddOrEditBees/ComponentsOption/FlashSale/index.jsx
 */
import React, { useEffect } from 'react';
import { connect } from 'dva';
import RenderFormItem from '../RenderFormItem';


const colorsTip = {
  nameColor: "商品名称文字颜色",
  originalPriceColor: "商品原价文字颜色",
  presentPriceColor: "商品现价文字颜色",
  countDownColor: "倒计时文字颜色",
  describeColor: '商品描述文字颜色'
}

const defaultColors = {
  nameColor: 'rgba(255, 245, 211, 1)',
  originalPriceColor: 'rgba(255, 255, 253, 1)',
  presentPriceColor: 'rgba(255, 146, 102, 1)',
  countDownColor: 'rgba(255, 97, 58, 1)',
  describeColor: 'rgba(83,83,83,1)',
}

const colorsKey = [
  "nameColor",
  "originalPriceColor",
  "presentPriceColor",
  "countDownColor",
  "describeColor",
]


function Img( props ) {
  const { dispatch, componentsData, xdMallActivityList=[], xdMallGoodsList=[] } = props;
  const { mallActId } = componentsData

  const renderList = [
    {
      renderType: 'Select',
      label: '请选择商城活动',
      field: 'mallActId',
      flex: true,
      required: true,
      optionList: xdMallActivityList.map( ( item )=>( { label:item.activityName, value:item.activityId } ) ),
      changeCallBack:( e, _, changeComponentData ) => {
        changeComponentData( '', 'shopId' )
        changeComponentData( '', 'shopName' )
        changeComponentData( '', 'originalPrice' )
        changeComponentData( '', 'spikePrice' )
        changeComponentData( '', 'startTime' )
        changeComponentData( '', 'endTime' )
        changeComponentData( '', 'description' )
        changeComponentData( '', 'payModel' )
      },  
      propsData: {
        placeholder: '请选择商城活动',
        style: {
          width: 200,
        },
      },
    },
    {
      renderType: 'Select',
      label: '选择商品',
      field: 'shopId',
      flex: true,
      required: true,
      optionList: xdMallGoodsList.map( ( item )=>( { label:item.goodsName, value:item.id } ) ),
      changeCallBack:( e, _, changeComponentData ) => {
        const productId = e
        const currentGood = xdMallGoodsList.find( item=>item.id===productId )
        const { goodsName, 
          // originalPrice, spikePrice, 
          activityStartTime, activityEndTime, price, discountPrice, payModel } = currentGood || {}
        changeComponentData( goodsName, 'shopName' )
        changeComponentData( price, 'originalPrice' )
        changeComponentData( discountPrice, 'spikePrice' )
        changeComponentData( activityStartTime, 'startTime' )
        changeComponentData( activityEndTime, 'endTime' )
        changeComponentData( payModel, 'payModel' )
      },  
      
      propsData: {
        placeholder: '请选择商品',
        style: {
          width: 200,
        },
      },
    },
    {
      renderType: 'Input',
      label: '商品名称',
      field: 'shopName',
      required: true,
      wordsMax: 20,
      conditionalRendering:( componentData ) => ( !!componentData.shopId ),
      propsData: {
        placeholder: '请输入商品名称',
      },
    },
    {
      renderType: 'InputNumber',
      label: '商品原价',
      field: 'originalPrice',
      required: true,
      conditionalRendering:( componentData ) => ( !!componentData.shopId ),
      propsData: {
        placeholder: '请输入商品原价',
        max:99999999,
        min: 0.00001
      },
    },
    {
      renderType: 'InputNumber',
      label: '商品秒杀价',
      field: 'spikePrice',
      conditionalRendering:( componentData ) => ( !!componentData.shopId ),
      required: true,
      propsData: {
        placeholder: '请输入商品秒杀价',
        max:99999999,
        min: 0.00001
      },
    },
    // {
    //   renderType: 'DatePicker',
    //   label: '秒杀开始时间',
    //   field: 'startTime',
    //   flex:true,
    //   required: true,
    //   conditionalRendering:( componentData ) => ( !!componentData.shopId ),
    //   formLayout:{},
    //   propsData: {
    //     showTime:true,
    //     style: { width:'80%' },
    //     format: 'YYYY-MM-DD HH:mm:ss',
    //   }
    // },
    // {
    //   renderType: 'DatePicker',
    //   label: '秒杀结束时间',
    //   field: 'endTime',
    //   flex:true,
    //   required: true,
    //   conditionalRendering:( componentData ) => ( !!componentData.shopId ),
    //   formLayout:{},
    //   propsData: {
    //     showTime:true,
    //     style: { width:'80%' },
    //     format: 'YYYY-MM-DD HH:mm:ss',
    //   }
    // },
    {
      renderType: 'Input',
      label: '商品描述',
      field: 'description',
      required: false,
      wordsMax: 30,
      conditionalRendering:( componentData ) => ( !!componentData.shopId ),
      propsData: {
        placeholder: '请输入商品描述',
      },
    },
    {
      renderType: 'UploadModal',
      field: 'backgroundImage',
      label: '背景图',
      required: true,
      tips: {
        text: ['图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'beforeButton',
      label: '秒杀前按钮样式',
      required: true,
      tips: {
        text: ['图片大小建议不大于1M'],  
      },
    },
    {
      renderType: 'UploadModal',
      field: 'inStockButton',
      label: '秒杀中-有库存按钮样式',
      required: true,
      tips: {
        text: ['图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'outStockButton',
      label: '秒杀中-无库存按钮样式',
      required: true,
      tips: {
        text: ['图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'UploadModal',
      field: 'endButton',
      label: '秒杀结束按钮样式',
      required: true,
      tips: {
        text: ['图片大小建议不大于1M'],
      },
    },
    {
      renderType: 'ColorsMap',
      label: '颜色',
      field: 'colors',
      formLayout: {},
      propsData: {
        colorsTip,
        colorsKey,
        defaultValue: defaultColors
      },
    },
  ];
  const getXDMallActivityList = () => {
    dispatch( {
      type:'beesVersionThree/getXDMallActivityList',
    } )
  }
  const getXDMallGoodsList = () => {
    dispatch( {
      type:'beesVersionThree/getXDMallGoodsList',
      payload:{
        query:{
          activityId:mallActId
        },
      }
      
    } )
  }
  useEffect( ()=>{
    getXDMallActivityList()
  }, [] )

  useEffect( ()=>{
    if( mallActId ){
     getXDMallGoodsList()
    }
  }, [mallActId] )
  return <RenderFormItem renderList={renderList} />;
}

export const SUSPENSION = true;
export const HIDE_TEXT_COLOR = true;
export default connect( ( state )=>( {
  xdMallActivityList: state.beesVersionThree.xdMallActivityList,
  xdMallGoodsList:state.beesVersionThree.xdMallGoodsList,
} ) )( Img );
