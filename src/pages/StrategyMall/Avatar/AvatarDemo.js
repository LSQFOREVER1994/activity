
import React from 'react';

const img1 = require('../../../assets/empty.png');
// const white = require('../../../assets/bg-white.png');

const getSize = (size, num) =>{
  if(num){
    // return `${size + num}rem`
    return `${(size + num)/32}rem`
  }
    return `${(size / 32)}rem`
  
  
}

const AvatarDemo = ({
  radius = 5, src = img1, size = 60,
}) => {

  let style = {
    width: getSize(size),
    height: getSize(size),
    borderRadius: getSize(radius),
  };
  if (typeof (src) === 'string') {
    style = { ...style, background: `0 0 /100% 100% url(${src}) no-repeat` };
  }
  if (Array.isArray(src) && src.length > 0) {
    switch (src.length) {
      case 1: style = { ...style, background: `0 0 /100% 100% url(${src}) no-repeat` };
        break;
      case 2: style = {
        ...style,
        background: `url(${src[1]}) 100% 100% / ${getSize(size / 2, 10)} ${getSize(size / 2, 10)} no-repeat,
                    url(${src[0]}) 0 0 / ${getSize(size / 2, 10)} ${getSize(size / 2, 10)}  no-repeat`,
      }; break;
      case 3: style = {
        ...style,
        background: `url(${src[2]}) border-box 100% 100% / ${getSize(size / 2, 5)}  ${getSize(size / 2, 5)} no-repeat,
                    url(${src[1]}) 50% 0 / ${getSize(size / 2, 5)}  ${getSize(size / 2, 5)} no-repeat,
                    url(${src[0]}) 0 100% /  ${getSize(size / 2, 5)}  ${getSize(size / 2, 5)}  no-repeat`,
      }; break;
      default: style = {
        ...style,
        background: `url(${src[3]}) 0 0 /  ${getSize(size / 2, -1)}  ${getSize(size / 2, -2)} no-repeat,
                    url(${src[2]}) 100% 0 /  ${getSize(size / 2, -1)}  ${getSize(size / 2, -2)} no-repeat,
                    url(${src[1]}) 0 100% /  ${getSize(size / 2, -1)}  ${getSize(size / 2, -2)} no-repeat,
                    url(${src[0]}) 100% 100% /  ${getSize(size / 2, -1)}  ${getSize(size / 2, -2)}  no-repeat`,
      }; 
      // default: throw new Error('Avatar src of Array max length is 4');
    }
  }
  return (
    <div style={style} />
  );
};
export default AvatarDemo;
