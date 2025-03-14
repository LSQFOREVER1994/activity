import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { Modal, Checkbox } from 'antd';
import styles from './condition.less';
/* eslint-disable react/no-array-index-key */ 


@connect(({ backModal }) => ({
  groups: backModal.groups
}))

class ConditionModalComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isShow: this.props.isShow,
      type: this.props.type,
      cancelConditionModal: this.props.cancelConditionModal,
      handleConditionSubmit: this.props.handleConditionSubmit,
      localBuyConditions: this.props.localBuyConditions,
      localSellConditions: this.props.localSellConditions,
    }
  }

  componentDidMount() {
    this.fetchConditionGroups();
  };

  componentWillReceiveProps(nextProps) {
    const { isShow } = this.props;
    if (isShow !== nextProps.isShow) {
      this.setState({
        isShow: nextProps.isShow,
        type: nextProps.type,
        localBuyConditions: nextProps.localBuyConditions,
        localSellConditions: nextProps.localSellConditions,
      })
    }
  };

  checkChange = (checkValue, type) => {
    if (type === '买入条件') {
      this.setState({
        localBuyConditions: checkValue,
      });
    } else {
      this.setState({
        localSellConditions: checkValue,
      });
    }
  }

  fetchConditionGroups = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'backModal/getGroups',
      payload: {}
    }) 
  };

  render() {
    const { groups } = this.props;
    const { isShow, type, cancelConditionModal, handleConditionSubmit, localBuyConditions, localSellConditions } = this.state;

    return (
      <Modal
        maskClosable={false}
        title={`选择${type}`}
        width={1000}
        bodyStyle={{ padding: '18px 0 28px' }}
        destroyOnClose
        visible={isShow}
        onOk={type === '买入条件' ? () => handleConditionSubmit(type, localBuyConditions) : () => handleConditionSubmit(type, localSellConditions)}
        onCancel={() => cancelConditionModal(type)}
      >
        {
          <div>
            <Checkbox.Group style={{width: '100%'}} onChange={(checkValue) => {this.checkChange(checkValue, type)}} defaultValue={type === '买入条件' ? localBuyConditions : localSellConditions}>
              {groups.map((item, index) => {
                return(
                  <div className={styles.conditionGroup} key={`${item.name}-${index}`}>
                    <span className={styles.conditionGroupSpan}>{item.name}</span>
                    {item.stockConditions.map((subItem, i) => {
                      return(
                        <div style={{marginLeft: 35}} key={`${subItem.name}-${i}`}>
                          <span style={{fontSize: 15, fontWeight: 500}}>{subItem.name}&nbsp;:&nbsp;</span>
                          <div>
                            {subItem.conditions.map((grdItem) => {
                              return(
                                <Checkbox key={`${grdItem.name}`} value={grdItem} style={{marginLeft: 20}}>{grdItem.name}</Checkbox>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </Checkbox.Group>
            
          </div>
          }
      </Modal>
    )
  }
}

export default ConditionModalComponent;