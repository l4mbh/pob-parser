const axios = require("axios");
const cache = require("../cache/NodeCache");

const zlib = require("zlib");
const urlbase64 = require("url-safe-base64");
const parseString = require("xml2js").parseString;

exports.pobParser = async (req, res, next) => {
  const code = req.body.code;

  const cacheKey = `pobParser_${code}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  try {
    const decodeStr = urlbase64.decode(code);
    const inflatedData = zlib
      .inflateSync(Buffer.from(decodeStr, "base64"))
      .toString("ascii");
    parseString(inflatedData, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error parsing XML" });
      }
      const data = {
        skills: result.PathOfBuilding.Skills[0].SkillSet[0].Skill,
        items: result.PathOfBuilding.Items[0].Item,
        notes: result.PathOfBuilding.Notes,
      };
      cache.set(cacheKey, data); // set cache
      return res.status(200).json(data);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

exports.pobb = (req, res, next) => {
  const url = req.body.url;

  const cacheKey = `pobb_${url}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  axios
    .get(`${url}/raw`)
    .then((response) => {
      cache.set(cacheKey, response.data); // set cache
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error while getting pobb data." });
    });
};

exports.skillsGem = (req, res, next) => {
  const skillId = req.body.skillId;
  const encodedSkillId = encodeURIComponent(`"${skillId}"`);

  const cacheKey = `skillsGem_${skillId}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  axios
    .get(
      `https://www.poewiki.net/w/api.php?action=cargoquery&tables=skill_gems,skill,items&where=skill.skill_id=${encodedSkillId}&fields=primary_attribute,name,inventory_icon,skill_id&format=json&join_on=skill._pageID=skill_gems._pageID,skill._pageID=items._pageID`
    )
    .then((response) => {
      cache.set(cacheKey, response.data); // set cache
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Something went wrong while getting skill info!" });
    });
};

exports.skillGemImg = (req, res, next) => {
  const skillImageName = req.body.skillImageName;

  const cacheKey = `skillGemImg_${skillImageName}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  axios
    .get(
      `https://www.poewiki.net/w/api.php?action=query&titles=Image:${skillImageName}&prop=imageinfo&iiprop=url&format=json`
    )
    .then((response) => {
      cache.set(cacheKey, response.data); // set cache
      return res.status(200).json(response.data);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Something went wrong while getting skill image!" });
    });
};
