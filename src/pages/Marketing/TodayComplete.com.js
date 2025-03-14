import React from "react";
import { Icon } from "antd";
import styles from './index.less'

const list = [
  { time: '2020-02-20 14:30', content: '您新建了活动‘新年锦鲤’', status: '待处理' },
  { time: '2020-02-21 14:30', content: '您到处了商城订单', status: '待处理' },
  { time: '2020-02-22 14:30', content: '您到处了商城订单', status: '待处理' },
  { time: '2020-02-23 14:30', content: '您编辑了运营资源位', status: '待处理' },
]
class TodoList extends React.PureComponent {
  render() {
    return (
      <div className={styles.todo_list}>
        {list && list.length > 0 &&
          <div className={styles.todo_list_clear}><Icon type="delete" />清空</div>
        }        {
          list && list.length > 0 &&
          list.map( item =>
            <div className={styles.todo_item} style={{ justifyContent:'start' }}>
              <span style={{ marginRight:15 }}>{item.time.substring( 5 )}</span>
              <span className={styles.todo_item_content}>{item.content}</span>
            </div> )
        }
      </div>
    )
  }
}

export default TodoList