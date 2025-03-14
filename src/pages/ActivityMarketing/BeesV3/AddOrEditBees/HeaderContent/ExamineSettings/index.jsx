import React, { useContext, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Select } from 'antd';
// import serviceObj from '@/services/serviceObj';
import { DomDataContext } from '../../provider';
import styles from './index.less'

const { Option } = Select

// const designImgs = {
//   invite: `${serviceObj.defaultImagePath}SJGF2.png`,
//   share: `${serviceObj.defaultImagePath}SJGF1.png`,
// };
const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

function ExamineSettings( props ) {
  const { dispatch, examineList } =props
  const [domData, changeDomData] = useContext( DomDataContext );
  const { approvalConfig = [] } = domData;


    // 获取审核人员列表
    const getExamineList = ( nick ) => {
      dispatch( {
        type: 'bees/getExamineList',
        payload: {
          query: {
            nick: nick || ''
          }
        },
      } );
    };
  
    useEffect( ()=>{
      getExamineList();
    }, [] )

  const changeInput = ( e, type ) => {
    let val = e;
    if ( e && e.target ) {
      val = e.target.value;
    }

    domData[type] = val
    const obj = Object.assign( domData );
    changeDomData( obj );
  };

  const onSearch = ( e ) => {
    getExamineList( e );
  }
  
  return (
    <div style={{ width: '100%', minHeight:400 }} className="shareOp">
      <FormItem
        style={{ display: 'flex', width:'100%' }}
        label={
          <span className={styles.labelText}>
            <span>*</span>审批人员
          </span>
          }
        {...formLayout}
      >
        <Select
          mode="multiple"
          style={{ width:'100%' }}
          value={approvalConfig}
          filterOption={false}
          placeholder="请选择活动发布审批人员"
          showSearch
          onSearch={onSearch}
          // onChange={e => handleChange( e, 'parameter' )}
          onChange={e => changeInput( e, 'approvalConfig' )}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {examineList?.map( item => (
            <Option
              key={`${item.nick}(${item.username})`}
              value={item.id}
            >{`${item.nick}(${item.username})`}
            </Option>
      ) )}
        </Select>
      </FormItem>
    </div>
  );
}
const mapProps = ( { bees } ) => ( {
  examineList: bees.examineList,
} );

export default connect( mapProps )( ExamineSettings );
