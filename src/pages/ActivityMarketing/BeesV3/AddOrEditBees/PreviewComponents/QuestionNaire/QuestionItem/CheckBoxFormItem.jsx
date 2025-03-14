import { Form, Checkbox } from 'antd';
import React from 'react';
import renderQuestinLabel from './utils';
import styles from './questionItem.less';

function CheckBoxItem( {
  value = {
    itemValues: [],
    otherValue: '',
  }, optionsList, optionColor,
} ) {

  return (
    <Checkbox.Group value={value?.itemValues}>
      {
        optionsList?.length && optionsList.map( ( option ) => (
          <>
            <Checkbox
              value={option}
              style={{ marginLeft: 6 }}
            >
              <span style={{ color: optionColor }}>{option}</span>
            </Checkbox>
            {
              ( value?.itemValues?.includes( '其他' ) && option === '其他' )
              && (
                <div className={styles.other_input}>
                  <input type="text" value={value.otherValue} />
                </div>
              )
            }
          </>
        ) )
      }
    </Checkbox.Group>
  );
}

const CheckBoxFormItem = ( {
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
        <CheckBoxItem optionColor={optionColor} optionsList={optionsList} />
      </Form.Item>
    </div>
  );
};

export default CheckBoxFormItem;
