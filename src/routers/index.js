import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../page/common/history';

import App from '../page/common/App';
import Login from '../page/common/Login';
import Home from '../page/common/Home';
import NoMatch from '../page/common/404';

class MRoute extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/app" component={App}/>
          <Route path="/login" component={Login}/>
          <Route component={NoMatch}/>
        </Switch>
      </Router>
    );
  }
}

export default MRoute;