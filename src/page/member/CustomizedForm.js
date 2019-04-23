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

class CustomizedForm extends Component{
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
        const { visible, onCancel, onCreate, form, okText, title,cancelText } = this.props;
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
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="性别" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('sex', {
                            rules: [{ required: true, message: '请选择性别！' }],
                        })(
                            <Radio.Group style={{marginRight: 20}}>
                                <Radio value='男'>男</Radio>
                                <Radio value='女'>女</Radio>
                            </Radio.Group>
                        )}
                    </FormItem>
                    <Form.Item label="生日" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('brith', {
                            rules: [{ required: true, message: '请选择生日！' }],
                        })(
                            <DatePicker locale={locale} format="YYYY-MM-DD"/>
                        )}
                    </Form.Item>
                    {/*<FormItem label="年龄" {...FormItemLayout} hasFeedback>*/}
                        {/*{getFieldDecorator('age', {*/}
                            {/*rules: [{ required: true, message: '请输入年龄！' }],*/}
                        {/*})(*/}
                            {/*<InputNumber min={0} max={199} step={1} />*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                    {/*<FormItem label="地址" {...FormItemLayout} hasFeedback>*/}
                        {/*{getFieldDecorator('address', {*/}
                            {/*rules: [{ required: true, message: '请选择地址！' }],*/}
                        {/*})(*/}
                            {/*<Cascader options={options}/>*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                    <FormItem label="手机号" {...FormItemLayout} hasFeedback>
                        {getFieldDecorator('tel', {
                            rules: [{
                                pattern: /^1(3|4|5|7|8)\d{9}$/, message: "手机号码格式不正确！"
                            },{
                                required: true, message: '请输入手机号！'
                            }],
                        })(
                            <Input addonBefore={"+86"} style={{ width: '100%' }} />
                        )}
                    </FormItem>
                    {/*<FormItem label="余额" {...FormItemLayout} hasFeedback>*/}
                        {/*{getFieldDecorator('balance', {*/}
                            {/*rules: [{ required: true, message: '请输入数字支持小数点！' }],*/}
                        {/*})(*/}
                            {/*<InputNumber min={0} max={9999} step={1} />*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                    {/*<FormItem label="邮箱" {...FormItemLayout} hasFeedback>*/}
                        {/*{getFieldDecorator('email', {*/}
                            {/*rules: [{*/}
                                {/*type: 'email', message: '邮箱格式不正确！',*/}
                            {/*}, {*/}
                                {/*required: true, message: '请输入邮箱！',*/}
                            {/*}],*/}
                        {/*})(*/}
                            {/*<Input />*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                    {/*<FormItem label="网址" {...FormItemLayout} hasFeedback>*/}
                        {/*{getFieldDecorator('website', {*/}
                            {/*rules: [{required: true, message: '请输入网址！'}],*/}
                        {/*})(*/}
                            {/*<AutoComplete*/}
                                {/*dataSource={websiteOptions}*/}
                                {/*onChange={this.handleWebsiteChange}*/}
                            {/*>*/}
                                {/*<Input/>*/}
                            {/*</AutoComplete>*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                </Form>
            </Modal>
        );
    }
}

const CollectionCreateForm = Form.create()(CustomizedForm);
export default CollectionCreateForm;