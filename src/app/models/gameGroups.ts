export interface GameGroups {
    id: string;
    name: string;
    members: string[];
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