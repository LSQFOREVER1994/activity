import React, { PureComponent } from 'react';
import { Upload, Button, message } from 'antd';
import UploadFileRequest from './UploadFileRequest';
import 'cropperjs/dist/cropper.css';
import './uploadImg.less';
/*  eslint-disable  react/no-string-refs,  no-param-reassign,  no-cond-assign, no-nested-ternary */

//  图片上传
//  ChangeFunc  ->  上传改变
//  accept  ->  上传类型


if ( !HTMLCanvasElement.prototype.toBlob ) {
  Object.defineProperty( HTMLCanvasElement.prototype, 'toBlob', {
    value( callback, type, quality ) {
      const CAN = this;
      setTimeout( () => {
        const binStr = atob( CAN.toDataURL( type, quality ).split( ',' )[1] );
        const len = binStr.length;
        const arr = new Uint8Array( len );
        for ( let i = 0; i < len; i += 1 ) {
          arr[i] = binStr.charCodeAt( i );
        }

        callback( new Blob( [arr], { type: type || 'image/png' } ) );
      } );
    }
  } );
}

class UploadFile extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      uploading: false,
    };
  }

  requestUpload = ( { formData, file } ) => { // 文件上传
    const { ChangeFunc = this.ChangeFunc, categoryId, libraryType } = this.props;
    UploadFileRequest( {
      formData,
      file,
      categoryId,
      libraryType,
      parentFunc: ( res ) => {
        this.setState( {
          uploading: false,
        } );
        ChangeFunc( res );
      },
      parentFailFunc: () => {
        this.setState( { uploading: false } );
      }
    } )
  };

  // 上传图片改变
  ChangeFunc = ( res ) => {
    if ( this.props.onChange ) {
      this.props.onChange( res.url );
    }
  }

  // 删除上传的图片
  RemoveFunc = () => {
    if ( this.props.onChange ) {
      this.props.onChange( '' );
    }
  }


  // beforeUpload
  customRequest = ( file ) => {
    const { accept } = this.props
    const { lastModified, name } = file;
    let maxSize 
    if( accept === 'audio/mp3' ){
        maxSize = 10 * 1024 * 1024 
        if( name.substring( name.length - 3 ) !== 'mp3' ){
          message.error( '文件格式类型不是mp3' )
          return false
        }
    }else if( accept === 'video/mp4' ) {
      maxSize = 100 * 1024 * 1024 
      if( name.substring( name.length - 3 ) !== 'mp4' ){
        message.error( '文件格式类型不是mp4' )
        return false
      }
    }
    if( file.size > maxSize ) {
      message.error( `文件大小不能超过${maxSize / ( 1024 * 1024 )}M` );
      return false
    }
    this.setState( { uploading: true } );
    const formData = new FormData();
      if ( lastModified ) {
        formData.append( "file", file ); // 文件对象
      } else {
        formData.append( "file", file, name );
      }
      this.requestUpload( { formData, file } );
      return true
  };


  render() {
    const {
      fileList = [],
      style = {},
      value = "",
      RemoveFunc = this.RemoveFunc,
      PreviewFunc = this.PreviewFunc,
      className,
      children,
      listType = "picture-card",
      disabled=false,
      accept="audio/mp3,video/mp4"
    } = this.props;
    if ( value && !this.props.fileList ) {
      fileList[0] = { uid: value, url: value };
    }
    const {
      uploading,
    } = this.state;
    return (
      <div className={`${className} uploadImgBtn`} style={Object.assign( { height: 'auto' }, style )}>
        <Upload
          listType={listType}
          fileList={fileList}
          beforeUpload={this.customRequest}
          onPreview={PreviewFunc}
          onRemove={RemoveFunc}
          disabled={disabled || uploading}
          accept={accept}
          style={{ width: 'auto', height: 'auto', background: 'none', border: 'none' }}
        >
          {children || <Button type='primary' loading={uploading}>上传文件</Button>}
        </Upload>
      </div>
    );
  }
}

export default UploadFile;
