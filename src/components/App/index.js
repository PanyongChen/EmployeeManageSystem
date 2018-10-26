import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";

import Home from "../Home";
import Detail from "../Detail";
import Create from "../Create";
import Report from "../Report";
import Edit from "../Edit";
import * as actions from "../../actions";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="wrapper">
          <Route path="/" exact={true} component={Home} />
          <Route path="/detail/:employeeId" component={Detail} />
          <Route path="/create" component={Create} />
          <Route path="/report" component={Report} />
          <Route path="/edit" component={Edit} />
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return {
    employee: state.employee
  };
};

export default connect(mapStateToProps)(App);
