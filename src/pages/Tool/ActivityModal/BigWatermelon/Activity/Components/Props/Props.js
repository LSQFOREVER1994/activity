// 道具设置
import React, { PureComponent } from 'react';
import { Form, Input, Radio, message } from 'antd';
import { formatMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import styles from '../../../../ActivityModal.less';


const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()


class Props extends PureComponent {

  state = {
    // 道具列表固定格式，名称加类型
    propsList: [
      {
        name: '魔法棒',
        propsType: 'MAGIC'
      },
      {
        name: '炸弹',
        propsType: 'BOMB'
      },
    ],
    needScore: []
  }


  formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };

  formLayout2 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }


  // 很复杂的造数据格式，别问问就是后端要这样子。
  componentWillMount() {
    const { data } = this.props;
    const { needScore, propsList } = this.state;
    const newNeedScore = needScore;
    const newPropsList = propsList;
    if ( data.propsList ) {
      data.propsList.forEach( ( item, index ) => {
        const { propsImg, initCount, describe } = item;
        Object.assign( newPropsList[index], { propsImg, initCount, describe } );
        // 每多一个道具，增加三个道具档次
        newNeedScore.push( [{}, {}, {}] );
        item.needScore.forEach( ( score, scoreIndex ) => {
          const key = Object.keys( score ).join( '' );
          // 设置每个道具的各档次分数和兑换个数，
          newNeedScore[index][scoreIndex].needScore = score[key];
          newNeedScore[index][scoreIndex].scoreNum = key;
          newNeedScore[index][scoreIndex].key = `score${score[key]}${scoreIndex}`;
        } )
      } );
    } else {
      propsList.forEach( ( item, index ) => {
        newNeedScore.push( [{}, {}, {}] );
        newNeedScore[index].forEach( ( score, scoreIndex ) => {
          // 设置每个道具的各档次分数和兑换个数，
          newNeedScore[index][scoreIndex].needScore = null;
          newNeedScore[index][scoreIndex].scoreNum = null;
          newNeedScore[index][scoreIndex].key = `score${scoreIndex}`;
        } )
      } );
    }
    
    this.setState( {
      needScore: newNeedScore,
      propsList: newPropsList
    } );
  }


  getValues = () => {
    const { form: { getFieldsValue } } = this.props;
    const { propsList } = this.state;
    const newPropsList = propsList;
    const fieldsValueObj = getFieldsValue();

    // 循环道具列表
    propsList.forEach( ( item, index ) =>{
      // 循环表单数据
      Object.keys( fieldsValueObj ).forEach( ( field ) => {
        // 按道具类别添加数据处理后的道具列表
        if ( field.indexOf( item.name ) !== -1 ) {
          const key = field.split( '-' )[1];
          newPropsList[index][key] = fieldsValueObj[field];
        }

      } );

      const scoreKey0 = fieldsValueObj[`${item.name}-scoreNum0`] || 0;
      const scoreKey1 = fieldsValueObj[`${item.name}-scoreNum1`] || 0;
      const scoreKey2 = fieldsValueObj[`${item.name}-scoreNum2`] || 0;
      newPropsList[index].needScore = [{}, {}, {}];
      newPropsList[index].needScore[0][scoreKey0] = +fieldsValueObj[`${item.name}-needScore0`];
      newPropsList[index].needScore[1][scoreKey1] = +fieldsValueObj[`${item.name}-needScore1`];
      newPropsList[index].needScore[2][scoreKey2] = +fieldsValueObj[`${item.name}-needScore2`];

      for( let i=0; i<newPropsList[index].needScore.length; i+=1 ) {
        delete newPropsList[index][`scoreNum${i}`]
        delete newPropsList[index][`needScore${i}`]
      }
    } );
    return { propsList: newPropsList };
  }

  onPreview = () => {
    setTimeout( () => {
      this.props.onPreview();
    } );
  }

  // 表单提交
  handleSubmit = () => {
    const { form } = this.props;
    let data;
    let isError = true;
    form.validateFields( ( err ) => {
      data = this.getValues();
      data.propsList.forEach( ( item, index ) => {
        if ( item.enable === false ) {
          delete data.propsList[index].initCount;
          delete data.propsList[index].describe;
          delete data.propsList[index].propsImg;
        }
      } );

      if ( err ) {
        isError = false;
        message.error( '请在道具设置中填入必填项' );
      }
    } );
    return  isError && data;
  }


  render() {

    const { form: { getFieldDecorator, getFieldValue }, data } = this.props;
    const { propsList, needScore } = this.state;
    return (
      <GridContent>
        <p style={{ color: 'red' }}>(选填)  对道具进行配置<br /> 注：积分设置项，任务需打开才能生效</p>

        <Form className={styles.formHeight} onSubmit={this.handleSubmit}>
          {
            propsList.map( ( item, index ) => {
              return (
                <div key={item.name}>
                  <FormItem label={item.name} {...this.formLayout}>
                    {getFieldDecorator( `${item.name}-enable`, {
                      rules: [{ required: true, message: '请选择是否启用道具' }, ],
                      initialValue: data.propsList && data.propsList[index].enable || false,
                    } )(
                      <Radio.Group onChange={this.onPreview}>
                        <Radio value>启用</Radio>
                        <Radio value={false}>不启用</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>

                  {
                    getFieldValue( `${item.name}-enable` ) === true &&
                    <div>
                      <div style={{ display: 'flex', padding: '0px 0px 20px calc(16.666% - 80px)', alignItems: 'center' }}>
                        <div style={{ flexGrow: 100, alignItems: 'center', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 10, color: '#333' }} className={styles.edit_acitve_tab}>
                            道具图标：
                          </div>
                          <FormItem style={{ marginBottom: 0, paddingLeft: 80 }}>
                            {getFieldDecorator( `${item.name}-propsImg`, {
                              rules: [{ required: true, message: '请上传道具图标' }],
                              initialValue: data.propsList && data.propsList[index].propsImg || propsList.propsImg
                            } )( <UploadImg onChange={this.onPreview} /> )}
                          </FormItem>
                          <div style={{ fontSize: 13, color: '#999', position: 'absolute', top: '20px', left: '200px' }}>
                            格式：jpg/jpeg/png
                            <br />
                            建议尺寸：180px*180px
                            <br />
                             建议大小：不超过1M
                          </div>
                        </div>

                      </div>
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: '50%' }}>
                          {
                            needScore[index].map( ( score, scoreIndex ) => (
                              <FormItem 
                                key={`scror${score.key}`}
                                label='积分兑换道具规则'
                                {...this.formLayout2} 
                                className={scoreIndex !== 0 ? styles.scoreNoShow : styles.scoreCss}
                              >
                                {
                                  getFieldDecorator( `${item.name}-needScore${scoreIndex}`, {
                                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}初始化积分` },
                                    { pattern: new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message: '请输入0~999999之间的整数' }],
                                    initialValue: score.needScore
                                  } )( <Input
                                    placeholder='请输入兑换道具所需积分'
                                    min={0}
                                    max={999999}
                                    addonAfter='分'
                                    type='number'
                                    onChange={this.onPreview}
                                  /> )
                                }
                              </FormItem>
                            ) )
                          }
                          
                        </div>

                        <div style={{ width: '45%' }}>
                          {
                            needScore[index].map( ( num, numIndex ) => (
                              <FormItem
                                key={`scrorNum${num.key}`}
                                label='兑换道具'
                                {...this.formLayout2}
                                // className={numIndex !== 0 ? styles.scoreNoShow : styles.scoreCss}
                                className={`${styles.scoreCss} ${styles.noRequired}`}
                              >
                                {
                                  getFieldDecorator( `${item.name}-scoreNum${numIndex}`, {
                                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}初始化数量` },
                                    { pattern: new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message: '请输入0~999999之间的整数' }],
                                    initialValue: num.scoreNum
                                  } )( <Input
                                    placeholder='请输入该积分可兑换道具数量'
                                    min={0}
                                    max={999999}
                                    addonAfter='个'
                                    type='number'
                                    onChange={this.onPreview}
                                  /> )
                                }
                              </FormItem>
                            ) )
                          }
                          
                        </div>
                      </div>

                      <div style={{ height: '24px' }} />

                      <FormItem label='道具初始化次数' {...this.formLayout}>
                        {getFieldDecorator( `${item.name}-initCount`, {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}每日免费次数` },
                          { pattern: new RegExp( /^(0|\+?[1-9][0-9]{0,5})$/ ), message: '请输入0~999999之间的整数' }],
                          initialValue: data.propsList && data.propsList[index].initCount || propsList.initCount
                        } )( <Input
                          onChange={this.onPreview}
                          placeholder='请输入道具初始化次数，最大值是99999'
                          min={0}
                          max={999999}
                          addonAfter='次'
                          type='number'
                        /> )}
                      </FormItem>

                      <FormItem label='使用说明' {...this.formLayout}>
                        {getFieldDecorator( `${item.name}-describe`, {
                          rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}使用说明` }],
                          initialValue: data.propsList && data.propsList[index].describe || propsList.describe || ''
                        } )( <TextArea
                          rows={4}
                          onChange={this.onPreview}
                          placeholder='请输入使用说明'
                          className={styles.collect_edit_rule}
                          maxLength={48}
                        /> )}
                        <span style={{ position: 'absolute', right: 10, bottom: -10, color: 'rgba(0, 0, 0, 0.25)' }}>{getFieldValue( `${item.name}-describe` ).length}/48</span>
                      </FormItem>
                    </div>
                  }
                </div>

              )
            } )
          }
        </Form>
      </GridContent>

    )
  }
}

export default Props