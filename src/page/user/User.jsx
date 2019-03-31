import React, { Component } from 'react';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import {
    Table,
    Row,
    Col,
    Input,
    Icon,
    Cascader,
    DatePicker,
    Button,
    Tooltip,
    Popconfirm,
    message,
    Spin,
    Divider
} from 'antd';
import axios from 'axios';
import config from '../../utils/config'
import {Redirect} from "react-router-dom";
const Search = Input.Search;

export default class User extends Component{
    constructor(props){
        super(props);
        this.state={
            data:[],
            isLoding:false
        }
    }

    componentDidMount() {
        this._getUserList()
    }

    _getUserList = () =>{
        console.log(localStorage.getItem("token"))
        let that = this;
        that.setState({
            isLoding: true,
        });
        axios({
            method: 'get',
            url: `${config.BASE_URL}/user/list`,
            headers: {'Authorization': localStorage.getItem("token")},
        })
            .then(function (response) {
                // console.log(response);

                if (response.data.code === '-100') {
                    that.setState({
                        data:response.data.data,
                        isLoding: false,
                    })

                } else {
                    that.setState({
                        isLoding: false,
                    });
                    message.error('获取数据失败!'); //失败信息
                    // return <Redirect to="/login"/>
                }

            })
            .catch(function (error) {
                console.log(error)
                message.error('网络异常!');
            });
    }

    render(){

        const columns = [{
            title: '名字',
            dataIndex: 'name',
        },  {
            title: '手机号',
            dataIndex: 'phone',
        }, {
            title: '岗位',
            dataIndex: 'job',
        }, {
            title: '账号',
            dataIndex: 'userName',
        }, {
            title: '邮箱',
            dataIndex: 'email',
        }, {
            title: '微信号',
            dataIndex: 'address',
        }, {
            title: '操作',
            dataIndex: 'address',
            render: (text, record) => (
                <span>
                <Popconfirm title="确认删除吗？" okText="确认" cancelText="取消">
                    <a href="#">删除</a>
                </Popconfirm>
                <Divider type="vertical" style={{backgroundColor:'#1890ff'}}/>
                <a href="#">编辑</a>
                </span>
            ),
        }];
        const data = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        }];



        return(
            <div style={{height:'80vh'}}>
                <BreadcrumbCustom paths={['首页','用户']}/>
                <Row span={16}>
                    {/*<Col span={1} style={{textAlign: "center",fontSize:'16px'}}>*/}
                        {/*姓名:*/}
                    {/*</Col>*/}
                    <Col span={7}>
                        <Input
                            placeholder="姓名"
                            // onSearch={value => console.log(value)}
                            size="large"
                        />
                    </Col>
                    <Col span={2}  style={{textAlign: "center",fontSize:'16px'}}>
                        {/*电话:*/}
                    </Col>
                    <Col span={7}>
                        <Input
                            placeholder="手机号"
                            // onSearch={value => console.log(value)}
                            size="large"
                        />
                    </Col>
                    <Col span={2} ></Col>
                    <Col span={2}>
                        <Button type="primary" icon="search" size={'large'}>查找</Button>
                    </Col>
                    {/*<Col span={1} ></Col>*/}
                    <Col span={2} >
                        <Button type="primary" icon="reload" size={'large'}>重置</Button>
                    </Col>
                    {/*<Col span={1} ></Col>*/}
                    <Col span={2} >
                        <Button type="primary" icon="plus-circle" size={'large'}>新增</Button>
                    </Col>
                </Row>

                {this.state.isLoding?<Spin size="large" className="loading" />:
                <Table columns={columns} dataSource={this.state.data} size="middle" style={{marginTop:"10px"}}/>}
            </div>
        )
    }
}