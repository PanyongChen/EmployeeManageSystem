import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import List from "./List";

class Report extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Derict Reports</h1>
        <Link to={`/detail/${this.props.detail.detail._id}`}>
          <button type="submit" class="btn btn-secondary back-btn">
            Back
          </button>
        </Link>
        <div className="home-container">
          <ul className="list-wrap">
            {this.props.detail.reporters.map(report => {
              return <List data={report} key={report.id} />;
            })}
          </ul>
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

export default connect(mapStateToProps)(Report);
