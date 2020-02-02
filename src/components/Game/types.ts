export enum Key {
    Up = "ArrowUp",
    Down = "ArrowDown",
    Left = "ArrowLeft",
    Right = "ArrowRight",
    W = "w",
    S = "s",
    D = "d",
    A = "a",
}


export enum MinigameType {
    SIMON_SAYS = "Simon Says",
    JIGSAW_PUZZLE = "Jigsaw Puzzle",
    VERTEX_COUNT = "Vertex Count",
    VERTEX_COUNT_REAL = "Vertex Count Real",
}

export const type_exclude = [MinigameType.VERTEX_COUNT]
