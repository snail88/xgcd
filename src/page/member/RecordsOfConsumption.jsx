import React, { Component } from 'react';
import BreadcrumbCustom from '../common/BreadcrumbCustom';
import CollectionCreateForm from './CustomizedForm'
import TUCForm from './TopUpConsumptionFrom'
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
    Tag,
    notification
} from 'antd';
import axios from 'axios';
import config from '../../utils/config'
import { Redirect } from "react-router-dom";
import moment from "moment";

const Search = Input.Search;

export default class RecordsOfConsumption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoding: false,
            isUpdate: false,
            visible: false,
            id: '',
            isConsumption: false,
            TUCvisible: false,
            userName: '',
            tel: ''
        }
    }

    componentDidMount() {
        this._getConsumptionRecordList()
    }

    _getConsumptionRecordList = (data) => {
        console.log(localStorage.getItem("token"))
        let that = this;
        that.setState({
            isLoding: true,
            visible: false,
        });
        axios({
            method: 'post',
            url: `${config.BASE_URL}/consumeRecord/list`,
            headers: { 'Authorization': localStorage.getItem("token") },
            data: data
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

    _topUp = (data) => {
        this.setState({
            isConsumption: false,
            TUCvisible: true,
            id: data.id
        });
        const form = this.form1;
        form.setFieldsValue({
            // id: data.id,
            name: data.name,
            // sex: data.sex,
            // age: moment(moment()).diff(moment(data.brith), 'years') + 1,
            // brith: moment(data.brith),
            balance: data.balance,
            // tel: data.tel,
            // email: dataSource[index].email,
            // website: dataSource[index].website,
        });
    }

    _consume = (data) => {
        this.setState({
            isConsumption: true,
            TUCvisible: true,
            id: data.id
        });
        const form = this.form1;
        form.setFieldsValue({
            name: data.name,
            balance: data.balance,
        });
    }

    _saveConsume = () => {
        let that = this;
        const form = this.form1;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            axios({
                method: 'post',
                url: `${config.BASE_URL}/member/consume`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem("token") },
                params: {
                    ...values,
                    'id': that.state.id
                },
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.code === '-100') {
                        that._getConsumptionRecordList();
                        // message.success(response.data.message); //成功信息
                        that.openNotification('success', '会员<<  ' + response.data.data.name + '  >>消费成功!', response.data.message)
                    } else {
                        // message.error(response.data.message); //失败信息
                        that.openNotification('error', '消费失败!', response.data.message)
                    }

                })
                .catch(function (error) {
                    console.log(error)
                    message.error('网络异常!');
                });

            form.resetFields();
            this.setState({
                TUCvisible: false,
            });
        });
    }

    _saveTopUp = () => {
        let that = this;
        const form = this.form1;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const value = {
                ...values,
                'id': that.state.id
            };
            // console.log('Received values of form: ', value);
            axios({
                method: 'post',
                url: `${config.BASE_URL}/member/charge`,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.getItem("token") },
                params: {
                    ...values,
                    'id': that.state.id
                },
            })
                .then(function (response) {
                    console.log(response);
                    if (response.data.code === '-100') {
                        that._getConsumptionRecordList();
                        that.openNotification('success', '会员<<  ' + response.data.data.name + '  >>充值成功!', response.data.message)
                        // message.success(response.data.message); //成功信息
                    } else {
                        // message.error(response.data.message); //失败信息
                        that.openNotification('error', '充值失败!', response.data.message)
                    }

                })
                .catch(function (error) {
                    console.log(error)
                    message.error('网络异常!');
                });

            form.resetFields();
            this.setState({
                TUCvisible: false,
            });
        });
    }

    _cencelTUC = () => {
        this.setState({
            TUCvisible: false,
        });
    }

    openNotification = (type, message, description) => {
        // notification.open({
        //     message: message,
        //     description: description,
        //     // onClick: () => {
        //     //     console.log('Notification Clicked!');
        //     // },
        // });
        notification[type]({
            message: message,
            description: description,
            duration: null
        });
    };

    _search = () => {
        // let userName = this.refs.userNameInput.state.value
        // let tel = this.refs.telInput.state.value
        let data = {
            name: this.state.userName,
            tel: this.state.tel
        }
        this._getConsumptionRecordList(data)
        // console.log(this.state.userName)
        // console.log(this.state.tel)
    }

    render() {
        const { visible, isUpdate, TUCvisible, isConsumption } = this.state;
        const columns = [{
            title: '会员编号',
            dataIndex: 'id',
        }, {
            title: '会员名字',
            dataIndex: 'memberName',
        }, {
            title: '消费类型',
            dataIndex: 'type',
            render: val => (val == 1 ?
                <span>
                    <Tag color='red'>消费</Tag>
                </span>
                :
                <span>
                    <Tag color='green'>充值</Tag>
                </span>

            ),
        }, {
            title: '消费金额',
            dataIndex: 'money',
        }, {
            title: '消费时间',
            dataIndex: 'operatorDate',
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },{
            title: '操作者',
            dataIndex: 'operatorName',
        }, {
            title: '是否成功',
            dataIndex: 'isSuccess',
            render: val => (val == 1 ?
                <span>
                    <Tag color='green'>成功</Tag>
                </span>
                :
                <span>
                    <Tag color='red'>失败</Tag>
                </span>

            ),
           
        }, {
            title: '备注',
            dataIndex: 'remark',
        }];
        return (
            <div style={{ height: '80vh' }}>
                <BreadcrumbCustom paths={['首页', '会员消费记录']} />
                <Row span={16}>
                    {/*<Col span={1} style={{textAlign: "center",fontSize:'16px'}}>*/}
                    {/*姓名:*/}
                    {/*</Col>*/}
                    <Col span={7}>
                        <Input
                            placeholder="姓名"
                            // ref='userNameInput'
                            value={this.state.userName}
                            onChange={event => {
                                this.setState({
                                    userName: event.target.value
                                })
                            }}
                            size="large"
                        />
                    </Col>
                    <Col span={2} style={{ textAlign: "center", fontSize: '16px' }}>
                        {/*电话:*/}
                    </Col>
                    <Col span={7}>
                        <Input
                            placeholder="手机号"
                            // ref='telInput'
                            value={this.state.tel}
                            onChange={event => {
                                const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
                                if ((!Number.isNaN(event.target.value) && reg.test(event.target.value)) || event.target.value === '' || event.target.value === '-') {
                                    this.setState({
                                        tel: event.target.value
                                    })
                                }

                            }}
                            size="large"
                        />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={2}>
                        <Button type="primary" icon="search" size={'large'} onClick={() => {
                            this._search()
                        }}>查找</Button>
                    </Col>
                    {/*<Col span={1} ></Col>*/}
                    <Col span={2}>
                        <Button type="primary" icon="reload" size={'large'} onClick={() => {
                            this.setState({
                                userName: '',
                                tel: ''
                            })
                            this._getConsumptionRecordList()
                        }}>重置</Button>
                    </Col>
                    {/*<Col span={1} ></Col>*/}
                    {/* <Col span={2}>
                        <Button type="primary" icon="plus-circle" size={'large'} onClick={this._addmember}>新增</Button>
                    </Col> */}
                </Row>

                {this.state.isLoding ? <Spin size="large" className="loading" /> :
                    <Table columns={columns} dataSource={this.state.data} size="middle" style={{ marginTop: "10px" }} />}
                {isUpdate ?
                    <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                        onCreate={() => this._save()} title="修改会员" okText="保存" cancelText="取消" />
                    :
                    <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel}
                        onCreate={this.handleCreate} title="新增会员" okText="新建" cancelText="取消" />
                }
                {isConsumption ?
                    <TUCForm ref={this.saveFormRef1} visible={TUCvisible} onCancel={this._cencelTUC}
                        onCreate={() => this._saveConsume()} label="消费" title="消费" okText="确定" cancelText="取消" />
                    :
                    <TUCForm ref={this.saveFormRef1} visible={TUCvisible} onCancel={this._cencelTUC}
                        onCreate={() => this._saveTopUp()} label="充值" title="充值" okText="确定" cancelText="取消" />

                }
            </div>
        )
    }
}