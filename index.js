// import express from "express";
const express = require("express");
const app = express();
const meal = require("./meals/meal");
const PORT = 3000;

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");

app.use((req, res, next) => {
  const time = new Date();
  console.log(
    `-----
      ${time.toLocaleDateString()}: Received a ${req.method} request to ${
      req.url
    }.`
  );

  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Containing the data:");
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

app.get("/", (req, res) => {
  res.send(
    "Welcome to the Home page <br/> You can either use the '/meal' to retrieve meal data <br/> '/' to add new meal to the object <br/> '/meal/:id' to update or delete the meal"
  );
});

app.get("/meal", (req, res) => {
  res.json(meal);
});

app.get("/meal/:id", (req, res) => {
  try {
    if (req.params.id >= 0 && req.params.id < meal.length) {
      res.json(meal[req.params.id]);
    } else {
      res.status(404).json({ error: "That is not a valid id" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error occured while retriving the meal data" });
  }
});

app.post("/", (req, res) => {
  meal.push(req.body);
  res.json(meal);
});

app.patch("/meal/:id", (req, res) => {
  try {
    if (req.params.id >= 0 && req.params.id < meal.length) {
      const mealUpdate = { ...meal[req.params.id], ...req.body };
      meal[req.params.id] = mealUpdate;
      res.json(meal[req.params.id]);
    } else {
      res.status(404).json({ error: "That is not a valid id" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error occured while updating the meal" });
  }
});

app.delete("/meal/:id", (req, res) => {
  try {
    if (req.params.id >= 0 && req.params.id < meal.length) {
      meal.splice(req.params.id, 1);
      res.json(meal);
    } else {
      res.status(404).json({ error: "That is not a valid id" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error occured while deleting one meal" });
  }
});

app.listen(PORT, () => {
  console.log(`The server is running on localhost:${PORT} `);
});
