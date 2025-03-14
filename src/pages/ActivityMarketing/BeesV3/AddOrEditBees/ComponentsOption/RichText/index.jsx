import React, { useMemo } from 'react';
import { Form, } from 'antd';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
// import AdvancedSetting from './AdvancedSetting'

const FormItem = Form.Item;

function Text( { componentsData, changeValue } ) {
  const {
    propValue: { text }, id,
  } = componentsData;
  const braftEditor = useMemo( ()=>{
    return (
      <BraftEditor
        id={id}
        record={text}
        onChange={e => changeValue( e, 'propValue.text' )}
        field="content"
        contentStyle={{ height: '250px' }}
      />
    )
  }, [text, id] )
  return (
    <FormItem required label="内容">
      {braftEditor}
    </FormItem>
  );
}
export const SET_JUMP = true;
export const HIDE_TEXT_COLOR = true;
// export const ADVANCED_SETTING  = AdvancedSetting;
export default Text;
