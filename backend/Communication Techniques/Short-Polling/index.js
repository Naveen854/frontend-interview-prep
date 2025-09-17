const shortPollingRouter = require("express").Router();

let data = "initial data";

shortPollingRouter.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

shortPollingRouter.get("/getData", (req, res) => {
  res.send({ message: "success", data });
});

shortPollingRouter.put("/updateData", (req, res) => {
  const newData = req.body.data;
  data = newData;
  res.send({ message: "success", data });
});

module.exports = shortPollingRouter;
