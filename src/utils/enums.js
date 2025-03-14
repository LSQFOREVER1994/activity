const getValue = ( enumList, key ) => {
  let selectValue = key;
  enumList.some( ( item ) => {
    if ( item.key !== key ) {
      return false;
    }
    selectValue = item.value;
    return true;
  } );
  return selectValue;
};
const getKey = ( enumList, value ) => {
  let selectValue = value;
  enumList.some( ( item ) => {
    if ( item.value !== value ) {
      return false;
    }
    selectValue = item.key;
    return true;
  } );
  return selectValue;
};

const topicTypeList=[
  { key:'SINGLE_CHOICE', value:'单选题' },
  { key:'MULTIPLE_CHOICE', value:'多选题' },
  { key:'ESSAY_QUESTION', value:'简答题' },
  { key:'SCORE', value:'评分题' },
]


export {
  getValue,
  getKey,
  topicTypeList,
};
