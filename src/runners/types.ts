export type TaskRunnerStatus = 'open' | 'pending' | 'fulfilled' | 'rejected';
export type Task<T> = () => Promise<T>;
export type PipelineTask<T> = (perviousResult?: T) => Promise<T>;
export type RunParallelTasksResult<T> = Promise<PromiseSettledResult<T>[]>;
export type RunSerialTasksResult<T> = Promise<PromiseSettledResult<T>[]>;
export type RunPipelineTaskResult<T> = Promise<T>;
