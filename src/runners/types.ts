export type TasksRunnerStatus = 'standby' | 'pending' | 'fulfilled' | 'rejected';

export type NormalTask<T> = () => Promise<T>;
export type PipelineTask<T> = (perviousResult: T) => Promise<T>;
export type Task<T> = NormalTask<T> | PipelineTask<T>

export interface TasksRunner<T> {
    tasks: Task<T>[],
    pendingTasks: Promise<T>[],
    status: TasksRunnerStatus,
}

export interface ParallelTasksRunner<T> extends TasksRunner<T> {
    tasks: NormalTask<T>[],
}
export interface SerialTasksRunner<T> extends TasksRunner<T>{
    tasks: NormalTask<T>[],
}
export interface PipelineTasksRunner<T> extends TasksRunner<T> {
    tasks: PipelineTask<T>[],
    runnerFirstArgCache: T | undefined,
}

export type RunParallelTasksResult<T> = Promise<PromiseSettledResult<T>[]>;
export type RunSerialTasksResult<T> = Promise<PromiseSettledResult<T>[]>;
export type RunPipelineTasksResult<T> = Promise<T>;
