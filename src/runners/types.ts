export type TasksRunnerStatus = 'standby' | 'pending' | 'fulfilled' | 'rejected';

export type ParallelTask<T> = () => Promise<T>;
export type SerialTask<T> = () => Promise<T>;
export type PipelineTask<T> = (perviousResult: T) => Promise<T>;
export type Task<T> = ParallelTask<T> | SerialTask<T> | PipelineTask<T>

export interface TasksRunner<T> {
    tasks: Task<T>[],
    pendingTasks: WeakMap<Task<T>, Promise<T>>,
    executeCount: 0,
    status: TasksRunnerStatus,
}

export interface ParallelTasksRunner<T> extends TasksRunner<T> {
    tasks: ParallelTask<T>[],
}
export interface SerialTasksRunner<T> extends TasksRunner<T>{
    tasks: SerialTask<T>[],
}
export interface PipelineTasksRunner<T> extends TasksRunner<T> {
    tasks: PipelineTask<T>[],
    runnerFirstArgCache: T | undefined,
}

export type RunParallelTasksResult<T> = Promise<PromiseSettledResult<T>[]>;
export type RunSerialTasksResult<T> = Promise<PromiseSettledResult<T>[]>;
export type RunPipelineTasksResult<T> = Promise<T>;
