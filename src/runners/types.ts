export type TaskRunnerStatus = 'standby' | 'pending' | 'fulfilled' | 'rejected';

export type Task = () => Promise<unknown>;
export type PipelineTask<T> = (perviousResult?: T) => Promise<T>;

export interface TasksRunner {
    tasks: Task[],
    pendingTasks: Promise<unknown>[],
    status: TaskRunnerStatus,
}

export interface ParallelTasksRunner extends TasksRunner {}
export interface SerialTasksRunner extends TasksRunner {}
export interface PipelineTasksRunner<T> extends TasksRunner {
    tasks: PipelineTask<T>[],
    pendingTasks: Promise<T>[],
    runnerFirstArgCache: T | undefined,
}

export type RunParallelTasksResult = Promise<PromiseSettledResult<unknown>[]>;
export type RunSerialTasksResult = Promise<PromiseSettledResult<unknown>[]>;
export type RunPipelineTasksResult<T> = Promise<T>;
