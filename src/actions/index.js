const axios = require("axios");

function getEmployeeStart() {
  return {
    type: "FETCH_EMPLOYEES_REQUEST"
  };
}

function getEmployeeFail(error) {
  return {
    type: "FETCH_EMPLOYEES_FAILURE",
    error: error
  };
}

function getEmployeeSuccess(response) {
  return {
    type: "FETCH_EMPLOYEES_SUCCESS",
    employee: response
  };
}

function getDetailSuccess(response) {
  return {
    type: "FETCH_DETAIL_SUCCESS",
    detail: response,
    manager: response.manager,
    reporters: response.reporters
  };
}

function getDetailStart() {
  return {
    type: "FETCH_DETAIL_REQUEST"
  };
}

function getDetailFail() {
  return {
    type: "FETCH_DETAIL_FAIL"
  };
}

function addEmployeeSuccess(){
  return {
    type: "ADD_EMPLOYEE_SUCCESS"
  };
}
export const toggle = val => {
  return {
    type: "TOGGLE", 
    value: val
  };
};


export function addEmployee(employee, history) {

  return (dispatch) => {
    dispatch(getEmployeeStart());
    axios
      .post("http://localhost:5000/api/employee", employee)
      .then(res => {
      
          history.push("/")// then will redirecting homepage 
        }
      )
     
      .catch(err => {
        dispatch(getEmployeeFail(err.toString())); 
        
      });
  };
}

export function getEmployees() {
  return (dispatch) => {
    dispatch(getEmployeeStart());
    axios
      .get("http://localhost:5000/api/employees")
      .then(response => {
        dispatch(getEmployeeSuccess(response.data.employees));
      })
      .catch(err => {
        dispatch(getEmployeeFail(err));
      });
  };
}

export function getEmployeeDetail(id) {
  return (dispatch) => {
    dispatch(getDetailStart());
    axios
      .get(`http://localhost:5000/api/employee/${id}`)
      .then(response => {
        dispatch(getDetailSuccess(response.data));
      })
      .catch(err => {
        dispatch(getDetailFail(err));
      });
  };
}

export function deleteEmployee(id) {
  return (dispatch) => {
    dispatch(getEmployeeStart());
    console.log("requestdelete")
    axios
      .delete(`http://localhost:5000/api/employee/${id}`) 
      .then(response => {
        console.log("anserdelete")
        console.log(response.data.employees)
        dispatch(getEmployeeSuccess(response.data.employees));
      })
      .catch(err => {
        dispatch(getDetailFail(err));
      });
  };
}

export function editEmployee(id, user, history) {
  return (dispatch, getState) => {
    dispatch(getEmployeeStart());
    axios
      .put(`http://localhost:5000/api/employee/${id}`, user)
      .then(response => {
        // if (response.status === 200) {
          history.push("/")
        }
      )
      .catch(err => {
        dispatch(getDetailFail(err));
      });
  };
}
