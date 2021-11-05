import { RunSerialTasksResult, Task } from "./types.ts";
import { BaseTasksRunner } from "./base-tasks-runner.ts";

export type { RunSerialTasksResult } from "./types.ts";

export class SerialTasksRunner<T> extends BaseTasksRunner<T> {
  protected tasks: Task<T>[];

  constructor() {
    super();
    this.tasks = [];
  }

  public async runTasks(): RunSerialTasksResult<T> {
    // add all tasks to the running tasks list on first run
    if (this.status === "open") {
      this.status = "pending";
    }

    const results: PromiseSettledResult<T>[] = [];

    for (let i = 0; i < this.tasks.length; i++) {
      // add task to running tasks list if it's not in the list
      if (!(i in this.runningTasks)) {
        this.runningTasks.push(this.tasks[i]());
      }

      try {
        // run tasks one by one
        const result = await this.runningTasks[i];
        results.push({
          status: "fulfilled",
          value: result,
        });
      } catch (error) {
        // if task failed, the runner stops running tasks
        this.status = "rejected";
        results.push({
          status: "rejected",
          reason: error.message || error,
        });
        return Promise.reject(results);
      }
    }

    this.status = "fulfilled";
    return Promise.resolve(results);
  }
}
