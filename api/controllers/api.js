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

exports.itemImg = (req, res, next) => {
  const itemImage = req.body.itemName;

  const cacheKey = `itemImg${itemImage}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  //console.log(`https://www.poewiki.net/w/api.php?action=query&titles=Image:${itemImage}&prop=imageinfo&iiprop=url&format=json`)

  axios
    .get(
      `https://www.poewiki.net/w/api.php?action=query&titles=Image:${itemImage}&prop=imageinfo&iiprop=url&format=json`
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

exports.itemImgName = (req, res, next) => {
  const itemName = req.body.itemName;
  console.log(itemName);

  if (itemName.includes("Unique ID:")) {
    return res.status(200).json('none');
  }

  const encodedName = encodeURIComponent(`"${itemName}"`)
    .replace(/'/g, "%27")
    .replace(/!/g, "%21")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");

  const cacheKey = `itemImgName${itemName}`;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(cachedData);
  }

  // console.log(`https://www.poewiki.net/w/api.php?action=cargoquery&tables=items&fields=inventory_icon&where=name=${encodedName}&format=json`)

  axios
    .get(
      `https://www.poewiki.net/w/api.php?action=cargoquery&tables=items&fields=inventory_icon&where=name=${encodedName}&format=json`
    )
    .then((response) => {
      const result = response.data.cargoquery[0].title[
        "inventory icon"
      ].replace(/^File:/, "");
      // console.log(result)
      cache.set(cacheKey, result); // set cache
      return res.status(200).json(result);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(500)
        .json({
          message: "Something went wrong while getting item image name!",
        });
    });
};
