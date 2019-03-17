import React, { Component } from 'react';
import Button from 'antd/lib/button';
import './App.css';
import Login from './page/Login/Login'
class App extends Component {
    render() {
        return (
            <div className="App">
                <h1 style={{marginBottom:'1em'}}>秀阁潮店后台管理系统</h1>
                <Login/>
            </div>
        );
    }
}

export default App;