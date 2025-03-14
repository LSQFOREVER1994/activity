import React, { useEffect } from 'react';
import { connect } from 'dva';
import { Form, Switch, Select, Tooltip, Icon } from 'antd';


const FormItem = Form.Item;
const { Option } = Select;

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
}

const RankTask = props => {
    const { componentsData, changeValue, form, dispatch, eligibilityType = [], eligibilityList = [] } = props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

    // 任务资格列表
    const getEligibilityList = ( id ) => {
      dispatch( {
        type: 'beesVersionThree/getEligibilityList',
        payload: {
          id
        },
      } );
    }

    // 任务类型列表
    const getTaskEventTypeList = () => {
      dispatch( {
        type:'beesVersionThree/getEligibilityType',
        payload:{
          successFun:()=>{
            const { isRankEligibility, taskEventType } = componentsData || {};
            if( isRankEligibility && taskEventType )getEligibilityList( taskEventType )
          }
        }
      } )
    }

    // 任务类型切换
    const changeEligibility =( val )=>{
      if( val ){
        getEligibilityList( val )
      }
      changeValue(  val, 'taskEventType', )
      changeValue( '', 'taskEventId' );
      setFieldsValue( {
        taskEventId:''
      } )
    }

    // 入榜门槛开关
    const switchChange = ( checked )=>{
      if( !checked ){
        changeValue( '', 'taskEventType' )
        changeValue( '', 'taskEventId' );
      }
      changeValue( checked, 'isRankEligibility' )
    }

    useEffect( ()=>{
      getTaskEventTypeList()
    }, [] )

    return(
      <Form>
        <FormItem 
          label={
            <span>
              入榜门槛
              <Tooltip title="开启后将限制入选排行榜的资格">
                <Icon type="question-circle" />
              </Tooltip>
            </span>
          }
          {...formLayout}
        >
          {getFieldDecorator( 'isRankEligibility', {
            rules: [{ required: true }],
            valuePropName: 'checked',
            initialValue: componentsData.isRankEligibility
            } )( 
              <Switch onChange={( checked )=>switchChange( checked )} /> )}
        </FormItem>
        {
            ( getFieldValue( 'isRankEligibility' ) || componentsData.isRankEligibility ) ? 
              <>
                <FormItem>
                  {getFieldDecorator( 'taskEventType', {
                    rules: [{ required: true, message:'请选择资格类型' }],
                    initialValue: componentsData.taskEventType
                    } )(
                      <Select
                        showSearch
                        filterOption={( input, option ) =>
                          option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                        }
                        placeholder="请选择资格类型"
                        onChange={( e ) => changeEligibility( e, 'taskEventType' )}
                        getPopupContainer={( triggerNode )=>triggerNode.parentElement || document.body}
                      >
                        {eligibilityType.map( item => (
                          <Option key={item.id}>{item.name}</Option>
                        ) )}
                      </Select>
                    )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator( 'taskEventId', {
                    rules: [{ required: true, message:'请选择资格' }],
                    initialValue: componentsData.taskEventId
                    } )(
                      <Select
                        showSearch
                        filterOption={( input, option ) =>
                          option.props.children.toLowerCase().indexOf( input.toLowerCase() ) >= 0
                        }
                        placeholder="请选择资格"
                        onChange={( e ) => changeValue( e, 'taskEventId' )}
                        getPopupContainer={( triggerNode )=>triggerNode.parentElement || document.body}
                      >
                        {eligibilityList.map( item => (
                          <Option key={item.taskEventId}>{item.name}</Option>
                        ) )}
                      </Select>
                    )}
                </FormItem>
              </>
            :""
        }
      </Form>
    )
}

const taskProps = ( { beesVersionThree } ) => ( {
    eligibilityType: beesVersionThree.eligibilityType,
    eligibilityList:beesVersionThree.eligibilityList
} );
  
export default Form.create( { name: 'beesVersionThree' } )( connect( taskProps )( RankTask ) );