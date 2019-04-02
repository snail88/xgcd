import React, {Component} from 'react';
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

export default class Member extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoding: false,
            isUpdate:false,
            visible: false,
            id:''
        }
    }

    componentDidMount() {
        this._getUserList()
    }

    _getUserList = () => {
        console.log(localStorage.getItem("token"))
        let that = this;
        that.setState({
            isLoding: true,
            visible: false,
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
                        data: response.data.data,
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

    //点击新增按钮
    _addmember = () => {
        this.setState({
            visible: true,
            isUpdate:false,
        });
        const form = this.form;
        form.resetFields();
    }

    //删除单个会员
    _delConfirm = (id) => {
        let that = this;
        axios({
            method: 'get',
            url: `${config.BASE_URL}/member/del?id=${id}`,
            headers: {'Authorization': localStorage.getItem("token")},
        })
            .then(function (response) {
                if (response.data.code === '-100') {
                    that._getUserList();
                    message.error('删除会员成功!');
                } else {
                    message.error('删除会员失败!'); //失败信息
                }
            })
            .catch(function (error) {
                console.log(error)
                message.error('网络异常!');
            });
    }

    //编辑
    _edit = (data) => {
        // message.error(data.id);
        this.setState({
            visible: true,
            isUpdate:true,
            id:data.id
        });
        const form = this.form;
        form.setFieldsValue({
            id: data.id,
            name: data.name,
            sex: data.sex,
            // age: moment(moment()).diff(moment(data.brith), 'years') + 1,
            brith: moment(data.brith),
            balance: data.balance,
            tel: data.tel,
            // email: dataSource[index].email,
            // website: dataSource[index].website,
        });
        // this.setState({
        //     visible: true,
        // });
    }

    //保存
    _save = () =>{
        let that = this;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const value = {
                ...values,
                'brith': values['brith'].format('YYYY-MM-DD'),
                'id':that.state.id
            };
            // console.log('Received values of form: ', value);
            axios({
                method: 'post',
                url: `${config.BASE_URL}/member/update`,
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token")},
                data: value
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.code === '-100') {
                        that._getUserList();
                        message.success('会员修改成功!'); //成功信息
                    } else {
                        message.error('会员修改失败!'); //失败信息
                    }

                })
                .catch(function (error) {
                    console.log(error)
                    message.error('网络异常!');
                });

            form.resetFields();
            this.setState({
                visible: false,
            });
        });
    }

    //取消
    handleCancel = () => {
        this.setState({visible: false});
    };

    //接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };

    //创建
    handleCreate = () => {
        let that = this;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const value = {
                ...values,
                'brith': values['brith'].format('YYYY-MM-DD'),
            };
            // console.log('Received values of form: ', value);
            axios({
                method: 'post',
                url: `${config.BASE_URL}/member/add`,
                headers: {'Content-Type': 'application/json', 'Authorization': localStorage.getItem("token")},
                data: value
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.code === '-100') {
                        that._getUserList();
                        message.success('会员新增成功!'); //成功信息
                    } else {
                        message.error('会员新增失败!'); //失败信息
                    }

                })
                .catch(function (error) {
                    console.log(error)
                    message.error('网络异常!');
                });

            form.resetFields();
            this.setState({
                visible: false,
            });
        });
    };

    render() {
        const {visible,isUpdate} = this.state;
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
            render: (text, record) => {
                return moment(moment()).diff(moment(record.brith), 'years') + 1
            }

        }, {
            title: '手机号',
            dataIndex: 'tel',
        }, {
            title: '生日',
            dataIndex: 'brith',
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        }, {
            title: '余额',
            dataIndex: 'balance',
            render: val => (val > 100 ?
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
            dataIndex: 'days',
            render: (text, record) => {
                return moment(moment()).diff(record.createDate, 'days')
            }
        }, {
            title: '操作',
            dataIndex: 'opera',
            render: (text, record) => {
                // console.log('record===>',record)
                return (
                    <span>
                        <Popconfirm title={`确认删除 <${record.name}> 吗?`} okText="确认" cancelText="取消"
                                    onConfirm={() => this._delConfirm(record.id)}>
                            <a href="#">删除</a>
                        </Popconfirm>
                        <Divider type="vertical" style={{backgroundColor: '#1890ff'}}/>
                        <a href="#" onClick={() => this._edit(record)}>编辑</a>
                        {/*<span onClick={()=>this._edit(record)}>*/}
                        {/*<Icon type="edit" /> 修改*/}
                        {/*</span>*/}
                        <Divider type="vertical" style={{backgroundColor: '#1890ff'}}/>
                        <a href="#">充值</a>
                        <Divider type="vertical" style={{backgroundColor: '#1890ff'}}/>
                        <a href="#">扣费</a>
                        <Divider type="vertical" style={{backgroundColor: '#1890ff'}}/>
                        <a href="#">消费记录</a>
                    </span>
                )
            },
        }];
        return (
            <div style={{height: '80vh'}}>
                <BreadcrumbCustom paths={['首页', '会员管理']}/>
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
                    <Col span={2} style={{textAlign: "center", fontSize: '16px'}}>
                        {/*电话:*/}
                    </Col>
                    <Col span={7}>
                        <Input
                            placeholder="手机号"
                            // onSearch={value => console.log(value)}
                            size="large"
                        />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={2}>
                        <Button type="primary" icon="search" size={'large'}>查找</Button>
                    </Col>
                    {/*<Col span={1} ></Col>*/}
                    <Col span={2}>
                        <Button type="primary" icon="reload" size={'large'}>重置</Button>
                    </Col>
                    {/*<Col span={1} ></Col>*/}
                    <Col span={2}>
                        <Button type="primary" icon="plus-circle" size={'large'} onClick={this._addmember}>新增</Button>
                    </Col>
                </Row>

                {this.state.isLoding ? <Spin size="large" className="loading"/> :
                    <Table columns={columns} dataSource={this.state.data} size="middle" style={{marginTop: "10px"}}/>}
                {isUpdate ?
                    <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                          onCreate={()=>this._save()} title="修改会员" okText="保存" cancelText="取消"/>
                    :
                    <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                                          onCreate={this.handleCreate} title="新增会员" okText="新建" cancelText="取消"/>
                }
            </div>
        )
    }
}