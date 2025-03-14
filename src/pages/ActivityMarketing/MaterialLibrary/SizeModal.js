import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Modal, Button, Input, Form, message } from 'antd'
import styles from './materialLibrary.less';
import Size1 from '@/assets/size1.png'
import Size2 from '@/assets/size2.png'
import Size3 from '@/assets/size3.png'
import Size4 from '@/assets/size4.png'
import Size5 from '@/assets/size5.png'
import Size6 from '@/assets/size6.png'
import Size7 from '@/assets/size7.png'
import Size8 from '@/assets/size8.png'

const FormItem = Form.Item;
const SIZELIST = [
  {
    key: 1,
    name: '手机海报',
    width: 750,
    height: 1334,
    pic: Size1
  },
  {
    key: 2,
    name: '长图',
    width: 750,
    height: 2100,
    pic: Size2
  },
  {
    key: 3,
    name: '邀请函',
    width: 750,
    height: 1334,
    pic: Size3
  },
  {
    key: 4,
    name: '易拉宝',
    width: 800,
    height: 2000,
    pic: Size4
  },
  {
    key: 5,
    name: '公众号首图',
    width: 900,
    height: 383,
    pic: Size5
  },
  {
    key: 6,
    name: '公众号小图',
    width: 200,
    height: 200,
    pic: Size6
  },
  {
    key: 7,
    name: '公众号横板海报',
    width: 900,
    height: 500,
    pic: Size7
  },
  {
    key: 8,
    name: '二维码',
    width: 500,
    height: 500,
    pic: Size8
  }
]
@connect()
@Form.create()
class SizeModal extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      currentSize: null
    }
  }

  componentDidMount() {
    const { form } = this.props;
    form.setFieldsValue( { materialName: '未命名素材' } );
  }

  createMeterial = () => {
    const { form, createNewMaterial } = this.props;
    const params = form.getFieldsValue();
    const { materialName, width, height } = params;
    const Reg = /^[1-9]*[1-9][0-9]*$/;
    if ( !Reg.test( width ) || !Reg.test( height ) ) {
      message.warn( '请输入正确的像素尺寸' );
      return
    }
    this.setState( { currentSize: null } );
    createNewMaterial( materialName, width, height );
  }

  focusName = () => {
    const { form } = this.props;
    const { materialName } = form.getFieldsValue();
    if ( materialName === '未命名素材' ) {
      form.setFieldsValue( { materialName: '' } );
    }
  }

  blurName = () => {
    const { form } = this.props;
    const { materialName } = form.getFieldsValue();
    if ( materialName === '' ) {
      form.setFieldsValue( { materialName: '未命名素材' } );
    }
  }

  selectSize = ( key, width, height ) => {
    const { form } = this.props;
    form.setFieldsValue( { width } );
    form.setFieldsValue( { height } );
    this.setState( {
      currentSize: key
    } )
  }

  render() {
    const { form: { getFieldDecorator }, visible, closeSizeModal, } = this.props;
    const { currentSize } = this.state;
    return (
      <Modal
        title="新建"
        destroyOnClose
        visible={visible}
        onOk={this.handleSync}
        onCancel={() => { this.setState( { currentSize: null } ); closeSizeModal() }}
        maskClosable={false}
        width={764}
        footer={[
          <Button key="submit" type="primary" onClick={this.createMeterial}>创建</Button>,
        ]}
      >
        <div style={{ display: 'flex' }}>
          <FormItem style={{ margin: '0' }}>
            {getFieldDecorator( 'materialName', {
              initialValue: '未命名素材'
            } )(
              <Input
                placeholder="请输入素材名称"
                onFocus={() => this.focusName()}
                onBlur={() => this.blurName()}
                maxLength={20}
                style={{ boxShadow: 'none' }}
                className={styles.size_input_name}
              />
            )}
          </FormItem>
          <FormItem style={{ padding: '0', margin: '0', width: '100px', marginLeft: '100px' }}>
            {getFieldDecorator( 'width', {
            } )(
              <Input placeholder='宽度' style={{ border: 'none', background: '#f6f8fa' }} />
            )}
          </FormItem>
          <div className={styles.size_text}>*</div>
          <FormItem style={{ padding: '0', margin: '0', width: '100px' }}>
            {getFieldDecorator( 'height', {
            } )(
              <Input placeholder='高度' style={{ border: 'none', background: '#f6f8fa' }} />
            )}
          </FormItem>
          <div className={styles.size_text}>像素</div>
        </div>
        <div className={styles.size_item_box}>
          {
            SIZELIST.map( item => {
              return (
                <div key={item.key} className={styles[`${currentSize === item.key ? 'size_item_active' : 'size_item'}`]} onClick={() => this.selectSize( item.key, item.width, item.height )}>
                  <div className={styles.size_item_img}><img src={item.pic} alt={item.name} /></div>
                  <div className={styles.size_item_name}>{item.name}</div>
                  <div className={styles.size_item_text}>{`${item.width}*${item.height} 像素`}</div>
                </div>
              )
            } )
          }
        </div>
      </Modal>
    )
  }
}
export default SizeModal;
