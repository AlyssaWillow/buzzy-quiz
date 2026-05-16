export interface category {
    categoryCode: string;
    categoryName: string;
    description: string;
    questions: question[];
}

export interface question {
    number: number;
    points: number;
    question: string;
    answer: string;
}

export interface activeQuestion {
    number: number;
    question: question;
    gameId: string;
}