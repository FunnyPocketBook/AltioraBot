import { Player } from "../types/interface.js";
import axios from "axios";
import * as jsdom from "jsdom";

export async function getPlayerInfo(player): Promise<Player> {
  if (!player.match(/\S+#\d+/)) return null;
  const request = await axios.get(`https://playoverwatch.com/en-us/career/pc/${player.replace("#", "-")}`);
  if (request.status !== 200) return null;
  const dom = new jsdom.JSDOM(request.data);
  const doc = dom.window.document;
  const playerInfo: Player = {
    name: player,
    topHeroes: [],
    sr: {
      tank: 0,
      dps: 0,
      support: 0,
      text: ""
    },
    error: null
  };
  if (doc.getElementsByClassName("PrivateProfile_content-container").length > 0) {
    playerInfo.error = `${player}'s profile is set to private.`;
    return playerInfo;
  }
  const heroNameList = doc.querySelectorAll("#competitive .ProgressBar-title");
  const heroTimeList = doc.querySelectorAll("#competitive .ProgressBar-description");
  if (heroNameList.length === 0) {
    playerInfo.error = `${player} does not exist, please make sure that the name is correct.`;
    return playerInfo;
  }
  const compRank = doc.querySelectorAll(".competitive-rank-role");
  for (let i = 0; i < 5; i++) {
    playerInfo.topHeroes.push(`${heroNameList[i].textContent} (${heroTimeList[i].textContent})`);
  }
  for (let i = 0; i < compRank.length / 2; i++) {
    const rank = compRank[i];
    const rankText = rank.getElementsByClassName("competitive-rank-tier-tooltip")[0].getAttribute("data-ow-tooltip-text");
    const sr = parseInt(rank.getElementsByClassName("competitive-rank-level")[0].textContent);
    switch (rankText.split(" ")[0]) {
      case "Tank":
        playerInfo.sr.tank = sr;
        playerInfo.sr.text += `Tank: ${sr}, `;
        break;
      case "Damage":
        playerInfo.sr.dps = sr;
        playerInfo.sr.text += `DPS: ${sr}, `;
        break;
      case "Support":
        playerInfo.sr.support = sr;
        playerInfo.sr.text += `Support: ${sr}, `;
        break;
    }
  }
  return playerInfo;
}
