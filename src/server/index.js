const express = require("express");// for node server
var bodyParser = require("body-parser");// for parsing req&res
const path = require("path");
const mongoose = require("mongoose");// for db binding
const mongodbConnect = require("./config/database");// for db config

const db = mongoose.connection; 
const app = new express();// create express server object
mongodbConnect();

// import models
const Employee = require("./models/Employee.js");// employee model

// Server Middleware
app.use(bodyParser.json());// parse as json type
app.use((req, res, next) => {// customize middleware, before middleware
  console.log("A " + req.method + " request received at " + new Date());
  next();
});

app.use(function(req, res, next) { // customize middleware, after middleware
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  console.log("B " + req.method + " send response at " + new Date());
  next();
});

// get list of employees 
app.get("/api/employees", (req, res) => { // get employee list
  Employee.find({}, (err, employees) => { // find all record without filtering
    if (err) {
      res.status(500).json({ error: err }); // if error happens, send response with statu 500 and error object, here 500 means serverside error
    } else {
      console.log(employees)
      res.status(200).json({ employees});//if ok, return employes list
    }
  });
});

// get an employee details
app.get("/api/employee/:employeeId", (req, res) => {// get employee detail info where id = employeeId 
  Employee.findById(req.params["employeeId"], (err, employee) => { 
    //this one is get employee detail info where id = employeeId 
    //req.parames["employeeId"] = search url path; 
    //(err, employee) means finding ok---return employee, else----return error
    //(err, employee) here is callback function, after findByid function is finished, this function is called. 
    if (err) {// if error happens, send response with statu 500 and error object
      res.status(500).json({ error: err });
    } else {// if ok
      let reports = employee.directReports;
      // result of findById is employee object. this object has the structure of employee schema.
      // so employee.directReports is array of reports of employee object.
      let manager = employee.manager;// here is the same
      Employee.find({}, (err, all) => {// this is all employee in collections
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({
            employee, //this has another infos of employee, like firstName, phonenumber, avartar,...; 
            reporters: all.filter(em => reports.includes(em.id)), 
            // get reports employee objects list by using filtering 
            // reports is array of employee ids, so get employee list where id is included in reports.
            // it will be reports list.
            manager: all.filter(em => manager === em.id)//same, here we use === because we only have one manager
          });
        }
      });
    }
  });
});

// add a new employee 
app.post("/api/employee", (req, res) => {
   // req.body.manger is new manager for creating
  // when create new employee, we can set manager as none or anyone
  if (!req.body.manager) { 
    
    /// if no manager of new employee, set as none //req.body: a request with a parseable body (e.g. JSON, url-encoded, or XML) has body parameters equal to its parsed value 
     Employee.create(req.body, (err, employee) => {//this employee is single, it is new employee
      if (err) {// we don't use employee 
        res.status(500).json({ error: err }); // error
      } else {
        res.status(200).json({ message: "ok" });// if creating is success, in client side will receive {message;"ok"}, if not, will recieve error msg
      }
    });
  } else { 
    /// if manager of new employee exists, means set as anyone

    Employee.create(req.body, (err, employee) => {// creat new employee
      if (err) {
        res.status(500).json({ error: err });
      } else {
        Employee.findById(req.body.manager, (err, manager) => {// find manager object
          if (err) {
            res.status(500).json({ error: err });
          } else {
            let newManager = Object.assign({}, manager._doc);// manager._doc is the whole information of manager
            //it is the new manager information, assign to the newManager object
            newManager.directReports = [  // add new employee into reports of manager //hare is the updating process of reporters for this new manager
              ...newManager.directReports, //<-------old reports// this is original reprots of this manager----> a
              employee._id //<-------here // it will be added in reports array -----> b
            ];
             // this part is for updating manager, we have to update manager with new reports
            Employee.findByIdAndUpdate( // update manager with new reports array
              req.body.manager,// original manager
              newManager, // original manager will be updated to new Manager which has new reports array[...a, b]
              (err, manager) => {
                if (err) {
                  res.status(500).json({ error: err });
                } else {
                  res.status(200).json({ message: "ok" });
                }
              }
            );
          }
        });
      }
    });
  }
});

// modify an exist employee
app.put("/api/employee/:employeeId", (req, res) => { // update employe where id = employeeId
  if (req.body.manager=='') req.body.manager = null  
   // if we select anyone, we can get id string of anyone, but if select none, get empty string
  // at that moment, we have to set it as null;
  Employee.findByIdAndUpdate(// update employee
    req.params["employeeId"], // here is employee id string 
    req.body,// here is the employee body for updating; before update
    (err, employee) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        if (employee != null) {
          let obj = employee._doc;//here employee._doc means employee information before modify, it is json type
          if (obj.manager === req.body.manager) { 
           
           /// if manager is not changed
            Employee.findByIdAndUpdate(// update employee
              req.params["employeeId"],// this is employee id which need to update
              req.body, // informantion for updating, ..
              (err, employee) => { 
                if (err) { 
                  res.status(500).json({ error: err });
                } else {
                  res.status(200).json({ message: "ok" });
                }
              }
            );
          } else { 

            /// if manager is changed
            // employee.manager --> old manager
            // req.body.manager --> new manager
            if (employee.manager !== null) { // if old manager exists, in other words, if updating employee has already any manager, we will remove it and update new manager
              Employee.findById(obj.manager, (err, manager) => { // find old manager // for finding old manger object
                //but old manager has reports array with current employee. so we have to remove current employee from reports array of old manager
                if (err) {
                  res.status(500).json({ error: err });
                } else {
                  if (manager !== null) { // manager is old manager.
                    let newManager = Object.assign({}, manager._doc);//here .._doc is the new manager, but it is not req.body.manager(this is reql new manager)
                    // it is only for updating old manager; 
                    newManager.directReports = newManager.directReports.filter(// remove updated employee from reports of old manager
                      user => user !== req.params["employeeId"] // in other words, we filter reports array where id is not id of current employee
                      
                    );
                    Employee.findByIdAndUpdate(// update old manager with new reports array // and update old manager
                      obj.manager,// old manager
                      newManager,// manager with new reports array(without current employee id
                      (err, manager) => {
                        if (err) {
                          res.status(500).json({ error: err });
                        }
                      }
                    );
                  }
                }
              });
            }
            // add to new manager`s reportors
            // in above code, we have remove current employee from reports of old manager
            // here, we have to add current employee into reports of new manager
            // only adding not removing;
            if (req.body.manager !== null) { // if new manager not null
              Employee.findById(req.body.manager, (err, manager) => {// find new manager
                if (err) {
                  res.status(500).json({ error: err });
                } else {
                  if (manager !== null) {
                    let newManager = Object.assign({}, manager._doc);
                    newManager.directReports = [ // added updated employee into reports array of new manager
                      ...newManager.directReports, // <------old reports array
                      obj._id   // <-----updated employee id
                    ];
                    Employee.findByIdAndUpdate(// update new manager with updated reports array
                      req.body.manager,
                      newManager,
                      (err, manager) => {
                        if (err) {
                          res.status(500).json({ error: err });
                        } else {
                          res.status(200).json({ message: "ok" });
                        }
                      }
                    );
                  }
                }
              });
            } else {
              res.status(200).json({ message: "ok" });
            }
          }
        }
      }
    }
  );
});

// delete an exist employee

app.delete("/api/employee/:employeeId", (req, res) => { // remove the employee where id = employeeId
  Employee.findByIdAndRemove(req.params["employeeId"], (err, employee) => {// remove employee
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (employee !== null) {// if employee exists in db 
        let obj = employee._doc;
        if (obj.manager !== null) { 
          
          /// if manager of removed employee is not null,find this manager, and 
          //delete the employee from this manager's reporters list
          // w/ manager
          Employee.findById(obj.manager, (err, manager) => { // find this manager
            if (err) {
              res.status(500).json({ error: err });
            } else {
              if (manager !== null) { 
                let newManager = Object.assign({}, manager._doc);
                let index = newManager.directReports.indexOf( // find position of deleted employee from reports array of manager
                  req.params["employeeId"]
                );
                newManager.directReports = [// remove employee from reports array
                  ...newManager.directReports.slice(0, index),
                  ...newManager.directReports.slice(
                    index + 1,
                    newManager.directReports.length
                  )
                ];
                Employee.findByIdAndUpdate( // update manager with updated reports array
                  obj.manager,//original manager
                  newManager,//manager with updated report array
                  (err, manager) => {
                    if (err) {
                      res.status(500).json({ error: err });
                    } else {
                      if (obj.directReports.length > 0) { /// if deleted employee has reports array// here is the situation that 
                        // this deleted person might be a manager and has reporter, so we need to remove him as the manager of his reporters
                        /// and then.. we have to add these reporters in new manager
                        // w/ directReports
                        obj.directReports.forEach(report => { // loop over all employee in reports
                          Employee.findById(report, (err, employee) => {
                            if (err) {
                              res.status(500).json({ error: err });
                            } else {
                              if (employee !== null) { 
                                let newReporter = Object.assign(
                                  {},
                                  employee._doc
                                );
                                newReporter.manager = obj.manager; 
                                Employee.findByIdAndUpdate( // report empolyee is updated with new manager
                                  report,
                                  newReporter,
                                  (err, employee) => {
                                    if (err) {
                                      res.status(500).json({ error: err });
                                    }
                                  }
                                );
                              }
                            }
                          });
                        });
                        Employee.findById(obj.manager, (err, manager) => { // added old reports array into reports array of new manager
                          if (err) {
                            res.status(500).json({ error: err });
                          } else {
                            if (manager !== null) { // if manager exist in db
                              let newManager = Object.assign({}, manager._doc);
                              newManager.directReports = [
                                ...newManager.directReports, //<-----reports array of new manager
                                ...obj.directReports  //<----reports array of deleted employee 
                              ];
                              Employee.findByIdAndUpdate(// update manager with updated reports array
                                obj.manager,
                                newManager,
                                (err, manager) => {
                                  if (err) {
                                    res.status(500).json({ error: err });
                                  } else {
                                    Employee.find({}, (err, employees) => { // get employee list, and send response with it
                                      if (err) {
                                        res.status(500).json({ error: err });
                                      } else {
                                        res.status(200).json({ employees });
                                      }
                                    });
                                  }
                                }
                              );
                            } else {// if manager doesn't exist in db
                              Employee.find({}, (err, employees) => { // get employee list, and send response with it
                                if (err) {
                                  res.status(500).json({ error: err });
                                } else {
                                  res.status(200).json({ employees });
                                }
                              });
                            }
                          }
                        });
                      } else { // if deleted employee doesn't has any reports array
                        Employee.find({}, (err, employees) => { // get employee list, and send response with it
                          if (err) {
                            res.status(500).json({ error: err });
                          } else {
                            res.status(200).json({ employees });
                          }
                        });
                      }
                    }
                  }
                );
              }
            }
          });
        } else { // if manager of removed employee is null
          Employee.find({}, (err, employees) => {// get employee list, and send response with it
            if (err) {
              res.status(500).json({ error: err });
            } else {
              res.status(200).json({ employees });
            }
          });
        }
      } else {// if employee doesn't exist in db
        res.status(500).json({ error: err });
      }
    }
  });
});

app.listen(5000, () => { // run server at port 5000
  console.log("Listening to port 5000.");
});

