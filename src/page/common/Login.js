import React, { Component } from 'react';
import '../../style/login.less';
import axios from 'axios';
import { Form, Icon, Input, Button, Checkbox, message, Spin } from 'antd';
import config from '../../utils/config'
import {Redirect} from "react-router-dom";
const FormItem = Form.Item;

const login = [{
    username:'admin',
    password:'admin'
},{
    username:'zysoft',
    password:'zysoft'
}];

function PatchUser(values) {  //匹配用户
    const results = login.map(function(item){
        if(values.username === item.username && values.password === item.password){
            return 1;
        }else{
            return 0;
        }
    });
    return results.includes(1);
};

class NormalLoginForm extends Component {

    constructor(props){
        super(props);    //这句也很重要,这样才能在里面继承this
        this.state = {
            isLoding:false,
            data:{}
        };
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('eeeeee===>',e)
        console.log('props===>',this.props)
        this.props.form.validateFields((err, values) => {
            // axios.get(`${config.BASE_URL}/member/list`)
            //     .then(function (response) {
            //         console.log(response);
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });
            if (!err) {
                let that = this;
                this.setState({
                    isLoding: true,
                });
                axios({
                    method: 'post',
                    url: `${config.BASE_URL}/user/login`,
                    headers: {'Content-Type': 'application/json'},
                    data: {
                        userName: values.username,
                        password: values.password
                    }
                })
                    .then(function (response) {
                        console.log(response);
                        if (response.data.code === '-100') {
                            localStorage.setItem('mspa_user', JSON.stringify(values));
                            localStorage.setItem('token', response.data.data.token);
                            localStorage.setItem('user', JSON.stringify(response.data.data));

                            message.success('登录成功!'); //成功信息
                            // let that = this;
                            that.props.history.push({pathname: '/app', state: values});
                        } else {
                            that.setState({
                                isLoding: false,
                            });
                            message.error('账号密码错误!'); //失败信息
                            return <Redirect to="/login"/>
                        }

                    })
                .catch(function (error) {
                    console.log(error)
                    message.error('网络异常!');
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            this.state.isLoding?<Spin size="large" className="loading" />:
            <div className="login">
                <div className="login-form">
                    <div className="login-logo">
                        <div className="login-name">秀阁潮店后台管理系统</div>
                    </div>
                    <Form onSubmit={this.handleSubmit} style={{maxWidth: '300px'}}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                            )}
                        </FormItem>
                        <FormItem style={{marginBottom:'0'}}>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: false,
                            })(
                                <Checkbox>记住我</Checkbox>
                            )}
                            {/*<a className="login-form-forgot" href="" style={{float:'right'}}>忘记密码?</a>*/}
                            <Button type="primary" htmlType="submit" className="login-form-button" style={{width: '100%'}}>
                                登录
                            </Button>
                            {/*Or <a href="">现在就去注册!</a>*/}
                        </FormItem>
                    </Form>
                    {/*<a className="githubUrl" href="https://github.com/zhaoyu69/antd-spa"> </a>*/}
                </div>
            </div>
        );
    }
}

const Login = Form.create()(NormalLoginForm);
export default Login;