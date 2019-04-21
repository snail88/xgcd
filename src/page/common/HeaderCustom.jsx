import React, { Component } from 'react';
import {Layout, Icon, Menu, Badge, message} from 'antd';
import {Link, Redirect} from 'react-router-dom';
import history from './history';
import axios from "axios";
import config from "../../utils/config";

const { Header } = Layout;
const SubMenu = Menu.SubMenu;

export default class HeaderCustom extends Component{
    constructor(props){
        super(props);
        this.state = {
            collapsed: props.collapsed,
        }
        this.logout = this.logout.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        this.onCollapse(nextProps.collapsed);
    }
    onCollapse = (collapsed) => {
        this.setState({
            collapsed,
        });
    };
    logout(){
        let user = JSON.parse(localStorage.getItem("user"))
        console.log('user===>>>>',user)
        axios({
            method: 'delete',
            url: `${config.BASE_URL}/user/logout`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
            // data: {
            //     id: user.id,
            // }
        })
            .then(function (response) {
                console.log(response);
                if (response.data.code === '-100') {
                    localStorage.removeItem("mspa_user");
                    history.push('/login');
                    message.success('退出登录成功!')
                } else {
                    message.error('系统错误!请联系管理员!'); //失败信息
                }

            })
            .catch(function (error) {
                console.log(error)
                message.error('网络异常!');
            });

    }
    render(){
        return(
            <Header style={{ background: '#fff', padding: 0 }} className="header">
                <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.props.toggle}
                />
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                >
                    <Menu.Item key="schedule">
                        <Link to="/app/header/Calendars">
                            <Badge count={3} overflowCount={99} style={{height:'15px',lineHeight:'15px'}}>
                                <Icon type="schedule" style={{fontSize:16, color: '#1DA57A' }}/>
                            </Badge>
                        </Link>
                    </Menu.Item>
                    <SubMenu 
                        title={<span>
                            <Icon type="user" style={{fontSize:16, color: '#1DA57A' }}/>{this.props.username}
                        </span>}
                        >
                        <Menu.Item key="logout" style={{textAlign:'center'}} className="logout">
                            <span onClick={this.logout}>退出登录</span>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Header>
        )
    }
} 