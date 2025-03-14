TODO: 待打磨

```JSX
// e.g.示例1，在组件设置中使用
// 键值请自定义
listData.js
...
  colors: {
    pannelColor1: 'rgba(255, 245, 211, 1)',
    pannelColor2: 'rgba(255, 255, 253, 1)',
    pennelDivideColor: 'rgba(255, 146, 102, 1)',
    prizeTextColor: 'rgba(83,83,83,1)',
    textColor: 'rgba(83,83,83,1)',
  },
...

...
const { componentsData, changeValue } = props;
const { drawConsumeType } = componentsData;

// Tips
const colorsTip = {
  pannelColor1: "转盘盘面颜色1",
  pannelColor2: "转盘盘面颜色2",
  pennelDivideColor: "转盘分界线颜色",
  prizeTextColor: "奖品文字颜色",
  textColor: `${drawConsumeType === "LEFT_COUNT" ? "剩余次数文字颜色" : "积分文字颜色"}`
}

// 键值数组，保证顺序
const colorsKey = [
  "pannelColor1",
  "pannelColor2",
  "pennelDivideColor",
  "prizeTextColor",
  "textColor",
]

// 默认值，用于兼容旧活动
const defaultColors = {
  pannelColor1: 'rgba(255, 245, 211, 1)',
  pannelColor2: 'rgba(255, 255, 253, 1)',
  pennelDivideColor: 'rgba(255, 146, 102, 1)',
  prizeTextColor: 'rgba(83,83,83,1)',
  textColor: 'rgba(83,83,83,1)',
}

const renderList = [
  {
    renderType: 'ColorsMap',
    label: '颜色',
    field: 'colors',
    flex: true,
    formLayout: {},
    propsData: {
      colorsTip,
      colorsKey,
      defaultValue: defaultColors
    },
  },
]
...

```

