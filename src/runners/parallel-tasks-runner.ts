import { RunParallelTasksResult, Task } from "./types.ts";
import { BaseTasksRunner } from "./base-tasks-runner.ts";

export type { RunParallelTasksResult } from "./types.ts";

export class ParallelTasksRunner<T> extends BaseTasksRunner<T> {
  protected tasks: Task<T>[];

  constructor() {
    super();
    this.tasks = [];
  }

  public async runTasks(): RunParallelTasksResult<T> {
    // add all tasks to the running tasks list on first run
    if (this.status === "open") {
      this.status = "pending";
      this.runningTasks = this.tasks.map((task) => task());
    }

    const results = await Promise.allSettled(this.runningTasks);
    this.status = "fulfilled";

    return Promise.resolve(results);
  }
}
