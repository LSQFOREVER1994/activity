/* eslint-disable no-unused-expressions */
import { message, notification } from 'antd';
import moment from 'moment';
import _ from 'lodash';
// import { object } from 'prop-types';

// 活动必填项配置
const activityRequired = [
  'name',
  // 'activityType',
  // 'startTime',
  // 'endTime',
  'state',
  'notStartTip',
  'endTip',
  // 'initCount',
  // 'dailyCount',
  // 'withoutEmpty',
  // 'theme',
]; // 'pauseTip'

// 组件必填项配置
const elementsRequiredObj = {
  // 按钮组件必填项配置
  BUTTON: ['label', 'style'],

  // 组合
  GROUP: ['label', 'style'],

  // 轮播组件必填项配置
  BANNER: ['label', 'direction', 'effect', 'pagination', 'autoplay', 'loop', 'images'],

  EMPTY: ['label'],

  POP_UP: ['label', 'background'],

  // 图片组件必填项配置
  IMAGE: ['label'],

  // 文字组件必填项配置
  TEXT: ['label', 'fontName'],

  // 拼图组件必填项配置
  PUZZLE_GAME: ['label', 'startButton', 'hasNoChangeTip', 'hasChangeTip', 'previewTime', 'puzzleTime', 'backgroundImage', 'showRemainingValue'],

  //  富文本组件必填项配置

  RICH_TEXT: ['label'],
  // 跑马灯组件必填项配置
  MARQUEE: ['label', 'clickEvent', 'direction'],

  LIKE: ['label'],

  QUESTIONNAIRE: ['label', 'popupTitle'],

  // 养成组件必填项配置
  FEED_UPGRADE: [
    'label',
    'pendingImg',
    'adoptBtnImg',
    'initImg',
    'upgradeImg',
    'upgradeBtnImg',
    'titleImg',
    'scoreImg',
  ],

  // 弹幕组件必填项配置
  BARRAGE: ['label'],

  // 九宫格组件必填项配置
  GRID_WHEEL: [
    'label',
    'showRemainingValue',
    'showAttendUser',
    'drawImage',
    'hasNoChangeTip',
    'hasChangeTip',
    'prizes',
  ],
  // 基金卡片组件必填项配置
  FUNDS: ['label', 'funds'],

  // 任务组件必填项配置
  TASK: ['label', 'task', 'goButton', 'finishButton'],

  // 音频组件必填项配置
  AUDIO: ['label', 'url', 'style'],

  // 视频组件必填项配置
  VIDEO: ['label', 'url', 'enable'],

  // 话题PK组件必填项配置
  PK_TOPIC: ['label', 'topic', 'positive', 'negative', 'endTime'],

  // 红包雨必填项配置
  RED_RAIN: ['label', 'gameTime', 'atLeast', 'prizes', 'drawButton', 'redPacket', 'clickRed'],

  // 视频组件必填项配置
  CHAT: ['label', 'chatItemList'],

  // 大转盘组件必填项配置
  BIG_WHEEL: ['label', 'borderImg', 'drawButton', 'hasChangeTip', 'hasNoChangeTip'],

  // 积分组件必填配置
  DATA: ['label', 'dataType'],

  // 邀请组件
  INVITE: ['label'],

  // 老虎机组件必填项配置
  SLOT_MACHINE: ['label', 'showRemainingValue', 'frameImage', 'drawImage', 'prizes', 'hasChangeTip', 'hasNoChangeTip'],

  // 签到组件必填项配置
  SIGN: [
    'label',
    'finish',
    'miss',
    'unSign',
    'lock',
    'label',
    'rule',
    'signDays',
    'signType',
    'buttonBefore',
    'buttonAfter',
    'prizeImg',
  ],

  // 签到组件必填项配置
  ACTIVITY_SIGN: [
    'label',
    'signedIcon',
    'missIcon',
    'unSignIcon',
    'lockIcon',
    'label',
    'rule',
    'signDay',
    'signType',
    'unSignBtnImg',
    'signedBtnImg',
    'prizeIcon',
  ],

  // 答题组件必填项配置
  ANSWER: ['label', 'showRemainingValue', 'startButton', 'tag', 'count', 'passAnswerNumber'],

  // 兑换组件必填项配置
  EXCHANGE_NEW: ['label', 'emptyInventoryExchangeButton', 'exchangeButton'],

  // 盲盒组件必填项配置
  MYSTERY_BOX: ['label', 'buttonBefore', 'prizes'],

  // TAB组件必填项配置
  TAB: ['label', 'tabItems'],

  // 集卡组件必填项配置
  CARD: [
    'label',
    'single',
    'cardType',
    'cardButton',
    'drawButton',
    'continueButton',
    'cardImage',
    'cardList',
    'prizes',
  ],

  // 倒计时组件必填项配置
  COUNTDOWN: ['label', 'endTime', 'isShowDays', 'effectType', 'endEffectType'],

  // 常规评论组件必填项配置
  NORMAL_COMMENT: ['label', 'commentTitle', 'publicCommentTitle'],

  // 正反方评论组件必填项配置
  OPPOSING_COMMENT: [
    'label',
    'positiveTitle',
    'negativeTitle',
    'positiveButton',
    'negativeButton',
    'topicId',
  ],

  // 猜涨跌组件必填项配置
  GUESS: ['label', 'riseButtonImage', 'fallButtonImage', 'indexConfigList', 'bettingOptions'],

  // 猜涨跌排行榜组件必填项配置
  RANK: ['label', 'showNumber', 'rankType'],

  // 拼团组件必填项配置
  BIND_GROUP: [
    'label',
    'memberAmount',
    'attendLimit',
    'inviteButtonImg',
    'drawButtonImg',
    'startGroupButtonImg',
    'awardButtonImg',
  ],

  //  接元宝组件
  RECEIVE_GOLD: [
    'label',
    'startButton',
    'background',
    'hasNoChangeTip',
    'hasChangeTip',
    'gameTimeLimit',
    'characterImage',
  ],

  // 合成游戏组件
  COMPOSITE_GAME: [
    'label',
    'startButton',
    'closeButton',
    'backgroundImage',
    'scoreFrameImg',
    'bottomImg',
    'hasNoChangeTip',
    'hasChangeTip',
  ],

  // 秒杀组件
  FLASH_SALE:['label', 'mallActId', 'shopId', 'originalPrice', 'spikePrice', 'backgroundImage', 'beforeButton', 'inStockButton', 'outStockButton', 'endButton', ],

  // 锦鲤
  LUCK_DOG: ['label', 'luckDog', 'price', 'attendButton', 'prizes'],

  // 自定义组件必填项配置
  CUSTOM: ['label'],

  // 二维码组件

  QRCODE: ['label', 'content'],

  // 未识别组件必填项配置
  // TODO: ['label', 'json'],

  // 刮刮卡组件必填项配置
  SCRATCH_CARD: [
    'label',
    // 'startTime',
    // 'endTime',
    'drawConsumeType',
    'showRemainingValue',
    'beforeScratch',
    'afterScratch',
    'prizes',
  ],

  // 大富翁组件必填项配置
  MONOPOLY: [
    'label',
    'doll',
    'single',
    'goAlongType',
    'maxStep',
    'isLoop',
    'images',
    'diceImages',
    'hasNoChangeTip',
    'hasChangeTip',
    'backgroundImage',
  ],

  // 问卷组件必填项配置
  // QUESTIONNAIRE: ['label', 'withPrize', 'buttonImage', 'question'],

  // 文字链组件必填项配置
  LINK: ['label'],

  // 领奖组件必填项配置
  AWARD: [
    'label',
    'showCount',
    'dateType',
    'countSize',
    'awardButton',
    'oneMoreButton',
    'finishButton',
    'prizeName',
    'prizeImg',
    'prizes',
  ],

  // 砸金蛋组件必填项配置
  SMASH_EGG: [
    'label',
    'showType',
    'eggsImages',
    'hammerImages',
    'bottomImage',
    'prizes',
    'hasNoChangeTip', 'hasChangeTip',
  ],
  PAGE: ['label', 'items'],

  // ETF热榜组件必填项配置
  ETF_HOT_RANK: ['label'],

  K_LINE_GAME: ['label', 'startButton', 'hasNoChangeTip', 'hasChangeTip'],
  ETF_RANK: ['label', 'datasourceId', 'rankStyle', 'showNum'],
  ETF_ENROLL: ['label', 'enrollButton', 'hasEnrollButton'],
  // 抓娃娃机组件必填项配置
  DOLL_MACHINE: ['label', 'hasNoChangeTip', 'hasChangeTip', 'gameTime', 'dropSpeed', 'backgroundImage', 'startButton'],
  VOTING:['label', 'showAttendUser', 'questionType', 'title', 'description', 'isShowVoteData', 'uncheckBackground', 'checkBackground', 'uncheckBackground', 'checkBackground', 'uncheckScaleBackground', 'checkScaleBackground'],
  FLIP: ['label', 'startFlipButton', 'pleaseFlipButton', 'cardBehind', 'cardFront', 'hasChangeTip', 'hasNoChangeTip'],

};

// 判断对象是否为空
const onEmptyObject = obj => {
  if ( !obj ) {
    return true;
  }
  const arr = Object.keys( obj );
  if ( arr.length === 0 ) {
    return true;
  }
  return false;
};

// 活动时间特殊检验

const onCheckBaseTime = ( timeList, type ) => {
  const baseSettingTip = {
    activitySettings: '活动基础设置',
    lotterySettings: '活动抽奖设置',
  }

  if ( timeList.length < 1 ) {
    message.error( `请填写${baseSettingTip[type]}指定时间段` )
    return false;
  }
  return timeList.every( ( timePeriod, i ) => {
    if ( !timePeriod || !timePeriod.startTime || !timePeriod.endTime ) {
      message.error( `请检查${baseSettingTip[type]}第${i + 1}个指定时间段是否填写完整` )
      return false;
    }

    const startTime = moment( timePeriod.startTime, 'HH:mm' );
    const endTime = moment( timePeriod.endTime, 'HH:mm' );

    if ( startTime.isSameOrAfter( endTime ) ) {
      message.error( `请检查${baseSettingTip[type]}第${i + 1}个指定时间段填写是否合法` )
      return false;
    }

    return true;
  } );
}

// 判断数据类型
const isType = obj => {
  const type = Object.prototype.toString.call( obj );
  if ( type === '[object Array]' ) return 'Array';
  if ( type === '[object Object]' ) return 'Object';
  return 'param is no object type';
};

// 数据检测
const onDataVerification = ( submitObj, requiredList = [] ) => {
  if ( onEmptyObject( submitObj ) ) return false;
  const arr = [];
  requiredList.forEach( info => {
    let isHas;
    // 判断为false时注意区分是否为boolean类型，是boolean类型给过
    if ( !submitObj[info] && typeof submitObj[info] !== 'boolean' ) isHas = false;
    if (
      !submitObj[info] &&
      typeof submitObj[info] === 'boolean' &&
      ( submitObj[info] === true || submitObj[info] === false )
    )
      isHas = true;
    // 判断字段类型
    if ( submitObj[info] ) {
      if ( isType( submitObj[info] ) === 'Object' ) {
        // 对象
        if ( submitObj.type !== 'CUSTOM' && onEmptyObject( submitObj[info] ) ) isHas = false;
        if ( !onEmptyObject( submitObj[info] ) ) isHas = true;
      } else if ( isType( submitObj[info] ) === 'Array' ) {
        // 数组
        if ( !submitObj[info].length || submitObj[info].length <= 0 ) isHas = false;
        if ( submitObj[info].length > 0 ) isHas = true;
      } else {
        isHas = true;
      }
    }
    if ( typeof submitObj[info] === 'number' ) isHas = true;
    arr.push( isHas );
  } );
  if ( arr.includes( false ) ) {
    return false;
  }
  return true;
};

// 校验活动基本信息
const onBaseVerification = ( baseData, requiredList, isSave ) => {
  const { appointDateType, appointDate, appointTimeType, appointTime, drawSetting, approvalConfig } = baseData || {};
  let isTrue = true
  let newRequiredList = requiredList;
  if ( baseData && baseData.state && baseData.state !== 'ENABLE' ) {
    // 当活动状态为暂停或禁用时，需要验证活动暂停提示语
    newRequiredList = [...requiredList, 'pauseTip'];
  }
  if ( baseData && baseData.timeType ) {
    // 当活动时间类型为起止时间，需检验活动开始结束时间
    newRequiredList = [...requiredList, 'startTime', 'endTime'];
  }
  if ( appointDateType !== 'DAILY' && !appointDate?.length ) {
    message.error( `请选择活动基本设置中${appointDateType === 'WEEKLY' ? '每周' : '每月'}的指定日期` )
    isTrue = false
  }
  if ( appointTimeType === "TIME_PERIOD" ) {
    isTrue = onCheckBaseTime( appointTime, 'activitySettings' )
  }
  if ( drawSetting && drawSetting.enableTidal ) {
    isTrue = onCheckBaseTime( drawSetting.tidalTime, 'lotterySettings' )
  }
  isTrue = isTrue && onDataVerification( baseData, newRequiredList );
  return isTrue;
};

// 列表内校验
const listKeyVerification = ( list, keys ) => {
  let whether = true;
  if ( list && list.length > 0 ) {
    list.forEach( item => {
      keys.forEach( kitem => {
        if ( !item[kitem] ) {
          whether = false;
        }
      } );
    } );
  } else {
    whether = false;
  }
  return whether;
};

// 计算奖品中概率
const reduceProbability = ( data, keyName ) => {
  let totalProbability = 0;
  if ( data && data.length > 0 ) {
    data.forEach( info => {
      totalProbability += info[keyName] * 1000;
    } );
  }
  const res = totalProbability / 1000;
  return res;
};

/**
 * 计算客群概率
 * @param {array} prizesData 奖品数据,dataKey: prizes or prizeList
 * @param {array} groupsData 客群概率数据 参数名格式： `${dataKey}CustomerGroups`
 * @returns { boolean } whether: true 概率为100% false 概率不为100%
 */
const reduceGroupProbability = ( prizesData, groupsData ) => {
  let whether = true;
  let msg = '';

  if ( groupsData && groupsData.length ) {
    groupsData.forEach( group => {
      if ( !group.taskEventId || !group.taskEventType || !group.name ) {
        whether = false;
        msg = `请检查${group.name || '客群名称'}配置是否填写完整`;
      }
      if ( group.probabilityList.length < prizesData.length ) {
        whether = false;
        msg = `请检查${group.name}各个奖品是否配置了客群概率`;
      }
      Object.keys( group.probabilityList[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( group.probabilityList, item ) !== 100 ) {
            whether = false;
            msg = `需要${group.name}中的奖品概率和为100%`;
          }
        }
      } );
    } )
  }
  if ( !whether ) {
    message.error( msg )
  }
  return whether;
};

// 文本特殊校验
const onTextVerification = infoData => {
  let whether = true;
  if ( !infoData.propValue.text ) {
    whether = false;
  }
  return whether;
};

// 富文本特殊校验
const onRichTextVerification = infoData => {
  // 去除p标签和空格
  const str = infoData.propValue.text.replace( /<p(?:(?!<\/p>).|\n)*?>/gm, "" ).replace( /<\/p>/gm, "" ).replace( /&nbsp;/gi, "" )
  let whether = true;
  if ( str === "" ) {
    whether = false;
  }
  return whether;
};

// 图片校验
const onImageVerification = infoData => {
  let whether = true;
  if ( !infoData.propValue.image ) {
    whether = false;
  }
  return whether;
};

// 九宫格特殊必填项校验
const onGridWheelVerification = ( infoData, num ) => {
  let whether = true;
  if ( infoData.prizes && infoData.prizes.length ) {
    const itemPositionList = [];
    infoData.prizes.forEach( info => {
      const list = info.itemPosition.split( ',' );
      list.forEach( item => {
        itemPositionList.push( item );
      } );
    } );
    const newItemPositionList = Array.from( new Set( itemPositionList ) );
    if ( newItemPositionList.length && newItemPositionList.length !== ( num || 8 ) ) {
      message.error( '奖品位未满！' );
      whether = false;
    }

    // 判断奖品概率
    Object.keys( infoData.prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( infoData.prizes, item ) !== 100 ) {
          message.error( '需要概率为100%' );
          whether = false;
        }
      }
    } );

    // 判断客群概率
    if ( !reduceGroupProbability( infoData.prizes, infoData.prizesCustomerGroups ) ) {
      whether = false
    }

  } else {
    whether = false;
  }

  return whether;
};

// 红包雨特殊必填项校验
const onGridRedRainVerification = infoData => {
  let whether = true;
  if ( infoData.prizes && infoData.prizes.length ) {
    // 判断奖品概率
    Object.keys( infoData.prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( infoData.prizes, item ) !== 100 ) {
          message.error( '需要概率为100%' );
          whether = false;
        }
      }
    } );

    // 判断客群概率
    if ( !reduceGroupProbability( infoData.prizes, infoData.prizesCustomerGroups ) ) {
      whether = false
    }

  } else {
    whether = false;
  }
  return whether;
};

// 排行榜特殊必填项校验
const onRankVerification = infoData => {
  let whether = true;
  const { rankCategoryTypes, isRankEligibility, taskEventType, taskEventId } = infoData;
  if ( !rankCategoryTypes || !rankCategoryTypes.length ) {
    whether = false;
  }
  if ( isRankEligibility && ( !taskEventId || !taskEventType ) ) {
    whether = false;
  }
  return whether;
};

// 单个任务校验
const onSingleTaskVerification = ( task = {}, type ) => {
  let isTrue = false;
  const { name, taskType, rewardValue, attendLimit, needSubCount, taskEventName } = task;
  if ( type === 'single' && name && ( rewardValue || rewardValue === 0 ) && attendLimit ) {
    if ( taskType === 'INVITE' ) {
      if ( taskEventName ) isTrue = true;
    } else if ( taskType === 'EVENT' ) {
      if ( taskEventName ) isTrue = true;
    } else {
      isTrue = true;
    }
  } else if (
    type === 'noSingle' &&
    name &&
    needSubCount &&
    ( rewardValue || rewardValue === 0 ) &&
    attendLimit
  ) {
    isTrue = true;
  } else if ( type === 'sub' && name && taskType ) {
    isTrue = true;
  }
  return isTrue;
};

// 任务卡片特殊必填项校验
const onTaskVerification = infoData => {
  let isTrue = true;
  const { task = {}, prizes = [], getButton } = infoData;
  const { rewardType, rewardValue, taskType, browseTime, isManual, description, attendLimit } = task;
  if ( isManual && !getButton ) isTrue = false;
  if ( !description ) isTrue = false
  if ( attendLimit === null || attendLimit === undefined ) isTrue = false
  if ( rewardType === 'PRIZE' && prizes.length === 0 ) isTrue = false;
  if ( !rewardValue && rewardValue !== 0 ) isTrue = false
  if ( infoData?.task.startTime && infoData?.task.endTime ) {
    const format = 'YYYY-MM-DD HH:mm:ss';
    const startTime = moment( infoData?.task.startTime, format );
    const endTime = moment( infoData?.task.endTime, format );
    const isLate = moment( endTime ).isAfter( startTime );
    if ( !isLate ) {
      message.error( '任务结束时间应晚于开始时间' );
      isTrue = false;
    }
  }
  if ( taskType === 'CLICK' && !browseTime && browseTime !== 0 ) {
    isTrue = false;
  }


  // if ( !isSingle && typeof isSingle !== 'boolean' ) isTrue = false;
  // if ( !isSingle && typeof isSingle === 'boolean' ) {
  //   // 多任务
  //   const parentTask = onSingleTaskVerification( task, 'noSingle' );
  //   const childTask = [];
  //   tasks.forEach( info => {
  //     const childTaskTrue = onSingleTaskVerification( info, 'sub' );
  //     childTask.push( childTaskTrue );
  //   } );
  //   isTrue = parentTask && !childTask.includes( false );
  // }
  // if ( isSingle && typeof isSingle === 'boolean' ) {
  //   // 单任务
  //   isTrue = onSingleTaskVerification( task, 'single' );
  // }
  // if ( !duration && typeof duration !== 'boolean' ) isTrue = false;
  return isTrue;
};

// 跑马灯特殊必填项校验
const onMarqueeVerification = infoData => {
  let isTrue = true;
  const { records = [] } = infoData;
  if ( records.length > 0 ) {
    records.forEach( item => {
      if ( !item ) {
        isTrue = false;
      }
    } );
  }
  return isTrue;
};

// 开始时间结束时间校验
const isStartTimeBefore = ( startTime, endTime ) => {
  if ( startTime && !endTime ) return true;
  if ( !startTime && endTime ) {
    message.error( '请选择开始时间' );
    return false
  }
  const start = moment( startTime );
  const end = moment( endTime );
  if ( !start.isBefore( end ) ) {
    message.error( '开始时间不能大于结束时间' );
  }
  return start.isBefore( end );
}

// 翻牌组件特殊校验
const onFlipVertification = infoData => {
  const { prizes, startTime, endTime, number } = infoData
  let whether = true;
  let positionCount = 0
  if ( startTime || endTime ) {
    whether = isStartTimeBefore( startTime, endTime )
  }

  prizes.forEach( ( item ) => {
    const positionStr = item.itemPosition
    const positionLength = positionStr.split( ',' )?.length || 0
    positionCount += positionLength
  } )

  if ( Number( positionCount ) !== Number( number ) ) {
    message.error( '奖项位置需与翻牌数量一致' )
    whether = false
  }

  if ( prizes && prizes.length ) {
    // 判断奖品概率
    Object.keys( prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( infoData.prizes, item ) !== 100 ) {
          message.error( '需要概率为100%' );
          whether = false;
        }
      }
    } );

    // 判断客群概率
    if ( !reduceGroupProbability( infoData.prizes, infoData.prizesCustomerGroups ) ) {
      whether = false
    }

  } else {
    whether = false;
  }

  return whether
}

// 集卡特殊校验
const onCardVerification = infoData => {
  const {
    cardList = [],
    prizes = [],
    prizeList = [],
    cardType,
    single,
    drawType,
    startTime,
    endTime,
    openTime,
  } = infoData;
  let whether = true;
  if ( drawType === 'TIMING' && !openTime ) {
    message.error( '请填写抽奖开放时间' );
    whether = false;
  }
  if ( startTime && endTime ) {
    if (
      moment( openTime ).valueOf() < moment( startTime ).valueOf() ||
      moment( openTime ).valueOf() > moment( endTime ).valueOf()
    ) {
      message.error( '抽奖活动时间需在活动有效期内' );
      whether = false;
    }
  }
  if ( prizes && prizes.length ) {
    // 判断奖品概率
    Object.keys( prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( prizes, item ) !== 100 ) {
          message.error( '抽奖奖品需要概率为100%' );
          whether = false;
        }
      }
    } );
    // 判断客群概率
    if ( !reduceGroupProbability( prizes, infoData.prizesCustomerGroups ) ) {
      whether = false
    }
  } else {
    whether = false;
  }

  // 卡片组判断
  if ( cardType && cardType === 'FIVE' && cardList.length !== 5 ) whether = false;
  if ( cardType && cardType === 'EIGHT' && cardList.length !== 8 ) whether = false;
  if ( cardList && cardList.length ) {
    const arr = ['name', 'frontImage', 'inventory', 'dayMaxCount', 'probability'];
    cardList.forEach( item => {
      arr.forEach( kitem => {
        if ( typeof item[kitem] !== 'number' ) {
          if ( !item[kitem] ) {
            whether = false;
          }
        }
      } );
    } );
    Object.keys( cardList[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( cardList, item ) !== 100 ) {
          message.error( '卡片需要概率总和为100%' );
          whether = false;
        }
      }
    } );
  } else {
    whether = false;
  }

  // 配置单卡抽奖时，单卡奖品必须配置
  if ( single && prizeList.length > 0 ) {
    if ( prizeList && prizeList.length ) {
      // 判断奖品概率
      Object.keys( prizeList[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( prizeList, item ) !== 100 ) {
            message.error( '卡片奖品需要概率为100%' );
            whether = false;
          }
        }
      } );

      // 判断客群概率
      if ( !reduceGroupProbability( prizeList, infoData.prizeListCustomerGroups ) ) {
        whether = false
      }

    } else {
      whether = false;
    }
  }
  if ( single && prizes.length <= 0 ) {
    whether = false;
  }

  return whether;
};

// 倒计时特殊校验
const onCountDownVerification = infoData => {
  let isTrue = true;
  const { endEffectType, copywriting } = infoData;
  if ( endEffectType === 'COPYWRITING' && !copywriting ) {
    isTrue = false;
  }
  return isTrue;
};

const onLuckDogVerification = ( infoData = {} ) => {
  const { luckDog = {} } = infoData;
  let isTrue = true;
  // 配置项判断
  if ( luckDog && Object.keys( luckDog ).length > 0 ) {
    if ( !luckDog.score ) {
      isTrue = false;
    } else if ( !luckDog.openTime ) {
      isTrue = false;
    }
  }
  return isTrue;
};

// 大富翁特殊校验
const onMonoPolyVerification = ( infoData = {} ) => {
  const { startTime, endTime, images, diceImages, single, hasLoopPrize, luckyGrids, prizes, prizeList } = infoData;
  let text = '';
  let isTrue = true;
  if ( startTime && endTime ) {
    isTrue = moment( endTime ).isAfter( startTime );
    if ( !isTrue ) {
      message.error( '结束时间应晚于开始时间' );
    }
  }
  // 配置项判断
  images?.forEach( i => {
    if ( !i ) {
      text = '检查格子配置是否都上传了图片'
      isTrue = false
    }
  } );
  diceImages?.forEach( i => {
    if ( !i ) {
      text = '检查骰子配置是否都上传了图片'
      isTrue = false
    }
  } );

  if ( single ) {
    if ( !luckyGrids || !luckyGrids.length ) {
      message.error( '请配置抽奖格子' );
      isTrue = false;
    } else {
      let hasCommonDraw = false
      luckyGrids.forEach( i => {
        if ( i.gridId === undefined || !i.image ) {
          message.error( '请检查抽奖格子配置每个格子配置项是否填写完整' );
          isTrue = false
        }
        if ( i.gridType === 'DRAW' ) {
          if ( !i.prizes || !i.prizes.length ) {
            message.error( '请配置格子对应独立奖池奖品' );
            isTrue = false
          } else {
            Object.keys( i.prizes[0] ).forEach( item => {
              if ( item.indexOf( 'probability' ) > -1 ) {
                if ( reduceProbability( i.prizes, item ) !== 100 ) {
                  message.error( '每个格子独立奖池需要概率为100%' );
                  isTrue = false;
                }
              }
            } );
            // 判断客群概率
            if ( !reduceGroupProbability( i.prizes, i.prizesCustomerGroups ) ) {
              isTrue = false
            }
          }
        } else if ( i.gridType === 'COMMON_DRAW' ) {
          hasCommonDraw = true
        }
      } )
      if ( hasCommonDraw ) {
        if ( !prizeList || !prizeList.length ) {
          message.error( '请配置格子通用奖池' );
          isTrue = false;
        } else {
          // 判断格子通用奖品概率
          Object.keys( prizeList[0] ).forEach( item => {
            if ( item.indexOf( 'probability' ) > -1 ) {
              if ( reduceProbability( prizeList, item ) !== 100 ) {
                message.error( '格子通用奖池需要概率为100%' );
                isTrue = false;
              }
            }
          } );
          // 判断客群概率
          if ( !reduceGroupProbability( prizeList, infoData.prizeListCustomerGroups ) ) {
            isTrue = false
          }
        }
      }
    }
  }

  if ( hasLoopPrize ) {
    if ( !prizes || !prizes.length ) {
      message.error( '请配置单圈/终点奖池' );
      isTrue = false;
    } else {
      // 判断终点奖品概率
      Object.keys( prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( prizes, item ) !== 100 ) {
            message.error( '抽奖奖品需要概率为100%' );
            isTrue = false;
          }
        }
      } );
      // 判断客群概率
      if ( !reduceGroupProbability( prizes, infoData.prizesCustomerGroups ) ) {
        isTrue = false
      }
    }
  }
  if ( text ) {
    message.error( text );
  }
  return isTrue;
};

// 问卷特殊校验
const onQuestionVerification = ( infoData = {} ) => {
  const { question, submitButtonImage, submitButtonStyle, startTime, endTime } = infoData;
  const startMoment = moment( startTime );
  const endMoment = moment( endTime );
  let whether = true;

  // 判断是否配置题目
  if ( !question || question.length <= 0 ) whether = false;

  if( startTime && endTime && startMoment.isAfter( endMoment ) ){
    message.error( '问卷开始时间需要小于结束时间！' );
    whether = false
  }

  // 题目组判断
  if ( question && question.length > 0 ) {
    const optionListContain = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'DROP_DOWN']
    if ( submitButtonStyle !== "DEFAULT" && !submitButtonImage ) {
      message.warning( '自定义样式的按钮图片为空！' );
      whether = false
    }
    question.forEach( item => {
      if ( !item?.topic ) {
        message.warning( '存在题目的类型未选择！' );
        whether = false
        return
      }
      if ( !item?.title ) {
        message.warning( '存在题目的标题未填写！' );
        whether = false
        return
      }

      if ( optionListContain.includes( item.topic ) && !item?.optionsList?.length ) {
        message.warning( '存在题目的选项为空！' );
        whether = false
      }
    } )
  }
  return whether;
};

// 刮刮卡特殊校验
const onScratchCardVerification = ( infoData = {} ) => {
  const { prizes } = infoData;
  let whether = true;
  // 判断配置奖品
  if ( !prizes || prizes.length <= 0 ) whether = false;

  // 判断奖品概率
  if ( prizes && prizes.length > 0 ) {
    Object.keys( prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( prizes, item ) !== 100 ) {
          message.error( '抽奖奖品需要概率为100%' );
          whether = false;
        }
      }
    } );

    // 判断客群概率
    if ( !reduceGroupProbability( prizes, infoData.prizesCustomerGroups ) ) {
      whether = false
    }
  }
  return whether;
};

// 文字链特殊校验
const onLinkVerification = ( infoData = {} ) => {
  const { wordLinkList = [] } = infoData;
  let whether = true;
  // 文字链内容校验
  const emptyLinks = wordLinkList.find( it => it.content === '' );
  if ( typeof emptyLinks !== 'undefined' ) whether = false;
  return whether;
};

// 领奖特殊校验
const onAwardVerification = ( infoData = {} ) => {
  const { showCount, countSize, prizes = [] } = infoData;
  let whether = true;
  // 关联奖品列表空值校验
  const keyVerification = ['image', 'relationPrizeType', 'relationPrizeId', 'name', 'expireType'];
  const prizesPassed = prizes.every( prize => {
    if ( prize.rewardType === "PRIZE" ) {
      const filterPrize = [];
      keyVerification.forEach( key => {
        // 根据过期类型获取对应值
        if ( key === 'expireType' ) {
          if ( prize[key] === 'TIME' ) {
            filterPrize.push( prize.expireTime );
          } else if ( prize[key] === 'DAYS' ) {
            filterPrize.push( prize.expireDays );
          }
        } else {
          filterPrize.push( prize[key] );
        }
      } );
      return filterPrize.every( it => !!it );
    }
    return true;
  } );
  // 领取人次展示时需要校验领取人次字号
  if ( ( showCount && !countSize ) || !prizesPassed ) {
    whether = false;
  }
  return whether;
};

// 签到特殊校验 TODO: 
const onActivitySignVerification = ( infoData = {} ) => {
  const { reachRewards = [], prizeList, dailyRewardType, rewardEnable, startTime, endTime } = infoData;
  const startMoment = moment( startTime );
  const endMoment = moment( endTime );
  let whether = true;
  let msg = "";
  const arrDays = [];
  if ( dailyRewardType === 'PRIZE' && prizeList && prizeList.length ) {
    // 每日奖励类型为奖品&奖品概率
    if ( reduceProbability( prizeList, 'probability' ) !== 100 ) {
      whether = false;
      msg = '每日奖励奖品总概率需要为100%'
    }
    // 判断客群概率
    if ( !reduceGroupProbability( prizeList, infoData.prizeListCustomerGroups ) ) {
      whether = false
    }
  }

  if ( reachRewards.length === 0 && rewardEnable ) {
    whether = false;
    msg = "未设置达标天数奖励，请添加达标天数奖励！"
  } else if ( rewardEnable ) {
    reachRewards.forEach( item => {
      if ( !item.conditionValue ) {
        whether = false;
        msg = '未设置达标天数！';
        return;
      }
      if ( arrDays.indexOf( item.conditionValue ) !== -1 ) {
        whether = false;
        msg = `达标天数奖励：${item.conditionValue} 已重复！`;
        return;
      }
      arrDays.push( item.conditionValue );
      if ( item.prizes?.length === 0 ) {
        whether = false;
        msg = `达标天数奖励：${item.conditionValue} 未填写奖品！`;
        return;
      }
      if ( reduceProbability( item.prizes, 'probability' ) !== 100 ) {
        whether = false;
        msg = `达标天数奖励：${item.conditionValue} 抽奖奖品总概率需要为100%！`;
      }
      // 判断客群概率
      if ( !reduceGroupProbability( item.prizes, item.prizesCustomerGroups ) ) {
        whether = false
      }
    } )
  }
  if( startTime && endTime && startMoment.isAfter( endMoment ) ){
    message.error( '签到开始时间需要小于结束时间！' );
    whether = false
  }
  if( !startTime && endTime ) {
    message.error( '请选择签到开始时间！' );
    whether = false
  }

  if ( !whether ) {
    notification.warn( {
      message: "签到组件校验失败",
      description: msg,
    } )
  }
  return whether;
};

// 签到特殊校验
const onSignVerification = ( infoData = {} ) => {
  const { prizes = [] } = infoData;
  let whether = true;
  // 关联奖品列表空值校验
  if ( infoData.rewardType === 'PRIZE' ) {
    if ( !prizes.length ) {
      message.error( '当前需要填写奖品' );
      whether = false;
    } else if ( prizes && prizes.length > 0 ) {
      Object.keys( prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( prizes, item ) !== 100 ) {
            message.error( '抽奖奖品需要概率为100%' );
            whether = false;
          }
        }
      } );
      // 判断客群概率
      if ( !reduceGroupProbability( prizes, infoData.prizesCustomerGroups ) ) {
        whether = false
      }
    }
  } else if ( infoData.rewardType !== 'PRIZE' && ( !infoData.rewardValue && infoData.rewardValue !== 0 ) ) {
    whether = false;
  }

  return whether;
};

// 老虎机组件内奖品校验
const onTigerVerification = infoData => {
  let whether = true;
  const { prizes } = infoData;

  if ( prizes && prizes.length ) {
    if ( prizes.length && prizes.length < 3 ) {
      message.error( '奖品位未满！请配置至少三个奖品' );
      whether = false;
    }

    // 判断配置奖品
    if ( !prizes || prizes.length <= 0 ) whether = false;

    // 判断奖品概率
    if ( prizes && prizes.length > 0 ) {
      Object.keys( prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( prizes, item ) !== 100 ) {
            message.error( '抽奖奖品需要概率为100%' );
            whether = false;
          }
        }
      } );

      // 判断客群概率
      if ( !reduceGroupProbability( prizes, infoData.prizesCustomerGroups ) ) {
        whether = false
      }

    }
    return whether;
  }
  return true;
};

// 邀请组件内校验
const onInviteVerification = infoData => {
  const {
    inviteeSetting,
    inviterSetting,
    bindingType,
    inviteButton,
    showType,
    showStyle,
    task,
    goButton,
    finishButton,
    inviterLimit,
  } = infoData;
  let whether = true;
  if ( inviterLimit ) {
    if ( !inviterSetting.limit || !inviterSetting.attendType ) {
      whether = false;
      return whether;
    }
  }

  if ( !inviterSetting.rewardType ) {
    whether = false;
    return whether;
  }
  // if ( !inviteeSetting.rewardType ) {
  //   whether = false;
  //   return whether;
  // }

  // if ( inviteeSetting.rewardType && inviteeSetting.rewardType !== 'PRIZE' ) {
  //   if ( !inviteeSetting.rewardValue && inviteeSetting.rewardValue !== 0 ) {
  //     whether = false;
  //     return whether;
  //   }
  // }

  if ( inviterSetting.rewardType && inviterSetting.rewardType !== 'PRIZE' ) {
    if ( !inviterSetting.rewardValue && inviterSetting.rewardValue !== 0 ) {
      whether = false;
      return whether;
    }
  }
  if ( bindingType === 'AUTO' ) {
    if ( !inviteButton ) {
      whether = false;
      return whether;
    }
  }
  if ( showType === 'POP_WINDOWS' ) {
    const { name } = task || {};
    if ( !name || !goButton || !finishButton ) {
      whether = false;
      return whether;
    }
    if( showStyle === 'BUTTON' && !inviteButton ){
      whether = false;
      return whether;
    }
  }
  if ( inviteeSetting.enable ) {
    if ( !inviteeSetting.eventType || !inviteeSetting.eventId ) {
      whether = false;
      return whether;
    }
  }
  if ( inviterSetting.enable ) {
    if ( !inviterSetting.eventType || !inviterSetting.eventId ) {
      whether = false;
      return whether;
    }
  }
  if ( inviteeSetting.rewardType === 'PRIZE' ) {
    if ( inviteeSetting.prizes && inviteeSetting.prizes.length ) {
      // 判断奖品概率
      Object.keys( inviteeSetting.prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( inviteeSetting?.prizes, item ) !== 100 ) {
            message.error( '需要概率为100%' );
            whether = false;
          }
        }
      } );
      // 判断客群概率
      if ( !reduceGroupProbability( inviteeSetting?.prizes, inviteeSetting?.prizesCustomerGroups ) ) {
        whether = false
      }
    } else {
      whether = false;
    }
  }

  if ( inviterSetting.rewardType === 'PRIZE' ) {
    if ( inviterSetting.prizes && inviterSetting.prizes.length ) {
      // 判断奖品概率
      Object.keys( inviterSetting.prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( inviterSetting.prizes, item ) !== 100 ) {
            message.error( '需要概率为100%' );
            whether = false;
          }
        }
      } );
      // 判断客群概率
      if ( !reduceGroupProbability( inviterSetting?.prizes, inviterSetting?.prizesCustomerGroups ) ) {
        whether = false
      }
    } else {
      whether = false;
    }
  }

  return whether;
};

// 自定义组件特殊必填项校验
const onCustomVerification = infoData => {
  let whether = true;
  if ( !infoData.propValue.key || !infoData.propValue.json ) {
    whether = false;
  }
  return whether;
};

const onAnswerVerification = infoData => {
  let whether = true;
  if ( infoData?.startTime && infoData?.endTime ) {
    const format = 'YYYY-MM-DD';
    const startTime = moment( infoData?.startTime, format );
    const endTime = moment( infoData?.endTime, format );
    const isTure = moment( endTime ).isAfter( startTime );
    if ( !isTure ) {
      message.error( '答题结束时间应晚于开始时间' );
      return false;
    }
  }
  if( !infoData.tag?.id ){
    whether = false
    return whether
  }
  if ( !infoData.withPrize ) return whether;
  if ( infoData.rewardType === 'INTEGRAL' ) {
    if ( !infoData.integralType ) whether = false;
    if ( !infoData.score && infoData.score !== 0 ) whether = false;
    return whether;
  }
  if ( infoData.rewardType === 'LEFT_COUNT' ) {
    if ( !infoData.rewardCount && infoData.rewardCount !== 0 ) {
      whether = false;
      return whether;
    }
  }
  if ( infoData.rewardType === 'PRIZE' ) {
    // 判断配置奖品
    if ( !infoData?.prizes || infoData?.prizes.length <= 0 ) return false;
    Object.keys( infoData.prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( infoData.prizes, item ) !== 100 ) {
          message.error( '需要概率为100%' );
          whether = false;
        }
      }
    } );
    // 判断客群概率
    if ( !reduceGroupProbability( infoData.prizes, infoData.prizesCustomerGroups ) ) {
      whether = false
    }
    return whether;
  }
  return whether;
};

// 兑换组件特殊必填项校验
const onExchangeVerification = infoData => {
  let whether = true;
  if ( !infoData.prizeGroupList || infoData.prizeGroupList.length === 0 ) {
    message.error( '请至少有1个商品分类' );
    whether = false;
    return whether;
  }
  // 检验每个分类是否存在有没有奖品
  const isNoPrize = infoData.prizeGroupList.some( item => {
    if ( item.prizeList.length === 0 ) {
      message.error( '请确保每个分类至少有1个奖品' );
      return true;
    }
    return false;
  } );
  whether = !isNoPrize;
  return whether;
};

// 养成组件特殊必填项校验
const onFeedChangeVerification = infoData => {
  let emptyNum = 0
  const { levels = [] } = infoData
  levels.forEach( ( item ) => {
    if ( !item.image || !item.name || ( !item.expValue && item.expValue !== 0 ) ) {
      emptyNum += 1
    }
  } )
  return !emptyNum
}

// 弹幕组件特殊校验
const onBarrageVerification = infoData => {
  let isTrue = true;
  const { records = [] } = infoData;
  if ( records.length > 0 ) {
    records.forEach( item => {
      if ( !item ) {
        isTrue = false;
      }
    } );
  }
  return isTrue;
}

// ETF排行榜组件校验
const onEFTRank = infoData => {
  let isTrue = true;
  const { rankTypeList, fields } = infoData;
  if ( rankTypeList.length < 2 ) {
    isTrue = false
    message.error( '最少勾选两个榜单' )
  }
  if ( fields.length < 3 ) {
    isTrue = false
    message.error( '最少展示三个字段' )
  }
  return isTrue
}

// ETF热榜组件校验
const onEFTHotRank = infoData => {
  let isTrue = true;
  const { ranks } = infoData;
  ranks.forEach( item => {
    if ( item.manual ) {
      item.funds.forEach( i => {
        if ( !i.fundId ) {
          message.error( '请选择人工配置榜单基金' )
          isTrue = false
        }
      } )
    }
  } )

  return isTrue
}



// TODO：检查合成游戏组件分段区间是否存在交叉⬇
const findFirstOverlap = ( arr ) => {
  const firstOverlapIndex = arr.findIndex( ( currentRange, currentIndex ) => {
    const currentMin = currentRange.minScore;
    const currentMax = currentRange.maxScore
    return arr.slice( currentIndex + 1 ).some( otherRange => {
      const otherMin = otherRange.minScore;
      const otherMax = otherRange.maxScore
      return (
        ( currentMin >= otherMin && currentMin <= otherMax ) ||
        ( currentMax >= otherMin && currentMax <= otherMax ) ||
        ( otherMin >= currentMin && otherMax <= currentMax )
      );
    } );
  } )
  return firstOverlapIndex;
}

const checkSubsectionFunc = ( list ) => {
  let whether = true;
  const checkScoreRewardsSection = findFirstOverlap( list );
  const checkScoreRewardsData = list.length && list.map( item => {
    if ( ( !item.minScore && item.minScore !== 0 ) && ( !item.maxScore && item.maxScore !== 0 ) ) {
      return true
    }
    if ( ( !item.minScore && item.minScore !== 0 ) || ( !item.maxScore && item.maxScore !== 0 ) || ( item.minScore >= item.maxScore ) ) {
      return false
    }
    if ( item.minScore === 0 && item.maxScore === 0 ) {
      return false
    }
    return true;
  } )
  const checkScoreRewards = list.length > 0 ? checkScoreRewardsData.findIndex( item => ( item === false ) ) : -1;
  // 检查分段最小值最大值是否填写完整
  if ( checkScoreRewards !== -1 ) {
    message.error( `请确保第${checkScoreRewards + 1}个分段数据填写完整` )
    return false
  }

  // 检查分段区间是否存在交叉
  if ( checkScoreRewardsSection !== -1 ) {
    message.error( `请检查的分段区间设置，第${checkScoreRewardsSection + 1}区间与其他区间存在交叉` )
    return false
  }

  list.forEach( ( i, index ) => {
    if ( i.minScore || i.maxScore ) {
      if ( !i.prizes || i.prizes.length <= 0 ) {
        message.error( `请检查第${index + 1}个分段是否有配置奖品` )
        whether = false;
        return false
      }
      Object.keys( i.prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( i.prizes, item ) !== 100 ) {
            message.error( '需要概率为100%' );
            whether = false
            return false;
          }
        }
      } );
      // 判断客群概率
      if ( !reduceGroupProbability( i.prizes, i.prizesCustomerGroups ) ) {
        whether = false
      }
    }
  } )
  return whether;
}

const onBigwaterMelon = infoData => {
  let whether = true;
  const { elementsImg, gameProps, scoreRewards } = infoData
  const checkElementImg = elementsImg.some( item => ( item === '' ) )
  const checkGameProps = gameProps.findIndex( item => ( item.enable && !item.cycleInitCount && item.cycleInitCount !== 0 ) || ( item.enable && !item.desc ) )
  const checkScoreRewardsSection = findFirstOverlap( scoreRewards )
  const checkScoreRewardsData = scoreRewards.length && scoreRewards.map( item => {
    if ( ( !item.minScore && item.minScore !== 0 ) && ( !item.maxScore && item.maxScore !== 0 ) ) {
      return true
    }
    if ( ( !item.minScore && item.minScore !== 0 ) || ( !item.maxScore && item.maxScore !== 0 ) || ( item.minScore >= item.maxScore ) ) {
      return false
    }
    if ( item.minScore === 0 && item.maxScore === 0 ) {
      return false
    }
    return true;
  } )
  const checkScoreRewards = scoreRewards.length > 0 ? checkScoreRewardsData.findIndex( item => ( item === false ) ) : -1;

  // 检查合成元素图标是否满足十一个
  if ( checkElementImg ) {
    message.error( '请确保合成元素图标数量为11个' )
    return false
  }
  // 检查道具数据是否填写完整
  if ( checkGameProps !== -1 ) {
    message.error( `请确保第${checkGameProps + 1}个道具数据填写完整` )
    return false
  }
  // 检查分段最小值最大值是否填写完整
  if ( checkScoreRewards !== -1 ) {
    message.error( `请确保第${checkScoreRewards + 1}个分段数据填写完整` )
    return false
  }
  // 检查分段区间是否存在交叉
  if ( checkScoreRewardsSection !== -1 ) {
    message.error( `请检查的分段区间设置，第${checkScoreRewardsSection + 1}区间与其他区间存在交叉` )
    return false
  }
  // 检查奖品概率是否为百分百
  scoreRewards.forEach( ( i, index ) => {
    if ( i.minScore || i.maxScore ) {
      if ( !i.prizes || i.prizes.length <= 0 ) {
        message.error( `请检查第${index + 1}个分段是否有配置奖品` )
        whether = false
        return false
      }
      Object.keys( i.prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( i.prizes, item ) !== 100 ) {
            message.error( '需要概率为100%' );
            whether = false;
          }
        }
      } );
      // 判断客群概率
      if ( !reduceGroupProbability( i.prizes, i.prizesCustomerGroups ) ) {
        whether = false
      }
    }
    return undefined
  } )
  return whether

}

const onReceiveGoldVerification = infoData => {
  let whether = true;
  const { scoreRewards, propSettings } = infoData;
  whether = checkSubsectionFunc( scoreRewards );
  const probability = propSettings.reduce( ( sum, obj ) => sum + obj.probability, 0 );
  console.log( probability, 'probability' );
  if ( probability !== 100 ) {
    message.error( '所有道具概率之和需为100%' );
    return false;
  }
  return whether;
}

const onPageMelon = infoData => {
  const whether = true;
  const { items = [] } = infoData;
  if ( items.length <= 0 ) {
    message.error( '请至少有一个页面' )
    return false
  }
  return whether
}

const checkAdvancedSetting = ( advancedSetting ) => {
  const { showTimeType, startDateTime, endDateTime, startTime, endTime } = advancedSetting;
  if ( showTimeType === 'NONE' || !Object.entries( advancedSetting ).length ) {
    return true;
  }
  if ( ( showTimeType === 'DATETIME' && ( !startDateTime || !endDateTime ) ) ||
    ( showTimeType === 'LOCALTIME' && ( !startTime || !endTime ) ) ) {
    message.warning( '请检查高级设置是否填写完整' );
    return false;
  }
  const format = showTimeType === 'DATETIME' ? 'YYYY-MM-DD HH:mm:ss' : 'HH:mm:ss';
  const newStartTime = moment( showTimeType === 'DATETIME' ? startDateTime : startTime, format );
  const newEndTime = moment( showTimeType === 'DATETIME' ? endDateTime : endTime, format );
  const isLate = moment( newEndTime ).isAfter( newStartTime );
  if ( !isLate ) {
    message.error( '组件展示结束时间应晚于开始时间' );
    return false;
  }
  return true;
};

const kLineGameVerification = ( infoData ) => {
  if ( infoData.enableWinAward ) {
    if ( !infoData.prizes ) {
      message.error( "未配置获胜奖品！" )
      return false;
    }
    if ( infoData.prizes.reduce( ( sum, obj ) => sum + obj.probability, 0 ) !== 100 ) {
      message.error( "获胜奖品配置概率应为100%！" )
      return false;
    }
  }
  if ( infoData.enableDrawAward ) {
    if ( !infoData.drawPrizeList ) {
      message.error( '未配置平局奖品！' );
      return false;
    }
    if ( infoData.drawPrizeList.reduce( ( sum, obj ) => sum + obj.probability, 0 ) !== 100 ) {
      message.error( '平局奖品配置概率应为100%！' );
      return false;
    }
  }
  return true;
}

const onLikeElementVerification = ( infoData ) => {
  if ( infoData.likeStyle === 'CUSTOM' ) {
    if ( !infoData.customLikeIcon ) {
      message.error( '未上传激活图标！' );
      return false;
    } if ( !infoData.customUnLikeIcon ) {
      message.error( '未上传未激活图标！' );
      return false;
    }
  }
  return true
}

const onETFEnrolllementVerification = ( infoData ) => {
  const { enableAward, enrollNumber } = infoData || {};
  if ( enableAward && !enrollNumber ) return false;
  return true
}


// 拼图游戏特殊校验
const onPuzzleGameVerification = ( infoData ) => {
  const { puzzleGames, prizes } = infoData
  let whether = true

  if ( !puzzleGames?.length ) {
    message.error( '请设置拼图信息！' )
    whether = false
  }
  puzzleGames.forEach( ( item ) => {
    if ( !item.name || !item.image || !item.width || !item.height ) {
      message.error( '尚有拼图设置未填写完毕' )
      whether = false
    }
  } )

  if ( prizes && prizes.length ) {
    // 判断奖品概率
    Object.keys( prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( prizes, item ) !== 100 ) {
          message.error( '抽奖奖品需要概率为100%' );
          whether = false;
        }
      }
    } );
    // 判断客群概率
    if ( !reduceGroupProbability( prizes, infoData.prizesCustomerGroups ) ) {
      whether = false
    }

  } else {
    whether = false;
  }

  return whether

}

// 抓娃娃机组件特殊校验
const onDollMachineVerification = ( infoData ) => {
  let whether = true;
  const { scoreRewards } = infoData;
  whether = checkSubsectionFunc( scoreRewards );
  return whether;
}

const onModalVerification = ( infoData ) => {
  let whether = true;
  const { popType, content, confirmText, confirmIcon, confirmStyle, isShowConfirm } = infoData || {}
  if ( popType === 'RICH' && !content ) {
    message.error( '富文本内容为空！' );
    whether = false
  }
  if ( confirmStyle === 'DEFAULT' && isShowConfirm ) {
    if ( !confirmText ) {
      whether = false
    }
  } else if ( !confirmIcon  && confirmStyle === 'IMAGE' ) {
    whether = false
  }

  return whether
}

const onTabVerification = ( infoData ) => {
  let whether = true;
  const { tabItems } = infoData || {}
  const choosePageArr = ['CURRENT', 'ACTIVITY']
  const isNoPageName = tabItems.some( item => !item.pageName && choosePageArr.includes( item.type ) )
  if( isNoPageName ){
    message.error( 'Tab列表中有未选择页面的tab!' );
    whether = false
  }
  return whether
}

const onVotingVerification = ( infoData ) => {
  let whether = true
  const { questionType, submitButtonImage, optionsList } = infoData
  if( questionType ==='MULTIPLE_CHOICE' && !submitButtonImage ) whether = false
  if( !optionsList.length ) whether = false
  if( optionsList.length ){
    optionsList.forEach( item => {
      if( !item.context ) whether = false
    } )
  }
  return whether
}

const onBindGroupVerification = ( infoData ) => {
  let whether = true;
  if ( infoData.prizes && infoData.prizes.length ) {
    // 判断奖品概率
    Object.keys( infoData.prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( infoData.prizes, item ) !== 100 ) {
          message.error( '需要概率为100%' );
          whether = false;
        }
      }
    } );
    // 判断客群概率
    if ( !reduceGroupProbability( infoData.prizes, infoData.prizesCustomerGroups ) ) {
      whether = false
    }

  } else {
    whether = false;
  }

  if ( infoData.prizeList && infoData.prizeList.length ) {
    // 判断奖品概率
    Object.keys( infoData.prizeList[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( infoData.prizeList, item ) !== 100 ) {
          message.error( '需要概率为100%' );
          whether = false;
        }
      }
    } );

    // 判断客群概率
    if ( !reduceGroupProbability( infoData.prizeList, infoData.prizesCustomerGroups ) ) {
      whether = false
    }
  } else {
    whether = false;
  }

  return whether;
}

// 猜涨跌特殊校验
const onGuessVerification = infoData => {
  const { bettingOptions } = infoData;
  return bettingOptions && JSON.parse( bettingOptions ).length > 0
}

// 各个组件内特殊校验
const onComponentVerification = ( infoData, requiredList, infoType ) => {
  let newRequiredList = requiredList;
  let specialKey = true; // 特别字段，某些需要更深层判断使用
  switch ( infoType ) {
    case 'TEXT':
      if ( infoData ) {
        specialKey = onTextVerification( infoData );
      }
      break;
    case 'RICH_TEXT':
      if ( infoData ) {
        specialKey = onRichTextVerification( infoData );
      }
      break;
    case 'IMAGE':
      if ( infoData ) {
        specialKey = onImageVerification( infoData );
      }
      break;
    case 'SLOT_MACHINE':
      if ( infoData ) {
        specialKey = onTigerVerification( infoData );
      }
      break;
    case 'SMASH_EGG':
      if ( infoData ) {
        if ( infoData?.eggsImages?.some( item => !item ) ) {
          specialKey = false;
        }
        if ( infoData.prizes && infoData.prizes.length ) {
          // 判断奖品概率
          Object.keys( infoData.prizes[0] ).forEach( item => {
            if ( item.indexOf( 'probability' ) > -1 ) {
              if ( reduceProbability( infoData.prizes, item ) !== 100 ) {
                message.error( '需要概率为100%' );
                specialKey = false;
              }
            }
          } );
          // 判断客群概率
          if ( !reduceGroupProbability( infoData.prizes, infoData.prizesCustomerGroups ) ) {
            specialKey = false
          }
        }
      }
      break;
    case 'AUDIO':
      if ( infoData && infoData.showType && infoData.showType === 'BUTTON_STYLE' ) {
        newRequiredList = [...requiredList, 'playImage', 'stopImage'];
      }
      break;
    case 'FUNDS':
      if ( infoData && infoData.funds && infoData.funds.length ) {
        specialKey = listKeyVerification( infoData.funds, ['fundId', 'showType'] );
      }
      break;
    case 'GRID_WHEEL':
      if ( infoData ) {
        specialKey = onGridWheelVerification( infoData );
      }
      break;
    case 'BIG_WHEEL':
      if ( infoData ) {
        specialKey = onGridWheelVerification( infoData, 6 );
      }
      break;
    case 'TASK':
      if ( infoData ) {
        specialKey = onTaskVerification( infoData );
      }
      break;
    case 'MARQUEE':
      if ( infoData ) {
        specialKey = onMarqueeVerification( infoData );
      }
      break;
    case 'RED_RAIN':
      if ( infoData ) {
        specialKey = onGridRedRainVerification( infoData );
      }
      break;
    case 'MYSTERY_BOX':
      if ( infoData ) {
        // 盲盒此校验逻辑与红包雨相同
        specialKey = onGridRedRainVerification( infoData );
      }
      break;
    case 'CARD':
      if ( infoData ) {
        specialKey = onCardVerification( infoData );
      }
      break;
    case 'COUNTDOWN':
      if ( infoData ) {
        specialKey = onCountDownVerification( infoData );
      }
      break;
    case 'RANK':
      if ( infoData ) {
        specialKey = onRankVerification( infoData );
      }
      break;
    case 'LUCK_DOG':
      if ( infoData ) {
        specialKey = onLuckDogVerification( infoData );
      }
      break;
    case 'MONOPOLY':
      if ( infoData ) {
        specialKey = onMonoPolyVerification( infoData );
      }
      break;
    case 'QUESTIONNAIRE':
      if ( infoData ) {
        specialKey = onQuestionVerification( infoData );
      }
      break;
    case 'SCRATCH_CARD':
      if ( infoData ) {
        specialKey = onScratchCardVerification( infoData );
      }
      break;
    case 'LINK':
      if ( infoData ) {
        specialKey = onLinkVerification( infoData );
      }
      break;
    case 'AWARD':
      if ( infoData ) {
        specialKey = onAwardVerification( infoData );
      }
      break;
    case 'SIGN':
      if ( infoData ) {
        specialKey = onSignVerification( infoData );
      }
      break;
    case 'ACTIVITY_SIGN':
      if ( infoData ) {
        specialKey = onActivitySignVerification( infoData );
      }
      break;
    case 'CUSTOM':
      if ( infoData ) {
        specialKey = onCustomVerification( infoData );
      }
      break;
    case 'INVITE':
      if ( infoData ) {
        specialKey = onInviteVerification( infoData );
      }
      break;
    case 'ANSWER':
      if ( infoData ) {
        specialKey = onAnswerVerification( infoData );
      }
      break;
    case 'EXCHANGE_NEW':
      if ( infoData ) {
        specialKey = onExchangeVerification( infoData );
      }
      break;
    case 'COMPOSITE_GAME':
      if ( infoData ) {
        specialKey = onBigwaterMelon( infoData )
      }
      break;
    case 'PAGE':
      if ( infoData ) {
        specialKey = onPageMelon( infoData )
      }
      break;
    case 'RECEIVE_GOLD':
      if ( infoData ) {
        specialKey = onReceiveGoldVerification( infoData )
      }
      break;
    case 'FEED_UPGRADE':
      if ( infoData ) {
        specialKey = onFeedChangeVerification( infoData )
      }
      break;
    case 'BARRAGE':
      if ( infoData ) {
        specialKey = onBarrageVerification( infoData )
      }
      break;
    case 'K_LINE_GAME':
      if ( infoData ) {
        specialKey = kLineGameVerification( infoData )
      }
      break;
    case 'ETF_RANK':
      if ( infoData ) {
        specialKey = onEFTRank( infoData )
      }
      break;
    case 'ETF_HOT_RANK':
      if ( infoData ) {
        specialKey = onEFTHotRank( infoData )
      }
      break;
    case 'LIKE':
      if ( infoData ) {
        specialKey = onLikeElementVerification( infoData )
      }
      break;
    case 'ETF_ENROLL':
      if ( infoData ) {
        specialKey = onETFEnrolllementVerification( infoData )
      }
      break;
    case 'PUZZLE_GAME':
      if ( infoData ) {
        specialKey = onPuzzleGameVerification( infoData )
      }
      break;
    case 'DOLL_MACHINE':
      if ( infoData ) {
        specialKey = onDollMachineVerification( infoData )
      }
      break;
    case 'POP_UP':
      if ( infoData ) {
        specialKey = onModalVerification( infoData )
      }
      break;
    case 'TAB':
      if ( infoData ) {
        specialKey = onTabVerification( infoData )
      }
      break;
    case 'VOTING':
      if( infoData ) {
        specialKey = onVotingVerification( infoData )
      }
      break;
    case 'BIND_GROUP':
      if( infoData ) {
        specialKey = onBindGroupVerification( infoData )
      }
      break;
    case 'FLIP':
      if ( infoData ) {
        specialKey = onFlipVertification( infoData );
      }
      break;
    case 'GUESS':
      if ( infoData ) {
        specialKey = onGuessVerification( infoData );
      }
      break;
    default:
      break;
  }
  
  const isTrue = onDataVerification( infoData, newRequiredList );
  const advanceTrue = checkAdvancedSetting( infoData.advancedSetting || {} );
  // console.log( isTrue, specialKey, advanceTrue );
  return specialKey && isTrue && advanceTrue;
};

// 判断是否全部填写必填选项
// 入参 submitObj 即将提交的数据
const isContained = ( submitObj, arr, func, isSave ) => {
  const isEmpty = onEmptyObject( submitObj );
  if ( isEmpty ) {
    message.error( '不能保存空活动' );
    return false;
  }
  
  // TODO: 临时关闭
  if( !isSave && ( !submitObj?.approvalConfig || submitObj?.approvalConfig.length<=0 ) ) {
    message.error( '请指定活动发布审批人员以继续流程' )
    return false;
  }

  // 先判断活动层必填信息
  const isTrue = onBaseVerification( submitObj, activityRequired, );
  if ( !isTrue ) {
    if ( func ) func( 'base' );
    message.error( '请检查活动设置的必填项是否填写完整！' );
    return false;
  }
  // 判断页面层
  if ( !submitObj.pages || submitObj.pages.length <= 0 ) {
    if ( func ) func( 'add' );
    message.error( '至少需要添加一个页面！' );
    return false;
  }

  // 判断组件层
  const resflag = submitObj.pages.every( ( item, pageIndex ) => {
    // 页面是否添加组件
    if ( !item?.componentData?.length ) {
      message.error( `请检查第${pageIndex + 1}个页面是否添加组件！` );
      return false;
    }
    if ( item.enablePageTurning ) {
      if ( !item.pageTurningMethod ) {
        message.error( `请检查${pageIndex + 1}个页面是否配置翻页方式` )
        return false;
      }
      if ( !item.pageTurningType ) {
        message.error( `请检查${pageIndex + 1}个页面是否配置翻页类型` )
        return false;
      }
    }
    if ( item.autoPageTurning && !item.autoPageTime ) {
      message.error( `请检查${pageIndex + 1}个页面是否配置自动翻页时间` )
      return false;
    }
    // 组件必填项是否完整
    const flag = item.componentData.every( ( info, index ) => {
      const isTrueElement = onComponentVerification(
        info,
        elementsRequiredObj[info.type],
        info.type
      );
      if ( !isTrueElement ) {
        message.warning(
          `请检查第${pageIndex + 1}个页面的第${index + 1}个 (${info.label
          }) 组件的必填项是否填写完整`
        );
      }
      return isTrueElement;
    } );
    return flag;
  } );
  return resflag;
};



// 删除组件数据中的所有id(组件复制操作场景时用到)
const deleteElementDataId = ( data ) => {
  const cloneData = _.cloneDeep( data )
  const dataKeys = Object.keys( data )
  dataKeys.forEach( i => {
    if ( i === 'id' && cloneData[i] ) delete cloneData[i]
    const type = Object.prototype.toString.call( cloneData[i] );
    // 对象类型
    if ( type === '[object Object]' ) {
      if ( cloneData[i].id ) delete cloneData[i].id
      if ( cloneData[i].activityId ) delete cloneData[i].activityId
      if ( cloneData[i].elementId ) delete cloneData[i].elementId
    }
    // 数组类型
    if ( type === '[object Array]' ) {
      if ( cloneData[i] && cloneData[i].length ) {
        const arr = _.cloneDeep( cloneData[i] )
        arr.forEach( j => {
          if ( j && j.id ) delete j.id
          if ( j && j.activityId ) delete j.activityId
          if ( j && j.elementId ) delete j.elementId
          return j
        } )
        cloneData[i] = arr
      }
    }
  } )
  return cloneData
}


// 复制页面时拼接新id
const splicElementDataId = ( data, pageNum ) => {
  const cloneData = _.cloneDeep( data )
  const dataKeys = Object.keys( data )
  dataKeys.forEach( i => {
    if ( i === 'id' && cloneData[i] ) cloneData[i] = `${cloneData[i]}_copy_${pageNum}`
    const type = Object.prototype.toString.call( cloneData[i] );
    // 对象类型
    if ( type === '[object Object]' ) {
      if ( cloneData[i].id ) delete cloneData[i].id
      if ( cloneData[i].activityId ) delete cloneData[i].activityId
      if ( cloneData[i].elementId ) delete cloneData[i].elementId
      if ( cloneData[i].componentData && cloneData[i].componentData.length ) {
        cloneData[i].componentData.map( j => {
          const newItem = j
          newItem.id = `${newItem.id}_copy_${pageNum}`
          return newItem
        } )
      }
      if ( cloneData[i].componentIds && cloneData[i].componentIds.length ) {
        const newIds = cloneData[i].componentIds.map( v => `${v}_copy_${pageNum}` )
        cloneData[i].componentIds = newIds
      }
    }
    // 数组类型
    if ( type === '[object Array]' ) {
      if ( cloneData[i] && cloneData[i].length ) {
        const arr = _.cloneDeep( cloneData[i] )
        arr.forEach( j => {
          if ( j && j.id ) delete j.id
          if ( j && j.activityId ) delete j.activityId
          if ( j && j.elementId ) delete j.elementId
          return j
        } )
        cloneData[i] = arr
      }
    }
  } )
  return cloneData
}

export { isContained, onEmptyObject, deleteElementDataId, splicElementDataId };
