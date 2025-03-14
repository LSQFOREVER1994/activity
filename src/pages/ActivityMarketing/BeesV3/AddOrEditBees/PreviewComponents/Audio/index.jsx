/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef, useState } from 'react';
import { Slider } from 'antd';
import { setScaleFunc } from '../index';
import styles from './index.less';

const playAudio = require( '../../../assets/img/play_audio.png' );
const pauseAudio = require( '../../../assets/img/pause_audio.png' );
const volumeAudio = require( '../../../assets/img/volume_audio.png' );
const muteAudio = require( '../../../assets/img/mute_audio.png' );

function Audio( props ) {
  const { loop, url, showType, label, playImage, stopImage, style, id } = props;
  const [audioDuration, setAudioDuration] = useState( 0 );
  const [currentTime, setCurrentTime] = useState( 0 );
  const [volume, setVolume] = useState( 1.0 );
  const [audioStatus, setAudioStatus] = useState( 'pause' );
  const audioDom = useRef( null );

  const audioInit = () => {
    const { current } = audioDom;
    current.addEventListener( 'canplay', () => {
      // 监听audio是否加载完毕，如果加载完毕，则读取audio播放时间
      setAudioDuration( current.duration );
    } );
    current.addEventListener( 'timeupdate', () => {
      // 实时监听音频播放时间
      setCurrentTime( current.currentTime );
    } );
    current.addEventListener( 'play', () => {
      // 监听音频播放
      setAudioStatus( 'play' );
    } );
    current.addEventListener( 'ended', () => {
      // 监听音频结束
      setAudioStatus( 'pause' );
    } );
  };
  useEffect( () => {
    audioInit();
  }, [] );

  useEffect( () => {
    if ( !url && audioDuration ) {
        setAudioDuration( 0 )
    }
  }, [url] )

  const timeFommat = num => {
    // 时间数字格式化
    let fommatNum = '';
    if ( num < 10 ) {
      fommatNum = `0${num}`;
    } else {
      fommatNum = num;
    }
    return fommatNum;
  };
  const durationFommat = duration => {
    // 音频秒数格式化
    const house = 60 * 60; // 一小时换算成秒
    let fommat = '';
    if ( duration && duration >= house ) {
      // 时长判断，大于一小时
      const h = parseInt( duration / house, 10 );
      const m = parseInt( ( duration - h * house ) / 60, 10 );
      const s = parseInt( duration - h * house - m * 60, 10 );
      fommat = `${timeFommat( h )}:${timeFommat( m )}:${timeFommat( s )}`;
    } else if ( duration ) {
      // 时长小于一小时
      const m = parseInt( duration / 60, 10 );
      const s = parseInt( duration % 60, 10 );
      fommat = `${timeFommat( m )}:${timeFommat( s )}`;
    } else {
      fommat = audioDuration > house ? '00:00:00' : '00:00';
    }
    return fommat;
  };
  // 修改音频暂停开始状态
  const handleAudioStatus = type => {
    setAudioStatus( type );
    audioDom.current[`${type}`]();
  };
  const moveProgressBar = e => {
    // 移动进度条
    audioDom.current.currentTime = e || 0; // 将滑块值赋值给audio
    setCurrentTime( e || 0 );
  };

  const handleChangeVolume = () => {
    // 静音切换
    audioDom.current.volume = 1.0;
    if ( volume === 1.0 ) {
      audioDom.current.volume = 0;
      audioDom.current.muted = true;
      setVolume( 0 );
    } else {
      audioDom.current.volume = 1.0;
      audioDom.current.muted = false;
      setVolume( 1.0 );
    }
  };
  const showCustomAudio = () => {
    let ele = null;
    if ( showType === 'BAR_STYLE' ) {
      // 横条样式
      ele = (
        <div className={styles.audioBar}>
          <div className={styles.barAudioStatusBox}>
            {audioStatus === 'play' ? (
              <img
                className={styles.AudioStatusImg}
                src={pauseAudio}
                alt=""
                onClick={() => {
                  handleAudioStatus( 'pause' );
                }}
              />
            ) : (
              <img
                className={styles.AudioStatusImg}
                src={playAudio}
                alt=""
                onClick={() => {
                  handleAudioStatus( 'play' );
                }}
              />
            )}
          </div>
          <div className={styles.audioTime}>
            {durationFommat( currentTime || 0 )}/{durationFommat( audioDuration )}
          </div>
          <div className={styles.progressBarBox}>
            <Slider
              value={currentTime || 0}
              onChange={moveProgressBar}
              max={audioDuration}
              tipFormatter={durationFommat}
            />
          </div>
          <div onClick={handleChangeVolume} className={styles.audioVolumeBox}>
            {volume === 1.0 ? (
              <img src={volumeAudio} alt="" className={styles.AudioStatusImg} />
            ) : (
              <img src={muteAudio} alt="" className={styles.AudioStatusImg} />
            )}
          </div>
        </div>
      );
    } else if ( showType === 'CAR_STYLE' ) {
      ele = (
        // 卡片样式
        <div className={styles.audioCar}>
          <div className={styles.carText}>{label}</div>
          <div className={styles.progressBarBox}>
            <Slider
              value={currentTime || 0}
              onChange={moveProgressBar}
              max={audioDuration}
              tipFormatter={durationFommat}
            />
          </div>
          <div className={styles.audioCar_bottom}>
            <div className={styles.bottomContent}>
              <div className={styles.barAudioStatusBox}>
                {audioStatus === 'play' ? (
                  <img
                    className={styles.AudioStatusImg}
                    src={pauseAudio}
                    alt=""
                    onClick={() => {
                      handleAudioStatus( 'pause' );
                    }}
                  />
                ) : (
                  <img
                    className={styles.AudioStatusImg}
                    src={playAudio}
                    alt=""
                    onClick={() => {
                      handleAudioStatus( 'play' );
                    }}
                  />
                )}
              </div>
              <div className={styles.timeText}>
                {durationFommat( currentTime || 0 )}/{durationFommat( audioDuration )}
              </div>
            </div>
            <div onClick={handleChangeVolume} className={styles.audioVolumeBox}>
              {volume === 1.0 ? (
                <img src={volumeAudio} alt="" className={styles.AudioStatusImg} />
              ) : (
                <img src={muteAudio} alt="" className={styles.AudioStatusImg} />
              )}
            </div>
          </div>
        </div>
      );
    } else if ( showType === 'BUTTON_STYLE' ) {
      ele = (
        // 按钮样式
        <div
          className={`${styles.audioButton} ${audioStatus === 'play' && styles.audioButtonPlay}`}
        >
          {audioStatus === 'play' ? (
            <img
              src={playImage}
              className={styles.AudioStatusImg}
              alt=""
              onClick={() => {
                handleAudioStatus( 'pause' );
              }}
            />
          ) : (
            <img
              className={styles.AudioStatusImg}
              src={stopImage}
              alt=""
              onClick={() => {
                handleAudioStatus( 'play' );
              }}
            />
          )}
        </div>
      );
    }
    return ele;
  };

  const itemEl = useRef( null );
  useEffect( () => {
    const componentWrap = itemEl.current;
    if ( componentWrap ) {
      setScaleFunc( componentWrap, style );
    }
  }, [style.width, style.height] );
  return (
    <div className={styles.main} ref={itemEl} id={id}>
      <div className={styles.defualtAudio}>
        <audio controls ref={audioDom} loop={loop} src={url} />
      </div>
      {showCustomAudio()}
    </div>
  );
}
export default Audio;
