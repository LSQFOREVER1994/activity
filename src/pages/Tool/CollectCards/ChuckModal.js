import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Icon, Modal, message } from 'antd';
import UploadImg from '@/components/UploadImg';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../Lists.less';
import CardModal from './CardModal'

const FormItem = Form.Item;

const frontCard = require( '../../../../src/assets/frontCard.png' )


@connect( ( { activity } ) => ( {
  loading: activity.loading,
  collectCardsSpecsObj: activity.collectCardsSpecsObj,
} ) )
@Form.create()
class ChuckModal extends PureComponent {

  formLayout = {
    labelCol: { span: 9 },
    wrapperCol: { span: 14 },
  };

  formLayoutInput = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  constructor( props ) {
    super( props );
    this.state = {
    
      // 正面图
      coverSrccardImg: '',
      imgagesSrccardImg: '',
      previewVisiblecardImg: false,
      previewImagecardImg: '',
      // fileListcardImg: [],
      fileListcardImg: this.props.collectCardsSpecsObj.cardImg ? [{ url: this.props.collectCardsSpecsObj.cardImg, uid: this.props.collectCardsSpecsObj.cardImg }] : [],

      visibleCard: false,
      imgSrc: ''
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    const { dispatch, collectCardsSpecsObj, collectCardsSpecsObj: { id } } = this.props;
    if ( !id ) {
      dispatch( {
        type: 'activity/SetState',
        payload: {
          collectCardsSpecsObj: {
            ...collectCardsSpecsObj,
            nextState: true
          }
        }
      } )
    }
    this.props.onRef( this )
  }



  // 拿取子组件
  onRef = ( ref ) => {
    this.child = ref;
  }


  // 提交：商品种类
  styleHandleSubmit = ( e ) => {
    e.preventDefault();
    const { dispatch, form, collectCardsSpecsObj } = this.props;
    if ( collectCardsSpecsObj.cardInfoList.length === 0 ) {
      message.error( '请填写卡牌设置' );
      return
    }
    const id = collectCardsSpecsObj.id ? collectCardsSpecsObj.id : '';
    form.validateFields( ( err, fieldsValue ) => {
      if ( err ) return;
      const params = id ? Object.assign( fieldsValue, { id } ) : fieldsValue;
      if ( !id ) {
        dispatch( {
          type: 'activity/SetState',
          payload: {
            collectCardsSpecsObj: {
              ...collectCardsSpecsObj,
              ...params,
              nextState: false
            }
          }
        } )
      } else {
        dispatch( {
          type: 'activity/SetState',
          payload: {
            collectCardsSpecsObj: {
              ...collectCardsSpecsObj,
              ...params,
            }
          }
        } )
      }
      message.success( '保存成功' )
    } );
  };


  // 打开图片预览
  PreviewFunc = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  PreviewFunc2 = ( file, type ) => {
    this.setState( {
      [`previewImage${type}`]: file.url,
      [`previewVisible${type}`]: true,
    } );
  }

  CancelFunc = ( type ) => this.setState( { [`previewVisible${type}`]: false } );

  uploadImg = ( res, type ) => {
    const list = this.state[`fileList${type}`];
    list[0] = res;
    this.setState( { [`fileList${type}`]: new Array( ...list ) } );
    this.props.form.setFieldsValue( { [type]: res.url } )
  }

  RemoveFunc = ( type ) => {
    this.setState( { [`fileList${type}`]: [] } );
    this.props.form.setFieldsValue( { [type]: '' } )
  }

  //  示例图放大
  exampleCardMax = ( e, imgType ) => {
    e.preventDefault();
    this.setState( {
      visibleCard: true,
      imgSrc: imgType
    } )
  }

  //  关闭示例图
  onCancelCard = () => {
    this.setState( {
      visibleCard: false,
      imgSrc: ''
    } )
  }


  render() {
    const { form: { getFieldDecorator }, collectCardsSpecsObj } = this.props;
    const {
      previewVisiblecardImg, previewImagecardImg, fileListcardImg,
      imgSrc, visibleCard
    } = this.state;

    return (
      <GridContent>
        <Form layout='horizontal' className={styles.formHeight} onSubmit={this.styleHandleSubmit}>
          <Row gutter={24}>
            <Col span={1} />
            <Col span={8}>
              <FormItem 
                label='福卡正面' 
                {...this.formLayout}
                extra={( <div style={{ whiteSpace:'nowrap' }}>未翻牌时的状态，尺寸：600*830</div> )}   
              >
                {getFieldDecorator( 'cardImg', {
                  rules: [{ required: true, message: '请上传福卡正面图片' }],
                  initialValue: collectCardsSpecsObj.cardImg,
                } )(
                  <div style={{ height: 110 }}>
                    <UploadImg
                      previewVisible={previewVisiblecardImg}
                      previewImage={previewImagecardImg}
                      fileList={fileListcardImg}
                      CancelFunc={() => { this.CancelFunc( 'cardImg' ) }}
                      PreviewFunc={( e ) => { this.PreviewFunc2( e, 'cardImg' ) }}
                      ChangeFunc={( e ) => this.uploadImg( e, 'cardImg' )}
                      RemoveFunc={() => this.RemoveFunc( 'cardImg' )}
                    />
                  </div>
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <div className={styles.exampleCard}>
                <div className={styles.cardStyle}>
                  <img src={frontCard} />
                </div>
                <div className={styles.exampleText}>
                  <span>示例图</span>
                  <Icon type="zoom-in" style={{ marginLeft: 3, marginTop: 1 }} onClick={( e ) => this.exampleCardMax( e, frontCard )} />
                </div>
              </div>
            </Col>
          </Row>

        </Form>
       
        <CardModal onRef={this.onRef} exampleCardMax={this.exampleCardMax} />
        {
          visibleCard ?
            <Modal
              visible={visibleCard}
              onCancel={this.onCancelCard}
              footer={null}
            >
              <div>
                <img src={imgSrc} style={{ width: '100%' }} />
              </div>
            </Modal>
            : null
        }
      </GridContent>
    );
  }
}

export default ChuckModal;
