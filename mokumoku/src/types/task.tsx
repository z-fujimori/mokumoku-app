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
    interval: number,
    limit_time: number,
    consecutive_record: number,
    record_high: number
}

export type Task = {
    id: number,
    name: string,
    assignment: number,
    service: string,
    interval: number,
    limit_time: number,
    consecutive_record: number,
    record_high: number
}

export const Service: Record<string, string> = {
    "h": "時間",
    "p": "ページ",
    "ｺ": "個",
    "-": "",
};
