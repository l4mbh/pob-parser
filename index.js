const zlib = require("zlib");
const urlbase64 = require("url-safe-base64");
const parseString = require("xml2js").parseString;
const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const cors_anywhere = require("cors-anywhere");

const apiRoutes = require("./api/routes/api");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
// set headers
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api", apiRoutes);

// app.use("/pob", async (req, res) => {
//   const code = req.body.code;

//   try {
//     const decodeStr = urlbase64.decode(code);

//     await parseString(
//       zlib.inflateSync(Buffer.from(decodeStr, "base64")).toString("ascii"),
//       (err, result) => {
//         const data = {
//           skills: result.PathOfBuilding.Skills[0].SkillSet[0].Skill,
//           items: result.PathOfBuilding.Items[0].Item,
//           notes: result.PathOfBuilding.Notes,
//         };
//         res.status(200).json(data);
//       }
//     );
//   } catch (err) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

app.use("/", (req, res) => {
  res.status(200).send("hello");
});

app.listen(5000, () => {
  console.log(`PoB parser listening at http://localhost:${port}`);
});

cors_anywhere
  .createServer({
    originWhitelist: [],
  })
  .listen(8080, () => {
    console.log(`Cors-anythere running at http://localhost:8080`);
  });
