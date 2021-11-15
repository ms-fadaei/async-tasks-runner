import { Task, TasksRunner } from './types'

export function pushTasks<T> (taskRunner: TasksRunner<T>, ...tasks: Task<T>[]): number {
  // can't add tasks if the runner is closed
  if (taskRunner.status === 'standby') {
    return taskRunner.tasks.push(...tasks) - 1
  }

  return -1
}

export function spliceTasks<T> (taskRunner: TasksRunner<T>, start: number, count: number, ...tasks: Task<T>[]): Task<T>[] {
  // can't remove tasks if the runner is closed
  if (taskRunner.status === 'standby') {
    return taskRunner.tasks.splice(start, count, ...tasks)
  }

  return []
}

export function resetTasks<T> (taskRunner: TasksRunner<T>): void {
  // can't remove tasks if the runner is closed
  if (taskRunner.status !== 'pending') {
    taskRunner.pendingTasks = []
    taskRunner.status = 'standby'
  }
}
