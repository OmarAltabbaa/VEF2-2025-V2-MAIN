export type UiState = 'initial' | 'loading' | 'error' | 'data' | 'empty'

export type Category = {
    id: number;
    slug: string;
    name: string;
}

export type Paginated<T> = {
    data: T[];
    total: number;
    limit: number;
    offset: number;
};

export type Answer = {
    id: number;
    text: string;
    correct: boolean;
    questionId: number;
};

export type Question = {
    id: number;
    text: string;
    categoryId: number;
    answers: Answer[];
    category: {
        id: number;
        slug: string;
        name: string;
    };
};