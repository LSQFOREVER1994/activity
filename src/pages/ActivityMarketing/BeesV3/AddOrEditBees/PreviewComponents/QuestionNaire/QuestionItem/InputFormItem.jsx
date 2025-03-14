import { Form } from 'antd';
import React from 'react';
import renderQuestinLabel from './utils';
import styles from './questionItem.less';

function InputItem( { value = '' } ) {
  return (
    <div className={styles.question_input}>
      <input value={value} type="text" readOnly placeholder="请输入内容" />
    </div>
  );
}

const InputFormItem = ( { formItemInfo, questionIdx, spacing } ) => {
  const { title,  description, descriptionColor } = formItemInfo;

  return (
    <div
      className={styles.element_container}
      key={`${title}_${questionIdx}`}
      style={{ marginBottom: `calc(${spacing || 0} / 32 * 1rem)` }}
    >
      <Form.Item
        colon={false}
        name={`inputItem_${questionIdx}`}
        label={renderQuestinLabel( formItemInfo, questionIdx )}
        clearable
        labelCol={12}
      >
        <div
          className={styles.question_desc}
          style={{
            color: descriptionColor,
          }}
        >
          {description}
        </div>
        <InputItem />
      </Form.Item>
    </div>

  );
};

export default InputFormItem;
