import {
  PipelineTask,
  RunParallelTasksResult,
  RunPipelineTaskResult,
  RunSerialTasksResult,
  Task,
  TaskRunnerStatus
} from './types'

export type { Task, TaskRunnerStatus } from './types'

export abstract class BaseTasksRunner<T> {
  protected abstract tasks: Task<T>[] | PipelineTask<T>[];
  protected runningTasks: Promise<T>[];
  private _status: TaskRunnerStatus;

  constructor () {
    this.runningTasks = []
    this._status = 'open'
  }

  public get status (): TaskRunnerStatus {
    return this._status
  }

  protected set status (status: TaskRunnerStatus) {
    this._status = status
  }

  public add (...tasks: Task<T>[]): number {
    // can't add tasks if the runner is closed
    if (this.status === 'open') {
      return this.tasks.push(...tasks) - 1
    }

    return -1
  }

  public remove (start: number, count = 1): Task<T>[] {
    // can't remove tasks if the runner is closed
    if (this.status === 'open') {
      return this.tasks.splice(start, count)
    }

    return []
  }

  public reset (): this {
    if (this.status !== 'pending') {
      this.runningTasks = []
      this.status = 'open'
    }

    return this
  }

  public abstract run(
    firstArg?: T,
  ): RunParallelTasksResult<T> | RunSerialTasksResult<T> | RunPipelineTaskResult<T>;

  public abstract get(index: number): Promise<T>;
}
