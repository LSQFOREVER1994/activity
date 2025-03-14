import React from "react";
import { Icon } from "antd";
import styles from './index.less'

const list = [
  { time: '2020-02-20 14:30', content: '有一笔退款待处理', status: '待处理' },
  { time: '2020-02-21 14:30', content: '有一笔退款待处理', status: '待处理' },
  { time: '2020-02-22 14:30', content: '有一笔退款待处理', status: '待处理' },
  { time: '2020-02-23 14:30', content: '有一笔退款待处理', status: '待处理' },
]
class TodoList extends React.PureComponent {
  render() {
    return (
      <div className={styles.todo_list}>
        {list && list.length > 0 && 
          <div className={styles.todo_list_clear}><Icon type="delete" />清空</div>
        }
        {
          list && list.length > 0 && 
          list.map( item => 
            <div className={styles.todo_item}>
              <span>{item.time.substring( 5 )}</span>
              <span className={styles.todo_item_content}>{item.content}</span>
              <span className={styles.todo_item_status}>&gt;&gt;{item.status}</span>
            </div> )
        }
      </div>
    )
  }
}

export default TodoList