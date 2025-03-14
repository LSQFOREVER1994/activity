import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Tabs } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from '../education.less';
import TagsList from '../Tags/TagsList'
import SubjectList from '../Subject/SubjectList'

const { TabPane } = Tabs;

@connect( ( { course } ) => ( {
  loading: course.loading,
} ) )
@Form.create()

class QuestionBank extends PureComponent {
  state = {

  }

  componentDidMount() {

  };

  render() {
    return (
      <GridContent>
        <div className={styles.standardList}>
          <Card 
            className={styles.listCard}
            bordered={false}
            title="题库管理"
            bodyStyle={{ padding: '20px 32px 40px 32px' }}
          >
            <div>
              <Tabs defaultActiveKey="1">
                <TabPane tab="题目分类" key="1">
                  <TagsList />
                </TabPane>

                <TabPane tab="题目列表" key="2">
                  <SubjectList />
                </TabPane>
              </Tabs>
            </div>
          </Card>
        </div>
      </GridContent>
    );
  };
}

export default QuestionBank;