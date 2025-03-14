# 3.x版本新增与编辑活动

#### 目录结构
```
|
| AddOrEditBees 新增与编辑
	|- PreviewComponents 编辑预览组件目录				
	|- ComponentsOption 组件配置目录

```

#### ComponentsOption 组件配置导出参数说明

| key              | value     | 说明               |
| ---------------- | --------- | ------------------ |
| SET_JUMP         | boolean   | 是否展示跳转       |
| ADVANCED_SETTING | ReactNode | 编辑区域自定义配置 |
| default          | ReactNode | 其他配置           |


#### model文件
1. 因为该文件作为组件导入使用，该目录下的model不会生效。
2. 对应model文件在Bees/modelbeesV3.js 命名空间为：beesVersionThree



#### JSON渲染表单

| 字段                 | 值类型                                                       | 说明                             | 备注                                                         |
| -------------------- | ------------------------------------------------------------ | -------------------------------- | ------------------------------------------------------------ |
| field                | string\|array<string>                                        | 显示及改变的路径                 | 参考loadsh.set,<br />目前日期选择组件是数组                  |
| renderType           | string                                                       | 渲染组件类型                     | 默认输入框                                                   |
| label                | ReactNode                                                    | 表单标题                         |                                                              |
| required             | boolean                                                      | 必填标识                         |                                                              |
| radioList            | array\<object>                                               | 单选框选项                       | {label:'',value:''}                                          |
| optionList           | array\<object>                                               | 下拉框选项                       | {label:'',value:''}                                          |
| propsData            | object                                                       | antd组件配置                     |                                                              |
| tips                 | ReactNode \| array<{text:array,style?:object}>               | 组件右边注释                     | {text:[],style?:{}}                                          |
| unit                 | ReactNode \| array<{text:array,style?:object}>               | 输入框组件右边单位 （px,次,人)   | {text:[],style?:{}}                                          |
| annotation           | ReactNode                                                    | 组件下边添加注释内容             |                                                              |
| suffixContainerStyle | object                                                       | 表单容器样式（组件与后缀父元素） |                                                              |
| formLayout           | object                                                       | 表单布局配置                     | 默认值：labelCol: { span: 6 }<br />wrapperCol: { span: 14 }  |
| changeCallBack       | function<{data,changeData}>                                  | 值改变回调                       |                                                              |
| conditionalRendering | string\|<br />boolean\|<br />object\|<br />array<object>\|<br />function<data>:boolean | 条件渲染                         | string:从当前组件参数获取值的路径<br />boolean:显示或不显示<br />object:用获取的值与传入的值比对，相同渲染，{path:string,value:any}<br />array:同object<br />function:自定义渲染逻辑，入参当前组件参数对象，出参布尔值 |
| content              | ReactNode                                                    | 自定义组件内容                   |                                                              |
| disabled             | 同conditionalRendering                                       | 组件禁用                         | 同conditionalRendering                                       |
| recoveryValue        | number                                                       | 恢复值                           | 当输入框删除为空时，会将该值当作输入值更新                   |
|                      |                                                              |                                  |                                                              |
|                      |                                                              |                                  |                                                              |

#### 已封装组件

1. Input 输入框
2. UploadModal 上传组件
3. SliderAndInputNumber 滑动条与输入框
4. SketchPicker 颜色选择
5. InputNumber 数字输入框
6. RangePicker 多个日期选择
7. Radio 单选框
8. Select 下拉框
9. TextArea 文本域
10. DatePicker 单个日期选择器
11. custom 自定义组件