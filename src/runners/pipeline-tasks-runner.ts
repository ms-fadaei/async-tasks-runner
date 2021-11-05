import { PipelineTask, RunPipelineTaskResult } from "./types.ts";
import { BaseTasksRunner } from "./base-tasks-runner.ts";

export type { RunPipelineTaskResult } from "./types.ts";

export class PipelineTasksRunner<T> extends BaseTasksRunner<T> {
  protected tasks: PipelineTask<T>[];

  constructor() {
    super();
    this.tasks = [];
  }

  public addTask(...tasks: PipelineTask<T>[]): number {
    if (this.status !== "open") {
      throw new Error("task runner is not open to add new task");
    }

    return this.tasks.push(...tasks) - 1;
  }

  public async runTasks(firstArg: T): RunPipelineTaskResult<T> {
    // add all tasks to the running tasks list on first run
    if (this.status === "open") {
      this.status = "pending";
    }

    // lastResult need as next task argument
    let lastResult: T = firstArg;

    for (let i = 0; i < this.tasks.length; i++) {
      try {
        // add task to running tasks list if it's not in the list
        if (!(i in this.runningTasks)) {
          this.runningTasks.push(this.tasks[i](lastResult));
        }

        // run tasks one by one
        lastResult = await this.runningTasks[i];
      } catch (error) {
        // if task failed, the runner stops running tasks
        this.status = "rejected";
        return Promise.reject(error);
      }
    }

    this.status = "fulfilled";
    return Promise.resolve(lastResult);
  }
}
