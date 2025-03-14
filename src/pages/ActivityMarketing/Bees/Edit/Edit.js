import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './edit.less';
import ImgElement from '../Elements/ImgElement/ImgElement'// 图片组件
import TextElement from '../Elements/TextElement/TextElement'// 文字组件
import BannerElement from '../Elements/BannerElement/BannerElement'// 轮播组件
import ButtonElement from '../Elements/ButtonElement/ButtonElement'// 按钮组件
import GridWheelElement from '../Elements/GridWheelElement/GridWheelElement' // 九宫格组件
import FundsElement from '../Elements/FundsElement/FundsElement'  // 基金卡片组件
import MarqueeElement from '../Elements/MarqueeElement/MarqueeElement'  // 跑马灯组件
import TaskElement from '../Elements/TaskElement/TaskElement'  // 任务组件
import AudioElement from '../Elements/AudioElement/AudioElement'  // 音频组件
import VideoElement from '../Elements/VideoElement/VideoElement'  // 视频组件
import TopicPKElement from '../Elements/TopicPKElement/TopicPKElement'  // 话题PK组件
import RedRainElement from '../Elements/RedRainElement/RedRainElement'  // 红包雨组件
import ChatElement from '../Elements/ChatElement/ChatElement'  // 对话框组件
import SecretBoxElement from '../Elements/SecretBoxElement/SecretBoxElement'  // 盲盒组件
import HitEggElement from '../Elements/HitEggElement/HitEggElement';  // 砸金蛋组件
import BigWheelElement from '../Elements/BigWheelElement/BigWheelElement'  // 大转盘组件
import TigerMachineElement from '../Elements/TigerMachineElement/TigerMachineElement'  // 老虎机组件
import SignElement from '../Elements/SignElement/SignElement'  // 签到组件
import AnswerElement from '../Elements/AnswerElement/AnswerElement'  // 答题组件
import TabElement from '../Elements/TabElement/TabElement';  // TAB组件
import BlindBoxElement from '../Elements/BlindBoxElement/BlindBoxElement';  // 盲盒组件
import ExchangeElement from '../Elements/ExchangeElement/ExchangeElement';  // 兑换组件
import CollectionCardElement from '../Elements/CollectionCardElement/CollectionCardElement';  // 集卡组件
import CountDownElement from '../Elements/CountDownElement/CountDownElement';  // 倒计时
import ScratchCardElement from '../Elements/ScratchCardElement/ScratchCardElement';  // 刮刮卡组件
import BindGroupElement from '../Elements/BindGroupElement/BindGroupElement';  // 拼团组件
import LuckDogElement from '../Elements/LuckDogElement/LuckDogElement'; // 开奖组件
import NormalCommentElement from '../Elements/NormalCommentElement/NormalCommentElement';  // 常规评论组件
import OpposingCommentElement from '../Elements/OpposingCommentElement/OpposingCommentElement';  // 正反方评论组件
import GuessElement from '../Elements/GuessElement/GuessElement';  // 猜涨跌组件
import RankElement from '../Elements/RankElement/RankElement';  // 排行榜组件
import MonopolyElement from '../Elements/MonopolyElement/MonopolyElement';  // 理财街组件
import QuestionnaireElement from '../Elements/QuestionnaireElement/QuestionnaireElement';  // 问卷组件
import BarrageElement from '../Elements/BarrageElement/BarrageElement'; // 弹幕组件
import CustomElement from '../Elements/CustomElement/CustomElement' // 自定义组件
import AwardElement from '../Elements/AwardElement/AwardElement'; // 领奖组件
import LinkElement from '../Elements/LinkElement/LinkElement' // 文字链组件
import UnrecognizedElement from '../Elements/UnrecognizedElement/UnrecognizedElement';
import Integral from '../Elements/IntegralElement/IntegralElement';
import InviteElement from '../Elements/InviteElement/InviteElement'; // 邀请组件
import SloganElement from '../Elements/SloganElement/SloganElement'; // 口令组件
import ETFEnrollElement from '../Elements/ETFEnrollElement/ETFEnrollElement'; // ETF报名组件
import ETFHotRankElement from '../Elements/ETFHotRankElement/ETFHotRankElement'; // ETF热榜组件


// 不识别组件
@connect()
// @Form.create()
class Edit extends PureComponent {
  // 初始化数据
  state = {
    element: null,
    title: '',
  };

  componentDidMount() {
    this.renderElement();
  }

  componentWillReceiveProps( nextProps ) {
    if ( this.props.domData !== nextProps.domData ) {
      this.renderElement();
    }
  }

  // 组件渲染
  renderElement = () => {
    const { editObj, domData, changeDomData } = this.props;
    // 算出当前编辑的组件数据
    const elementsList = domData.elements ? domData.elements : [];
    const eleObj = elementsList.find( info => info.virtualId === editObj.virtualId ) || {};
    // 组件区分
    let element;
    let title;
    if ( editObj && editObj.type && editObj.type === 'IMAGE' ) {
      element = (
        <ImgElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "图片";
    } else if ( editObj && editObj.type && editObj.type === 'TEXT' ) {
      element = (
        <TextElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "文字";
    } else if ( editObj && editObj.type && editObj.type === 'BANNER' ) {
      element = (
        <BannerElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "轮播";
    } else if ( editObj && editObj.type && editObj.type === 'BUTTON' ) {
      element = (
        <ButtonElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "按钮";
    } else if ( editObj && editObj.type && editObj.type === 'MARQUEE' ) {
      element = (
        <MarqueeElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "跑马灯";
    } else if ( editObj && editObj.type && editObj.type === 'GRID_WHEEL' ) {
      element = (
        <GridWheelElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "九宫格";
    } else if ( editObj && editObj.type && editObj.type === 'FUNDS' ) {
      element = (
        <FundsElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "基金卡片";
    } else if ( editObj && editObj.type && editObj.type === 'TASK' ) {
      element = (
        <TaskElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "任务";
    } else if ( editObj && editObj.type && editObj.type === 'AUDIO' ) {
      element = (
        <AudioElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "音频";
    } else if ( editObj && editObj.type && editObj.type === 'VIDEO' ) {
      element = (
        <VideoElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "视频";
    } else if ( editObj && editObj.type && editObj.type === 'PK_TOPIC' ) {
      element = (
        <TopicPKElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "话题PK";
    } else if ( editObj && editObj.type && editObj.type === 'RED_RAIN' ) {
      element = (
        <RedRainElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "红包雨";
    } else if ( editObj && editObj.type && editObj.type === 'CHAT' ) {
      element = (
        <ChatElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "对话框";
    } else if ( editObj && editObj.type && editObj.type === 'BIG_WHEEL' ) {
      element = (
        <BigWheelElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "大转盘";
    } else if ( editObj && editObj.type && editObj.type === 'SLOT_MACHINE' ) {
      element = (
        <TigerMachineElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "老虎机";
    } else if ( editObj && editObj.type && editObj.type === 'SIGN' ) {
      element = (
        <SignElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "签到";
    } else if ( editObj && editObj.type && editObj.type === 'MYSTERY_BOX_2' ) {
      element = (
        <SecretBoxElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "盲盒2";
    } else if ( editObj && editObj.type && editObj.type === 'ANSWER' ) {
      element = (
        <AnswerElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "答题";
    } else if ( editObj && editObj.type && editObj.type === 'TAB' ) {
      element = (
        <TabElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "TAB";
    } else if ( editObj && editObj.type && editObj.type === 'MYSTERY_BOX' ) {
      element = (
        <BlindBoxElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "盲盒";
    } else if ( editObj && editObj.type && editObj.type === 'SMASH_EGG' ) {
      element = (
        <HitEggElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        /> );
      title = "砸金蛋";
    } else if ( editObj && editObj.type && editObj.type === 'EXCHANGE' ) {
      element = (
        <ExchangeElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );

      title = "兑换";
    } else if ( editObj && editObj.type && editObj.type === 'RANK' ) {
      element = (
        <RankElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "排行榜";
    } else if ( editObj && editObj.type && editObj.type === 'CARD' ) {
      element = (
        <CollectionCardElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "集卡";
    } else if ( editObj && editObj.type && editObj.type === 'CUSTOM' ) {
      element = (
        <CustomElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "自定义组件";
    } else if ( editObj && editObj.type && editObj.type === 'SCRATCH_CARD' ) {
      element = (
        <ScratchCardElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "刮刮卡";
    } else if ( editObj && editObj.type && editObj.type === 'BIND_GROUP' ) {
      element = (
        <BindGroupElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "拼团";
    } else if ( editObj && editObj.type && editObj.type === 'NORMAL_COMMENT' ) {
      element = (
        <NormalCommentElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "常规评论";
    } else if ( editObj && editObj.type && editObj.type === 'OPPOSING_COMMENT' ) {
      element = (
        <OpposingCommentElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "正反方评论";
    } else if ( editObj && editObj.type && editObj.type === 'GUESS' ) {
      element = (
        <GuessElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "猜涨跌";
    } else if ( editObj && editObj.type && editObj.type === 'LUCK_DOG' ) {
      element = (
        <LuckDogElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "锦鲤";
    } else if ( editObj && editObj.type && editObj.type === 'COUNTDOWN' ) {
      element = (
        <CountDownElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      )
      title = "倒计时";
    } else if ( editObj && editObj.type && editObj.type === 'QUESTIONNAIRE' ) {
      element = (
        <QuestionnaireElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      )
      title = "问卷";
    } else if ( editObj && editObj.type && editObj.type === 'MONOPOLY' ) {
      element = (
        <MonopolyElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      )
      title = "理财街";
    } else if ( editObj && editObj.type && editObj.type === 'BARRAGE' ) {
      element = (
        <BarrageElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "弹幕";
    } else if ( editObj && editObj.type && editObj.type === 'AWARD' ) {
      element = (
        <AwardElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "领奖";
    } else if ( editObj && editObj.type && editObj.type === 'LINK' ) {
      element = (
        <LinkElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "文字链";
    } else if ( editObj && editObj.type && editObj.type === 'INTEGRAL' ) {
      element = (
        <Integral
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "积分组件";
    } else if ( editObj && editObj.type && editObj.type === 'INVITE' ) {
      element = (
        <InviteElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "邀请组件";
    } else if ( editObj && editObj.type && editObj.type === 'SLOGAN' ) {
      element = (
        <SloganElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "口令组件";
    } else if ( editObj && editObj.type && editObj.type === 'ETF_ENROLL' ) {
      element = (
        <ETFEnrollElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "ETF报名组件";
    } else if ( editObj && editObj.type && editObj.type === 'ETF_HOT_RANK' ) {
      element = (
        <ETFHotRankElement
          domData={domData}
          changeDomData={changeDomData}
          eleObj={eleObj}
        />
      );
      title = "ETF热榜组件";
    } else {
      element = <UnrecognizedElement
        domData={domData}
        changeDomData={changeDomData}
        eleObj={eleObj}
      />
      title = '不识别的组件';
    }
    this.setState( { element, title } );
  }


  render() {
    const { element, title } = this.state;
    return (
      <div className={styles.edit}>
        <div className={styles.editTitle}>
          {title}组件设置
        </div>

        <div className={styles.editContent}>
          {element}
        </div>
      </div>
    )
  }

}

export default Edit;
