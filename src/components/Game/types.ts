export enum Key {
    Up = "ArrowUp",
    Down = "ArrowDown",
    Left = "ArrowLeft",
    Right = "ArrowRight",
    Enter = "Enter",
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
    RED_BUTTON = "Red button",
    STATUS = "Status",
}

export const type_exclude = [MinigameType.VERTEX_COUNT]
