export interface SearchResults {
  boardgames: SearchBoardGame[];
  termsofuse: string;
}

export interface SearchBoardGame {
  id: string;
  yearpublished: yearPublished;
  name: Name2;
}

interface yearPublished {
  value: string;
}

interface Name2 {
  type: string;
  sortindex: number;
  value: string;
}