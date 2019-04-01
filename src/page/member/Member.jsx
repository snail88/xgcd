import React, { Component } from 'react';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import CollectionCreateForm from './CustomizedForm'
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
    Divider,
    Tag
} from 'antd';
import axios from 'axios';
import config from '../../utils/config'
import {Redirect} from "react-router-dom";
import moment from "moment";
const Search = Input.Search;

export default class Member extends Component{
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
            visible:false
        });
        axios({
            method: 'get',
            url: `${config.BASE_URL}/member/list`,
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

    _addmember = () =>{
        this.setState({
            visible: true,

        });
        const form = this.form;
        form.resetFields();
    }

    //取消
    handleCancel = () => {
        this.setState({ visible: false });
    };

    //接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    //创建
    handleCreate = () => {

        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const value = {
                ...values,
                'brith': values['brith'].format('YYYY-MM-DD'),
            };
            console.log('Received values of form: ', value);

            form.resetFields();
            this.setState({
                visible: false,
            });
        });
    };

    render(){
        const { visible} = this.state;
        const columns = [{
            title: '会员编号',
            dataIndex: 'id',
        }, {
            title: '名字',
            dataIndex: 'name',
        }, {
            title: '性别',
            dataIndex: 'sex',
        }, {
            title: '年龄',
            dataIndex: 'age',
        },  {
            title: '手机号',
            dataIndex: 'tel',
        }, {
            title: '生日',
            dataIndex: 'brith',
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        }, {
            title: '余额',
            dataIndex: 'balance',
            render: val => (val>50?
                <span>
                    <Tag color='green'>{val}</Tag>
                </span>
                    :
                <span>
                    <Tag color='volcano'>{val}</Tag>
                </span>

            ),
        }, {
            title: '已加入天数',
            dataIndex: 'howLong',
        }, {
            title: '操作',
            dataIndex: 'opera',
            render: (text, record) => (
                <span>
                <Popconfirm title="确认删除该会员吗？" okText="确认" cancelText="取消">
                    <a href="#">删除</a>
                </Popconfirm>
                <Divider type="vertical" style={{backgroundColor:'#1890ff'}}/>
                <a href="#">编辑</a>
                </span>
            ),
        }];
        return(
            <div style={{height:'80vh'}}>
                <BreadcrumbCustom paths={['首页','会员管理']}/>
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
                        <Button type="primary" icon="plus-circle" size={'large'} onClick={this._addmember}>新增</Button>
                    </Col>
                </Row>

                {this.state.isLoding?<Spin size="large" className="loading" />:
                    <Table columns={columns} dataSource={this.state.data} size="middle" style={{marginTop:"10px"}}/>}

                <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel} onCreate={this.handleCreate} title="新增会员" okText="新建" cancelText="取消"/>
            </div>
        )
    }
}