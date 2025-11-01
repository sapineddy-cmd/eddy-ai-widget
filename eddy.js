const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Eddy AI Widget opérationnel !");
});

app.listen(3000, () => {
  console.log("Serveur IA actif sur le port 3000");
});
