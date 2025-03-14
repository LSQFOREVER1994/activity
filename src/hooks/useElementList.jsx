import { useContext } from 'react'
import { DomDataContext } from '../pages/ActivityMarketing/BeesV3/AddOrEditBees/provider';
import { drawTypeList } from '../pages/ActivityMarketing/BeesV3/AddOrEditBees/BodyContent/DragSelection/ComponentList/listData';

/**
 * @returns Array 当前编辑活动抽奖组件列表
 */
function useElementList() {
  const [domData] = useContext( DomDataContext );
  const list = domData?.pages?.map( page => {
    return page?.componentData?.map( item => {
      if ( drawTypeList.includes( item.type ) ) { return item } return null;
    } ).filter( Boolean );
  } ).flat();
  return list
}

export default useElementList
