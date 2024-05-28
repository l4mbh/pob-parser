// const fetch = require("node-fetch");
// import fetch from "node-fetch";
const request = require("request");
const zlib = require("zlib");
const urlbase64 = require("url-safe-base64");
const parseString = require("xml2js").parseString;

exports.pobParser = async (req, res, next) => {
  const code = req.body.code;
  try {
    const decodeStr = urlbase64.decode(code);
    await parseString(
      zlib.inflateSync(Buffer.from(decodeStr, "base64")).toString("ascii"),
      (err, result) => {
        const data = {
          skills: result.PathOfBuilding.Skills[0].SkillSet[0].Skill,
          items: result.PathOfBuilding.Items[0].Item,
          notes: result.PathOfBuilding.Notes,
        };
        res.status(200).json(data);
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.pobb = (req, res, next) => {
  const url = req.body.url;
  console.log(url);
  try {
    request(`${url}/raw`, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        res.status(200).json(body);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error while getting pobb data." });
  }
};

exports.skillsGem = (req, res, next) => {
  const skillId = req.body.skillId;
  // console.log("skill id :",skillId);
  const encodedSkillId = encodeURIComponent(`"${skillId}"`);
  // console.log(`https://www.poewiki.net/w/api.php?action=cargoquery&tables=skill_gems,skill,items&where=skill.skill_id=${encodedSkillId}&fields=primary_attribute,name,inventory_icon,skill_id&format=json&join_on=skill._pageID=skill_gems._pageID,skill._pageID=items._pageID`);

  try {
    request(
      `https://www.poewiki.net/w/api.php?action=cargoquery&tables=skill_gems,skill,items&where=skill.skill_id=${encodedSkillId}&fields=primary_attribute,name,inventory_icon,skill_id&format=json&join_on=skill._pageID=skill_gems._pageID,skill._pageID=items._pageID`,
      (error, response, body) => {
        if (!error && response.statusCode == 200) {
          res.status(200).json(body);
        }
      }
    );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong while getting skill info!" });
  }
};

exports.skillGemImg = (req, res, next) => {

  const skillImageName = req.body.skillImageName;
  // console.log(skillImageName);
  // const encodedSkillGemName = encodeURIComponent(`"${skillImageName}"`);

  // console.log(`https://www.poewiki.net/w/api.php?action=query&titles=Image:${skillImageName}&prop=imageinfo&iiprop=url&format=json`);

  try {
    request(`https://www.poewiki.net/w/api.php?action=query&titles=Image:${skillImageName}&prop=imageinfo&iiprop=url&format=json`,(error, response, body) => {
      if (!error && response.statusCode == 200) {
        res.status(200).json(body);
      }
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong while getting skill image!" });
  }
};
