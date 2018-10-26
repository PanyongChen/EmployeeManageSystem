const mongoose = require("mongoose");
const db = mongoose.connection;

function init() {
  mongoose.connect("mongodb://jason:jason123@ds227373.mlab.com:27373/jason", { useNewUrlParser: true });
}

db.once("open", function() {
  console.log("mongodb connected.");
});

module.exports = init;