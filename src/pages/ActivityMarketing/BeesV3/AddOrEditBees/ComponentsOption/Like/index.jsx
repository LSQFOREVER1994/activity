

import React from 'react'
import RenderFormItem from '../RenderFormItem'
import styles from './index.less'
import { LikeSvg, LoveSvg, FlowerSvg } from './likeIcons'

/**
 *
 * @returns 点赞组件
 */
function Like( { componentsData, changeValue } ) {
  const { likeColor, unLikeColor, likeIcon, likeStyle } =componentsData
  const renderListTop = [
    {
      renderType: 'Radio',
      label: '点赞样式',
      field: 'likeStyle',
      flex: true,
      required: true,
      radioList: [
        {
          label: '默认',
          value: 'DEFAULT',
        },
        {
          label: '自定义',
          value: 'CUSTOM',
        },
      ],
    },
    {
      renderType: 'UploadModal',
      field: 'customLikeIcon',
      label: '激活图标',
      required: true,
      tips: {
        text:['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
      conditionalRendering: ( cmpData ) => cmpData.likeStyle === 'CUSTOM'
    },
    {
      renderType: 'UploadModal',
      field: 'customUnLikeIcon',
      label: '未激活图标',
      required: true,
      tips: {
        text:['图片尺寸比例建议1:1', '图片大小建议不大于1M'],
      },
      conditionalRendering: ( cmpData ) => cmpData.likeStyle === 'CUSTOM'

    },
  ]
  const renderListBottom = [
    {
      renderType: 'SketchPicker',
      field: 'likeColor',
      label: '激活颜色',
      flex: 1,
      conditionalRendering: ( cmpData ) => cmpData.likeStyle === 'DEFAULT'
    },
    {
      renderType: 'SketchPicker',
      field: 'unLikeColor',
      label: '未激活颜色',
      flex: 1,
      conditionalRendering: ( cmpData ) => cmpData.likeStyle === 'DEFAULT'
    },
    {
      renderType: 'Switch',
      label: '是否可以取消点赞',
      field: 'canCancel',
      flex:true,
    },
    {
      renderType: 'Switch',
      label: '是否展示点赞数',
      field: 'showLikeCount',
      flex: true,
    },
    {
      renderType: 'InputNumber',
      field: 'initLikeCount',
      label: '初始点赞数量',
      flex: 1,
      propsData: {
        min: 0,
        precision: 0,
        parser: text => Number( text.replace( /[^0-9]/g, '' ) )
      }
    },
  ]

  const setIconType = ( type ) => {
      changeValue( type, 'likeIcon' )
  }

  const renderLikeIcon = () => {
    return (
      <div className={styles.icon_container}>
        <div onClick={() => setIconType( 'like' )}>
          <LikeSvg
            color={( likeIcon === 'like' ) ? likeColor : unLikeColor}
          />
        </div>
        <div onClick={() => setIconType( 'love' )}>
          <LoveSvg
            color={( likeIcon === 'love' )  ? likeColor : unLikeColor}
          />
        </div>
        <div onClick={() => setIconType( 'flower'  )}>
          <FlowerSvg
            color={( likeIcon === 'flower' ) ? likeColor : unLikeColor}
            onClick={() => setIconType( 'flower'  )}
          />
        </div>
      </div>
    )
  }
  return (
    <>
      <RenderFormItem renderList={renderListTop} />
      {likeStyle === 'DEFAULT' && renderLikeIcon()}
      <RenderFormItem renderList={renderListBottom} />
    </>
  )
}

export default Like