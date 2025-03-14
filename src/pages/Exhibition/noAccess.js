import React from "react";
import { Icon } from "antd";
import IconFont from '@/components/IconFont';
import { isUrl } from '@/utils/utils';
import styles from './exhibition.less'

const getIcon = icon => {
  if ( typeof icon === 'string' ) {
    if ( isUrl( icon ) ) {
      return <Icon component={() => <img src={icon} alt="icon" className={styles.icon} />} />;
    }
    if ( icon.startsWith( 'icon-' ) ) {
      return <IconFont type={icon} />;
    }
    return <Icon type={icon} />;
  }
  return icon;
}

// eslint-disable-next-line react/prefer-stateless-function
class NoAccess extends React.Component{
  render(){
    return(
      <div className={styles.noAccess}>
        <p className={styles.notData}>{getIcon( 'icon-wuquanxian' )}</p>
        <p>暂无无权限</p>
      </div>
    )
  }
}

export default NoAccess