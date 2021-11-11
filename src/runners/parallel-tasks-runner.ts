import { RunParallelTasksResult, Task } from './types'
import { BaseTasksRunner } from './base-tasks-runner'

export type { RunParallelTasksResult } from './types'

export class ParallelTasksRunner<T> extends BaseTasksRunner<T> {
  protected tasks: Task<T>[]

  constructor (...tasks: Task<T>[]) {
    super()
    this.tasks = tasks
  }

  public run (): RunParallelTasksResult<T> {
    // add all tasks to the pending tasks list on first run
    if (this.status === 'load') {
      this.status = 'pending'
      this.pendingTasks = this.tasks.map(task => task())
    }

    return Promise.allSettled(this.pendingTasks)
      .then((results) => {
        this.status = 'fulfilled'
        return results
      })
  }

  public get (index: number): Promise<T> {
    if (this.status === 'load') {
      return Promise.reject(new Error('Task runner not yet started'))
    }

    // show error if the index is out of bounds
    if (index < 0 || index >= this.tasks.length) {
      return Promise.reject(new Error('Index out of bounds'))
    }

    // return the task if it's already pending
    // because of parallel pattern, we sure there is pending task here
    return this.pendingTasks[index]
  }
}
