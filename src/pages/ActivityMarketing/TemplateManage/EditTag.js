/* eslint-disable no-return-assign */
import React, { PureComponent } from 'react'
import { Tag, Input, Tooltip, Icon, message } from 'antd';
import styles from './templateManage.less'

class EditTag extends PureComponent {
  state = {
    inputVisible: false,
    inputValue: '',
  };

  handleClose = removedTag => {
    const { changeTags } = this.props;
    const tags = this.props.tags.filter( tag => tag !== removedTag );
    changeTags( tags );
    
  };

  showInput = () => {
    const { tags } = this.props;
    const isLong = tags.length > 2
    if( isLong ){
      message.error( '已达标签设置的数量上限 !' )
      return
    }
    this.setState( { inputVisible: true }, () => this.input.focus() );
  };

  handleInputChange = e => {
    this.setState( { inputValue: e.target.value } );
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { tags, changeTags } = this.props;
    let newTags = JSON.parse( JSON.stringify( tags ) )
    if ( inputValue && newTags.indexOf( inputValue ) === -1 ) {
      newTags = [...newTags, inputValue];
    }
    changeTags( newTags )
    this.setState( {
      inputVisible: false,
      inputValue: '',
    } );
  };

  saveInputRef = input => ( this.input = input );

  render() {
    const { inputVisible, inputValue } = this.state;
    const { tags } = this.props;
    return (
      <div className={styles.tagBox}>
        <div className={styles.tagsShowBox}>
          {tags && tags.map( ( tag ) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable onClose={() => this.handleClose( tag )} style={{ background: 'rgb(216,178,105)', color: '#fff' }}>
              {isLongTag ? `${tag.slice( 0, 20 )}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        } )}
          {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            maxLength={3}
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
          {!inputVisible && (
          <Tag onClick={this.showInput} style={{ background: 'rgb(216,178,105)', color: '#fff', cursor: 'pointer' }}>
            <Icon type="plus" />新建标签
          </Tag>
        )}
        </div>
      </div>
    );
  }
}

export default EditTag;