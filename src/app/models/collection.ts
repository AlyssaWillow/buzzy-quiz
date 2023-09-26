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
    bggRank: number;
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

export interface Name2 {
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
  bggRank: number;
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
  statistics: Statistics;
}

interface Ratings {
  usersrated: Value;
  average: Value;
  bayesaverage: Value;
  ranks: RankHolder;
  stddev: Value;
  median: Value;
  owned: Value;
  trading: Value;
  wanting: Value;
  wishing: Value;
  numcomments: Value;
  numweights: Value;
  averageweight: Value;
}

interface RankHolder {
  rank: Rank[];
}

interface Statistics {
  page: string;
  ratings: Ratings
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

export interface displayLists {
  header: displayHeader[];
  content: ListContent[];
}


export interface displayHeader {
  order: number;
  playerId: string;
}

export interface ListContent {
  rank: number;
  selections: Selections[];
}

export interface Selections {
  player: displayHeader | undefined;
  gameId: string;
  notes: string;
  previous: number
}

export interface ListType {
  id: string;
  name: string;
}

interface Inbound {text: string, objectid: string, inbound: string}