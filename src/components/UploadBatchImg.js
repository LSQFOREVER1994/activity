import React, { Component } from 'react';
import { Modal, Icon, Upload, message, Button } from 'antd';
import UploadFileRequest from './UploadFileRequest';
import './UploadBatchImg.less';


const getBase64 = ( file ) => {
  return new Promise( ( resolve, reject ) => {
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = () => resolve( reader.result );
    reader.onerror = error => reject( error );
  } );
}

class UploadBatchImg extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      loading: false,
      uploadMaxNum: 12
    };
  }

  // 关闭预览
  handleCancel = () => this.setState( { previewVisible: false } );

  // 开启图片预览
  handlePreview = async file => {
    const newFile = file
    if ( !newFile.url && !newFile.preview ) {
      newFile.preview = await getBase64( newFile.originFileObj );
    }
    this.setState( {
      previewImage: newFile.url || newFile.preview,
      previewVisible: true,
    } );
  };

  // 上传图片保存
  handleChange = ( { fileList } ) => this.setState( { fileList } );

  // 上传触发按钮
  handleOk = () => {
    const { fileList } = this.state
    if ( fileList.length === 0 ) {
      message.error( '请先选择文件' )
      return
    }
    const { uploadImg } = this.props
    this.setState( { loading: true }, () => {
      this.batchUpload( () => { uploadImg(); this.handleCancelModal() } );
    } );
  };

  // 上传处理
  batchUpload = ( callback ) => {
    const { fileList } = this.state
    if ( fileList && fileList.length ) {
      const promiseList = []
      fileList.forEach( ( info, index ) => {
        const promiseItem = new Promise( ( resolve ) => {
          this.uploadRequest( fileList[index].originFileObj, ( res ) => {
            resolve( res )
          } );
        } );
        promiseList.push( promiseItem )
      } )
      Promise.all( promiseList ).then( ( values ) => {
        if ( values.length === fileList.length ) {
          message.success( '批量上传成功' )
          callback()
        }
      } );
    }
  };

  // 图片压缩
  lrzImg = ( file, callBack ) => {
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
        this.requestUpload( { formData, file, callBack } );
      }, file.type || 'image/png' );
    };
  }

  // 上传
  uploadRequest = ( file, callBack ) => {
    const { type, size, lastModified, name } = file;
    const formData = new FormData();
    const staticImgType = 'image/jpeg, image/pjpeg, image/png';
    const isStaticImg = ( staticImgType.indexOf( type ) > -1 );
    if ( ( size / 1024 > 1025 ) && isStaticImg ) {
      // 大于1M，进行压缩上传
      this.lrzImg( file, callBack );
    } else {
      // 小于等于1M 原图上传
      if ( lastModified ) {
        formData.append( "file", file ); // 文件对象
      } else {
        formData.append( "file", file, name );
      }
      this.requestUpload( { formData, file, callBack } );
    }
  };


  // 文件上传
  requestUpload = ( { formData, file, callBack } ) => {
    const { categoryId, libraryType } = this.props;
    UploadFileRequest( {
      formData,
      file,
      categoryId,
      libraryType,
      parentFunc: ( res ) => {
        callBack( res );
      },
      parentFailFunc: () => {
        this.setState( { loading: false } );
      }
    } )
  };

  // 取消触发按钮
  handleCancelModal = () => {
    this.setState( {
      fileList: [],
      loading: false,
      previewImage: '',
      previewVisible: false,
    } );
    this.props.handleCancel();
  };

  // 手动上传控制
  beforeUpload = ()=>{
    return false
  }

  render() {
    const { control } = this.props;
    const { previewVisible, previewImage, fileList, loading, uploadMaxNum } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <Modal
        visible={control}
        key="batch_img_modal_key"
        title="批量上传图片"
        centered
        destroyOnClose
        onOk={this.handleOk}
        width="738px"
        onCancel={this.handleCancelModal}
        footer={[
          <Button key="back" onClick={this.handleCancelModal}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
            {this.state.uploading ? '上传中...' : '上传'}
          </Button>,
        ]}
      >
        <div className="clearfix">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            beforeUpload={this.beforeUpload}
            accept={"image/*"}
            multiple
          >
            {fileList.length >= uploadMaxNum ? null : uploadButton}
          </Upload>
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </Modal>
    );
  }
}

export default UploadBatchImg;
