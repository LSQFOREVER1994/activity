/* eslint-disable react/no-array-index-key,no-param-reassign */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Table, Card, Form, Modal, Input, Icon, DatePicker, Tag, Select, Popover, Radio } from 'antd';
import { formatMessage } from 'umi/locale';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import BraftEditor from '@/components/BraftEditor/BraftEditor';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import UploadImg from '@/components/UploadImg';
import styles from '../../EducationService/education.less';


const FormItem = Form.Item;
const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

const radioStyle = {
    display: 'inline-block',
    height: '30px',
    lineHeight: '30px',
    marginLeft: '10px',
    marginBottom: '15px',
  };

const colors = ["#2db7f5", "#87d068", "#108ee9", "#f50", "purple", '#335aa7', '#c1a375'];

@connect( ( { crop } ) => ( {
    loading: crop.loading,
    articleListResult: crop.articleListResult,

    tagsListResult: crop.tagsListResult
} ) )
@Form.create()

class ArticleList extends PureComponent {
    // 初始化数据
    state = {
        pageNum: 1,
        pageSize: 10,
        visible: false,
        sortedInfo: {},

        // 图片上传
        previewVisible: false,
        previewImage: '',
        fileLists: new Array( 7 ).fill( null ),
        coverSrc: '',
        imgagesSrc: '',
        newsType: 'inside',

    };

    formLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };

    componentDidMount() {
        const { dispatch } = this.props;
        const { pageNum, pageSize } = this.state;
        this.articleListManage( { pageNum, pageSize } );
        // 请求标签列表
        dispatch( {
            type: 'crop/getTagsListAll',
            payload: { pageSize: 100 }
        } )
    };

    // 初始化 页面获取文章列表
    articleListManage = ( { pageSize, pageNum, sortedInfo = {} } ) => {
        // 处理排序
        const sortValue = ( sortedInfo.order === 'descend' ) ? 'desc' : 'asc';
        const { dispatch } = this.props;

        dispatch( {
            type: 'crop/getArticleListAll',
            payload: {
                params: {
                    pageSize,
                    pageNum,
                    orderBy: sortedInfo.columnKey ? `${sortedInfo.columnKey || ''} ${sortValue}` : 'publish_date desc',
                },
                callFunc() { }
            }
        } )
    };

    // 翻页
    tableChange = ( pagination, filters, sorter ) => {
        const sotrObj = { order:'descend', ...sorter, }
        const { current, pageSize } = pagination;
        const { searchValue } = this.state;
        this.articleListManage( { pageNum: current, pageSize, sortedInfo: sotrObj, searchValue } );
        this.setState( {
            sortedInfo: sorter,
            pageNum: current,
            pageSize,
        } );
    };

    //  显示添加 Modal
    showAddModal = () => {
        this.srcForUpload( '' );
        this.setState( {
            visible: true,
            current: undefined,
            coverSrc: '',
            newsType: 'inside',
        } );
    };

    //  显示编辑 Modal
    showEditModal = ( obj ) => {
        this.srcForUpload( obj.imgUrl );
        const { fileLists } = this.state;

        if ( obj.imgUrl ) {
            fileLists[0] = {
                uid: obj.imgUrl,
                url: obj.imgUrl,
            };
        }
        this.setState( {
            visible: true,
            current: obj,
            fileLists,
            coverSrc: obj.imgUrl,
            newsType: obj.externalLink ? 'outside' : 'inside',
        } );
    };

    //  取消
    handleCancel = () => {
        const { current } = this.state;
        const id = current ? current.id : '';
        setTimeout( () => {
            if ( this.addProBtn ) { this.addProBtn.blur(); }
            if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
        }, 0 );

        this.setState( {
            visible: false,
            current: undefined,
            coverSrc: ''
        } );
    };


    //  提交(添加或者编辑文章)
    handleSubmit = ( e ) => {
        e.preventDefault();
        const { dispatch, form } = this.props;
        const {
            current, pageSize, pageNum, coverSrc, sortedInfo,
            newsType,
        } = this.state;
        const id = current ? current.id : '';

        setTimeout( () => {
            if ( this.addProBtn ) { this.addProBtn.blur(); }
            if ( this[`editProBtn${id}`] ) { this[`editProBtn${id}`].blur(); }
        }, 0 );

        const $this = this;
        form.validateFields( ( err, fieldsValue ) => {
            if ( err ) return;

            // 处理时间
            fieldsValue.publishDate = moment( fieldsValue.publishDate ).format( "YYYY-MM-DD HH:mm:ss" );
            // 处理标签并生成新数组
            fieldsValue.tags = fieldsValue.tags.map( ( tag ) => {
                const tagObject = { id: tag };
                return tagObject;
            } );

            if ( newsType === 'inside' ) {
                fieldsValue.externalLink = '';
            } else {
                fieldsValue.content = '';
            }

            // 处理图片地址
            const params = id ? Object.assign( current, fieldsValue, { imgUrl: coverSrc } ) : { ...fieldsValue, imgUrl: coverSrc };

            const isUpdate = !!id;
            dispatch( {
                type: 'crop/upaddDatArticle',
                payload: {
                    params,
                    isUpdate,
                    callFunc: () => {
                        $this.articleListManage( { pageNum, pageSize, sortedInfo } );
                        $this.setState( {
                            visible: false,
                            current: undefined,
                        } );
                    },
                },
            } );
        } );
    };

    // 删除文章
    deleteItem = ( e, id ) => {
        e.stopPropagation();

        const $this = this;
        const { pageSize, pageNum } = this.state;
        const { articleListResult: { list }, dispatch } = this.props;
        const obj = list.find( o => o.id === id );

        confirm( {
            cancelText: '取消',
            okText: '确定',
            title: `${formatMessage( { id: 'form.del.tit' } )}：${obj.title}`,
            onOk() {
                setTimeout( () => {
                    if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
                    if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
                }, 0 )
                dispatch( {
                    type: 'crop/delArticleList',
                    payload: {
                        id,
                        callFunc: () => {
                            $this.articleListManage( { pageSize, pageNum } );
                            $this.setState( { pageSize, pageNum } )
                        },
                    },
                } );
            },
            onCancel() {
                setTimeout( () => {
                    if ( $this[`delProBtn${id}`] ) { $this[`delProBtn${id}`].blur(); }
                    if ( $this[`delSpeBtn${id}`] ) { $this[`delSpeBtn${id}`].blur(); }
                }, 0 )
            },
        } );
    };

    // 上传图片
    ChangeFunc = ( res, key ) => {
        const { fileLists, imgagesSrc } = this.state;
        fileLists[key] = res;
        this.setState( { fileLists: new Array( ...fileLists ) } );
        if ( key === 0 ) {
            this.setState( { coverSrc: res.url } );
        } else {
            const imagesArr = imgagesSrc.split( ',' );
            imagesArr[key - 1] = res.url;
            this.setState( { imgagesSrc: imagesArr.join( ',' ) } );
        }
    };

    // 关闭图片预览
    CancelFunc = () => this.setState( { previewVisible: false } );

    // 删除上传的图片
    RemoveFunc = ( res, key ) => {
        const { fileLists, imgagesSrc } = this.state;
        fileLists[key] = null;
        this.setState( { fileLists: new Array( ...fileLists ) } );
        if ( key === 0 ) {
            this.setState( { coverSrc: '' } );
        } else {
            let imagesArr = imgagesSrc.split( ',' );
            imagesArr[key - 1] = '';
            imagesArr = imagesArr.filter( item => { return item } )
            this.setState( { imgagesSrc: imagesArr.join( ',' ) } );
        }
    }

    // 打开图片预览
    PreviewFunc = ( file ) => {
        this.setState( {
            previewImage: file.url,
            previewVisible: true,
        } );
    }

    // 根据链接分配显示到上传组建
    srcForUpload = ( cover ) => {
        const { fileLists } = this.state;

        if ( cover ) {
            const coverObj = {
                uid: cover,
                url: cover,
            };
            fileLists[0] = coverObj;
        } else {
            fileLists[0] = null;
        }

        this.setState( { fileLists: new Array( ...fileLists ) } );
    }

    // 绩牛预览
    onClickJN = ( data ) => {
        window.open( `http://www.jiniutech.com/articleDetail/${data.id}` );
    }

    // 大招预览
    onClickDZ = ( data ) => {
        window.open( `https://www.idazhao.cn/articleDetail/${data.id}` );
    }

    // 禁用文章
    disable = ( data ) => {
        const $this = this;
        const { pageSize, pageNum, sortedInfo } = this.state;
        const { dispatch } = this.props;
        const { id } = data;
        dispatch( {
            type: 'crop/enableArticle',
            payload: {
                id,
                callFunc: () => {
                    $this.articleListManage( { pageSize, pageNum, sortedInfo } );
                    $this.setState( { pageSize, pageNum } )
                },
            }
        } )
    }

    // 启用文章
    enable = ( data ) => {
        const $this = this;
        const { pageSize, pageNum, sortedInfo } = this.state;
        const { dispatch } = this.props;
        const { id } = data;
        dispatch( {
            type: 'crop/disableArticle',
            payload: {
                id,
                callFunc: () => {
                    $this.articleListManage( { pageSize, pageNum, sortedInfo } );
                    $this.setState( { pageSize, pageNum } )
                },
            }
        } )
    }

    changeNewsType = ( e ) => {
        this.setState( { newsType: e.target.value } );
    }


    render() {

        const { loading, articleListResult: { total, list }, form: { getFieldDecorator }, tagsListResult } = this.props;
        const { pageSize, pageNum, visible, current = {}, previewVisible, previewImage, fileLists, coverSrc, sortedInfo, newsType } = this.state;

        // 拿取标签
        const tagsList = tagsListResult.list || [];

        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            pageSize,
            total,
            current: pageNum
        };
        const modalFooter = {
            okText: formatMessage( { id: 'form.save' } ),
            onOk: this.handleSubmit,
            onCancel: this.handleCancel
        };

        const columns = [
            {// 编号
                title: <span>编号</span>,
                dataIndex: 'id',
                key: 'ID',
                render: id => <span>{id}</span>,
            },
            { // 文章标题
                title: <span>{formatMessage( { id: 'website.article.title' } )}</span>,
                dataIndex: 'title',
                render: title => <span>{title}</span>,
            },
            {// 文章标签
                title: <span>{formatMessage( { id: 'website.article.tag' } )}</span>,
                dataIndex: 'tags',
                render: tags => (
                  <div>
                    {
                            tags.map( ( tag, index ) => <Tag color={index > 4 ? "grey" : colors[index]} key={index} style={{ marginBottom: '1px' }}>{tag.name}</Tag> )
                        }
                  </div>
                )
            },
            {// 发布时间
                title: <span>{formatMessage( { id: 'website.article.publishDate' } )}</span>,
                dataIndex: 'publishDate',
                key: 'publish_date',
                sorter: true,
                sortOrder: sortedInfo.columnKey === 'publish_date' && sortedInfo.order,
                sortDirections: ['descend', 'ascend'],
                render: publishDate => <span>{publishDate || '-'}</span>
            },
            {// 作者
                title: <span>{formatMessage( { id: 'website.article.author' } )}</span>,
                dataIndex: 'author',
                render: author => <span>{author}</span>
            },
            {// 是否启用
                title: <span>{formatMessage( { id: 'website.article.enable' } )}</span>,
                dataIndex: 'enable',
                render: ( enable, data ) => (
                  <span>{
                        enable ? <Icon onClick={() => this.disable( data )} style={{ color: 'green' }} type="check-circle" />
                            : <Icon onClick={() => this.enable( data )} style={{ color: 'red' }} type="close-circle" />
                    }
                  </span> ),
            },
            {// 图片地址
                title: <span>{formatMessage( { id: 'website.article.imgUrl' } )}</span>,
                dataIndex: 'imgUrl',
                render: imgUrl => <img alt={imgUrl} src={imgUrl ? `${imgUrl}?imageView2/2/h/100` : ''} style={{ maxHeight: '80px' }} />
            },
            { // 外部新闻
                title: <span>外部新闻地址</span>,
                dataIndex: 'externalLink',
                render: externalLink => <span>{externalLink}</span>,
            },
            {// 删除，编辑
                title: '操作',
                dataIndex: 'id',
                render: ( id, data ) => {
                    const content = data.externalLink ? (
                      <Button
                        style={{ backgroundColor: colors[6], color: '#fff' }}
                        onClick={() => window.open( data.externalLink )}
                      >外部新闻
                      </Button>
                    ) : (
                      <div>
                        <Button
                          style={{ backgroundColor: colors[6], color: '#fff' }}
                          onClick={() => this.onClickJN( data )}
                        >绩牛官网
                        </Button>

                        <Button
                          style={{ backgroundColor: colors[5], color: '#fff' }}
                          onClick={() => this.onClickDZ( data )}
                        >大招官网
                        </Button>
                      </div>
                    );

                    return (
                      <div>
                        {/* 编辑按钮 */}
                        <span
                          style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#1890ff' }}
                          type="link"
                          onClick={() => this.showEditModal( data )}
                          ref={component => {
                                    /* eslint-disable */
                                    this[`editProBtn${id}`] = findDOMNode(component);
                                    /* eslint-enable */
                                }}
                        >
                              编辑
                        </span>

                        {/* 预览按钮 */}
                        <Popover
                          title={formatMessage( { id: 'action.button.eye' } )}
                          trigger="hover"
                          content={content}
                        >
                          <span
                            style={{ display: 'block', marginBottom:5, cursor:'pointer', color:'#52c41a'  }}
                            type="link"
                          >
                              预览
                          </span>
                        </Popover>

                        {/* 删除按钮 */}
                        <span
                          style={{ display: 'block', cursor:'pointer', color:'#f5222d' }}
                          type="link"
                          onClick={( e ) => this.deleteItem( e, id )}
                          ref={component => {
                                    /* eslint-disable */
                                    this[`delProBtn${id}`] = findDOMNode(component);
                                    /* eslint-enable */
                                }}
                        >
                              删除
                        </span>
                        
                      </div>
                    )
                }
            },
        ];
        return (
          <GridContent>
            <div className={styles.standardList}>
              <Card
                className={styles.listCard}
                bordered={false}
                title="文章列表"
                bodyStyle={{ padding: '20px 32px 40px 32px' }}
              >
                {/* 添加文章按钮 */}
                <Button
                  type="dashed"
                  style={{ width: '100%', marginBottom: 8 }}
                  icon="plus"
                  onClick={() => this.showAddModal()}
                  ref={component => {
                                /* eslint-disable */
                                this.addProBtn = findDOMNode(component);
                                /* eslint-enable */
                            }}
                >
                  {formatMessage( { id: 'form.add' } )}
                </Button>

                {/* 文章列表 */}
                <Table
                  size="large"
                  rowKey="id"
                  columns={columns}
                  loading={loading}
                  pagination={paginationProps}
                  dataSource={list}
                  onChange={this.tableChange}
                />
              </Card>
            </div>
            {/* 添加，编辑模板 */}
            <Modal
              maskClosable={false}
              title={Object.keys( current ).length > 0 ? '编辑标签' : '添加标签'}
              className={styles.standardListForm}
              width={1000}
              bodyStyle={{ padding: '28px 0 0' }}
              destroyOnClose
              visible={visible}
              {...modalFooter}
            >
              {
                <Form onSubmit={this.handleSubmit}>

                  {/* 发布时间 */}
                  <FormItem label={formatMessage( { id: 'website.article.publishDate' } )} {...this.formLayout}>
                    {getFieldDecorator( 'publishDate', {
                                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'website.article.publishDate' } )}` }],
                                    initialValue: moment( current.publishDate ),
                                } )( <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" /> )}
                  </FormItem>

                  {/* 作者 */}
                  <FormItem label={formatMessage( { id: 'website.article.author' } )} {...this.formLayout}>
                    {getFieldDecorator( 'author', {
                                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}ID` }],
                                    initialValue: current.author,
                                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'website.article.author' } )}`} disabled={!!current.author} /> )}
                  </FormItem>

                  {/* 标题 */}
                  <FormItem label={formatMessage( { id: 'website.article.title' } )} {...this.formLayout}>
                    {getFieldDecorator( 'title', {
                                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'website.article.title' } )}` }],
                                    initialValue: current.title,
                                } )( <Input placeholder={`${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'website.article.title' } )}`} /> )}
                  </FormItem>

                  {/* 标签 */}
                  <FormItem label={formatMessage( { id: 'website.article.tag' } )} {...this.formLayout}>
                    {getFieldDecorator( 'tags', {
                                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'website.article.tag' } )}` }],
                                    initialValue: current.tags ? current.tags.map( t => t.id ) : []
                                } )(
                                  <Select
                                    mode="multiple"
                                    placeholder={`${formatMessage( { id: 'form.select' } )}${formatMessage( { id: 'website.article.tag' } )}`}
                                  >
                                    {tagsList.length > 0 && tagsList.map( item =>
                                      <Option key={item.id} value={item.id}>{item.name}</Option>
                                        )}
                                  </Select>
                                )}
                  </FormItem>

                  {/* 摘要 */}
                  <FormItem label={formatMessage( { id: 'website.article.abstract' } )} {...this.formLayout}>
                    {getFieldDecorator( 'abstract', {
                                    rules: [{ required: false, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'website.article.abstract' } )}` }],
                                    initialValue: current.abstract,
                                } )( <TextArea /> )}
                  </FormItem>

                  {/* 图片 */}
                  <FormItem label={formatMessage( { id: 'website.article.picture' } )} {...this.formLayout}>
                    {getFieldDecorator( 'image', {
                                    rules: [{ required: false }],
                                    initialValue: coverSrc,
                                } )(
                                  <div className={styles.UploadLogoBox}>
                                    <UploadImg
                                      className={styles.UploadLogo}
                                      previewVisible={previewVisible}
                                      previewImage={previewImage}
                                      fileList={fileLists[0] ? [{ ...fileLists[0] }] : []}
                                      CancelFunc={this.CancelFunc}
                                      PreviewFunc={this.PreviewFunc}
                                      ChangeFunc={e => this.ChangeFunc( e, 0 )}
                                      RemoveFunc={e => this.RemoveFunc( e, 0 )}
                                    />
                                  </div>
                                )}
                  </FormItem>
                  <FormItem label='新闻归属' {...this.formLayout}>
                    <RadioGroup
                      defaultValue={newsType}
                      onChange={this.changeNewsType}
                    >
                      <Radio value="inside" style={radioStyle}>原创</Radio>
                      <Radio value="outside" style={radioStyle}>外部摘抄</Radio>
                    </RadioGroup>
                  </FormItem>
                  {/* 文章内容 */}
                  {
                    ( newsType === 'inside' ) && (
                    <FormItem label={formatMessage( { id: 'website.article.content' } )} {...this.formLayout}>
                      {getFieldDecorator( 'content', {
                                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}${formatMessage( { id: 'website.article.content' } )}` }],
                                    initialValue: current.content,
                                } )(
                                  <BraftEditor record={current.content} fieldDecorator={getFieldDecorator} field="content" />
                                )}
                    </FormItem>
                    )
                  }
                  {
                    ( newsType === 'outside' ) && (
                    <FormItem label="外部新闻地址" {...this.formLayout}>
                      {getFieldDecorator( 'externalLink', {
                                    rules: [{ required: true, message: `${formatMessage( { id: 'form.input' } )}外部新闻地址` }],
                                    initialValue: current.externalLink,
                                } )(
                                  <Input placeholder={`${formatMessage( { id: 'form.input' } )}外部新闻地址`} /> 
                                )}
                    </FormItem>
                    )
                  }
                  
                </Form>
                    }
            </Modal>
          </GridContent>
        );
    };
}

export default ArticleList;