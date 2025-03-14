import React, { PureComponent } from 'react';
import { Icon, message, } from 'antd';
import _ from 'lodash';

import CardCom from './Card.com';
import styles from '../../ActivityModal.less';

const time = () => new Date().getTime();

class AllCard extends PureComponent {
  allCardForm = {}

  constructor(props) {
    super(props);
    this.state = {
      list: props.list && props.list.length ? props.list.map((card, index) => ({ ...card, key: time() + index })) : [],
      activityId: props.activityId
    }
  }

  componentDidMount () {
    this.props.onRef(this)
  }

  addDetail = () => {
    const { list } = this.state;
    const newList = list.concat({ key: time(), isOpen: true });
    this.setState({ list: newList }, () => {
      this.props.onPreview()
    })
  }

  deleteDetail = (detail, index) => {
    const { allCardForm } = this;
    const lists = [];
    Object.keys(allCardForm).forEach((key) => {
      const formData = allCardForm[key].getValues();
      allCardForm[key].formReset();
      lists.push(formData);
    })

    const newList = lists.filter((item) => item && item.key !== index)
    delete this.allCardForm[`cardForm-${index}`];
    this.setState({ list: newList }, () => {
      this.props.onPreview()
    });
  }

  getValues = () => {
    const { allCardForm } = this;
    const { activityId } = this.state;
    const list = [];
    Object.keys(allCardForm).forEach((key) => {
      const formData = allCardForm[key].getCardValues();
      list.push({ ...formData, activityId });
    })
    return {
      cardInfoList: list,
    }
  }

  getData = () => {
    const { allCardForm } = this;
    const { activityId } = this.state;
    let haveError = false;
    Object.keys(allCardForm).forEach((key) => {
      if (allCardForm[key].getFormError()) haveError = true
    })
    if (haveError) {
      message.warning('所集卡片正在配置中')
      return false
    }
    const list = [];
    Object.keys(allCardForm).forEach((key) => {
      const formData = allCardForm[key].getValues();
      list.push({ ...formData, activityId });
    })
    const arr = list.filter(o => o.cardType !== 'NORMAL') // 获取非普通卡数量
    if (arr.length < 3 || arr.length > 16) {
      haveError = true;
      // 和万能卡
      message.warning(' 福卡数量至少配置3张卡片,最多配置15张')
      return false
    }
    if (_.uniqBy(arr, 'sort').length !== arr.length) {
      haveError = true;
      message.warning('集卡配置的排序重复')
      return false
    }
    const prizeRangeTotal = list.reduce((total, item) => parseFloat(total, 10) + parseFloat(item.probability, 10), 0)
    if (prizeRangeTotal !== 100) {
      message.warning('所有卡片概率和应为100%')
      return false
    }
    if (haveError) return false;
    return {
      cardInfoList: list,
    }
  }

  render () {
    const { list } = this.state;
    const { onPreview } = this.props;
    return (
      <div>
        {list.map((card, index) => {
          return <CardCom
            key={card.key}
            onRef={(ref) => { this.allCardForm[`cardForm-${card.key}`] = ref }}
            deleteDetail={() => { this.deleteDetail(card, card.key) }}
            detail={card}
            cardIndex={index + 1}
            isSpecial
            onPreview={onPreview}
          />
        }
        )}
        <div
          className={styles.edit_active_add}
          onClick={() => this.addDetail()}
        >
          <Icon
            type="plus-circle"
            style={{ color: '#1890FF', fontSize: 16, marginRight: 10 }}
          />添加卡片
        </div>
      </div>
    );
  }
}

export default AllCard;
