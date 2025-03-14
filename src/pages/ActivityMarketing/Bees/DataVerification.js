import { message } from 'antd';
import moment from 'moment';
// import { object } from 'prop-types';


// 活动必填项配置
const activityRequired = ['name', 'activityType', 'state', 'endTip', 'initCount', 'dailyCount', 'withoutEmpty', 'theme'] // 'pauseTip'


// 组件必填项配置
const elementsRequiredObj = {
  // 按钮组件必填项配置
  BUTTON: ['name', 'style', 'clickEvent'],

  // 轮播组件必填项配置
  BANNER: ['name', 'direction', 'effect', 'pagination', 'autoplay', 'loop', 'images'],

  // 图片组件必填项配置
  IMAGE: ['clickEvent', 'url', 'name'],

  // 文字组件必填项配置
  TEXT: ['name', 'text'],

  // 跑马灯组件必填项配置
  MARQUEE: ['name', 'clickEvent', 'direction'],

  // 九宫格组件必填项配置
  GRID_WHEEL: [
    'name', 'showLeftCount', 'showAttendUser',
    'drawImage', 'hasNoChangeTip', 'hasChangeTip', 'prizes'
  ],
  // 基金卡片组件必填项配置
  FUNDS: ['name', 'funds'],

  // 任务组件必填项配置
  TASK: ['name', 'isShowing', 'task', 'goButton', 'finishButton'],

  // 音频组件必填项配置
  AUDIO: ['name', 'url', 'style'],

  // 视频组件必填项配置
  VIDEO: ['name', 'url', 'enable'],

  // 话题PK组件必填项配置
  PK_TOPIC: ['name', 'topic', 'positive', 'negative', 'endTime'],

  // 红包雨必填项配置
  RED_RAIN: ['name', 'gameTime', 'atLeast', 'prizes', 'drawButton', 'redPacket', 'clickRed'],

  // 视频组件必填项配置
  CHAT: ['name', 'chatItemList'],

  // 大转盘组件必填项配置
  BIG_WHEEL: ['name', 'borderImg', 'drawButton', 'hasChangeTip', 'hasNoChangeTip'],

  // 老虎机组件必填项配置
  SLOT_MACHINE: ['name', 'showLeftCount', 'frameImage', 'drawImage'],

  // 签到组件必填项配置
  SIGN: ['name', 'finish', 'miss', 'unSign', 'lock', 'name', 'rule', 'signDays', 'signType', 'reach', 'buttonBefore', 'buttonAfter'],

  // 答题组件必填项配置
  ANSWER: ['name', 'showLeftCount', 'startButton', 'tag', 'count', 'rewardType'],

  // 兑换组件必填项配置
  EXCHANGE: ['name', 'showInventory', 'exchangeButton', 'emptyInventoryExchangeButton', 'prizes'],

  // 盲盒组件必填项配置
  MYSTERY_BOX: ['name', 'buttonBefore', 'prizes', 'buttonAfter', 'hasChangeTip', 'hasNoChangeTip'],

  // TAB组件必填项配置
  TAB: ['name', 'tabItems'],

  // 集卡组件必填项配置
  CARD: ['name', 'openTime', 'openTip', 'single', 'cardType', 'cardButton', 'drawButton',
    'continueButton', 'cardImage', 'cardList', 'prizeList'],

  // 倒计时组件必填项配置
  COUNTDOWN: ['name', 'endTime', 'isShowDays', 'effectType', 'endEffectType'],

  // 常规评论组件必填项配置
  NORMAL_COMMENT: ['name', 'commentTitle', 'publicCommentTitle'],

  // 正反方评论组件必填项配置
  OPPOSING_COMMENT: ['name', 'positiveButton', 'negativeButton'],

  // 猜涨跌组件必填项配置
  GUESS: ['name', 'endTime', 'startTime', 'indexCode', 'riseImage', 'fallImage'],

  // 猜涨跌排行榜组件必填项配置
  RANK: ['name', 'rankType', 'withPrize'],

  // 拼团组件必填项配置
  BIND_GROUP: ['name', 'memberAmount', 'attendLimit', 'inviteButtonImg', 'drawButtonImg', 'startGroupButtonImg',
    'awardButtonImg', 'prizes', 'prizeList'],

  // 抽奖组件必填项配置
  LUCK_DOG: [
    "name", 'price', 'attendButton', 'prizes'
  ],

  // 自定义组件必填项配置
  CUSTOM: ['name', 'key', 'json'],

  // 未识别组件必填项配置
  // TODO: ['name', 'json'],

  // 刮刮卡组件必填项配置
  SCRATCH_CARD: ['name', 'startTime', 'endTime', 'showLeftCount', 'beforeScratch', 'afterScratch', 'prizes'],

  // 理财街组件必填项配置
  MONOPOLY: ['name', 'startTime', 'startPoint', 'endPoint', 'doll', 'images', 'prizeList'],

  // 问卷组件必填项配置
  QUESTIONNAIRE: ['name', 'withPrize', 'buttonImage', 'question'],

  // 文字链组件必填项配置
  LINK: ["name"],

  // 领奖组件必填项配置
  AWARD: [
    "name", "showCount", "awardButton", "oneMoreButton", "finishButton",
    "prizeName", "prizeImg", "prizes",
  ],

  // 砸金蛋组件必填项配置
  SMASH_EGG: ["name", "eggsImages", "hammerImages", "hitImages", "bottomImage", "clickImage", "prizes"],

  // 积分组件
  INTEGRAL: ["name", "fontSize"],

  // 邀请组件
  INVITE: ['name', 'inviteBackgroundImage', 'copyButton', 'confirmButton', 'inviteButton'],

  // 口令组件
  SLOGAN: ['name', 'sloganShowType', 'confirmButton', 'popUpBackground'],

  // ETF报名
  ETF_ENROLL: ['name', 'enrollButton', 'hasEnrollButton', 'desc', 'agreement', 'rankDesc', 'startTime', 'endTime', 'gameStartTime', 'gameEndTime'],

  // ETF热榜
  ETF_FEATURED: ['name', 'entranceButton', 'indexShowNum']
}

// 判断对象是否为空
const onEmptyObject = ( obj ) => {
  if ( !obj ) {
    return true;
  }
  const arr = Object.keys( obj );
  if ( arr.length === 0 ) {
    return true;
  }
  return false;
}


// 判断数据类型
const isType = ( obj ) => {
  const type = Object.prototype.toString.call( obj );
  if ( type === '[object Array]' ) return 'Array'
  if ( type === '[object Object]' ) return 'Object'
  return 'param is no object type';
}

// 数据检测
const onDataVerification = ( submitObj, requiredList = [] ) => {
  if ( onEmptyObject( submitObj ) ) return false
  const arr = []
  requiredList.forEach( info => {
    let isHas
    // 判断为false时注意区分是否为boolean类型，是boolean类型给过
    if ( !submitObj[info] && typeof submitObj[info] !== 'boolean' ) isHas = false
    if ( !submitObj[info] && typeof submitObj[info] === 'boolean' && ( submitObj[info] === true || submitObj[info] === false ) ) isHas = true
    // 判断字段类型
    if ( submitObj[info] ) {
      if ( isType( submitObj[info] ) === 'Object' ) {
        // 对象
        if ( submitObj.type !== "CUSTOM" && onEmptyObject( submitObj[info] ) ) isHas = false
        if ( !onEmptyObject( submitObj[info] ) ) isHas = true
      } else if ( isType( submitObj[info] ) === 'Array' ) {
        // 数组
        if ( !submitObj[info].length || submitObj[info].length <= 0 ) isHas = false
        if ( submitObj[info].length > 0 ) isHas = true
      } else {
        isHas = true
      }
    }
    if ( typeof submitObj[info] === 'number' ) isHas = true
    arr.push( isHas )
  } )
  if ( arr.includes( false ) ) {
    return false
  }
  return true
}


// 校验活动基本信息
const onBaseVerification = ( baseData, requiredList ) => {
  let newRequiredList = requiredList
  if ( baseData && baseData.state && baseData.state !== 'ENABLE' ) {
    // 当活动状态为暂停或禁用时，需要验证活动暂停提示语
    newRequiredList = [...requiredList, 'pauseTip']
  }
  const isTrue = onDataVerification( baseData, newRequiredList )
  return isTrue
}

// 列表内校验
const listKeyVerification = ( list, keys ) => {
  let whether = true;
  if ( list && list.length > 0 ) {
    list.forEach( item => {
      keys.forEach( kitem => {
        if ( !item[kitem] ) {
          whether = false;
        }
      } )
    } )
  } else {
    whether = false
  }
  return whether
}

// 计算奖品中概率
const reduceProbability = ( data, keyName ) => {
  let totalProbability = 0;
  if ( data && data.length > 0 ) {
    data.forEach( info => {
      if ( info[keyName] ) totalProbability += info[keyName] * 1000
    } )
  }
  const res = totalProbability / 1000
  return res
}

// 富文本特殊校验
const onTextVerification = ( infoData ) => {
  let whether = true;
  if ( !infoData.text || infoData.text === '<p></p>' ) {
    whether = false;
  }
  return whether
}

// 九宫格特殊必填项校验
const onGridWheelVerification = ( infoData, num ) => {
  let whether = true
  if ( infoData.prizes && infoData.prizes.length ) {
    const itemPositionList = []
    infoData.prizes.forEach( info => {
      const list = info.itemPosition.split( ',' )
      list.forEach( item => {
        itemPositionList.push( item )
      } )
    } )
    const newItemPositionList = Array.from( new Set( itemPositionList ) )
    if ( newItemPositionList.length && newItemPositionList.length !== ( num || 8 ) ) {
      message.error( '奖品位未满！' )
      whether = false
    }

    // 判断奖品概率
    Object.keys( infoData.prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( infoData.prizes, item ) !== 100 ) {
          message.error( '需要概率为100%' )
          whether = false
        }
      }
    } )
  } else {
    whether = false
  }


  return whether
}

// 红包雨特殊必填项校验
const onGridRedRainVerification = ( infoData ) => {
  let whether = true;
  if ( infoData.prizes && infoData.prizes.length ) {
    // 判断奖品概率
    Object.keys( infoData.prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( infoData.prizes, item ) !== 100 ) {
          message.error( '需要概率为100%' )
          whether = false
        }
      }
    } )
  } else {
    whether = false
  }
  return whether
}

// 排行榜特殊必填项校验
const onRankVerification = ( infoData ) => {
  let whether = true;
  if ( infoData.withPrize && ( !infoData.prizes || infoData.prizes.length === 0 ) ) {
    whether = false
  }
  if ( infoData.withPrize && !infoData.openTime ) {
    whether = false
  }
  return whether
}

// 单个任务校验
const onSingleTaskVerification = ( task = {}, type ) => {
  let isTrue = false
  const { name, taskType, rewardValue, attendLimit, needSubCount, taskEventName } = task;
  if ( type === 'single' && name && ( rewardValue || rewardValue === 0 ) && attendLimit ) {
    if ( taskType === 'INVITE' ) {
      if ( taskEventName ) isTrue = true
    } else if ( taskType === 'EVENT' ) {
      if ( taskEventName ) isTrue = true
    } else {
      isTrue = true
    }
  } else if ( type === 'noSingle' && name && needSubCount && ( rewardValue || rewardValue === 0 ) && attendLimit ) {
    isTrue = true
  } else if ( type === 'sub' && name && taskType ) {
    isTrue = true
  }
  return isTrue
}


// 任务卡片特殊必填项校验
const onTaskVerification = ( infoData ) => {
  let isTrue
  const { task = {}, prizes = [] } = infoData;
  const { rewardType, isSingle, tasks, duration } = task;
  if ( rewardType === 'PRIZE' && prizes.length === 0 ) isTrue = false;
  if ( !isSingle && typeof isSingle !== 'boolean' ) isTrue = false
  if ( !isSingle && typeof isSingle === 'boolean' ) {
    // 多任务
    const parentTask = onSingleTaskVerification( task, 'noSingle' )
    const childTask = []
    tasks.forEach( info => {
      const childTaskTrue = onSingleTaskVerification( info, 'sub' )
      childTask.push( childTaskTrue )
    } )
    isTrue = parentTask && !childTask.includes( false )
  }
  if ( isSingle && typeof isSingle === 'boolean' ) {
    // 单任务
    isTrue = onSingleTaskVerification( task, 'single' )
  }
  // if ( !duration && typeof duration !== 'boolean' ) isTrue = false
  return isTrue
}

// 跑马灯特殊必填项校验
const onMarqueeVerification = ( infoData ) => {
  let isTrue = true;
  const { records = [], isSuspend, suspendMode, distance } = infoData;
  if ( records.length > 0 ) {
    records.forEach( item => {
      if ( !item ) {
        isTrue = false
      }
    } )
  }
  if ( isSuspend && !suspendMode ) isTrue = false
  if ( isSuspend && suspendMode && suspendMode === 'CUSTOM' && !distance ) isTrue = false
  return isTrue
}

// 按钮特殊必填项校验
const onButtonVerification = ( infoData ) => {
  let isTrue = true;
  const { isSuspend, suspendMode, distance } = infoData;
  if ( isSuspend && !suspendMode ) isTrue = false
  if ( isSuspend && suspendMode && suspendMode === 'CUSTOM' && !distance ) isTrue = false
  return isTrue
}

// 图片特殊必填项校验
const onImageVerification = ( infoData ) => {
  let isTrue = true;
  const { isSuspend, suspendMode, distance } = infoData;
  if ( isSuspend && !suspendMode ) isTrue = false
  if ( isSuspend && suspendMode && suspendMode === 'CUSTOM' && !distance ) isTrue = false
  return isTrue
}

// 集卡特殊校验
const onCardVerification = ( infoData ) => {
  const { cardList = [], prizes = [], prizeList = [], cardType, single, startTime, endTime, openTime } = infoData;
  let whether = true;
  if ( startTime && endTime ) {
    if ( ( moment( openTime ).valueOf() < moment( startTime ).valueOf() ) || ( moment( openTime ).valueOf() > moment( endTime ).valueOf() ) ) {
      message.error( '抽奖活动时间需在活动有效期内' )
      whether = false
    }
  }
  if ( prizeList && prizeList.length ) {
    // 判断奖品概率
    Object.keys( prizeList[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( prizeList, item ) !== 100 ) {
          message.error( '抽奖奖品需要概率为100%' )
          whether = false
        }
      }
    } )
  } else {
    whether = false
  }

  // 卡片组判断
  if ( cardType && cardType === 'FIVE' && cardList.length !== 5 ) whether = false
  if ( cardType && cardType === 'EIGHT' && cardList.length !== 8 ) whether = false
  if ( cardList && cardList.length ) {
    const arr = ['name', 'frontImage', 'inventory', 'dayMaxCount', 'probability']
    cardList.forEach( item => {
      arr.forEach( kitem => {
        if ( typeof item[kitem] !== 'number' ) {
          if ( !item[kitem] ) {
            whether = false;
          }
        }
      } )
    } )
    Object.keys( cardList[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( cardList, item ) !== 100 ) {
          message.error( '卡片需要概率总和为100%' )
          whether = false
        }
      }
    } )
  } else {
    whether = false
  }

  // 配置单卡抽奖时，单卡奖品必须配置
  if ( single && prizes.length > 0 ) {
    if ( prizes && prizes.length ) {
      // 判断奖品概率
      Object.keys( prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( prizes, item ) !== 100 ) {
            message.error( '卡片奖品需要概率为100%' )
            whether = false
          }
        }
      } )
    } else {
      whether = false
    }
  }
  if ( single && prizes.length <= 0 ) {
    whether = false;
  }

  return whether
}

// 倒计时特殊校验
const onCountDownVerification = ( infoData ) => {
  let isTrue = true;
  const { endEffectType, copywriting } = infoData;
  if ( endEffectType === 'COPYWRITING' && !copywriting ) {
    isTrue = false
  }
  return isTrue
}

const onLuckDogVerification = ( infoData = {} ) => {
  const { luckDog = {} } = infoData;

  let isTrue = true;
  // 配置项判断
  if ( luckDog && Object.keys( luckDog ).length > 0 ) {
    if ( !luckDog.score ) {
      isTrue = false
    } else if ( !luckDog.openTime ) {
      isTrue = false
    }
  }
  return isTrue
}


// 理财节
const onMonoPolyVerification = ( infoData = {} ) => {
  const { images, imageElements, single, luckyGrids, prizes, prizeList } = infoData;
  const text = '';
  let isTrue = true;
  // 配置项判断
  if ( images && images.length ) {
    isTrue = true;
  } else {
    message.error( '单格图标配置最少为1个' )
    isTrue = false;
    return isTrue
  }
  imageElements.forEach( i => {
    if ( i.enable && !i.url ) {
      isTrue = false;
    }
  } )
  if ( single ) {
    if ( !luckyGrids || !luckyGrids.length ) {
      message.error( '请配置单格子抽奖' )
      isTrue = false
      return false
    }
    if ( !prizes || !prizes.length ) {
      message.error( '请配置单格子奖品' )
      isTrue = false
      return false
    }
  }
  if ( single && prizes && prizes.length ) {
    // 判断终点奖品概率
    Object.keys( prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( prizes, item ) !== 100 ) {
          message.error( '抽奖奖品需要概率为100%' )
          isTrue = false
        }
      }
    } )
  }
  if ( prizeList && prizeList.length ) {
    // 判断终点奖品概率
    Object.keys( prizeList[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( prizeList, item ) !== 100 ) {
          message.error( '抽奖奖品需要概率为100%' )
          isTrue = false
        }
      }
    } )
  }
  if ( text ) {
    message.error( text )
  }
  return isTrue
}


// 问卷特殊校验
const onQuestionVerification = ( infoData = {} ) => {
  const { question, withPrize, prizes } = infoData
  let whether = true;
  // 判断是否可以抽奖,可以抽奖必须配置奖品
  if ( withPrize && ( !prizes || prizes.length <= 0 ) ) whether = false

  // 判断是否配置题目
  if ( !question || question.length <= 0 ) whether = false

  // 判断奖品概率
  if ( withPrize && prizes && prizes.length > 0 ) {
    Object.keys( prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( prizes, item ) !== 100 ) {
          message.error( '抽奖奖品需要概率为100%' )
          whether = false
        }
      }
    } )
  }
  // 题目组判断
  if ( question && question.length > 0 ) {
    question.forEach( item => {
      let arr = ['topic', 'answer', 'title']
      if ( item.topic && ( item.topic === 'SINGLE_CHOICE' || item.topic === 'MULTIPLE_CHOICE' ) ) {
        arr = ['topic', 'answer', 'title', 'optionsList']
      }
      arr.forEach( kitem => {
        if ( typeof item[kitem] !== 'number' && typeof item[kitem] !== 'boolean' && !item[kitem] ) whether = false;
      } )
    } )
  }
  return whether
}

// 刮刮卡特殊校验
const onScratchCardVerification = ( infoData = {} ) => {
  const { prizes } = infoData
  let whether = true;
  // 判断配置奖品
  if ( !prizes || prizes.length <= 0 ) whether = false

  // 判断奖品概率
  if ( prizes && prizes.length > 0 ) {
    Object.keys( prizes[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( prizes, item ) !== 100 ) {
          message.error( '抽奖奖品需要概率为100%' )
          whether = false
        }
      }
    } )
  }
  return whether
}

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
  } );
  // 领取人次展示时需要校验领取人次字号
  if ( ( showCount && !countSize ) || !prizesPassed ) {
    whether = false;
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
      message.error( '当前需要填写奖品' )
      whether = false
    } else if ( prizes && prizes.length > 0 ) {
      Object.keys( prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( prizes, item ) !== 100 ) {
            message.error( '抽奖奖品需要概率为100%' )
            whether = false
          }
        }
      } )
    }
  } else if ( infoData.rewardType !== 'PRIZE' && !infoData.rewardValue ) {
    whether = false
  }
  return whether;
};


// 兑换组件内特殊校验
const onExchangeVerification = ( infoData = {} ) => {
  const { elementShowType, landingPage, tags = [], prizes = [] } = infoData;
  let whether = true;
  if ( ( elementShowType === 'SECOND_LEVEL_PAGE' && !landingPage ) || ( elementShowType === 'HOMEPAGE' && !tags.length ) ) {
    whether = false;
  } else if ( elementShowType === 'HOMEPAGE' && tags.length ) {
    tags.forEach( ( t ) => {
      if ( !prizes.find( p => p.tagName === t.name ) ) {
        message.error( `${t.name}标签下暂未配置奖品！` )
        whether = false;
      }
    } )
  }
  return whether
}

// 邀请组件内奖品校验
const onInvitePrizesVerification = ( list = [] ) => {
  let whether = true;
  if ( list.length ) {
    // 判断奖品概率
    Object.keys( list[0] ).forEach( item => {
      if ( item.indexOf( 'probability' ) > -1 ) {
        if ( reduceProbability( list, item ) !== 100 ) {
          message.error( '需要概率为100%' )
          whether = false
        }
      }
    } )
  } else {
    whether = false
  }
  return whether
}

// 老虎机组件内奖品校验
const onTigerVerification = ( infoData, num ) => {
  let whether = true;
  const { prizes } = infoData

  if ( prizes && prizes.length ) {
    if ( prizes.length && prizes.length < 3 ) {
      message.error( '奖品位未满！请配置至少三个奖品' )
      whether = false
    }

    // 判断配置奖品
    if ( !prizes || prizes.length <= 0 ) whether = false

    // 判断奖品概率
    if ( prizes && prizes.length > 0 ) {
      Object.keys( prizes[0] ).forEach( item => {
        if ( item.indexOf( 'probability' ) > -1 ) {
          if ( reduceProbability( prizes, item ) !== 100 ) {
            message.error( '抽奖奖品需要概率为100%' )
            whether = false
          }
        }
      } )
    }
    return whether
  }

}


// 邀请组件内特殊校验
const onInviteVerification = ( infoData = {} ) => {
  const { inviteePrizes = [], prizes = [],
    showType, goButton,
    task: { rewardType, backRewardType, attendLimit, backRewardCount, rewardValue }
  } = infoData;
  let whether = true;
  if ( rewardType === 'PRIZE' ) {
    whether = onInvitePrizesVerification( prizes )
  } else if ( rewardType !== 'PRIZE' ) {
    if ( !attendLimit || !rewardValue ) {
      whether = false
    }
  }
  console.log( 'task', infoData.task );
  if ( backRewardType === 'PRIZE' ) {
    whether = onInvitePrizesVerification( inviteePrizes )
  }
  if ( showType === 'POP_WINDOWS' && !goButton ) {
    whether = false
  }
  return whether
}

// 口令组件
const onSloganVerification = ( infoData = {} ) => {
  const { sloganShowType, rewardButton, sloganList = [], sloganPrizeList = [] } = infoData;
  if ( sloganShowType === 'POPUP' && !rewardButton ) return false;
  if ( !sloganList.length ) return false;
  if ( !sloganPrizeList.length ) return false;
  return true;
}

// 答题
const onAnswerVerification = ( infoData = {} ) => {
  const { rewardType, score, passAnswerNumber } = infoData;
  if ( rewardType === 'INTEGRAL' && !score ) return false;
  if ( rewardType === 'LEFT_COUNT' && !passAnswerNumber ) return false;
  return true;
}


// 各个组件内特殊校验
const onComponentVerification = ( infoData, requiredList, infoType ) => {
  let newRequiredList = requiredList;
  let specialKey = true; // 特别字段，某些需要更深层判断使用
  switch ( infoType ) {
    case 'TEXT':
      if ( infoData ) {
        specialKey = onTextVerification( infoData )
      }
      break;
    case 'SLOT_MACHINE':
      if ( infoData ) {
        specialKey = onTigerVerification( infoData )
      }
      break;
    case 'AUDIO':
      if ( infoData && infoData.style && infoData.style === 'BUTTON_STYLE' ) {
        newRequiredList = [...requiredList, 'playImage', 'stopImage']
      }
      break;
    case 'FUNDS':
      if ( infoData && infoData.funds && infoData.funds.length ) {
        specialKey = listKeyVerification( infoData.funds, ['fundId', 'showType'] )
      }
      break;
    case 'GRID_WHEEL':
      if ( infoData ) {
        specialKey = onGridWheelVerification( infoData )
      }
      break;
    case 'BIG_WHEEL':
      if ( infoData ) {
        specialKey = onGridWheelVerification( infoData, 6 )
      }
      break;
    case 'TASK':
      if ( infoData ) {
        specialKey = onTaskVerification( infoData )
      }
      break;
    case 'MARQUEE':
      if ( infoData ) {
        specialKey = onMarqueeVerification( infoData )
      }
      break;
    case 'IMAGE':
      if ( infoData ) {
        specialKey = onImageVerification( infoData )
      }
      break;
    case 'BUTTON':
      if ( infoData ) {
        specialKey = onButtonVerification( infoData )
      }
      break;
    case 'RED_RAIN':
      if ( infoData ) {
        specialKey = onGridRedRainVerification( infoData )
      }
      break;
    case 'MYSTERY_BOX':
      if ( infoData ) { // 盲盒此校验逻辑与红包雨相同
        specialKey = onGridRedRainVerification( infoData )
      }
      break;
    case 'CARD':
      if ( infoData ) {
        specialKey = onCardVerification( infoData )
      }
      break;
    case 'COUNTDOWN':
      if ( infoData ) {
        specialKey = onCountDownVerification( infoData )
      }
      break;
    case 'RANK':
      if ( infoData ) {
        specialKey = onRankVerification( infoData )
      }
      break;
    case 'LUCK_DOG':
      if ( infoData ) {
        specialKey = onLuckDogVerification( infoData )
      }
      break;
    case 'MONOPOLY':
      if ( infoData ) {
        specialKey = onMonoPolyVerification( infoData )
      }
      break;
    case 'QUESTIONNAIRE':
      if ( infoData ) {
        specialKey = onQuestionVerification( infoData )
      }
      break;
    case 'SCRATCH_CARD':
      if ( infoData ) {
        specialKey = onScratchCardVerification( infoData )
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
    case 'EXCHANGE':
      if ( infoData ) {
        specialKey = onExchangeVerification( infoData );
      }
      break;
    case 'INVITE':
      if ( infoData ) {
        specialKey = onInviteVerification( infoData );
      }
      break;
    case 'SLOGAN':
      if ( infoData ) {
        specialKey = onSloganVerification( infoData );
      }
      break;
    case 'ANSWER':
      if ( infoData ) {
        specialKey = onAnswerVerification( infoData );
      }
      break;
    default:
      break;
  }

  const isTrue = onDataVerification( infoData, newRequiredList );

  return specialKey && isTrue
}

// 判断是否全部填写必填选项
// 入参 submitObj 即将提交的数据
const isContained = ( submitObj, arr, func ) => {
  const isEmpty = onEmptyObject( submitObj )
  if ( isEmpty ) {
    message.error( '不能保存空活动' )
    return false
  }

  // 先判断活动层必填信息
  const isTrue = onBaseVerification( submitObj, activityRequired )
  if ( !isTrue ) {
    if ( func ) func( 'base' )
    message.error( '请检查活动基础信息的必填项是否填写完整！' )
    return false
  }
  // 判断组件层
  if ( !submitObj.elements || submitObj.elements.length <= 0 ) {
    if ( func ) func( 'add' )
    message.error( '至少需要添加一个组件！' )
    return false
  }

  const errorElements = []
  submitObj.elements.forEach( ( info, index ) => {
    const isTrueElement = onComponentVerification( info, elementsRequiredObj[info.type], info.type )
    if ( !isTrueElement ) {
      errorElements.push( index )
    }
  } )

  if ( errorElements && errorElements.length > 0 ) {
    const elementObj = submitObj.elements[errorElements[0]]
    const elementName = elementObj.name ? `(${elementObj.name})` : ''
    message.error( `请检查第${errorElements[0] + 1}个组件${elementName}内的必填项是否填写完整！` )
    if ( func ) func( 'grid' )
    return false
  }

  return true
}


export {
  isContained,
  onEmptyObject
}
