import { PipelineTask, RunPipelineTaskResult } from './types'
import { BaseTasksRunner } from './base-tasks-runner'

export type { RunPipelineTaskResult } from './types'

export class PipelineTasksRunner<T> extends BaseTasksRunner<T> {
  protected tasks: PipelineTask<T>[]
  private firstArgCache: T | undefined

  constructor (...tasks: PipelineTask<T>[]) {
    super()
    this.tasks = tasks
    this.firstArgCache = undefined
  }

  public add (...tasks: PipelineTask<T>[]): number {
    // can't add tasks if the runner is closed
    if (this.status === 'load') {
      return this.tasks.push(...tasks) - 1
    }

    return -1
  }

  public remove (start: number, count = 1): PipelineTask<T>[] {
    // can't remove tasks if the runner is closed
    if (this.status === 'load') {
      return this.tasks.splice(start, count)
    }

    return []
  }

  public async run (firstArg: T): RunPipelineTaskResult<T> {
    // add all tasks to the pending tasks list on first run
    if (this.status === 'load') {
      this.firstArgCache = firstArg
      this.status = 'pending'
    } else {
      firstArg = this.firstArgCache as T
    }

    // lastResult need as next task argument
    let lastResult: T = firstArg
    const taskIterator = this.iterateTasks(lastResult)

    let nextTask = taskIterator.next()
    while (!nextTask.done) {
      try {
        // run tasks one by one
        lastResult = await nextTask.value
      } catch (error) {
        // if task failed, the runner stops pending tasks
        this.status = 'rejected'
        return Promise.reject(error)
      }

      nextTask = taskIterator.next(lastResult)
    }

    this.status = 'fulfilled'
    return Promise.resolve(lastResult)
  }

  private * iterateTasks (firstArg: T): Generator<Promise<T>> {
    // lastResult need as next task argument
    let lastResult: T = firstArg
    for (let i = 0; i < this.tasks.length; i++) {
      // start pending the task if it's not already pending
      if (!(i in this.pendingTasks)) {
        this.pendingTasks.push(this.tasks[i](lastResult))
      }

      lastResult = (yield this.pendingTasks[i]) as unknown as T
    }
  }

  public async get (index: number): Promise<T> {
    if (this.status === 'load') {
      return Promise.reject(new Error('Task runner is not yet started'))
    }

    // show error if the index is out of bounds
    if (index < 0 || index >= this.tasks.length) {
      return Promise.reject(new Error('Index out of bounds'))
    }

    // return the task if it's already pending
    if (index in this.pendingTasks) {
      return this.pendingTasks[index]
    }

    // run tasks one by one until the index is reached
    let lastResult: T = this.firstArgCache as T
    const taskIterator = this.iterateTasks(lastResult)
    for (let i = 0; i < index; i++) {
      try {
        // run tasks one by one
        const nextTask = taskIterator.next(lastResult)
        lastResult = await nextTask.value
      } catch {
        return Promise.reject(new Error('Task failed before reach'))
      }
    }

    return taskIterator.next().value
  }
}
