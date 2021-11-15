import { Task, ParallelTasksRunner, RunParallelTasksResult } from './types'

export function createParallelTasksRunner<T> (...tasks: Task<T>[]): ParallelTasksRunner<T> {
  return {
    tasks,
    pendingTasks: [],
    status: 'standby'
  }
}

export function runParallelTasks<T> (taskRunner: ParallelTasksRunner<T>): RunParallelTasksResult<T> {
  // add all tasks to the pending tasks list on first run
  if (taskRunner.status === 'standby') {
    taskRunner.status = 'pending'
    taskRunner.pendingTasks = taskRunner.tasks.map(task => task())
  }

  return Promise.allSettled(taskRunner.pendingTasks)
    .then((results) => {
      taskRunner.status = 'fulfilled'
      return results
    })
}

export function getParallelTasks<T> (taskRunner: ParallelTasksRunner<T>, index: number): Promise<unknown> {
  if (taskRunner.status === 'standby') {
    return Promise.reject(new Error('Task runner not yet started'))
  }

  // show error if the index is out of bounds
  if (index < 0 || index >= taskRunner.tasks.length) {
    return Promise.reject(new Error('Index out of bounds'))
  }

  // return the task if it's already pending
  // because of parallel pattern, we sure there is pending task here
  return taskRunner.pendingTasks[index]
}
