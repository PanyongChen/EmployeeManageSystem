import React, { Component }  from "react";
import image from "../data/image.js";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../actions";

class List extends Component {
  
  constructor(props) {
    super(props);
    this.state = {edit:false};
    this.clickReports = this.clickReports.bind(this);
    this.clickManager = this.clickManager.bind(this);
  }

  deleteHandler = () => {
    this.props.dispatch(actions.deleteEmployee(this.props.data._id));
  }

  clickReports(){
    if (this.props.click_reportsfn){
      this.props.click_reportsfn(this.props.data._id);
    }
  }
  clickManager(){
    if (this.props.click_managerfn){
      console.log(this.props.data.manager);
      if (this.props.data && this.props.data.manager) {
        this.props.click_managerfn(this.props.data.manager);
      }
    }
  }
  render() {
    let manager = this.props.employee.employee.filter(manager=>manager._id===this.props.data.manager)[0];
    return (
      <li className="list">
        {!this.props.data.avatar ? (
          <img src={image} className="li-avatar" />
        ) : (
          <img src={this.props.data.avatar} className="li-avatar" />
        )}
        <div className="li-mid">
            <div className="li-name">
              {this.props.data.firstName} {this.props.data.lastName}
            </div>
        </div>
        <div className="li-gender-wrap">
          <div className="li-gender">{this.props.data.gender}</div>
        </div>
        <div className="li-age-wrap">
          <div className="li-age">{this.props.data.age}</div>
        </div>
        <div className="li-title-wrap">
          <div className="li-title">{this.props.data.title}</div>
        </div>
        <div className="li-phone-wrap">
          <div className="li-phone">{this.props.data.cellPhone}</div>
          <a href={`tel:${this.props.data.cellPhone}`}>
              <i className="fas fa-phone-volume"></i>
          </a>
        </div>
        <div className="li-email-wrap">
          <div className="li-email">{this.props.data.email} </div>
          <a href={`mailto:${this.props.data.email}`}>
            <i className="fas fa-envelope-open"></i>
          </a>
        </div>

        <div className="li-manager-wrap">
          <div className="li-manager">
            <a onClick={this.clickManager}>
              <h4>
                { manager
                  &&manager.firstName}
              </h4>
            </a>
        </div> 
        </div> 

        <div className="li-reports-wrap">
        <div className="li-reports">
          <button type="button" className="btn" onClick={this.clickReports}>{this.props.data.directReports.length}</button>
        </div>
      </div>
      <div className="li-actions">
        <Link to={`/edit/${this.props.data._id}`}><button type="button" className="btn btn-primary">Edit</button></Link>
        </div>
        <div className="li-actions2">
        <button type="button" className="btn btn-danger" onClick={this.deleteHandler}>Delete</button>
        
        
      </div>
    </li>
    );
  }
}
const mapStateToProps = state => {
  return {
    employee: state.employee,
  };
};

export default connect(mapStateToProps)(List);

