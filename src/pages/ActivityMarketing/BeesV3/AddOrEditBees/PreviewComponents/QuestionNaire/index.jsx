/* eslint-disable no-case-declarations */


import { connect } from 'dva'
import {  Form,  Button } from 'antd'
import React, { useCallback, useRef, useEffect } from 'react'
import { setScaleFunc } from '../index';
import styles from './index.less'
import InputFormItem from './QuestionItem/InputFormItem';
import TextAreaFormItem from './QuestionItem/TextAreaFormItem';
import RateFormItem from './QuestionItem/RateFormItem';
import RadioFormItem from './QuestionItem/RadioFormItem';
import CheckBoxFormItem from './QuestionItem/CheckBoxFormItem';
import DropDownFormItem from './QuestionItem/DropDownFormItem';

// 题目组件枚举
const questionComponents = {
  SINGLE_CHOICE: RadioFormItem,
  MULTIPLE_CHOICE: CheckBoxFormItem,
  ESSAY_QUESTION: TextAreaFormItem,
  SCORE: RateFormItem,
  SINGLE_TEXT: InputFormItem,
  MULTIPLE_TEXT: TextAreaFormItem,
  DROP_DOWN: DropDownFormItem,
};

function Index( domData ) {
  const {
    question,
    spacing,
    submitButtonStyle,
    submitButtonTextColor,
    submitButtonBackgroundColor,
    submitButtonText,
    submitButtonImage,
    descriptionColor,
    borderColor,
    optionColor,
    titleColor,
    showNumber,
    style,
    id
  } = domData

  const itemEl = useRef( null );

  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width] );


  const renderQuestionItem = useCallback( () => {
    if ( !question?.length ) return null
    return (
        question.map( ( questionItem, idx ) => {
          const defaultQItemProps = {
            formItemInfo: { ...questionItem, showNumber,  optionColor,  descriptionColor, titleColor },
            questionIdx: idx,
            optionsList: questionItem?.optionsList || [],
            spacing,
          };
          const Component = questionComponents[questionItem.topic];
          if ( Component ) {
            return <Component {...defaultQItemProps} />;
          }
          return null;
        } )
    )
  }, [question?.length, JSON.stringify( domData ), spacing, optionColor, JSON.stringify( question )] )

  return (
    <div className={styles.form_container} style={{ ...style, zIndex:999, border: `1px solid ${borderColor}`, background:style?.backgroundColor }} ref={itemEl} id={id}>
      <Form>
        {renderQuestionItem()}
        {
          submitButtonStyle === 'DEFAULT' ? (
            <div className={styles.button_container}>
              <Button block type="submit" style={{ background: submitButtonBackgroundColor, width:"92%", height:"calc(100 / 32 * 1rem)" }} color={submitButtonBackgroundColor ? '' : 'primary'} size="large">
                <div style={{ color: submitButtonTextColor }}>{submitButtonText || '提交'}</div>
              </Button>
            </div>

          ) : (
            <div className={styles.submit_btn_img}>
              <img src={submitButtonImage} alt="" />
            </div>
          )
        }
      </Form>
    </div>
  )
}

export default connect()( Index )
