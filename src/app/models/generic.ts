import { StringLike } from "@firebase/util";

export interface nameId {
    id: string;
    name: string;
}

export interface textId {
    id: string;
    text: string;
}

export interface cycle {
    id: string;
    name: string;
    display: boolean
}

export interface Override {
    id: string;
    expansion: boolean;
}

export interface Overrides {
    bases: string[];
    expansions: string[];
  }
