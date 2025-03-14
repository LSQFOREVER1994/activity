import { Form, Radio } from 'antd';
import React from 'react';
import renderQuestinLabel from './utils';
import styles from './questionItem.less';

function RadioItem( {
  value = {
    itemValue: '',
    otherValue: '',
  }, optionsList, optionColor,
} ) {


  return (
    <Radio.Group value={value.itemValue}>
      {
        optionsList?.length && optionsList.map( ( option ) => (
          <>
            <Radio
              value={option}
              style={{
                '--icon-size': 'calc(36 / 32 *1rem)',
                marginLeft: 6
              }}
            >
              <span style={{ color: optionColor }}>{option}</span>
            </Radio>
            {
              ( option === '其他' && value.itemValue === '其他' )
              && (
                <div className={styles.other_input}>
                  <input type="text" value={value.otherValue} readOnly />
                </div>
              )
            }
          </>
        ) )
      }
    </Radio.Group>
  );
}

const RadioFormItem = ( {
  formItemInfo, questionIdx, spacing,
} ) => {
  const { title, optionsList, description, descriptionColor, optionColor } = formItemInfo;

  return (
    <div
      className={styles.element_container}
      key={`${title}_${questionIdx}`}
      style={{ marginBottom: `calc(${spacing || 0} / 32 * 1rem)` }}
    >
      <Form.Item
        colon={false}
        name={`radioItem_${questionIdx}`}
        label={renderQuestinLabel( formItemInfo, questionIdx )}
        clearable
      >
        <div
          className={styles.question_desc}
          style={{
            color: descriptionColor,
          }}
        >
          {description}
        </div>
        <RadioItem optionColor={optionColor} optionsList={optionsList} />
      </Form.Item>
    </div>
  );
};

export default RadioFormItem;
