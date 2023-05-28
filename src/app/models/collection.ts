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

export interface Link {
  type: string;
  id: number;
  value: string;
  inbound: boolean;
}

interface Name {
  text: string;
  sortorder: number
}

interface Name2 {
  type: string;
  sortindex: number;
  value: string;
}

export interface textId {
  text: string;
  objectid: string;
}

export interface AllBoardGames {
    termsofuse: string | null;
    item: AllBoardGame[];
}

export interface AllBoardGame {
  id: string;
  image: string;
  description: string; 
  link: Link[];
  maxplayers: Value; 
  maxplaytime: Value;
  minage: Value;
  minplayers: Value;
  minplaytime: Value;
  name: Name2[];
  playingtime: number;
  poll: Poll[];
  thumbnail: string;
  type: string;
  yearpublished: Value;
}

interface Value {
  value: number;
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

export interface ListPlayerGame {
  playerId: string;
  rank: number;
  game: BoardGame;
  previousRank: number;
}

interface Inbound {text: string, objectid: string, inbound: string}