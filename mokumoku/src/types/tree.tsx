export enum TreeState {
    none = 0,
    seed = 1,  // 種
    sprout = 2,  // 芽
    tree = 3,  // 木
    nut = 4,  // 実
    dead = 5,  // 枯
}

export type Tree = {
    id: number,
    state: TreeState
}

export type GetTime = {
    id: number,
    task_id: number,
    task: string,
    start_time: string,
    end_time: string
}
