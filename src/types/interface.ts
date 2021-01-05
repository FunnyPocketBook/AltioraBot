export interface Arguments {
  timer?: string[];
  reminder?: string[];
  ping?: string[];
  list?: string[];
  set?: Map<string, string>;
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
    majorityText: string;
  };
}
