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
    N1 = "1",
    N2 = "2",
    N3 = "3",
    N4 = "4",
    N5 = "5",
    N6 = "6",
    N7 = "7",
    N8 = "8",
    N9 = "9",
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
