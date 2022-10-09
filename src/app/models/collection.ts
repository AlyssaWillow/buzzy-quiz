import { TextFieldModule } from "@angular/cdk/text-field";
import { stringLength } from "@firebase/util";

export interface GameCollection {
    totalitems: number;
    termsofuse: string | null;
    pubdate: string | null;
    item: BoardGame[];
}

export interface BoardGame {
    objecttype: string | null;
    objectid: string | null;
    subtype: string | null;
    collid: string;
    name: Name;
    sortindex: string | null;
    yearpublished: string | null;
    image: string;
    thumbnail: string | null;
    numplays: number;
    stats: Stats;
    status: Status;
    owner: string;
  }

  export interface Status {
    own: number;
    prevowned: number;
    fortrade: number;
    want: number;
    wanttoplay: number;
    wanttobuy: number;
    wishlist: number;
    preordered: number;
    lastmodified: string | null;
  }

  export interface Stats {
    minplayers: string|null; 
    maxplayers: string; 
    minplaytime: string; 
    maxplaytime: string; 
    playingtime: string; 
    numowned: string; 
    rating: Rating;
  }

  export interface Rating {
    rating: string | null;
    usersrated: string | null;
    average: string | null;
    bayesaverage: string | null;
    stddev: string | null;
    median: string | null;
    ranks: Rank[];
  }

export interface Rank {
    type: string | null;
    id: number
    name: string | null;
    friendlyname: string
    value: number;
    bayesaverage: number;
}

interface Name {
  text: string;
  sortorder: number
}

export interface textId {
  text: string;
  objectid: string;
}

export interface AllBoardGames {
    termsofuse: string | null;
    boardgame: AllBoardGame[];
}

export interface AllBoardGame {
  age: number;
  boardgameaccessor: textId[];
  boardgameartist: textId[];
  boardgamecategory: textId[];
  boardgamedesigner: textId[];
  boardgameexpansion: textId[];
  boardgamefamily: textId | textId[];
  boardgamehonor: textId[];
  boardgameimplementation: Inbound;
  boardgamemechanic: textId[];
  boardgamepodcastepisode: textId[];
  boardgamepublisher: textId[];
  boardgamesubdomain: textId;
  boardgameversion: textId[]
  commerceweblink: textId;
  description: string; 
  image: string;
  maxplayers: number; 
  maxplaytime: number;
  minplayers: number;
  minplaytime: number
  name: Name[];
  objectid: string;
  playingtime: number;
  poll: Poll[];
  thumbnail: string;
  videogamebg: textId;
  yearpublished: number;
}

interface BoardGameExpansion {
  text: string;
  objectid: string;
}

interface Poll {
  name: string;
  results: Result[];
  title: string;
  totalvotes: string;
}

interface Result {
  level: string; 
  value: string;
  numvotes: string;
}

interface Inbound {text: string, objectid: string, inbound: string}