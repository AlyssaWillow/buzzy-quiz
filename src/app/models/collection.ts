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
    collid: string | null;
    name: Name;
    sortindex: string | null;
    yearpublished: string | null;
    image: string | null;
    thumbnail: string | null;
    numplays: number;
    stats: Stats;
    status: Status;
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
  text: string | null;
  sortorder: number
}