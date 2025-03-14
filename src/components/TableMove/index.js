import React from 'react';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { Table } from 'antd';

let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if ( isOver ) {
      if ( restProps.index > dragingIndex ) {
        className += ' drop-over-downward';
      }
      if ( restProps.index < dragingIndex ) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget( <tr {...restProps} className={className} style={style} /> ),
    );
  }
}

const rowSource = {
  beginDrag( props ) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop( props, monitor ) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if ( dragIndex === hoverIndex ) {
      return;
    }
    props.moveRow( dragIndex, hoverIndex );
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget( 'row', rowTarget, ( connect, monitor ) => ( {
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
} ) )(
  DragSource( 'row', rowSource, connect => ( {
    connectDragSource: connect.dragSource(),
  } ) )( BodyRow ),
);


const DragSortingTable=( { listTypeStr, dataSource, tableStting, changeValue } )=>{
  const  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  const moveRow = ( dragIndex, hoverIndex ) => {
    const dragRow = dataSource[dragIndex];
    const arr = update( { list: dataSource }, {
      list: {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
      },
    } ).list
    if( changeValue && listTypeStr )changeValue( [...arr], listTypeStr )
  };

  return(
    <DndProvider backend={HTML5Backend}>
      <Table
        {...tableStting}
        dataSource={dataSource}
        components={components}
        onRow={( record, index ) => ( {
          index,
          moveRow,
        } )}
      />
    </DndProvider>
  )
}

export default DragSortingTable