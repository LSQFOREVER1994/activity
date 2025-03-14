import { Form } from 'antd';
import React, { useState } from 'react';
import renderQuestinLabel from './utils';
import styles from './questionItem.less';

import addressRight from '@/assets/address_right.png'

function DropDownItem( {
  value = '',
} ) {
  return (
    <>
      <div className={styles.question_drop_input}>
        <input value={value} type="text" readOnly placeholder="请选择内容" />
      </div>
    </>
  );
}

const DropDownFormItem = ( {
  formItemInfo, questionIdx, spacing,
} ) => {
  const { title,  optionsList, description, descriptionColor } = formItemInfo;
  const [selectVisible, setSelectVisible] = useState( false );

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
        <div className={styles.drop_container}>
          <DropDownItem
            optionsList={optionsList}
            selectVisible={selectVisible}
            setSelectVisible={setSelectVisible}
          />
          <img
            src={addressRight}
            alt=""
            className={styles.inputItem_icon}
            onClick={() => setSelectVisible( true )}
          />
        </div>
      </Form.Item>
    </div>
  );
};

export default DropDownFormItem;
