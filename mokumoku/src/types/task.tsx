export type Add_task = {
    name: string,
    assignment: number,
    service: string,
    interval: number,
    plase: number
}

export type PlaseWithTask = {
    plase_id: number,
    plase: string,
    tree_state_id: number,
    task_id: number,
    name: string,
    assignment: number,
    service: string,
    interval: number
}
