import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";

import * as actions from "../../actions";

import List from "./List.js";
import Loading from "../Loading";
import employee from "../../reducers/employee";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      authenticated: false,
      aryEmployee: this.props.employee.employee,
    };
  }

  componentDidMount() {
    this.props.dispatch(actions.getEmployees());
    this.props.dispatch(actions.toggle(false));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.employee.employee.length === 0 &&
      nextProps.employee.employee.length > 0) {
      this.setState({ aryEmployee: this.filterEmployees(nextProps.employee.employee, this.state.input) });
    }
  }

  handleInput = e => {
    const input = e.target.value;
    const aryEmployee = this.filterEmployees(this.props.employee.employee, input);

    this.setState({ input, autenticated: true, aryEmployee });
  };

  filterEmployees = (aryEmployee, keyword) => {
    let filteredAry;
    if (keyword) {
      const lowKeyword = keyword.toLowerCase();
      filteredAry = aryEmployee.filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`;

        return (fullName.toLowerCase().includes(lowKeyword) ||
                employee.age.toString().includes(lowKeyword) ||
                employee.title.toLowerCase().includes(lowKeyword) ||
                employee.cellPhone.toString().includes(lowKeyword) ||
                employee.email.toLowerCase().includes(lowKeyword) ||
                employee.directReports.length.toString().includes(lowKeyword)
        );
      })
    } else {
      filteredAry = aryEmployee;
    }
    return filteredAry;
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
              {this.state.aryEmployee.map((employee, index) => {
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
