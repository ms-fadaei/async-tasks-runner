import { PipelineTask, RunPipelineTaskResult } from "./types.ts";
import { BaseTasksRunner } from "./base-tasks-runner.ts";

export type { RunPipelineTaskResult } from "./types.ts";

export class PipelineTasksRunner<T> extends BaseTasksRunner<T> {
  protected tasks: PipelineTask<T>[];
  private firstArgCache: T | undefined;

  constructor(...tasks: PipelineTask<T>[]) {
    super();
    this.tasks = tasks;
    this.firstArgCache = undefined;
  }

  public add(...tasks: PipelineTask<T>[]): number {
    if (this.status !== "open") {
      throw new Error("task runner is not open to add new task");
    }

    return this.tasks.push(...tasks) - 1;
  }

  public async run(firstArg: T): RunPipelineTaskResult<T> {
    // add all tasks to the running tasks list on first run
    if (this.status === "open") {
      this.firstArgCache = firstArg;
      this.status = "pending";
    } else {
      firstArg = this.firstArgCache as T;
    }

    // lastResult need as next task argument
    let lastResult: T = firstArg;
    const taskIterator = this.iterateTasks(lastResult);

    let nextTask = taskIterator.next();
    while (!nextTask.done) {
      try {
        // run tasks one by one
        lastResult = await nextTask.value;
      } catch (error) {
        // if task failed, the runner stops running tasks
        this.status = "rejected";
        return Promise.reject(error);
      }

      nextTask = taskIterator.next(lastResult);
    }

    this.status = "fulfilled";
    return Promise.resolve(lastResult);
  }

  private * iterateTasks(firstArg: T): Generator<Promise<T>> {
    // lastResult need as next task argument
    let lastResult: T = firstArg;
    for (let i = 0; i < this.tasks.length; i++) {
      // start running the task if it's not already running
      if (!(i in this.runningTasks)) {
        this.runningTasks.push(this.tasks[i](lastResult));
      }

      lastResult = (yield this.runningTasks[i]) as unknown as T;
    }
  }

  public async get(index: number): Promise<T> {
    if (this.status === "open") {
      return Promise.reject(new Error("Task runner is open"));
    }

    // show error if the index is out of bounds
    if (index < 0 || index >= this.tasks.length) {
      return Promise.reject(new Error("Index out of bounds"));
    }

    // return the task if it's already running
    if (index in this.runningTasks) {
      return this.runningTasks[index];
    }

    // run tasks one by one until the index is reached
    let lastResult: T = this.firstArgCache as T;
    const taskIterator = this.iterateTasks(lastResult);
    for (let i = 0; i < index; i++) {
      try {
        // run tasks one by one
        const nextTask = taskIterator.next(lastResult);
        lastResult = await nextTask.value;
      } catch {
        return Promise.reject(new Error("Task not reached"));
      }
    }

    return taskIterator.next().value;
  }
}
