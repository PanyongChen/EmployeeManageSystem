const express = require("express");
var bodyParser = require("body-parser");

const path = require("path");
const mongoose = require("mongoose");
const mongodbConnect = require("./config/database");

const db = mongoose.connection;
const app = new express();

// Connect to mongodb

mongodbConnect();

// import models
const Employee = require("./models/Employee.js");

// Server Middleware
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log("A " + req.method + " request received at " + new Date());
  next();
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// get list of employees

app.get("/api/employees", (req, res) => {
  Employee.find({}, (err, employee) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      res.status(200).json({ employee });
    }
  });
});

// get an employee details

app.get("/api/employee/:employeeId", (req, res) => {
  Employee.findById(req.params["employeeId"], (err, employee) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      let reports = employee.directReports;
      let manager = employee.manager;
      Employee.find({}, (err, all) => {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.status(200).json({
            employee,
            reporters: all.filter(em => reports.includes(em.id)),
            manager: all.filter(em => manager === em.id)
          });
        }
      });
    }
  });
});

// add a new employee 

app.post("/api/employee", (req, res) => {
  if (!req.body.manager) {
    Employee.create(req.body, (err, employee) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        Employee.find({}, (err, employee) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            res.status(200).json({ employee });
          }
        });
      }
    });
  } else {
    Employee.create(req.body, (err, employee) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        Employee.findById(req.body.manager, (err, manager) => {
          if (err) {
            res.status(500).json({ error: err });
          } else {
            let newManager = Object.assign({}, manager._doc);
            newManager.directReports = [
              ...newManager.directReports,
              employee._id
            ];
            Employee.findByIdAndUpdate(
              req.body.manager,
              newManager,
              (err, manager) => {
                if (err) {
                  res.status(500).json({ error: err });
                } else {
                  Employee.find({}, (err, employee) => {
                    if (err) {
                      res.status(500).json({ error: err });
                    } else {
                      res.status(200).json({ employee });
                    }
                  });
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

app.put("/api/employee/:employeeId", (req, res) => {
  Employee.findByIdAndUpdate(
    req.params["employeeId"],
    req.body,
    (err, employee) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        if (employee != null) {
          let obj = employee._doc;
          // manager dosen`t change
          if (obj.manager === req.body.manager) {
            Employee.findByIdAndUpdate(
              req.params["employeeId"],
              req.body,
              (err, employee) => {
                if (err) {
                  res.status(500).json({ error: err });
                } else {
                  Employee.find({}, (err, employee) => {
                    if (err) {
                      res.status(500).json({ error: err });
                    } else {
                      res.status(200).json({ employee });
                    }
                  });
                }
              }
            );
          } else {
            // delete previous manager
            if (employee.manager !== null) {
              Employee.findById(obj.manager, (err, manager) => {
                if (err) {
                  res.status(500).json({ error: err });
                } else {
                  if (manager !== null) {
                    let newManager = Object.assign({}, manager._doc);
                    newManager.directReports = newManager.directReports.filter(
                      user => user !== req.params["employeeId"]
                    );
                    Employee.findByIdAndUpdate(
                      obj.manager,
                      newManager,
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
            if (req.body.manager !== null) {
              Employee.findById(req.body.manager, (err, manager) => {
                if (err) {
                  res.status(500).json({ error: err });
                } else {
                  if (manager !== null) {
                    let newManager = Object.assign({}, manager._doc);
                    newManager.directReports = [
                      ...newManager.directReports,
                      obj._id
                    ];
                    Employee.findByIdAndUpdate(
                      req.body.manager,
                      newManager,
                      (err, manager) => {
                        if (err) {
                          res.status(500).json({ error: err });
                        } else {
                          Employee.find({}, (err, employee) => {
                            if (err) {
                              res.status(500).json({ error: err });
                            } else {
                              res.status(200).json({ employee });
                            }
                          });
                        }
                      }
                    );
                  }
                }
              });
            }
          }
        }
      }
    }
  );
});

// delete an exist employee

app.delete("/api/employee/:employeeId", (req, res) => {
  Employee.findByIdAndRemove(req.params["employeeId"], (err, employee) => {
    if (err) {
      res.status(500).json({ error: err });
    } else {
      if (employee !== null) {
        let obj = employee._doc;
        if (obj.manager !== null) {
          // w/ manager
          Employee.findById(obj.manager, (err, manager) => {
            if (err) {
              res.status(500).json({ error: err });
            } else {
              if (manager !== null) {
                let newManager = Object.assign({}, manager._doc);
                let index = newManager.directReports.indexOf(
                  req.params["employeeId"]
                );
                newManager.directReports = [
                  ...newManager.directReports.slice(0, index),
                  ...newManager.directReports.slice(
                    index + 1,
                    newManager.directReports.length
                  )
                ];
                Employee.findByIdAndUpdate(
                  obj.manager,
                  newManager,
                  (err, manager) => {
                    if (err) {
                      res.status(500).json({ error: err });
                    } else {
                      if (obj.directReports.length > 0) {
                        // w/ directReports
                        obj.directReports.forEach(report => {
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
                                Employee.findByIdAndUpdate(
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
                        Employee.findById(obj.manager, (err, manager) => {
                          if (err) {
                            res.status(500).json({ error: err });
                          } else {
                            if (manager !== null) {
                              let newManager = Object.assign({}, manager._doc);
                              newManager.directReports = [
                                ...newManager.directReports,
                                ...obj.directReports
                              ];
                              Employee.findByIdAndUpdate(
                                obj.manager,
                                newManager,
                                (err, manager) => {
                                  if (err) {
                                    res.status(500).json({ error: err });
                                  } else {
                                    Employee.find({}, (err, employee) => {
                                      if (err) {
                                        res.status(500).json({ error: err });
                                      } else {
                                        res.status(200).json({ employee });
                                      }
                                    });
                                  }
                                }
                              );
                            } else {
                              Employee.find({}, (err, employee) => {
                                if (err) {
                                  res.status(500).json({ error: err });
                                } else {
                                  res.status(200).json({ employee });
                                }
                              });
                            }
                          }
                        });
                      } else {
                        Employee.find({}, (err, employee) => {
                          if (err) {
                            res.status(500).json({ error: err });
                          } else {
                            res.status(200).json({ employee });
                          }
                        });
                      }
                    }
                  }
                );
              }
            }
          });
        } else {
          Employee.find({}, (err, employee) => {
            if (err) {
              res.status(500).json({ error: err });
            } else {
              res.status(200).json({ employee });
            }
          });
        }
      } else {
        res.json({ message: "employee doesn`t exist." });
      }
    }
  });
});

app.listen(5000, () => {
  console.log("Listening to port 5000.");
});
