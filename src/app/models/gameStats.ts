import { AllBoardGame } from "./collection";

export interface CollectionGroups {
  value: string;
  viewValue: string;
}

export interface BaseToGame {
  baseId: string;
  base: AllBoardGame;
  expansions: BaseToExpansion[];
}

export interface BaseToExpansion {
  expansionId: number;
  expansion: AllBoardGame;
}