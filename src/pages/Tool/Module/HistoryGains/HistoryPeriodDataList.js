import React, { PureComponent, Fragment } from 'react';
import { Form, Button, Col, Row, DatePicker, Radio, Icon, message, Modal, Upload } from 'antd';
import { connect } from 'dva';
import moment from 'moment'
import { formatMessage } from 'umi/locale';
import reqwest from 'reqwest';
import cookies from 'js-cookie';
import UploadImg from '@/components/UploadImg';
import styles from './index.less';
import DetailForm from './HistoryDetail.Form';
import serviceObj from  '@/services/serviceObj';

const { cropService, historyUrl } = serviceObj;
const time = () => new Date().getTime();
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
@connect()
@Form.create()
class HistoryGains extends PureComponent {
  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 4 },
  }

  formLayoutImage = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  }

  formLayoutDate = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 },
  }

  detailsForm = {}

  constructor( props ){
    let details =[];
    if( props.periodCurrent.id ){
      props.info.periods.forEach( item => {
        if( props.periodCurrent.id === item.id ){
          details=item.details;
        }
      } )
    }
    const Details = details.map( ( item, index ) => ( { ...item, key:time()+index } ) );
    const period = props.info.periods && props.info.periods.length > 0 ? props.info.periods[0] : {};
    super( props );
    this.state = {
      // snapshot图
      coverSrcsnapshot: '',
      imgagesSrcsnapshot: '',
      previewVisiblesnapshot: false,
      previewImagesnapshot: '',
      fileListsnapshot: props.periodCurrent.snapshot ? [{ url: props.periodCurrent.snapshot, uid: props.periodCurrent.snapshot }] : [],

      info: props.info || {},
      details: Details,

      loading:false,
      listLoading:false,
      deleteLoading:false,
      // 要删除的战绩详情
      deleteIds:[0],
      period,
      gainsList: props.info.periods && props.info.periods.length > 0 ? [...props.info.periods, {}]:[{}],

      fileList:[],   // 上传文件列表
      fileInfo:[],
      detailsArr:[],
    };
  }

  componentDidMount(){
    this.props.onRef( this )
    this.pushDetails()
  }

  onRef = ( ref, key ) => {
    this.detailsForm[`detailForm-${key}`] = ref
  }


   //  合并导入的战绩数据
   pushDetails = () => {
    const { details, fileInfo } = this.state;
    //  导入数据与原有数据合并
    // const obj = {}
    // const newDetails = details.concat( fileInfo ).reduce( ( prev, curr )=>{
    //   obj[curr.key] ? true : obj[curr.key] = true && prev.push( curr );
    //   return prev
    // }, [] )
    const arr =[]
    fileInfo.forEach( ( item )=>{
      if( item.code && item.name && item.publishTime && item.change ){
        arr.push( item )
      }
    } )
    const newDetails = details.concat( arr )
    this.setState( { details:newDetails } )
  }

  handleSubmit = ( e )=>{
    e.preventDefault();
    const { detailsForm } = this;
    const { form, dispatch, infoId, infoName, showEditModal, periodCurrent, fetchPeriodList } = this.props;
    // const { data=[] }=this.props
    const { deleteIds, info, period } = this.state;
    const that = this;

    form.validateFields( ['rangeTime', 'state', 'snapshot'], ( err, values ) => {
      if ( err ) return;
      this.setState( { listLoading:true } )
      const details = [];
      Object.keys( detailsForm ).forEach( ( key ) => {
        const formData = detailsForm[key].handleSubmit();
        details.push( formData );
      } )
      const { rangeTime, state, snapshot } = values;
      const start = moment( rangeTime[0] ).format( 'YYYY-MM-DD' );
      const end = moment( rangeTime[1] ).format( 'YYYY-MM-DD' );
      dispatch( {
        type: 'tool/submitHistoryGainPeriod',
        payload: {
          id:periodCurrent.id || '',
          categoryId:info.id || infoId,
          deleteIds,
          start,
          end,
          snapshot,
          name:info.name ||infoName,
          state,
          details
        },
        isUpdate: !!period.id,
        callFunc: ( result ) => {
          if ( period.id ){
            const gainsList = that.state.gainsList.map( item => {
              if( item.id === period.id ) return result;
              return item;
            } )
            console.log( 'gainsList', gainsList )
            that.setState( { gainsList, listLoading:false } );
            that.props.handleOk();
            fetchPeriodList( {} );
            that.handleCancel();
            showEditModal( { data:info, type:'historyDataList', infoId } )
          }else{
            const gainsList = that.state.gainsList.filter( item => JSON.stringify( item ) !== '{}' );
            const GainsList = gainsList.concat( [result, {}] );
            that.clearAgainForm();
            that.detailsForm = {};
            that.setState( { gainsList: GainsList, listLoading:false, fileListsnapshot:[] } );
            that.props.handleOk();
            fetchPeriodList( {} );
            that.handleCancel();
            showEditModal( { data:info, type:'historyDataList', infoId } )
          }
        }
      } )
    } )
  }

  // 取消自身模板
  handleCancel = () => {
    this.props.childchangeModal()
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
    this.props.form.setFieldsValue( { [type]:res.url } )

  }

  RemoveFunc = ( type ) => {
    this.setState( { [`fileList${type}`]: [] } );
    this.props.form.setFieldsValue( { [type]: '' } )
  }

  addDetail = () => {
    const { details } = this.state;
    const newDetails = details.concat( { key:time() } );
    this.setState( { details:newDetails } )
  }

  clearAgainForm = () => {
    const { form } = this.props;
    this.clearDetailsForm();
    form.resetFields( ['rangeTime', 'state'] );
  }

  clearDetailsForm = () => {
    const { detailsForm } = this;
    if ( detailsForm ){
      Object.keys( detailsForm ).forEach( ( key ) => {
        detailsForm[key].formReset();
      } )
    }
  }


  deleteDetail = ( detail, index ) => {
    let { deleteIds } = this.state;
    if ( detail.id ) deleteIds = deleteIds.concat( [detail.id] )
    const { detailsForm } = this;
    const Details = [];
    Object.keys( detailsForm ).forEach( ( key ) => {
      const formData = detailsForm[key].getValues();
      detailsForm[key].formReset();
      Details.push( formData );
    } )
    // const newDetails = Details.filter( ( item, Index ) => Index !== index && item )
    const newDetails = Details.filter( ( item ) => item && item.key !== index )
    delete this.detailsForm[`detailForm-${index}`];
    this.setState( { details: newDetails, deleteIds } );
  }

   // 导入
   customRequest = ( option )=> {
    const formData = new FormData();
    const token = cookies.get( 'JINIU_DATA_PRODUCT_CMS_TOKEN' )|| sessionStorage.getItem( 'JINIU_DATA_PRODUCT_CMS_TOKEN' );
    const tokenObj = token ? { 'X-Auth-Token': token } : {};
    formData.append( 'file', option.file );

    reqwest( {
      url:`${cropService}/histories/detail/import`,
      method: 'post',
      processData: false,
      headers:{ Accept: 'application/json', ...tokenObj, },
      data: formData,
      success: ( res ) => {
        // 导入的数据添加key值
       const fileInfo = res.result.map( ( item ) => {
          item.key =Math.floor( time()+Math.random()*1000 )
          return item
        } );
        if( res ){
          this.setState( {
              fileInfo,
              loading: false,
              uploading: false,
              defaultFile:false
          }, ()=>this.pushDetails() )
        }
      },
      error: () => {
        this.setState( {
            loading: false,
            uploading: false
        } )
        message.error( "文件上传失败！" );
      },
    } );
  }


  // // 切换战绩详情
  // changePeriod = ( period ) => {
  //   this.detailsForm = {}
  //   this.clearAgainForm();
  //   const details = period.details && period.details.length > 0 ? period.details : [];
  //   const Details = details.map( ( item, index ) => ( { ...item, key: time() + index } ) )
  //   const fileListsnapshot = period.snapshot ? [{ url: period.snapshot, uid: period.snapshot }] : [];
  //   this.setState( { period, details: Details, fileListsnapshot } )
  // }

  // 删除战绩详情
  // detailPeriod = () => {
  //   const { dispatch } = this.props;
  //   const { period, gainsList } = this.state;
  //   const that = this;
  //   this.setState( { deleteLoading:true } )
  //   dispatch( {
  //     type:'tool/deleteHistoryGainPeriod',
  //     payload: { id: period.id },
  //     callFunc:() => {
  //       const newgainsList = gainsList.filter( item => item.id !== period.id )
  //       that.setState( { gainsList: newgainsList, deleteLoading:false }, () => {
  //         that.changePeriod( newgainsList[0] )
  //       } )
  //     }
  //   } );
  // }

  render() {
    const { form: { getFieldDecorator }, periodVisible, periodCurrent } = this.props;
    const {
      fileListsnapshot, previewImagesnapshot, previewVisiblesnapshot,
      fileList, details
    } = this.state;

    const modalFooter = {
      okText: formatMessage( { id: 'form.save' } ),
      onOk: this.handleSubmit,
      onCancel: this.handleCancel
    };

    return (
      <Modal
        title='添加战绩详情'
        visible={periodVisible}
        width={1200}
        bodyStyle={{ padding:'12px 24px', maxHeight:'80vh', overflow: "auto" }}
        {...modalFooter}
      >
        <Fragment>
          <Form>
            <FormItem label="战绩起止时间" {...this.formLayout}>
              {getFieldDecorator( 'rangeTime', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}战绩起止时间` }],
                initialValue: periodCurrent.start ? [moment( periodCurrent.start, 'YYYY-MM-DD' ), moment( periodCurrent.end, 'YYYY-MM-DD' )] :[],
              } )(
                <RangePicker format="YYYY-MM-DD" style={{ width:270 }} />
              )}
            </FormItem>

            <FormItem label="是否发布" {...this.formLayout}>
              {getFieldDecorator( 'state', {
                rules: [{ required: true, message: `${formatMessage( { id: 'form.select' } )}是否发布` }],
                initialValue: periodCurrent.state || 'ENABLE',
              } )(
                <RadioGroup>
                  <Radio value="ENABLE">{formatMessage( { id: 'strategyMall.product.state.ENABLE' } )}</Radio>
                  <Radio value="DISABLE">{formatMessage( { id: 'strategyMall.product.state.DISABLE' } )}</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem label='完整战绩图' {...this.formLayout}>
              {getFieldDecorator( 'snapshot', {
                initialValue: periodCurrent.snapshot,
              } )(
                <div style={{ height: 110 }}>
                  <UploadImg
                    previewVisible={previewVisiblesnapshot}
                    previewImage={previewImagesnapshot}
                    fileList={fileListsnapshot}
                    CancelFunc={() => { this.CancelFunc( 'snapshot' ) }}
                    PreviewFunc={( e ) => { this.PreviewFunc2( e, 'snapshot' ) }}
                    ChangeFunc={( e ) => this.uploadImg( e, 'snapshot' )}
                    RemoveFunc={() => this.RemoveFunc( 'snapshot' )}
                  />
                </div>
              )}
            </FormItem>
            {/* <Col span={6} className={styles.snapshot_mome}>*前台可优先展示战绩图</Col> */}

            <FormItem label="战绩详情" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <Row gutter={24}>
                <Col span={3}>
                  <Upload
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,"
                    customRequest={this.customRequest}
                    beforeUpload={this.beforeUpload}
                    fileList={fileList}
                  >
                    <Button>
                      <Icon type='upload' />
                      导入
                    </Button>
                  </Upload>
                </Col>
                <Col span={3}>
                  <Button href={historyUrl}>
                    <Icon type='download' />
                    模板下载
                  </Button>
                </Col>
              </Row>
              <Row style={{ textAlign: 'center', fontWeight: 'bold' }} className={styles.form_gains_detail}>
                <Col span={3}><span className={styles.form_before}>*</span>信号类型</Col>
                <Col span={3}><span className={styles.form_before}>*</span>股票代码</Col>
                <Col span={3}><span className={styles.form_before}>*</span>股票名称</Col>
                <Col span={4}><span className={styles.form_before}>*</span>推送日期</Col>
                <Col span={3} style={{ textAlign: 'right', position:'relative', left:8 }}><span className={styles.form_before}>*</span>涨幅（%）</Col>
                <Col span={3}>备注</Col>
                <Col span={2}>K线截图</Col>
              </Row>
              {
                details.map( ( detail ) =>
                  <DetailForm
                    detail={detail}
                    onRef={( ref ) => { this.detailsForm[`detailForm-${detail.key}`] = ref}}
                    key={`detail_${detail.key}`}
                    deleteDetail={() => { this.deleteDetail( detail, detail.key )}}
                  /> )
                }
              <Button
                type="dashed"
                style={{ width: '88%', marginBottom: 8 }}
                icon="plus"
                onClick={() => this.addDetail()}
              >
                {formatMessage( { id: 'form.add' } )}
              </Button>
            </FormItem>
          </Form>

        </Fragment>
      </Modal>
    );
  }
}

export default HistoryGains;
