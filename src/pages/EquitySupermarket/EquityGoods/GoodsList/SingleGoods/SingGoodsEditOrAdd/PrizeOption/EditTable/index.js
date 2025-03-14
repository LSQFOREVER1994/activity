/* eslint-disable no-useless-escape */
/* eslint-disable no-restricted-globals */
import React, { useContext, useRef, useState, useEffect } from "react";
import { Form, InputNumber, Table } from 'antd';

import styles from './index.less';

const limitDecimals = ( value ) => {
  const reg = /^(\-)*(\d+).(\d\d\d).*$/;
  if ( typeof value === 'string' ) {
    return !isNaN( Number( value ) ) ? value.replace( reg, '$1$2.$3' ) : ''
  } if ( typeof value === 'number' ) {
    return !isNaN( value ) ? String( value ).replace( reg, '$1$2.$3' ) : ''
  }
  return ''
};

const EditableContext = React.createContext( null )
const EditableRow = ( { form, index, ...props } ) => {
  return (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
  )
};
const EditableFormRow = Form.create()( EditableRow );

const EditableCell = ( data ) => {
  const {
    editable,
    dataIndex,
    title,
    record,
    index,
    handleSave,
    children,
    ...restProps
  } = data;

  const [editing, setEditing] = useState( false )
  const inputRef = useRef( null )
  const form = useContext( EditableContext )

  useEffect( () => {
    if ( editing ) inputRef.current.focus()
  }, [editing] );

  const toggleEdit = () => {
    setEditing( !editing )
  };

  const save = ( e ) => {
    form.validateFields( ( error, values ) => {
      if ( error && error[e.currentTarget.id] ) {
        console.log( '表格编辑保存失败:', error )
        return;
      }
      toggleEdit();
      handleSave( e.currentTarget.id, { ...record, ...values } );
    } );
  };

  const renderCell = () => {
    let childNode = (
      <div
        className={styles['editable-cell-value-wrap']}
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
    if ( editing ) {
      childNode = (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator( dataIndex, {
            rules: [
              {
                required: true,
                message: `请设置概率`,
              },
            ],
            initialValue: record[dataIndex],
          } )(
            <InputNumber
              ref={inputRef}
              onPressEnter={save}
              onBlur={save}
              min={0}
              max={100}
              formatter={limitDecimals}
              parser={limitDecimals}
            />
          )}
        </Form.Item>
      )
    }

    return childNode

  }

  return (
    <td {...restProps}>
      {editable ? (
        <EditableContext.Consumer>
          {renderCell}
        </EditableContext.Consumer>
      ) : (
        children
      )}
    </td>
  )
}

const EditTable = ( props ) => {
  const { columns = [], dataSource = [], handleSave } = props

  const components = {
    body: {
      row: EditableFormRow,
      cell: EditableCell,
    },
  };

  const tableColumns = columns.map( item => {
    if ( !item.editable ) return item;
    return {
      ...item,
      onCell: ( record ) => {
        // 合计行不展示可编辑输入框
        if ( record && record.prizeVirtualId && record.prizeVirtualId === 'total_row' ){
          return null
        }
        return {
          record,
          editable: item.editable,
          dataIndex: item.dataIndex,
          title: item.title,
          handleSave,
        }
      },
    };
  } );

  return (
    <Table
      {...props}
      components={components}
      dataSource={dataSource}
      columns={tableColumns}
    />
  )
}

export default EditTable;
