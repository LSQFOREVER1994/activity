import React, {  } from "react";
import DragSelection from "./DragSelection";
import DragEdit from "./DragEdit";
import DragOption from "./DragOption";
import styles from './index.less'

function BodyContent() {
    return (
      <div className={styles.bodyContentWrap}>
        <DragSelection />
        <DragEdit />
        <DragOption />
      </div>
    )
}
export default BodyContent