import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import * as actions from "../../actions";
import Home from "../Home";
import image from "../data/image.js";

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      title: "",
      gender: "Male",
      age: "",
      email: "",
      avatar: null,
      officePhone: null,
      cellPhone: null,
      manager: null
    };
  }

  componentDidMount() {
    this.props.dispatch(actions.getEmployees());
  }

  firstNameChange = e => {
    this.setState({ firstName: e.target.value });
  };

  lastNameChange = e => {
    this.setState({ lastName: e.target.value });
  };

  titleChange = e => {
    this.setState({ title: e.target.value });
  };

  genderChange = e => {
    this.setState({ gender: e.target.value });
  };

  ageChange = e => {
    this.setState({ age: e.target.value });
  };

  emailChange = e => {
    this.setState({ email: e.target.value });
  };

  officePhoneChange = e => {
    this.setState({ officePhone: e.target.value });
  };

  cellPhoneChange = e => {
    this.setState({ cellPhone: e.target.value });
  };

  managerChange = e => {
    this.setState({ manager: e.target.value });
  };

  avatarChange = e => {
    if (e.target.value) {
      let file = e.target.files[0];
      getBase64(file).then(base64 => {
        this.setState({ avatar: base64 });
      });
    }
  };

  onSubmit = e => {
    e.preventDefault();
    let user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      manager: this.state.manager,
      title: this.state.title,
      gender: this.state.gender,
      age: this.state.age,
      avatar: this.state.avatar,
      officePhone: this.state.officePhone,
      cellPhone: this.state.cellPhone,
      email: this.state.email
    };
    this.props.dispatch(actions.addEmployee(user));
    this.props.dispatch(actions.toggle(true));
  };

  render() {
    return this.props.redirect ? (
      <Redirect to={{ pathname: "/" }} />
    ) : (
      <div className="create-user">
        <h2 className="head">Create A New Employee</h2>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            {this.state.avatar === null ? (
              <img src={image} />
            ) : (
              <img src={this.state.avatar} />
            )}
            <div class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                id="inputGroupFile01"
                accept=".jpg, .jpeg, .png"
                onChange={this.avatarChange}
              />
              <label class="custom-file-label" for="inputGroupFile01">
                Upload Picture
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              onChange={this.firstNameChange}
              value={this.state.firstName}
              placeholder="First Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              onChange={this.lastNameChange}
              value={this.state.lastName}
              placeholder="Last Name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Manager:</label>
            <select
              className="form-control"
              id="gender"
              onChange={this.managerChange}
              value={this.state.manager}
            >
              <option value={null}>none</option>
              {this.props.employee.employee.map(manager => {
                return <option value={manager._id}>{manager.firstName} {manager.lastName}</option>;
              })}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              onChange={this.titleChange}
              value={this.state.title}
              placeholder="Title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              className="form-control"
              id="gender"
              onChange={this.genderChange}
              value={this.state.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="age">Age:</label>
            <input
              type="text"
              className="form-control"
              id="age"
              placeholder="Age"
              onChange={this.ageChange}
              value={this.state.age}
              maxLength="3"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="age"
              placeholder="Email"
              onChange={this.emailChange}
              value={this.state.email}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="officePhone">Office Phone:</label>
            <input
              type="tel"
              className="form-control"
              id="officePhone"
              placeholder="Office Phone"
              onChange={this.officePhoneChange}
              value={this.state.officePhone}
              maxLength={10}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cellPhone">Cell Phone:</label>
            <input
              type="tel"
              className="form-control"
              id="cellPhone"
              placeholder="Cell Phone"
              onChange={this.cellPhoneChange}
              value={this.state.cellPhone}
              maxLength={10}
              required
            />
          </div>

          <Link to="/">
            <button type="submit" class="btn btn-secondary back-btn">
              Back
            </button>
          </Link>
          <button type="submit" class="btn btn-primary create-btn">
            Create
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    employee: state.employee,
    redirect: state.redirect
  };
};

export default connect(mapStateToProps)(Create);
