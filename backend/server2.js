const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});
app.set("port", port);

app.post("/api/tasks", (req, res, next) => {
  console.log(req.body);
  res.json({
    status: {
      message: "successfully",
      code: 201,
    },
  });
});

app.get("/api/tasks", (req, res, next) => {
  const tasks = [
    {
      _id: "andjvbiadfsb",
      title: "1  from server",
      description: "first task description",
    },
    {
      _id: "jnvapjdiwriwv",
      title: "2 from server",
      description: "second task description",
    },
  ];

  res.json({
    status: {
      message: "successful",
      code: 200,
    },
    data: tasks,
  });
});

app.use((req, res, next) => {
  console.log("First middleware");

  next();
});

app.use((req, res, next) => {
  console.log("Second middleware");
  res.send("Hello from express!!!!");
});

const server = http.createServer(app);

server.on("error", () => {
  console.log("error in server", err.message, err);
});

server.on("listening", () => {
  console.log("I am listening on port:", port);
});

server.listen(port);
