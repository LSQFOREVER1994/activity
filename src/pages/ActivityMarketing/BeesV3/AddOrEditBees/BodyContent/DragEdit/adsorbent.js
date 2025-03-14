/* eslint-disable no-param-reassign */
const ADSORBENT_START_NUM = 3; // 吸附像素
export const DRAG_REGION_WIDTH = 375; // 拖拽编辑宽度
// export const DRAG_REGION_HEIGHT = 718; // 拖拽编辑高度
/**
 * @example 编辑可视区吸附处理
 * @param {object} obj {left,top} 当前位置
 * @param {object} option 移动元素参数
 * @param {object} visibleAreaSize 编辑可视区宽高
 * @returns
 */
export function editAreaAdsorbent( obj, option, visibleAreaSize, DRAG_REGION_HEIGHT ) {
  const { left, top } = obj;
  const guidesArr = [];
  const { height, width, offsetXInWrap, offsetYInWrap } = visibleAreaSize;
  const arr = [
    {
      // 拖拽内容吸附拖拽区域左边
      condition: Math.abs( left ) <= ADSORBENT_START_NUM,
      updateKey: 'left',
      value: 0,
      guides: {
        left: 0,
        top: -offsetYInWrap,
        height,
      },
    },
    {
      // 拖拽内容中间吸附拖拽区域左边
      condition: Math.abs( left + option.width / 2 ) <= ADSORBENT_START_NUM,
      updateKey: 'left',
      value: -option.width / 2,
      guides: {
        left: 0,
        top: -offsetYInWrap,
        height,
      },
    },
    {
      // 拖拽内容右边吸附拖拽区域左边
      condition: Math.abs( left + option.width ) <= ADSORBENT_START_NUM,
      updateKey: 'left',
      value: -option.width,
      guides: {
        left: 0,
        top: -offsetYInWrap,
        height,
      },
    },
    {
      // 拖拽内容吸附拖拽区域顶部边
      condition: Math.abs( top ) <= ADSORBENT_START_NUM,
      updateKey: 'top',
      value: 0,
      guides: {
        left: -offsetXInWrap,
        top: 0,
        width,
      },
    },
    {
      // 拖拽内容中间吸附拖拽区域顶部边
      condition: Math.abs( top + option.height / 2 ) <= ADSORBENT_START_NUM,
      updateKey: 'top',
      value: -option.height / 2,
      guides: {
        left: -offsetXInWrap,
        top: 0,
        width,
      },
    },
    {
      // 拖拽内容底部吸附拖拽区域顶部边
      condition: Math.abs( top + option.height ) <= ADSORBENT_START_NUM,
      updateKey: 'top',
      value: -option.height,
      guides: {
        left: -offsetXInWrap,
        top: 0,
        width,
      },
    },
    {
      // 拖拽内容左边吸附拖拽区域右边
      condition: Math.abs( DRAG_REGION_WIDTH - left ) <= ADSORBENT_START_NUM,
      updateKey: 'left',
      value: DRAG_REGION_WIDTH,
      guides: {
        left: DRAG_REGION_WIDTH,
        top: -offsetYInWrap,
        height,
      },
    },
    {
      // 拖拽内容中间吸附拖拽区域右边
      condition: Math.abs( DRAG_REGION_WIDTH - ( left + option.width / 2 ) ) <= ADSORBENT_START_NUM,
      updateKey: 'left',
      value: DRAG_REGION_WIDTH - option.width / 2,
      guides: {
        left: DRAG_REGION_WIDTH,
        top: -offsetYInWrap,
        height,
      },
    },
    {
      // 拖拽内容右边吸附拖拽区域右边
      condition: Math.abs( DRAG_REGION_WIDTH - ( left + option.width ) ) <= ADSORBENT_START_NUM,
      updateKey: 'left',
      value: DRAG_REGION_WIDTH - option.width,
      guides: {
        left: DRAG_REGION_WIDTH,
        top: -offsetYInWrap,
        height,
      },
    },
    {
      // 拖拽内容顶部边吸附拖拽区域底部
      condition: Math.abs( DRAG_REGION_HEIGHT - top ) <= ADSORBENT_START_NUM,
      updateKey: 'top',
      value: DRAG_REGION_HEIGHT,
      guides: {
        left: -offsetXInWrap,
        top: DRAG_REGION_HEIGHT,
        width,
      },
    },
    {
      // 拖拽内容中间吸附拖拽区域底部
      condition: Math.abs( DRAG_REGION_HEIGHT - ( top + option.height / 2 ) ) <= ADSORBENT_START_NUM,
      updateKey: 'top',
      value: DRAG_REGION_HEIGHT - option.height / 2,
      guides: {
        left: -offsetXInWrap,
        top: DRAG_REGION_HEIGHT,
        width,
      },
    },
    {
      // 拖拽内容低部边吸附拖拽区域底部
      condition: Math.abs( DRAG_REGION_HEIGHT - ( top + option.height ) ) <= ADSORBENT_START_NUM,
      updateKey: 'top',
      value: DRAG_REGION_HEIGHT - option.height,
      guides: {
        left: -offsetXInWrap,
        top: DRAG_REGION_HEIGHT,
        width,
      },
    },
    {
      // 拖拽内容左边吸附拖拽区域中间
      condition: Math.abs( left - DRAG_REGION_WIDTH / 2 ) <= ADSORBENT_START_NUM,
      updateKey: 'left',
      value: DRAG_REGION_WIDTH / 2,
      guides: {
        left: DRAG_REGION_WIDTH / 2,
        top: -( height - DRAG_REGION_HEIGHT ) / 2,
        height,
      },
    },
    {
      // 拖拽内容中间吸附拖拽区域中间
      condition: Math.abs( left + option.width / 2 - DRAG_REGION_WIDTH / 2 ) <= ADSORBENT_START_NUM,
      updateKey: 'left',
      value: DRAG_REGION_WIDTH / 2 - option.width / 2,
      guides: {
        left: DRAG_REGION_WIDTH / 2,
        top: -( height - DRAG_REGION_HEIGHT ) / 2,
        height,
      },
    },
    {
      // 拖拽内容右边吸附拖拽区域中间
      condition: Math.abs( left + option.width - DRAG_REGION_WIDTH / 2 ) <= ADSORBENT_START_NUM,
      updateKey: 'left',
      value: DRAG_REGION_WIDTH / 2 - option.width,
      guides: {
        left: DRAG_REGION_WIDTH / 2,
        top: -( height - DRAG_REGION_HEIGHT ) / 2,
        height,
      },
    },
    {
      // 拖拽内容顶部吸附拖拽区域中间
      condition: Math.abs( top - DRAG_REGION_HEIGHT / 2 ) <= ADSORBENT_START_NUM,
      updateKey: 'top',
      value: DRAG_REGION_HEIGHT / 2,
      guides: {
        left: -offsetXInWrap,
        top: DRAG_REGION_HEIGHT / 2,
        width,
      },
    },
    {
      // 拖拽内容中间吸附拖拽区域中间
      condition: Math.abs( top + option.height / 2 - DRAG_REGION_HEIGHT / 2 ) <= ADSORBENT_START_NUM,
      updateKey: 'top',
      value: DRAG_REGION_HEIGHT / 2 - option.height / 2,
      guides: {
        left: -offsetXInWrap,
        top: DRAG_REGION_HEIGHT / 2,
        width,
      },
    },
    {
      // 拖拽内容底部吸附拖拽区域中间
      condition: Math.abs( top + option.height - DRAG_REGION_HEIGHT / 2 ) <= ADSORBENT_START_NUM,
      updateKey: 'top',
      value: DRAG_REGION_HEIGHT / 2 - option.height,
      guides: {
        left: -offsetXInWrap,
        top: DRAG_REGION_HEIGHT / 2,
        width,
      },
    },
  ];
  arr.forEach( item => {
    if ( item.condition ) {
      obj[item.updateKey] = item.value;
      if ( item.guides ) {
        guidesArr.push( item.guides )
      };
    }
  } );
  return guidesArr;
}

function adsorptionBetweenComponentsY( obj, option, style, guidesLeft ) {
  const { top } = obj;
  let guidesTop = style.top;
  let guidsHeight = top - style.top + option.height;
  let $spacingAndSize = top - style.top;
  let $spacing = top - ( style.top + style.height );
  if ( top < style.top ) {
    guidesTop = top;
    guidsHeight = style.top - top + style.height;
    $spacingAndSize = style.top - top;
    $spacing = style.top - ( top + option.height );
  }
  return {
    left: guidesLeft,
    top: guidesTop,
    height: guidsHeight,
    $spacing: $spacing.toFixed( 2 ),
    $spacingAndSize: $spacingAndSize.toFixed( 2 ),
  };
}
function adsorptionBetweenComponentsX( obj, option, style, guidesTop ) {
  const { left } = obj;
  let guidesLeft = style.left;
  let guidsWidth = left - style.left + option.width;
  let $spacingAndSize = left - style.left;
  let $spacing = left - ( style.left + style.width );
  if ( left < style.left ) {
    guidesLeft = left;
    guidsWidth = style.left - left + style.width;
    $spacingAndSize = style.left - left;
    $spacing = style.left - ( left + option.width );
  }
  return {
    left: guidesLeft,
    top: guidesTop,
    width: guidsWidth,
    $spacing: $spacing.toFixed( 2 ),
    $spacingAndSize: $spacingAndSize.toFixed( 2 ),
  };
}
/**
 * @exports
 * @example 组件之间吸附处理
 * @param {object} obj {left,top} 当前位置
 * @param {object} option 移动元素参数
 * @param {array} componentData 组件参数集合
 * @returns
 */
export function adsorptionBetweenComponents( obj, option, componentData ) {
  const guidesArr = [];
  const { left, top } = obj;
  componentData.forEach( item => {
    if ( item.id === option.id || !item.isView || item.inCombination ) return;
    const { style = {} } = item;
    /* x轴吸附开始 */
    // 拖拽组件左边与其他组件左边吸附
    if ( Math.abs( style.left - left ) <= ADSORBENT_START_NUM ) {
      obj.left = style.left;
      guidesArr.push( adsorptionBetweenComponentsY( obj, option, style, style.left ) );
    }
    // 拖拽组件中间与其他组件左边吸附
    if ( Math.abs( style.left - ( left + option.width / 2 ) ) <= ADSORBENT_START_NUM ) {
      obj.left = style.left - option.width / 2;
      guidesArr.push( adsorptionBetweenComponentsY( obj, option, style, style.left ) );
    }
    // 拖拽组件右边与其他组件左边吸附
    if ( Math.abs( style.left - ( left + option.width ) ) <= ADSORBENT_START_NUM ) {
      obj.left = style.left - option.width;
      guidesArr.push( adsorptionBetweenComponentsY( obj, option, style, style.left ) );
    }
    // 拖拽组件左边与其他组件中间吸附
    if ( Math.abs( style.left + style.width / 2 - left ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.left + style.width / 2;
      obj.left = guidesLeft;
      guidesArr.push( adsorptionBetweenComponentsY( obj, option, style, guidesLeft ) );
    }
    // 拖拽组件中间与其他组件中间吸附
    if ( Math.abs( style.left + style.width / 2 - ( left + option.width / 2 ) ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.left + style.width / 2;
      obj.left = style.left + style.width / 2 - option.width / 2;
      guidesArr.push( adsorptionBetweenComponentsY( obj, option, style, guidesLeft ) );
    }

    // 拖拽组件右边与其他组件中间吸附
    if ( Math.abs( style.left + style.width / 2 - ( left + option.width ) ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.left + style.width / 2;
      obj.left = style.left + style.width / 2 - option.width;
      guidesArr.push( adsorptionBetweenComponentsY( obj, option, style, guidesLeft ) );
    }

    // 拖拽组件左边与其他组件右边吸附
    if ( Math.abs( style.left + style.width - left ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.left + style.width;
      obj.left = guidesLeft;
      guidesArr.push( adsorptionBetweenComponentsY( obj, option, style, guidesLeft ) );
    }
    // 拖拽组件中间与其他组件右边吸附
    if ( Math.abs( style.left + style.width - ( left + option.width / 2 ) ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.left + style.width - option.width / 2;
      obj.left = guidesLeft;
      guidesArr.push( adsorptionBetweenComponentsY( obj, option, style, style.left + style.width ) );
    }
    // 拖拽组件右边与其他组件右边吸附
    if ( Math.abs( style.left + style.width - ( left + option.width ) ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.left + style.width - option.width;
      obj.left = guidesLeft;
      guidesArr.push( adsorptionBetweenComponentsY( obj, option, style, style.left + style.width ) );
    }
    /* x轴吸附结束 */
    /* y轴吸附开始 */
    // 拖拽组件顶部与其他组件顶部吸附
    if ( Math.abs( style.top - top ) <= ADSORBENT_START_NUM ) {
      obj.top = style.top;
      guidesArr.push( adsorptionBetweenComponentsX( obj, option, style, style.top ) );
    }
    // 拖拽组件中间与其他组件顶部吸附
    if ( Math.abs( style.top - ( top + option.height / 2 ) ) <= ADSORBENT_START_NUM ) {
      obj.top = style.top - option.height / 2;
      guidesArr.push( adsorptionBetweenComponentsX( obj, option, style, style.top ) );
    }
    // 拖拽组件底部与其他组件顶部吸附
    if ( Math.abs( style.top - ( top + option.height ) ) <= ADSORBENT_START_NUM ) {
      obj.top = style.top - option.height;
      guidesArr.push( adsorptionBetweenComponentsX( obj, option, style, style.top ) );
    }

    // 拖拽组件顶部与其他组件中间吸附
    if ( Math.abs( style.top + style.height / 2 - top ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.top + style.height / 2;
      obj.top = guidesLeft;
      guidesArr.push( adsorptionBetweenComponentsX( obj, option, style, guidesLeft ) );
    }
    // 拖拽组件中间与其他组件中间吸附
    if ( Math.abs( style.top + style.height / 2 - ( top + option.height / 2 ) ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.top + style.height / 2;
      obj.top = style.top + style.height / 2 - option.height / 2;
      guidesArr.push( adsorptionBetweenComponentsX( obj, option, style, guidesLeft ) );
    }

    // 拖拽组件底部与其他组件中间吸附
    if ( Math.abs( style.top + style.height / 2 - ( top + option.height ) ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.top + style.height / 2;
      obj.top = style.top + style.height / 2 - option.height;
      guidesArr.push( adsorptionBetweenComponentsX( obj, option, style, guidesLeft ) );
    }

    // 拖拽组件顶部与其他组件低边吸附
    if ( Math.abs( style.top + style.height - top ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.top + style.height;
      obj.top = guidesLeft;
      guidesArr.push( adsorptionBetweenComponentsX( obj, option, style, guidesLeft ) );
    }
    // 拖拽组件中间与其他组件低边吸附
    if ( Math.abs( style.top + style.height - ( top + option.height / 2 ) ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.top + style.height - option.height / 2;
      obj.top = guidesLeft;
      guidesArr.push( adsorptionBetweenComponentsX( obj, option, style, style.top + style.height ) );
    }
    // 拖拽组件低边与其他组件低边吸附
    if ( Math.abs( style.top + style.height - ( top + option.height ) ) <= ADSORBENT_START_NUM ) {
      const guidesLeft = style.top + style.height - option.height;
      obj.top = guidesLeft;
      guidesArr.push( adsorptionBetweenComponentsX( obj, option, style, style.top + style.height ) );
    }
  } );

  return guidesArr;
}

/**
 * @exports 自定义参考线吸附
* @param {object} obj {left,top} 当前位置
 * @param {object} option 移动元素参数
 * @param {array} data 参考线集合
 * @returns
 */
export function customReferenceLineAdsorption( obj, option, data ) {
  if ( !data?.length ) return;
  const { left, top } = obj;
  const { width, height } = option;
  data.forEach( item => {
    // X轴组件左边靠近参考线
    if ( Math.abs( item.left - left ) <= ADSORBENT_START_NUM ) {
      obj.left = item.left;
    }
    // X轴组件中间靠近参考线
    if ( Math.abs( item.left - ( left + width / 2 ) ) <= ADSORBENT_START_NUM ) {
      obj.left = item.left - width / 2;
    }
    // X轴组件右边靠近参考线
    if ( Math.abs( item.left - ( left + width ) ) <= ADSORBENT_START_NUM ) {
      obj.left = item.left - width;
    }

    // Y轴组件顶部靠近参考线
    if ( Math.abs( item.top - top ) <= ADSORBENT_START_NUM ) {
      obj.top = item.top;
    }
    // Y轴组件中间靠近参考线
    if ( Math.abs( item.top - ( top + height / 2 ) ) <= ADSORBENT_START_NUM ) {
      obj.top = item.top - height / 2;
    }
    // Y轴组件底部靠近参考线
    if ( Math.abs( item.top - ( top + height ) ) <= ADSORBENT_START_NUM ) {
      obj.top = item.top - height;
    }
  } );
}
export default { editAreaAdsorbent, adsorptionBetweenComponents, customReferenceLineAdsorption };
