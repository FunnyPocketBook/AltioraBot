import * as fs from "fs";
import { Config } from "../types/interface.js";

export function getConfig(): string {
  const config = loadConfig();
  return JSON.stringify(config.options, null, 2);
}

export function setConfig(options: string[]): Config {
  const config = loadConfig();
  for (let i = 0; i < options.length; i++) {
    config.options[options[i]] = options[++i];
  }
  fs.writeFileSync("appdata/config.json", JSON.stringify(config, null, 2));
  return config;
}

export function loadConfig(): Config {
  const rawdata = fs.readFileSync("appdata/config.json");
  return JSON.parse(rawdata.toString());
}
