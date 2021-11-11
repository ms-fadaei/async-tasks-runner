export type TaskRunnerStatus = 'standby' | 'pending' | 'fulfilled' | 'rejected';

export type Task<T> = () => Promise<T>;
export type PipelineTask<T> = (perviousResult?: T) => Promise<T>;

export interface TasksRunner<T> {
    tasks: Task<T>[],
    pendingTasks: Promise<T>[],
    status: TaskRunnerStatus,
}

export interface ParallelTasksRunner<T> extends TasksRunner<T> {}
export interface SerialTasksRunner<T> extends TasksRunner<T>{}
export interface PipelineTasksRunner<T> extends TasksRunner<T> {
    tasks: PipelineTask<T>[],
    pendingTasks: Promise<T>[],
    runnerFirstArgCache: T | undefined,
}

export type RunParallelTasksResult<T> = Promise<PromiseSettledResult<T>[]>;
export type RunSerialTasksResult<T> = Promise<PromiseSettledResult<T>[]>;
export type RunPipelineTasksResult<T> = Promise<T>;
