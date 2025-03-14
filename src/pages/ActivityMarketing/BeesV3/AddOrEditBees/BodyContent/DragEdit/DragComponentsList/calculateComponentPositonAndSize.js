// 角度转弧度
// Math.PI = 180 度
function angleToRadian( angle ) {
  return ( angle * Math.PI ) / 180;
}

/**
 * 计算根据圆心旋转后的点的坐标
 * @param   {Object}  point  旋转前的点坐标
 * @param   {Object}  center 旋转中心
 * @param   {Number}  rotate 旋转的角度
 * @return  {Object}         旋转后的坐标
 * https://www.zhihu.com/question/67425734/answer/252724399 旋转矩阵公式
 */
export function calculateRotatedPointCoordinate( point, center, rotate ) {
  /**
   * 旋转公式：
   *  点a(x, y)
   *  旋转中心c(x, y)
   *  旋转后点n(x, y)
   *  旋转角度θ
   * nx = cosθ * (ax - cx) - sinθ * (ay - cy) + cx
   * ny = sinθ * (ax - cx) + cosθ * (ay - cy) + cy
   */

  return {
    x:
      ( point.x - center.x ) * Math.cos( angleToRadian( rotate ) ) -
      ( point.y - center.y ) * Math.sin( angleToRadian( rotate ) ) +
      center.x,
    y:
      ( point.x - center.x ) * Math.sin( angleToRadian( rotate ) ) +
      ( point.y - center.y ) * Math.cos( angleToRadian( rotate ) ) +
      center.y,
  };
}

// 求两点之间的中点坐标
export function getCenterPoint( p1, p2 ) {
  return {
    x: p1.x + ( p2.x - p1.x ) / 2,
    y: p1.y + ( p2.y - p1.y ) / 2,
  };
}

function calculateLeftTop( style, curPositon, { symmetricPoint, proportion } ) {
  const { rotate, paddingTop = 0, paddingBottom = 0, paddingRight = 0, paddingLeft = 0 } = style;
  let newCenterPoint = getCenterPoint( curPositon, symmetricPoint );
  let newTopLeftPoint = calculateRotatedPointCoordinate( curPositon, newCenterPoint, -rotate );
  let newBottomRightPoint = calculateRotatedPointCoordinate(
    symmetricPoint,
    newCenterPoint,
    -rotate
  );

  let newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
  let newHeight = newBottomRightPoint.y - newTopLeftPoint.y;

  if ( newWidth / newHeight > proportion ) {
    newTopLeftPoint.x += Math.abs( newWidth - newHeight * proportion );
    newWidth = newHeight * proportion;
  } else {
    newTopLeftPoint.y += Math.abs( newHeight - newWidth / proportion );
    newHeight = newWidth / proportion;
  }

  // 由于现在求的未旋转前的坐标是以没按比例缩减宽高前的坐标来计算的
  // 所以缩减宽高后，需要按照原来的中心点旋转回去，获得缩减宽高并旋转后对应的坐标
  // 然后以这个坐标和对称点获得新的中心点，并重新计算未旋转前的坐标
  const rotatedTopLeftPoint = calculateRotatedPointCoordinate(
    newTopLeftPoint,
    newCenterPoint,
    rotate
  );
  newCenterPoint = getCenterPoint( rotatedTopLeftPoint, symmetricPoint );
  newTopLeftPoint = calculateRotatedPointCoordinate( rotatedTopLeftPoint, newCenterPoint, -rotate );
  newBottomRightPoint = calculateRotatedPointCoordinate( symmetricPoint, newCenterPoint, -rotate );

  newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
  newHeight = newBottomRightPoint.y - newTopLeftPoint.y;

  return {
    width: Math.round( newWidth - Number( paddingLeft || 0 ) - Number( paddingRight || 0 ) ),
    height: Math.round( newHeight - Number( paddingBottom || 0 ) - Number( paddingTop || 0 ) ),
    left: Math.round( newTopLeftPoint.x ),
    top: Math.round( newTopLeftPoint.y ),
  };
}

function calculateTop( style, curPositon, pointInfo ) {
  const { symmetricPoint, clickPosition } = pointInfo;
  const {
    rotate,
    paddingTop = 0,
    paddingBottom = 0,
    paddingRight = 0,
    paddingLeft = 0,
    width,
  } = style;
  // 由于用户拉伸时是以任意角度拉伸的，所以在求得旋转前的坐标时，只取 y 坐标（这里的 x 坐标可能是任意值），x 坐标用 clickPosition 的。
  // 这个中心点（第二个参数）用 clickPosition, center, symmetricPoint 都可以，只要他们在一条直线上就行
  const rotatedcurPositon = calculateRotatedPointCoordinate( curPositon, clickPosition, -rotate );

  // 算出旋转前 y 坐标，再用 clickPosition 的 x 坐标，重新计算它们旋转后对应的坐标
  const rotatedTopMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: clickPosition.x,
      y: rotatedcurPositon.y,
    },
    clickPosition,
    rotate
  );

  // 用旋转后的坐标和对称点算出新的高度（勾股定理）
  const newHeight = Math.sqrt(
    ( rotatedTopMiddlePoint.x - symmetricPoint.x ) ** 2 +
      ( rotatedTopMiddlePoint.y - symmetricPoint.y ) ** 2
  );
  const newCenter = {
    x: rotatedTopMiddlePoint.x - ( rotatedTopMiddlePoint.x - symmetricPoint.x ) / 2,
    y: rotatedTopMiddlePoint.y + ( symmetricPoint.y - rotatedTopMiddlePoint.y ) / 2,
  };

  return {
    height: Math.round( newHeight - Number( paddingTop ) - Number( paddingBottom ) ),
    top: Math.round( newCenter.y - newHeight / 2 ),
    left: Math.round( newCenter.x - ( width + Number( paddingLeft ) + Number( paddingRight ) ) / 2 ),
  };
}

function calculateRightTop( style, curPositon, { symmetricPoint, proportion } ) {
  const { rotate, paddingTop = 0, paddingBottom = 0, paddingRight = 0, paddingLeft = 0 } = style;
  let newCenterPoint = getCenterPoint( curPositon, symmetricPoint );
  let newTopRightPoint = calculateRotatedPointCoordinate( curPositon, newCenterPoint, -rotate );
  let newBottomLeftPoint = calculateRotatedPointCoordinate( symmetricPoint, newCenterPoint, -rotate );

  let newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
  let newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

  if ( newWidth / newHeight > proportion ) {
    newTopRightPoint.x -= Math.abs( newWidth - newHeight * proportion );
    newWidth = newHeight * proportion;
  } else {
    newTopRightPoint.y += Math.abs( newHeight - newWidth / proportion );
    newHeight = newWidth / proportion;
  }

  const rotatedTopRightPoint = calculateRotatedPointCoordinate(
    newTopRightPoint,
    newCenterPoint,
    rotate
  );
  newCenterPoint = getCenterPoint( rotatedTopRightPoint, symmetricPoint );
  newTopRightPoint = calculateRotatedPointCoordinate( rotatedTopRightPoint, newCenterPoint, -rotate );
  newBottomLeftPoint = calculateRotatedPointCoordinate( symmetricPoint, newCenterPoint, -rotate );

  newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
  newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

  return {
    width: Math.round( newWidth - Number( paddingLeft ) - Number( paddingRight ) ),
    height: Math.round( newHeight - Number( paddingTop ) - Number( paddingBottom ) ),
    left: Math.round( newBottomLeftPoint.x ),
    top: Math.round( newTopRightPoint.y ),
  };
}

function calculateRight( style, curPositon, { symmetricPoint, clickPosition } ) {
  const {
    rotate,
    paddingTop = 0,
    paddingBottom = 0,
    paddingRight = 0,
    paddingLeft = 0,
    height,
  } = style;
  const rotatedcurPositon = calculateRotatedPointCoordinate( curPositon, clickPosition, -rotate );
  const rotatedRightMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: rotatedcurPositon.x,
      y: clickPosition.y,
    },
    clickPosition,
    rotate
  );

  const newWidth = Math.sqrt(
    ( rotatedRightMiddlePoint.x - symmetricPoint.x ) ** 2 +
      ( rotatedRightMiddlePoint.y - symmetricPoint.y ) ** 2
  );

  const newCenter = {
    x: rotatedRightMiddlePoint.x - ( rotatedRightMiddlePoint.x - symmetricPoint.x ) / 2,
    y: rotatedRightMiddlePoint.y + ( symmetricPoint.y - rotatedRightMiddlePoint.y ) / 2,
  };

  return {
    width: Math.round( newWidth - Number( paddingLeft ) - Number( paddingRight ) ),
    top: Math.round( newCenter.y - ( height + Number( paddingTop ) + Number( paddingBottom ) ) / 2 ),
    left: Math.round( newCenter.x - newWidth / 2 ),
  };
}

function calculateRightBottom( style, curPositon, { proportion, symmetricPoint } ) {
  const { rotate, paddingTop = 0, paddingBottom = 0, paddingRight = 0, paddingLeft = 0 } = style;
  let newCenterPoint = getCenterPoint( curPositon, symmetricPoint );
  let newTopLeftPoint = calculateRotatedPointCoordinate( symmetricPoint, newCenterPoint, -rotate );
  let newBottomRightPoint = calculateRotatedPointCoordinate( curPositon, newCenterPoint, -rotate );

  let newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
  let newHeight = newBottomRightPoint.y - newTopLeftPoint.y;

  if ( newWidth / newHeight > proportion ) {
    newBottomRightPoint.x -= Math.abs( newWidth - newHeight * proportion );
    newWidth = newHeight * proportion;
  } else {
    newBottomRightPoint.y -= Math.abs( newHeight - newWidth / proportion );
    newHeight = newWidth / proportion;
  }

  const rotatedBottomRightPoint = calculateRotatedPointCoordinate(
    newBottomRightPoint,
    newCenterPoint,
    rotate
  );
  newCenterPoint = getCenterPoint( rotatedBottomRightPoint, symmetricPoint );
  newTopLeftPoint = calculateRotatedPointCoordinate( symmetricPoint, newCenterPoint, -rotate );
  newBottomRightPoint = calculateRotatedPointCoordinate(
    rotatedBottomRightPoint,
    newCenterPoint,
    -rotate
  );

  newWidth = newBottomRightPoint.x - newTopLeftPoint.x;
  newHeight = newBottomRightPoint.y - newTopLeftPoint.y;
  return {
    width: Math.round( newWidth - Number( paddingLeft ) - Number( paddingRight ) ),
    height: Math.round( newHeight - Number( paddingTop ) - Number( paddingBottom ) ),
    left: Math.round( newTopLeftPoint.x ),
    top: Math.round( newTopLeftPoint.y ),
  };
}

function calculateBottom( style, curPositon, { symmetricPoint, clickPosition } ) {
  const {
    rotate,
    paddingTop = 0,
    paddingBottom = 0,
    paddingRight = 0,
    paddingLeft = 0,
    width,
  } = style;
  const rotatedcurPositon = calculateRotatedPointCoordinate( curPositon, clickPosition, -rotate );
  const rotatedBottomMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: clickPosition.x,
      y: rotatedcurPositon.y,
    },
    clickPosition,
    rotate
  );

  const newHeight = Math.sqrt(
    ( rotatedBottomMiddlePoint.x - symmetricPoint.x ) ** 2 +
      ( rotatedBottomMiddlePoint.y - symmetricPoint.y ) ** 2
  );

  const newCenter = {
    x: rotatedBottomMiddlePoint.x - ( rotatedBottomMiddlePoint.x - symmetricPoint.x ) / 2,
    y: rotatedBottomMiddlePoint.y + ( symmetricPoint.y - rotatedBottomMiddlePoint.y ) / 2,
  };

  return {
    height: Math.round( newHeight - Number( paddingTop ) - Number( paddingBottom ) ),
    top: Math.round( newCenter.y - newHeight / 2 ),
    left: Math.round( newCenter.x - ( width + Number( paddingLeft ) + Number( paddingRight ) ) / 2 ),
  };
}

function calculateLeftBottom( style, curPositon, { proportion, symmetricPoint } ) {
  const {
    rotate,
    paddingTop = 0,
    paddingBottom = 0,
    paddingRight = 0,
    paddingLeft = 0,
  } = style;
  let newCenterPoint = getCenterPoint( curPositon, symmetricPoint );
  let newTopRightPoint = calculateRotatedPointCoordinate( symmetricPoint, newCenterPoint, -rotate );
  let newBottomLeftPoint = calculateRotatedPointCoordinate( curPositon, newCenterPoint, -rotate );
  let newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
  let newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

  if ( newWidth / newHeight > proportion ) {
    newBottomLeftPoint.x += Math.abs( newWidth - newHeight * proportion );
    newWidth = newHeight * proportion;
  } else {
    newBottomLeftPoint.y -= Math.abs( newHeight - newWidth / proportion );
    newHeight = newWidth / proportion;
  }

  const rotatedBottomLeftPoint = calculateRotatedPointCoordinate(
    newBottomLeftPoint,
    newCenterPoint,
    rotate
  );
  newCenterPoint = getCenterPoint( rotatedBottomLeftPoint, symmetricPoint );
  newTopRightPoint = calculateRotatedPointCoordinate( symmetricPoint, newCenterPoint, -rotate );
  newBottomLeftPoint = calculateRotatedPointCoordinate(
    rotatedBottomLeftPoint,
    newCenterPoint,
    -rotate
  );

  newWidth = newTopRightPoint.x - newBottomLeftPoint.x;
  newHeight = newBottomLeftPoint.y - newTopRightPoint.y;

  return {
    width: Math.round( newWidth - Number( paddingLeft ) - Number( paddingRight ) ),
    height: Math.round( newHeight - Number( paddingTop ) - Number( paddingBottom ) ),
    left: Math.round( newBottomLeftPoint.x ),
    top: Math.round( newTopRightPoint.y ),
  };
}

function calculateLeft( style, curPositon, { symmetricPoint, clickPosition } ) {
  const {
    rotate,
    paddingTop = 0,
    paddingBottom = 0,
    paddingRight = 0,
    paddingLeft = 0,
    height,
  } = style;
  const rotatedcurPositon = calculateRotatedPointCoordinate( curPositon, clickPosition, -rotate );
  const rotatedLeftMiddlePoint = calculateRotatedPointCoordinate(
    {
      x: rotatedcurPositon.x,
      y: clickPosition.y,
    },
    clickPosition,
    rotate
  );

  const newWidth = Math.sqrt(
    ( rotatedLeftMiddlePoint.x - symmetricPoint.x ) ** 2 +
      ( rotatedLeftMiddlePoint.y - symmetricPoint.y ) ** 2
  );

  const newCenter = {
    x: rotatedLeftMiddlePoint.x - ( rotatedLeftMiddlePoint.x - symmetricPoint.x ) / 2,
    y: rotatedLeftMiddlePoint.y + ( symmetricPoint.y - rotatedLeftMiddlePoint.y ) / 2,
  };
  return {
    width: Math.round( newWidth - Number( paddingLeft || 0 ) - Number( paddingRight || 0 ) ),
    top: Math.round(
      newCenter.y - ( height + Number( paddingTop || 0 ) + Number( paddingBottom || 0 ) ) / 2
    ),
    left: Math.round( newCenter.x - newWidth / 2 ),
  };
}
const calculateObj = {
  0: calculateLeftTop,
  1: calculateTop,
  2: calculateRightTop,
  3: calculateRight,
  4: calculateRightBottom,
  5: calculateBottom,
  6: calculateLeftBottom,
  7: calculateLeft,
};
function calculateComponentPositonAndSize( event, clickParams, elStyle, scaling ) {
  const { idx, parentRect, symmetricPoint, proportion, clickPosition } = clickParams;
  const curPositon = {
    x: ( event.clientX - parentRect.left ) * 100 / scaling,
    y: ( event.clientY - parentRect.top ) * 100 / scaling,
  };
  return calculateObj[idx]( elStyle, curPositon, { symmetricPoint, clickPosition, proportion } );
}
export default calculateComponentPositonAndSize;
