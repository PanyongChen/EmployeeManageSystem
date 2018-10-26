import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Loading from "../Loading";
import EmployeeDetail from "./EmployeeDetail.js";
import * as actions from "../../actions";

class Detail extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(
      actions.getEmployeeDetail(this.props.match.params.employeeId)
    );
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.match.params.employeeId !== this.props.match.params.employeeId
    ) {
      this.props.dispatch(
        actions.getEmployeeDetail(nextProps.match.params.employeeId)
      );
    }
  }

  render() {
    return (
      <div>
        <h1>Employee Detail</h1>
        <div className="detail-container">
          {this.props.detail.isLoading ? (
            <Loading />
          ) : (
            <EmployeeDetail url={this.props.match.url} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    detail: state.detail
  };
};

export default connect(mapStateToProps)(Detail);
