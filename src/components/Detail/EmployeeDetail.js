import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import image from "../data/image.js";
import { connect } from "react-redux";

import * as actions from "../../actions";

class EmployeeDetail extends Component {
  constructor(props) {
    super(props);
  }

  deleteHandler = () => {
    this.props.dispatch(actions.deleteEmployee(this.props.detail.detail._id));
    this.props.dispatch(actions.toggle(true));
  };

  render() {
    return this.props.redirect ? (
      <Redirect to={{ pathname: "/" }} />
    ) : !this.props.detail.detail ? null : (
      <div>
        <div>
          <Link to="/">
            <button type="button" className="btn btn-light">
              Back
            </button>
          </Link>
          <Link to="/edit">
            <button type="button" className="btn btn-primary">
              Edit
            </button>
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            data-toggle="modal"
            data-target="#exampleModal"
          >
            Delete
          </button>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5
                    className="modal-title"
                    id="exampleModalLabel"
                    style={{ color: "red" }}
                  >
                    Warning!
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this item?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    data-dismiss="modal"
                    onClick={this.deleteHandler}
                  >
                    DELETE!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul className="list-wrap list-detail">
          <li>
            <div>
              {this.props.detail.detail.avatar === null ? (
                <img src={image} className="li-avatar" />
              ) : (
                <img
                  src={this.props.detail.detail.avatar}
                  className="li-avatar"
                />
              )}
            </div>
            <div className="li-name">
              {this.props.detail.detail.firstName}{" "}
              {this.props.detail.detail.lastName}
            </div>
            <div className="li-title">{this.props.detail.detail.title}</div>
          </li>
          <Link
            to={
              this.props.detail.manager
                ? `/detail/${this.props.detail.detail.manager}`
                : `${this.props.url}`
            }
          >
            <li>
              <h4>View Manager</h4>
              <div>
                {this.props.detail.manager
                  ? `${this.props.detail.manager.firstName} ${
                      this.props.detail.manager.lastName
                    }`
                  : "None"}
              </div>
            </li>
          </Link>
          <Link
            to={
              this.props.detail.reporters.length > 0
                ? "/report"
                : `${this.props.url}`
            }
          >
            <li>
              <h4>View Direct Reportors</h4>
              <div>{this.props.detail.reporters.length}</div>
            </li>
          </Link>
          <li>
            <h4>Call Office</h4>
            <div>
              {this.props.detail.detail.officePhone
                ? this.props.detail.detail.officePhone
                : "N/A"}
              <a href={`tel:${this.props.detail.detail.officePhone}`}>
                <i className="fas fa-phone" />
              </a>
            </div>
          </li>
          <li>
            <h4>Call Cell</h4>
            <div>
              {this.props.detail.detail.cellPhone
                ? this.props.detail.detail.cellPhone
                : "N/A"}
              <a href={`tel:${this.props.detail.detail.cellPhone}`}>
                <i className="fas fa-phone" />
              </a>
            </div>
          </li>
          <li>
            <h4>Email</h4>
            <div>
              {this.props.detail.detail.email}{" "}
              <a href={`mailto:${this.props.detail.detail.email}`}>
                <i className="far fa-envelope-open" />
              </a>
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    detail: state.detail,
    redirect: state.redirect
  };
};

export default connect(mapStateToProps)(EmployeeDetail);
