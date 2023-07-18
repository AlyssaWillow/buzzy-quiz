import { Timestamp } from "./play";

export interface GameGroups {
    id: string;
    name: string;
    members: string[];
}

export interface GameGroupEvent {
  id: string;
  groupId: string;
  eventName: string;
  startDate: Timestamp;
  endDate: Timestamp;
}

export interface IdsPlayerCollections {
    distinctCollections: string[];
    collectionGroups: PlayerCollectionGroups[];
  }
  export interface PlayerCollectionGroups {
    collection: string[];
    id: string;
    associatedPlayers: string[];
  }
  export interface PlayerCollectionGroup {
    collection: string;
    associatedPlayers: string[];
  }

  export interface CollectionGroups {
    value: string;
    viewValue: string;
  }