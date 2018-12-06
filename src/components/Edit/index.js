import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import Loading from "../Loading";
import image from "../data/image.js";
import * as actions from "../../actions";

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

const findInvalidManager = (array, curId) => {
  let map = new Map();
  array.forEach(employee => {
    map.set(employee._id, employee);
  });
  let res = [];
  helper(curId, res, map);
  return res;
};

const helper = (curId, res, map) => {
  if (!map.has(curId)) {
    return;
  }
  res.push(curId);
  let employee = map.get(curId);
  for (let report of employee.directReports) {
    helper(report, res, map);
  }
  return;
};


class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      firstName: "",
      lastName: "",
      title: "",
      gender: "Male",
      age: "",
      email: "",
      avatar: null,
      officePhone: null,
      cellPhone: null,
      manager: null,
      invalid: []
    };
  }

  componentDidMount() {   
    console.log("componentDidMount in Edit")
    this.props.dispatch(
      actions.getEmployeeDetail(this.props.match.params.employeeId)
    );
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps in edit")
    if (nextProps.detail.detail)  {
      this.setState({...nextProps.detail.detail});//?
      this.setState({
        invalid: findInvalidManager(
          this.props.employee.employee,
          nextProps.detail.detail._id
        )
      }
      );
    }
  }

  firstNameChange = e => {
    this.setState({ firstName: e.target.value });
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
    let employee = {
      manager: this.state.manager,
      title: this.state.title,
      gender: this.state.gender,
      age: this.state.age,
      avatar: this.state.avatar,
      officePhone: this.state.officePhone,
      cellPhone: this.state.cellPhone,
      email: this.state.email
    };
    this.props.dispatch(actions.editEmployee(this.state._id, employee,this.props.history));
  };

  render() {
    
    return (
      <div className="create-user">
        <h2 className="head">Edit Employee</h2>
        {!this.props.detail.isLoading && this.props.detail && this.props.detail.detail?( //?
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            {this.state.avatar === null ? (
              <img src={image} />
            ) : (
              <img src={this.state.avatar} />
            )}
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputGroupFile01"
                accept=".jpg, .jpeg, .png"
                onChange={this.avatarChange}
              />
              <label className="custom-file-label" htmlFor="inputGroupFile01">
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
              value={this.state.firstName||""}
              placeholder="First Name"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              onChange={this.lastNameChange}
              value={this.state.lastName||""}
              placeholder="Last Name"
              readOnly
            />
          </div>
          <div className="form-group">
            <label htmlFor="gender">Manager:</label>
            <select
              className="form-control"
              id="gender"
              onChange={this.managerChange}
              value={this.state.manager||""}
            >
              <option value="none">no manager</option>
              
                                 
             {this.props.employee.employee ? this.props.employee.employee.map((manager, index) => {
                if (manager._id !== this.props.detail.detail._id) { 
                  if (this.state.invalid.includes(manager._id)) { 
                    return (
                      <option key={index} value={manager._id} disabled> 
                        {manager.firstName} {manager.lastName}
                      </option>
                    );
                  } else {
                    return (
                      <option key={index} value={manager._id}>
                        {manager.firstName} {manager.lastName}
                      </option>
                    );
                  }
                }
              }) : null} 
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              className="form-control"
              id="title"
              onChange={this.titleChange}
              value={this.state.title||""}
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
              value={this.state.gender||""}
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
              value={this.state.age||""}
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
              value={this.state.email||""}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="officePhone">Office Phone:</label>
            <input
              type="text"
              className="form-control"
              id="officePhone"
              placeholder="Office Phone"
              onChange={this.officePhoneChange}
              value={this.state.officePhone||""}
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
              value={this.state.cellPhone||""}
              maxLength={10}
              required
            />
          </div>

          <Link to="/">
            <button type="submit" className="btn btn-secondary back-btn">
              Back
            </button>
          </Link>
          <button type="submit" className="btn btn-primary create-btn">
            Confirm
          </button>
        </form>):
        (<Loading />)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    employee: state.employee,
    detail: state.detail,
    redirect: state.redirect
  };
};

export default connect(mapStateToProps)(Edit);
