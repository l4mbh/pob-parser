const express = require("express");
const cors = require("cors");

const apiRoutes = require('../routes/api');


const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


// app.use("/pob", async (req, res) => {
//   const code = req.body.code;
//   try {
//     const decodeStr = urlbase64.decode(code);
//     await parseString(zlib.inflateSync(Buffer.from(decodeStr, "base64")).toString("ascii"), (err, result) => {
//       const data = {
//         skills: result.PathOfBuilding.Skills[0].SkillSet[0].Skill,
//         items: result.PathOfBuilding.Items[0].Item,
//         notes: result.PathOfBuilding.Notes,
//       };
//       res.status(200).json(data);
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

app.use("/api", apiRoutes);	


app.use("/", (req, res) => {
  res.status(200).send("hello");
});

module.exports = app;
