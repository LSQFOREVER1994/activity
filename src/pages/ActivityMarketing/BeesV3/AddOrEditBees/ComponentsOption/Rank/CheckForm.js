import React from 'react';
import { Icon, Checkbox, Tooltip } from 'antd';
import styles from './index.less';

const CheckboxGroup = Checkbox.Group;

const integralList=[
  { label: '每月积分榜', value:'MONTH_ACC', tooltip: '统计活动中当月累计获得/消耗的积分' },
  { label: '每月王者榜', value:'MONTH_ADD', tooltip: '统计活动中当月累计获得的积分' },
  { label: '总积分榜', value:'TOTAL_ACC',  tooltip: '统计活动中累计获得的积分' },
]

const guessList=[
  { label: '每周王者榜', value:'WEEK_ADD', tooltip: '统计当周通过竞猜所获得的积分' },
  { label: '每周获胜榜', value:'WEEK_WIN_TIME', tooltip: '统计当周竞猜的获胜次数' },
  { label: '每周胜率榜', value:'WEEK_WIN_RATE', tooltip: '统计当周竞猜的胜率' },
  { label: '每月王者榜', value:'MONTH_ADD', tooltip: '统计当月通过竞猜所获得的积分' },
  { label: '每月胜率榜', value:'MONTH_WIN_RATE', tooltip: '统计当月竞猜的胜率' },
  { label: '每月积分榜', value:'MONTH_ACC', tooltip: '统计当月通过竞猜所获得/消耗的积分' },
  { label: '每月获胜榜', value:'MONTH_WIN_TIME', tooltip: '统计当月竞猜的获胜次数' },
  // { label: '每周积分榜', value:'WEEK_ACC' },
  { label: '总积分榜:', value:'TOTAL_ACC' },
  // { label: '总王者榜', value:'TOTAL_ADD' },
  // { label: '总胜率榜', value:'TOTAL_WIN_RATE' },
  // { label: '总获胜榜', value:'TOTAL_WIN_TIME' },
]


function CheckForm ( props ){
    const { componentsData={}, changeValue } = props;
    const { rankCategoryTypes=[], rankType } = componentsData;
    // const [ active, setActive ] = useState( '' )
    const optionList = rankType === 'INTEGRAL' ? integralList : guessList;
    const iconText = rankType === 'INTEGRAL' ? '需至少选择一个榜单进行展示，否则无法保存':
    '最多可勾选三个榜单，当勾选完3个榜单后，第四个榜单置灰无法选择,需至少选择一个榜单进行展示，否则无法保存';

    const handleThreeCheckBox = ( e )=>{
        const isCan = e.target.checked;
        const isVal = e.target.value;
        let arr = [...rankCategoryTypes];
        if( isCan ){
            arr.push( isVal )
        }else{
            arr = rankCategoryTypes.filter( ( i )=> i !== isVal )
        }
        changeValue( arr, 'rankCategoryTypes' )
    }

    return(
      <>
        <div className={styles.checkboxGroup_title}>
          <span style={{ color:'red', marginRight:5 }}>*</span>
          选择展示榜单&nbsp;
          <Tooltip title={iconText}>
            <Icon type="question-circle" />
          </Tooltip>
            &nbsp;:
        </div>
        <CheckboxGroup className={styles.checkboxGroup} value={rankCategoryTypes}>
          {
            optionList.map( i => (
              <div className={styles.checkbox_list_item} key={i.value}>
                <Checkbox
                  value={i.value}
                  disabled={( rankCategoryTypes.length === 1 && rankCategoryTypes.indexOf( i.value ) !== -1 )|| ( rankCategoryTypes.length === 3 && rankCategoryTypes.indexOf( i.value ) === -1 )}
                  onChange={( e )=>handleThreeCheckBox( e )}
                >
                  { i.label }
                  <Tooltip title={i.tooltip}>
                    <Icon type="question-circle" />
                  </Tooltip>
                </Checkbox>
                {/* <Icon
                  type="edit"
                  className={styles.icon}
                  onClick={()=>setActive( i.value )}
                /> */}
              </div>
            ) )
        }
        </CheckboxGroup>
      </>
    )
}
export default CheckForm;