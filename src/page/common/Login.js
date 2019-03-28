import React, { Component } from 'react';
import '../../style/login.less';
import axios from 'axios';
import { Form, Icon, Input, Button, Checkbox, message, Spin } from 'antd';
import config from '../../utils/config'
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
    state = {
        isLoding:false,
        data:{}
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            axios.get('http://149.129.117.122:8088/xg/member/list')
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
            // axios({
            //     method: 'post',
            //     url: `${config.BASE_URL}/user/login`,
            //     headers:{'Content-Type': 'application/json'},
            //     data:{
            //         userName: values.username,
            //         password: values.password
            //     }
            // })
            //     .then(function (response) {
            //         console.log(response);
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });
            if (!err) {
                console.log('Received values of form: ', values);
                if(PatchUser(values)){
                    this.setState({
                        isLoding: true,
                    });

                    localStorage.setItem('mspa_user',JSON.stringify(values));
                    message.success('登录成功!'); //成功信息
                    let that = this;
                    setTimeout(function() { //延迟进入
                        that.props.history.push({pathname:'/app',state:values});
                    }, 2000);

                }else{
                    message.error('账号密码错误!'); //失败信息
                }
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
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="用户名 (admin)" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码 (admin)" />
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