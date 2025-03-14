/* eslint-disable import/no-unresolved */
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import BraftEditor from 'braft-editor';
import ColorPicker from 'braft-extensions/dist/color-picker'
import { ContentUtils } from 'braft-utils';
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/rubyblue.css';
import 'codemirror/addon/selection/active-line';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars';
import { Icon, Modal } from 'antd';
import UploadImg from '@/components/UploadImg';
import styles from './BraftEditor.less';

const beautifyHtml = require( 'js-beautify' ).html;

BraftEditor.use( ColorPicker( {
  includeEditors: ['editor-with-color-picker'],
  theme: 'light' // 支持dark和light两种主题，默认为dark
} ) )

class BraftEditorComponent extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      noOnBlur: false,
      editHtml: false,
      htmlText: '',
      htmlTextInput: '',
      showEditorFixed: false,
      editorState: BraftEditor.createEditorState( props.record ),
    };
    console.log( props.record, '=========' )
  }

  componentWillReceiveProps( nextProps ) {
    // Should be a controlled component.
    if ( this.props.id !== nextProps.id ) {
      const { record } = nextProps;
      this.setState( {
        editorState: BraftEditor.createEditorState( record ),
      } );
    }
  }

  handleChange = ( editorState ) => {
    this.setState( { editorState } );
    this.triggerChange( editorState.toHTML() );
  }

  triggerChange = ( changedValue ) => {
    const { onChange } = this.props;
    if ( onChange ) {
      onChange( changedValue );
    }
  }

  uploadHandler = ( param ) => {
    if ( !param ) {
      return false;
    }

    this.setState( {
      editorState: ContentUtils.insertMedias( this.state.editorState, [{
        type: 'IMAGE',
        url: param,
      }] ),
    } );
    return true;
  }

  preview = () => {
    if ( window.previewWindow ) {
      window.previewWindow.close();
    }

    window.previewWindow = window.open();
    window.previewWindow.document.write( this.buildPreviewHtml() );
    window.previewWindow.document.close();
  }

  uploadImgFunc = () => {
    this.setState( { noOnBlur: true } )
  }

  onBlur = ( editorState ) => {
    const { noOnBlur } = this.state;
    if ( !noOnBlur ) {
      const { onBlur } = this.props;
      if ( onBlur ) {
        onBlur( editorState.toHTML() )
      }
    }

    this.setState( { showEditorFixed: true, noOnBlur: false } );
  }

  onClickFunc = ( e ) => {
    e.preventDefault();
    this.setState( { showEditorFixed: false } );
  }

  buildPreviewHtml = () => {
    return `
      <!Doctype html>
      <html>
        <head>
          <title>Preview Content</title>
          <style>
            html,body{
              height: 100%;
              margin: 0;
              padding: 0;
              overflow: auto;
              background-color: #f1f2f3;
            }
            .container{
              box-sizing: border-box;
              width: 100%;
              max-width: 1120px;
              min-height: 100%;
              margin: 0 auto;
              overflow: hidden;
              background-color: #fff;
              border-right: solid 1px #eee;
              border-left: solid 1px #eee;
            }
            .container img,
            .container audio,
            .container video{
              max-width: 100%;
              margin: 0 auto;
              height: auto;
            }
            .container p{
              white-space: pre-wrap;
              min-height: 1em;
            }
            .container pre{
              padding: 15px;
              background-color: #f1f1f1;
              border-radius: 5px;
            }
            .container blockquote{
              margin: 0;
              padding: 15px;
              background-color: #f1f1f1;
              border-left: 3px solid #d1d1d1;
            }
            .container .image-wrap img{
              display: block; /*用于消除图片默认的下边距，或者用line-height:0;也行*/
            }
            .container .image-wrap + p:empty{
              display: none;
            }
            .container p:first-child:empty{
              display:none
            }
          </style>
        </head>
        <body>
          <div class="container">${this.state.editorState.toHTML()}</div>
        </body>
      </html>
    `;
  }

  addHtml = () => {
    const { editorState } = this.state;
    this.setState( {
      htmlTextInput: editorState.toHTML(),
      editHtml: true,
      htmlText: beautifyHtml( editorState.toHTML() ),
    } );
  }

  handleCancel = () => {
    this.setState( {
      editHtml: false,
    } );
  }

  handleOk = () => {
    const { htmlTextInput } = this.state;
    this.setState( {
      editHtml: false,
      editorState: BraftEditor.createEditorState( htmlTextInput ),
    } );
  }

  changeHtml = ( editor, data, value ) => {
    this.setState( {
      htmlTextInput: value,
    } );
  }

  render() {
    const {
      showEditorFixed, editHtml, htmlText,
    } = this.state;
    const { readOnly } = this.props;
    const extendControls = [
      {
        key: 'custom-html',
        type: 'button',
        text: <span style={{ color: '#1890FF' }}>HTML</span>,
        onClick: this.addHtml,
      },
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <UploadImg
            fileList={[]}
            style={{ height: '36px' }}
            CancelFunc={this.CancelFunc}
            PreviewFunc={this.PreviewFunc}
            onChange={this.uploadHandler}
            className={styles.uploadImg}
            id='editer'
            noEditImg
          >
            <button
              type="button"
              className="control-item button upload-button"
              data-title="插入图片"
            // onClick={this.uploadImgFunc}
            >
              <Icon type="picture" theme="filled" />
            </button>
          </UploadImg>
        ),
      },
      // {
      //   key: 'custom-button',
      //   type: 'button',
      //   text: '预览',
      //   onClick: this.preview,
      // },
    ];

    return (
      <div className={styles.editor}>
        <div className="editor-wrapper" style={{ border: "1px solid #d9d9d9" }}>
          <BraftEditor
            id="editor-with-color-picker"
            value={this.state.editorState}
            onChange={this.handleChange}
            placeholder={this.props.placeholder}
            // onBlur={this.onBlur}
            excludeControls={['media']}
            extendControls={extendControls}
            contentStyle={{ height: 400, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)', ...this.props.contentStyle }}
            readOnly={readOnly}
          />
        </div>
        {
          editHtml && (
            <Modal
              key="change_code"
              width="60%"
              title="HTML"
              visible
              onOk={this.handleOk}
              onCancel={this.handleCancel}
            >
              <CodeMirror
                ref={( codeMirror ) => { this.codeMirror = codeMirror; }}
                value={htmlText}
                options={{
                  mode: 'htmlmixed',
                  theme: 'rubyblue',
                  tabSize: 2,
                  autoCursor: true,
                  lineWrapping: true,
                  matchBrackets: true,
                  lineNumbers: true,
                  styleActiveLine: true,
                  scrollbarStyle: 'simple',
                }}
                onChange={this.changeHtml}
              />
            </Modal>
          )
        }
        <div onClick={this.onClickFunc} className={styles.editorFixed} hidden={!showEditorFixed}>
          {/* <button onClick={this.onClickFunc} type="button">点我编辑</button> */}
        </div>
      </div>
    );
  }
}

export default connect()( BraftEditorComponent );
