import React, { Component } from 'react';
import { Modal, Form, Input, Radio, InputNumber, Cascader, Select, AutoComplete ,DatePicker,LocaleProvider} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const options = [];

class TopUpConsumptionFrom extends Component{
    state = {
        autoCompleteResult: [],
    };
    constructor(props){
        super(props);
    }
    componentDidMount(){

    }
    handleWebsiteChange = (value) => {
        let autoCompleteResult;
        if (!value) {
            autoCompleteResult = [];
        } else {
            autoCompleteResult = ['.com', '.cn', '.org', '.net'].map(domain => `${value}${domain}`);
        }
        this.setState({ autoCompleteResult });
    };
    render(){
        const { visible, onCancel, onCreate, form, okText, title,cancelText,label } = this.props;
        const { getFieldDecorator } = form;
        const { autoCompleteResult } = this.state;
        const FormItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        const websiteOptions = autoCompleteResult.map(website => (
            <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
        ));
        const config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };
        return (
            <Modal
                visible={visible}
                title={title}
                okText={okText}
                cancelText={cancelText}
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="horizontal">
                    <FormItem label="姓名" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入姓名！' }],
                        })(
                            <Input disabled={true}/>
                        )}
                    </FormItem>
                    <FormItem label="余额" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('balance', {
                            rules: [{ required: true, message: '请输入数字支持小数点！' }],
                        })(
                            <Input disabled={true}/>
                        )}
                    </FormItem>
                    <FormItem label={label}{...FormItemLayout} hasFeedback>
                        {getFieldDecorator('money', {
                            rules: [{ required: true, message: '请输入数字支持小数点两位！' }],
                        })(
                            <InputNumber min={0} max={9999} step={1} />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const TUCForm = Form.create()(TopUpConsumptionFrom);
export default TUCForm;