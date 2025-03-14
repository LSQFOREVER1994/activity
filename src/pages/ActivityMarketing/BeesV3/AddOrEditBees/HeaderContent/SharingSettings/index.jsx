import React, { useContext } from 'react';
import { Input, Form, message } from 'antd';
import UploadModal from '@/components/UploadModal/UploadModal';
// import serviceObj from '@/services/serviceObj';
import { DomDataContext } from '../../provider';
import head from '@/assets/head.png';
import border from '@/assets/border.png';

const { TextArea } = Input

// const designImgs = {
//   invite: `${serviceObj.defaultImagePath}SJGF2.png`,
//   share: `${serviceObj.defaultImagePath}SJGF1.png`,
// };
const FormItem = Form.Item;
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};
function SharingSettings() {
  const [domData, changeDomData] = useContext( DomDataContext );
  const { shareSetting = {} } = domData;

  const changeInput = ( e, type ) => {
    let val = e;
    if ( e && e.target ) {
      val = e.target.value;
    }
    if ( type === 'link' && val.length > 255 ) {
      message.error( '链接长度不能超过255个字符' );
      return;
    }
    if ( Object.keys( shareSetting ).length ) {
      domData.shareSetting[type] = val;
    } else {
      domData.shareSetting = { [type]: val };
    }
    const obj = Object.assign( domData );
    changeDomData( obj );
  };

  return (
    <div style={{ width: 600 }} className="shareOp">
      <FormItem style={{ display: 'flex' }} label="分享标题" {...formLayout}>
        <Input
          value={shareSetting.title}
          placeholder="请输入分享标题"
          maxLength={20}
          onChange={e => changeInput( e, 'title' )}
          suffix={
            <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
              {shareSetting.title ? `${shareSetting.title.length}` : ''}
            </span>
          }
        />
      </FormItem>
      <FormItem style={{ display: 'flex' }} label="分享描述" {...formLayout}>
        <TextArea
          value={shareSetting.desc}
          placeholder="请输入分享描述"
          maxLength={30}
          onChange={e => changeInput( e, 'desc' )}
          suffix={
            <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
              {shareSetting.desc ? `${shareSetting.desc.length}` : ''}
            </span>
          }
        />
      </FormItem>
      <FormItem style={{ display: 'flex' }} label="分享链接" {...formLayout}>
        <TextArea
          value={shareSetting.link}
          placeholder="请输入分享链接，不填默认本活动链接"
          onChange={e => changeInput( e, 'link' )}
          suffix={
            <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
              {shareSetting.link ? `${shareSetting.link.length}` : ''}
            </span>
          }
        />
      </FormItem>
      <FormItem label="分享图标" {...formLayout}>
        <div style={{ display: 'flex', width: '200px' }}>
          <UploadModal value={shareSetting.image} onChange={e => changeInput( e, 'image' )} />
          <div
            style={{
              width: '77px',
              fontSize: 13,
              color: '#999',
              lineHeight: 2,
              marginTop: 10,
              marginLeft: 10,
            }}
          >
            <div>格式：jpg/jpeg/png </div>
            <div>图片大小建议不大于1M</div>
          </div>
        </div>
      </FormItem>
      <FormItem label="分享样式预览" {...formLayout}>
        <div style={{ display: 'flex' }}>
          <div style={{ marginTop: '10px' }}>
            <img src={head} alt="" />
          </div>
          <div style={{ position: 'relative' }}>
            <img src={border} alt="" />
            <div style={{ position: 'absolute', top: 20, left: 20 }}>
              <div style={{ fontWeight: 500, lineHeight: '20px' }}>
                {shareSetting.title
                  ? shareSetting.title
                  : '分享标题分享标题分享标题分享标题分享标题分享标题分享标题分享标题分享标题分享标题'}
              </div>
              <div
                style={{
                  display: 'flex',
                  marginTop: 10,
                  alignItems: 'center',
                  alignContent: 'center',
                }}
              >
                <div
                  style={{
                    height: 120,
                    width: 120,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignContent: 'center',
                    overflow: 'hidden',
                    backgroundColor: '#e7e7e7',
                    borderRadius: '2px',
                  }}
                >
                  {shareSetting.image && (
                    <img style={{ width: '100%' }} src={shareSetting.image} alt="" />
                  )}
                </div>
                <span
                  style={{
                    marginLeft: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}
                >
                  {shareSetting.desc
                    ? shareSetting.desc
                    : '分享描述分享描述分享描述分享描述分享描述分享描述分享描述分享描述分享描述'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </FormItem>
    </div>
  );
}
export default SharingSettings;
