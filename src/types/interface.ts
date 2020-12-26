export interface Arguments {
  timer?: string[];
  reminder?: string[];
  ping?: string[];
  list?: string[];
  set?: string[];
  custom?: Map<string, string>;
  message?: string;
}

export interface Config {
  botToken: string;
  options: {
    introductionChannelId: string;
    communityRoleId: string;
    minIntroWords: number;
    noReactionText: string;
    tieText: string;
    winnerText: string;
  };
}
