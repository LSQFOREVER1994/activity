import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Form } from 'antd';
import styles from './DevDockExplain.less'

const FormItem = Form.Item;

@connect()
@Form.create()
class DevDockExplain extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {}
    }
   
    render() { 
        return (  
            <div>
                this is devdockexplain
            </div>
        );
    }
}
 
export default DevDockExplain;