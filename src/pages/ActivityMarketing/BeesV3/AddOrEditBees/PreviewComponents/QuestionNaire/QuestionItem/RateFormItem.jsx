import { Form, Rate } from 'antd';
import React from 'react';
import renderQuestinLabel from './utils';
import styles from './questionItem.less';

function RateItem( { value = '', count } ) {

  return (
    <Rate allowHalf count={Number( count ) || 5} value={value} />
  );
}

const RateFormItem = ( { formItemInfo, questionIdx, spacing } ) => {
  const { title,  description, descriptionColor, } = formItemInfo;

  return (
    <div
      className={styles.element_container}
      key={`${title}_${questionIdx}`}
      style={{ marginBottom: `calc(${spacing || 0} / 32 * 1rem)` }}
    >
      <Form.Item
        colon={false}
        name={`textAreaItem_${questionIdx}`}
        label={renderQuestinLabel( formItemInfo, questionIdx )}
        clearable
        labelCol={10}
      >
        <div
          className={styles.question_desc}
          style={{
            color: descriptionColor,
          }}
        >
          {description}
        </div>
        <RateItem count={formItemInfo?.extended?.score} />
      </Form.Item>
    </div>
  );
};

export default RateFormItem;
