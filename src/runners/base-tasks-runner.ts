import {
  PipelineTask,
  RunParallelTasksResult,
  RunPipelineTaskResult,
  RunSerialTasksResult,
  Task,
  TaskRunnerStatus,
} from "./types.ts";

export type { Task, TaskRunnerStatus } from "./types.ts";

export abstract class BaseTasksRunner<T> {
  protected abstract tasks: Task<T>[] | PipelineTask<T>[];
  protected runningTasks: Promise<T>[];
  private _status: TaskRunnerStatus;

  constructor() {
    this.runningTasks = [];
    this._status = "open";
  }

  public get status(): TaskRunnerStatus {
    return this._status;
  }

  protected set status(status: TaskRunnerStatus) {
    this._status = status;
  }

  public addTask(...tasks: Task<T>[]): number {
    // can't add tasks if the runner is closed
    if (this.status === "open") {
      return this.tasks.push(...tasks) - 1;
    }

    return -1;
  }

  public abstract runTasks(
    firstArg?: T,
  ): RunParallelTasksResult<T> | RunSerialTasksResult<T> | RunPipelineTaskResult<T>;

  public abstract getRunningTask(index: number): Promise<T>;
}
