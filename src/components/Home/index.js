import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";

import * as actions from "../../actions";

import List from "./List.js";
import Loading from "../Loading";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      authenticated: false
    };
  }

  componentDidMount() {
    this.props.dispatch(actions.getEmployees());
    this.props.dispatch(actions.toggle(false));
  }

  handleInput = e => {
    this.setState({ input: e.target.value, autenticated: true });
};

  render() {
    return (
      <div>
        <br />
        <h2 className="title">Employment Management System</h2>
        <br />
          <div id="block_container">
          <div id="block1">Search :{" "}
                <input
                    type="text"
                    value={this.state.input}
                    onChange={this.handleInput}
                />
            </div>
            &nbsp; &nbsp; &nbsp; 
            <div id="block2">
        <Link to="/create">
          <button type="button" className="btn btn-light">
            Create New Profile
          </button>
        </Link>
        </div>
        </div>
        <div className="home-container">
         <div className="titleBar">
           <button className="bname">Name</button>
           <button className="bage">Age</button>
           <button className="btitle">Title</button>
           <button className="bphone">Phone</button>
           <button className="bemail">email</button>
           <button className="breport"># of Direct Reportors</button>
        </div>
          {this.props.employee.isLoading ? (
            <Loading />
          ) : (
            <ul className="list-wrap">
              {this.props.employee.employee.map((employee, index) => {
                return <List key={index} data={employee} />;
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    employee: state.employee
  };
};

export default connect(mapStateToProps)(Home);
