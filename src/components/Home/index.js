import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import * as actions from "../../actions";

import List from "./List.js";
import Loading from "../Loading";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {

      input: "",
      authenticated: false,
      aryEmployee: this.props.employee.employee,
      sortBy: "updateDate",
      sortDir: "DESC"
    };
   
  }

  componentDidMount() {
    console.log("componentDidMount in home")
    this.props.dispatch(actions.getEmployees());
   
  } 
  

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps in home")
    if (this.props.employee !== nextProps.employee) { 
      this.setState({
        aryEmployee: this.sortEmployees(nextProps.employee.employee, "updateDate", "DESC"),
      });
     
    }
  }
  handleInput = e => { 
    const input = e.target.value;
    const aryEmployee = this.filterEmployees(this.props.employee.employee, input);
    this.setState({ input, autenticated: true, aryEmployee });
  };
  handleSortbyName = () =>{ 
    console.log("ere is handlesortbyname")
    this.handleSort('firstName');
  }
  handleSortbyGender = () =>{
    this.handleSort('gender');
  }
  handleSortbyAge = () =>{
    this.handleSort('age');
  }
  handleSortbyTitle = () =>{
    this.handleSort('title');
  }
  handleSortbyPhone = () =>{
    this.handleSort('officePhone');
  }
  handleSortbyEmail = () =>{
    this.handleSort('email');
  }
  handleSortbyManager = () =>{
    this.handleSort('manager');
  }
  handleSortbyReportors = () =>{
    this.handleSort('reports');
  }
  handleSort(sortBy) {
    // var sortBy = sortBy;
    var sortDir = "ASC";

    if (this.state.sortBy === sortBy ){
      if (this.state.sortDir === "ASC"){
        sortDir = "DESC";
      }else{
        sortDir = "ASC";
      }
    }

    this.setState({
      sortBy: sortBy,
      sortDir: sortDir
    }) 

    const aryEmployee = this.sortEmployees(this.state.aryEmployee,sortBy,sortDir);
    this.setState({ autenticated: true, aryEmployee });
  }

  refresh = () => {

    return this.props.employee;
  };
  viewAll = () => {
    this.setState({aryEmployee: this.props.employee.employee});
  };
  filterEmployees = (aryEmployee, keyword) => {
    let filteredAry;
    if (keyword) {
      const lowKeyword = keyword.toLowerCase();
      filteredAry = aryEmployee.filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`;

        return (fullName.toLowerCase().includes(lowKeyword) ||
                employee.gender.toLowerCase().includes(lowKeyword) ||
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
  showManager = (detail_id) =>{
    console.log(detail_id);
    var allemployees = this.props.employee.employee
    if (detail_id){
      var clicked_employee = allemployees.filter(employee => {
        return (employee._id === detail_id)
      });
      if (clicked_employee) {
        this.setState({aryEmployee: clicked_employee});
      }
    }
  }
  showReports = (detail_id) => {

    var allemployees = this.props.employee.employee
    if (detail_id){
      var clicked_employee = allemployees.filter(employee => {
        return (employee._id === detail_id)
      })[0];

      if (clicked_employee) {
        var reports = clicked_employee.directReports
        var aryEmployee = [];
        allemployees.forEach(function(employee){
          reports.forEach(function(report){
            if (employee._id === report){
              aryEmployee.push(employee)
            } 
          })
        })
        if (aryEmployee.length>0){
          this.setState({aryEmployee: aryEmployee});
        }
      }
    }
  }
  sortEmployees = (aryEmployee,sortBy,sortDir) => {
    var rows = aryEmployee;
    rows.forEach(function (row){
      if (row.directReports.length){
        row.reports = row.directReports.length
      } else {
        row.reports = 0;
      }
    })

    rows.sort((a, b) => {
      var sortVal = 0;
      if (a[sortBy] > b[sortBy]) {
        sortVal = 1;
      }
      if (a[sortBy] < b[sortBy]) {
        sortVal = -1;
      }
   
      if (sortDir === 'DESC') {
        sortVal = sortVal * -1; 
      }
      return sortVal;
    });
    return rows
  }
  render() {
    
    let arrow = this.state.sortDir === "ASC"?<span className="glyphicon glyphicon-arrow-down"></span>:<span className="glyphicon glyphicon-arrow-up"></span>
    let sort = <span></span>
    return (
      <div>
        <br />
        <h2 className="title">
        <a href="http://localhost:3000/">
        Employment Management System
        </a>
        </h2>
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
          &nbsp; &nbsp;
        </Link>
        {this.props.employee.isLoading?null:<button type="button" className="btn btn-light" onClick={this.viewAll}>View All</button>}
        </div>
        </div>
        <div className="home-container">
         <div className="titleBar">
           <button className="bname" onClick={this.handleSortbyName}>Name{this.state.sortBy==="firstName"?arrow:sort}</button>
           <button className="bage" onClick={this.handleSortbyGender}>Gender{this.state.sortBy==="gender"?arrow:sort}</button>
           <button className="bage" onClick={this.handleSortbyAge}>Age{this.state.sortBy==="age"?arrow:sort}</button>
           <button className="btitle" onClick={this.handleSortbyTitle}>Title{this.state.sortBy==="title"?arrow:sort}</button>
           <button className="bphone" onClick={this.handleSortbyPhone}>Phone{this.state.sortBy==="officePhone"?arrow:sort}</button>
           <button className="bemail" onClick={this.handleSortbyEmail}>email{this.state.sortBy==="email"?arrow:sort}</button>
           <button className="bmanager" onClick={this.handleSortbyManager}>Manager{this.state.sortBy==="manager"?arrow:sort}</button>
           <button className="breport" onClick={this.handleSortbyReportors}># of Reportors{this.state.sortBy==="reports"?arrow:sort}</button>
           <button className="bdetail">Edit</button> 
           <button className="bactions">Delete</button>
           
        </div>
          {this.props.employee.isLoading ? ( 
            <Loading />
          ) : (
            this.props.employee.error!=="" ?
            <ul className="list-wrap">
            
              {this.state.aryEmployee.map((employee, index) => {
                return <List key={index} data={employee} click_reportsfn={this.showReports} click_managerfn={this.showManager}/>;
              })}
            </ul>:<div>{this.props.employee.error}</div>
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    employee: state.employee,
  };
};

export default connect(mapStateToProps)(Home);
