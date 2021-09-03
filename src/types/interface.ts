export interface Arguments {
  timer?: string[];
  reminder?: string[];
  ping?: string[];
  list?: string[];
  set?: Map<string, string>;
  custom?: Map<string, string>;
  message?: string;
  userlimit?: string;
  permissions?: string[];
  poll?: string[];
  pollOptions?: string[];
  makevc?: string[];
  admin?: string[];
  ringer?: string[];
  find?: string[];
  player?: string;
  derole?: string[];
  role?: string[];
  all?: string[];
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
    tempVCIdleTime: number;
    tempVCCategoryId: string;
    tryoutsWelcomeMsg: string;
    tryoutsValorantWelcomeMsg: string;
    altioraWelcomeMsg: string;
    communityWelcomeMsg: string;
    minecraftWelcomeMsg: string;
    osuWelcomeMsg: string;
    animalCrossingWelcomeMsg: string;
    gamingWelcomeMsg: string;
  };
  britishify: boolean;
}

export interface Player {
  name: string;
  topHeroes: string[];
  sr: {
    tank: number;
    dps: number;
    support: number;
    text: string;
  };
  error: string;
}
