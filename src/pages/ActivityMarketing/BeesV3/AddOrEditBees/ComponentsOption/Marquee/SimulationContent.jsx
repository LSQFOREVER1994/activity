import React from 'react';
import { Empty, Form, Input, Popconfirm, Button, Collapse } from 'antd';
import styles from './simulationContent.less';

const FormItem = Form.Item;

function SimulationContent( { componentsData, changeValue } ) {
  const { records } = componentsData;
  const addRecordItem = () => {
    records.push( '' );
    changeValue( records, 'records' );
  };

  const onDelete = idx => {
    records.splice( idx, 1 );
    changeValue( records, 'records' );
  };


  const renderList = () => {
    if ( !records?.length ) {
        return (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无仿真记录，请去添加仿真记录" />
        );
    }
    return records.map( ( info, index ) => (
      // eslint-disable-next-line react/no-array-index-key
      <FormItem label={`内容${index + 1}`} key={index}>
        <Input
          value={info}
          placeholder="请输入仿真内容"
          onChange={e =>changeValue( e, `records[${index}]` )}
          maxLength={30}
          style={{ width: '85%' }}
        />

        <Popconfirm
          title="确定删除该仿真记录吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={() => onDelete( index )}
        >
          <span className={styles.simulationContentDelText}>删除</span>
        </Popconfirm>
      </FormItem>
      ) )
  };

  return (
    <Collapse
      defaultActiveKey="1"
      style={{ marginBottom: '20px' }}
    >
      <Collapse.Panel header="仿真记录" key="1">
        {renderList()}
        <p>* 仿真记录内容过长可能会被省略部分内容</p>
        <Button
          type="dashed"
          icon="plus"
          onClick={addRecordItem}
          className={styles.simulationContentButton}
        >
          添加仿真记录
        </Button>
      </Collapse.Panel>
    </Collapse>
  );
}
export default SimulationContent;
