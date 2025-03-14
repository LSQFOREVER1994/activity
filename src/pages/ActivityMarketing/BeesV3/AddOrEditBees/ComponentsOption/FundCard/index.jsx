import React, { useEffect } from 'react'
import { connect } from 'dva';
import { Checkbox, Form } from 'antd'
import FundList from './FundList';
import RenderFormItem from '../RenderFormItem'

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

function index( props ) {
  const { componentsData, changeValue, dispatch } = props;
  const { jumpButtonList, prodType } = componentsData;

  const getFundList = ( ) => {
    dispatch( {
      type: 'beesVersionThree/getFundList',
      payload:{
        page:{
          pageSize:1000,
          pageNum:1,
        },
        prodType,
      }
    } )
  }

  const renderList=[
    {
        renderType: 'Radio',
        label: '卡片样式',
        field: 'cardStyle',
        required: true,
        flex:true,
        formLayout: {},
        radioList: [
          {
            label: '小卡样式',
            value: 'SMALL',
          },
          {
            label: '大卡样式',
            value: 'BIG',
          },
        ],
    },
    {
        renderType: 'Radio',
        label: '产品类型',
        field: 'prodType',
        flex:true,
        required: true,
        formLayout: {},
        changeCallBack:( e ) => {
          const val = e.target.value;
          if( val !== '1' ){
            const newJumpButton = jumpButtonList.filter( item=> item !== 'AIP' )
            changeValue( newJumpButton, 'jumpButtonList' )
          };
          getFundList( val )
          changeValue( [], 'funds' )
        },
        radioList: [
          {
            label: '场外基金',
            value: '1',
          },
          {
            label: '场内基金',
            value: '2',
          },
          {
            label: '股票',
            value: '3',
          },
        ],
    },
]



  const selectVerification = ( type ) => {
    if( type === 'BUY' ){
      if( jumpButtonList.includes( 'AIP' ) ) return true
    }
    if( type === 'AIP' ){
      if( jumpButtonList.includes( 'BUY' ) ) return true
      if( prodType !== '1' ) return true
    }
    return undefined
  }

  const handleThreeCheckBox = ( e )=>{
    const isCan = e.target.checked;
    const isVal = e.target.value;
    let arr = [...jumpButtonList]
    if( isCan ){
      arr.push( isVal )
    }else{
      arr = jumpButtonList.filter( item=>item !== isVal )
    }
    changeValue( arr, 'jumpButtonList' )
  }

  useEffect( ()=>{
    getFundList()
  }, [prodType] )

  return (
    <div>
      <RenderFormItem renderList={renderList} />
      <FormItem label='跳转按钮'>
        <CheckboxGroup value={jumpButtonList}>
          <span style={{ paddingRight:'50px' }}>
            <Checkbox
              value='BUY'
              onChange={( e )=>handleThreeCheckBox( e )}
              disabled={selectVerification( 'BUY' )}
            >
              购买
            </Checkbox>
          </span>
          <span style={{ paddingRight:'50px' }}>
            <Checkbox
              value='AIP'
              onChange={( e )=>handleThreeCheckBox( e )}
              disabled={selectVerification( 'AIP' )}
            >
              定投
            </Checkbox>
          </span>
          <span style={{ paddingRight:'50px' }}>
            <Checkbox
              value='SELF_SELECT'
              onChange={( e )=>handleThreeCheckBox( e )}
            >
              关注
            </Checkbox>
          </span>
        </CheckboxGroup>
      </FormItem>
      <FundList {...props} />
      <RenderFormItem renderList={[{
          renderType: 'SketchPicker',
          field: 'style.textColor',
          label: '评价文字颜色',
          flex: true,
        }]}
      />
    </div>
  )
}

export const HIDE_TEXT_COLOR = true;
export default connect()( index )