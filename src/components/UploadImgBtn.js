import React, { PureComponent } from 'react';
import { Modal, Icon, Upload, message, Tooltip, Button } from 'antd';
import Cropper from 'react-cropper';
import UploadFileRequest from './UploadFileRequest';
import 'cropperjs/dist/cropper.css';
import './uploadImg.less';
/*  eslint-disable  react/no-string-refs,  no-param-reassign,  no-cond-assign, no-nested-ternary */
//  无扩展情况 传入 previewImage 图片链接 和  onChange函数回调链接

//  图片上传
//  noEditImg  ->  是否不编辑图片（false：编辑图片（默认）； true：不编辑图片（上传gif图））
//  fileListLength  ->  照片墙的张数
//  fileList  ->  图片列表
//  previewVisible  ->  是否显示大图
//  previewImage  ->  大图的地址
//  PreviewFunc  ->  打开图片预览
//  ChangeFunc  ->  上传图片改变
//  CancelFunc  ->  关闭图片预览
//  RemoveFunc  ->  删除上传的图片
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

class UploadImgBtn extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      uploading: false,
      editImg: false,
      srcCropper: '',
      selectImgName: '',
      selectImgSuffix: '',
      selectImgUid: '',
      imgWidth: '-',
      imgHeight: '-',
      previewVisible: false,
    };
  }

  // 关闭图片预览
  CancelFunc = () => this.setState( { previewVisible: false } );

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

  // 打开图片预览
  PreviewFunc = () => {
    this.setState( {
      previewVisible: true,
    } );
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

  lrzImg = ( file ) => {
    const reader = new FileReader();
    const img = new Image();
    const canvas = document.createElement( 'canvas' );
    const context = canvas.getContext( '2d' );

    reader.onload = ( e ) => {
      img.src = e.target.result;
    };

    if ( file.type.indexOf( "image" ) === 0 ) {
      reader.readAsDataURL( file );
    }

    img.onload = () => {
      //  图片原始尺寸
      const originWidth = img.width;
      const originHeight = img.height;

      //  最大尺寸限制
      const maxWidth = 600;
      const maxHeight = 600 * ( originHeight / originWidth );
      //  目标尺寸
      let targetWidth = originWidth;
      let targetHeight = originHeight;
      //  图片尺寸超过600x600的限制
      if ( ( originWidth > maxWidth ) || ( originHeight > maxHeight ) ) {
        if ( ( originWidth > maxWidth ) ) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round( maxWidth * ( originHeight / originWidth ) );
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round( maxHeight * ( originWidth / originHeight ) );
        }
      }

      // canvas对图片进行缩放
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // console.log( originWidth, originHeight, targetWidth, targetHeight );
      // 清除画布
      context.clearRect( 0, 0, targetWidth, targetHeight );
      // 图片压缩
      context.drawImage( img, 0, 0, targetWidth, targetHeight );
      // canvas转为blob并上传

      canvas.toBlob( ( blob ) => {
        const formData = new FormData();
        formData.append( "file", blob, `${file.name}` );
        this.requestUpload( { formData, file } );
      }, file.type || 'image/png' );
    };
  }

  customRequest = ( file ) => {
    // lrzImg(option);
    const { type, size, lastModified, name } = file;
    this.setState( { uploading: true } );
    const formData = new FormData();
    const staticImgType = 'image/jpeg, image/pjpeg, image/png';
    const isStaticImg = ( staticImgType.indexOf( type ) > -1 );
    // if ( ( size / 1024 > 1025 ) && isStaticImg ) {
    //   // 大于1M，进行压缩上传
    //   this.lrzImg( file );
    // } else {
      // 小于等于1M 原图上传
      if ( lastModified ) {
        formData.append( "file", file ); // 文件对象
      } else {
        formData.append( "file", file, `${name}` );
      }
      this.requestUpload( { formData, file } );
    // }
  };

  handleCancel = () => {
    this.setState( {
      editImg: false,
      srcCropper: '',
      selectImgName: '',
      selectImgSuffix: '',
    } );
  }

  beforeUpload = ( file ) => {
    let { noEditImg = false } = this.props;
    noEditImg = ( file.type === 'image/gif' ) ? true : noEditImg;
    const isLtM = ( file.size / 1024 / 1024 );
    if ( !( isLtM < 10 ) ) {
      message.error( `您当前选中的图片${isLtM.toFixed( 2 )}M,为保证上传图片质量，所选图片最好小于10M!` );
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = ( e ) => {
      const dataURL = e.target.result;
      this.setState( {
        editImg: !noEditImg,
        srcCropper: dataURL,
        selectImgName: file.name,
        selectImgSuffix: file.type,
        selectImgUid: file.uid,
      } );
    }

    if ( noEditImg ) {
      this.setState( {
        editImg: false,
        srcCropper: '',
        selectImgName: '',
        selectImgSuffix: '',
      } );
      this.customRequest( file );
    }
    return noEditImg;
  }

  handleOk = () => {
    this.setState( {
      editImg: false,
      srcCropper: '',
      selectImgName: '',
      selectImgSuffix: '',
    } );
    const { selectImgName, selectImgSuffix } = this.state;
    const $this = this;
    this.refs.cropper.getCroppedCanvas().toBlob( ( blob ) => {
      // const file = new File( [blob], selectImgName, { type: selectImgSuffix } );
      const file = $this.blobToFile( blob, selectImgName );
      $this.customRequest( file );
    }, selectImgSuffix || 'image/png', 1 );
  }

  blobToFile = ( theBlob, fileName ) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  cropCropper = () => {
    const { selectImgName, selectImgSuffix } = this.state;
    const img = new Image();
    const $this = this;
    this.refs.cropper.getCroppedCanvas().toBlob( ( blob ) => {
      // const file = new File( [blob], selectImgName, { type: selectImgSuffix } );
      const file = $this.blobToFile( blob, selectImgName );
      const reader = new FileReader();
      reader.readAsDataURL( file );
      reader.onload = ( e ) => {
        img.src = e.target.result;
      }
      img.onload = () => {
        //  图片原始尺寸
        this.setState( {
          imgWidth: img.width,
          imgHeight: img.height,
        } );
      }
    }, selectImgSuffix || 'image/png', 1 );
  }

  changeImg = ( type ) => {
    if ( type === '放大' ) {
      this.refs.cropper.zoom( 0.1 );
    } else if ( type === '缩小' ) {
      this.refs.cropper.zoom( -0.1 );
    } else if ( type === '上移' ) {
      this.refs.cropper.move( 0, -10 );
    } else if ( type === '下移' ) {
      this.refs.cropper.move( 0, 10 );
    } else if ( type === '左移' ) {
      this.refs.cropper.move( -10, 0 );
    } else if ( type === '右移' ) {
      this.refs.cropper.move( 10, 0 );
    }
  };

  render() {
    const {
      fileListLength = 1,
      fileList = [],
      style = {},
      previewVisible = this.state.previewVisible,
      previewImage = "",
      value = "",
      CancelFunc = this.CancelFunc,
      RemoveFunc = this.RemoveFunc,
      PreviewFunc = this.PreviewFunc,
      className,
      children,
      aspectRatio = null,
      listType = "picture-card",
      bodyDom = null,
      disabled = false,
      accept = "image/*"
    } = this.props;
    if ( value && !this.props.fileList ) {
      fileList[0] = { uid: value, url: value };
    }
    const {
      uploading, editImg, srcCropper,
      imgWidth, imgHeight,
    } = this.state;
    const uploadButton = bodyDom || (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className={`${className} uploadImgBtn`} style={Object.assign( { height: 'auto' }, style )}>
        <Upload
          listType={listType}
          fileList={fileList}
          beforeUpload={this.beforeUpload}
          onPreview={PreviewFunc}
          onRemove={RemoveFunc}
          disabled={disabled || uploading}
          accept={accept}
          style={{ width: 'auto', height: 'auto', background: 'none', border: 'none' }}
        >
          {children || <Button type='primary' loading={uploading}>上传文件</Button>}
          {/* {
            uploading ? <Spin tip="上传中..." /> : children || ( fileList.length >= fileListLength ? null : uploadButton )
          } */}
        </Upload>
        <Modal key="show_img_modal_key" visible={previewVisible} footer={null} onCancel={CancelFunc}>
          <img alt="example" style={{ width: '100%' }} src={previewImage || value} />
        </Modal>
        <Modal
          key="cropper_img_modal_key"
          width="60%"
          title="修剪图片"
          visible={editImg}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <div style={{ color: '#f5222d', marginBottom: '5px' }}>宽*高：{imgWidth}*{imgHeight}</div>
          <div style={{ color: '#f5222d', marginBottom: '5px' }}>
            编辑：
            <Tooltip title="放大"><Icon style={{ fontSize: '20px', marginRight: '10px' }} theme="twoTone" type="plus-circle" onClick={() => this.changeImg( '放大' )} /></Tooltip>

            <Tooltip title="缩小"><Icon style={{ fontSize: '20px', marginRight: '25px' }} theme="twoTone" type="minus-circle" onClick={() => this.changeImg( '缩小' )} /></Tooltip>

            <Tooltip title="上移"><Icon style={{ fontSize: '20px', marginRight: '10px' }} theme="twoTone" type="up-circle" onClick={() => this.changeImg( '上移' )} /></Tooltip>

            <Tooltip title="下移"><Icon style={{ fontSize: '20px', marginRight: '10px' }} theme="twoTone" type="down-circle" onClick={() => this.changeImg( '下移' )} /></Tooltip>

            <Tooltip title="左移"><Icon style={{ fontSize: '20px', marginRight: '10px' }} theme="twoTone" type="left-circle" onClick={() => this.changeImg( '左移' )} /></Tooltip>

            <Tooltip title="右移"><Icon style={{ fontSize: '20px', marginRight: '10px' }} theme="twoTone" type="right-circle" onClick={() => this.changeImg( '右移' )} /></Tooltip>

          </div>
          <Cropper
            src={srcCropper}
            ref="cropper"
            style={{ height: 400 }}
            preview='.cropper-preview'
            className="company-logo-cropper"
            viewMode={1} // 定义cropper的视图模式
            // zoomable={false} // 是否允许放大图像
            aspectRatio={aspectRatio} // image的纵横比
            guides // 显示在裁剪框上方的虚线
            background={false} // 是否显示背景的马赛克
            rotatable={false}
            autoCropArea={1}
            crop={this.cropCropper}
          />
        </Modal>
      </div>
    );
  }
}

export default UploadImgBtn;
