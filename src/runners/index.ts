import { Task, TasksRunner } from './types'

export function addTask<T> (taskRunner: TasksRunner<T>, ...tasks: Task<T>[]): number {
  // can't add tasks if the runner is closed
  if (taskRunner.status === 'standby') {
    return taskRunner.tasks.push(...tasks) - 1
  }

  return -1
}

export function removeTask<T> (taskRunner: TasksRunner<T>, start: number, count: number): Task<T>[] {
  // can't remove tasks if the runner is closed
  if (taskRunner.status === 'standby') {
    return taskRunner.tasks.splice(start, count)
  }

  return []
}

export function resetTasksRunner<T> (taskRunner: TasksRunner<T>): void {
  // can't remove tasks if the runner is closed
  if (taskRunner.status !== 'pending') {
    taskRunner.pendingTasks = []
    taskRunner.status = 'standby'
  }
}
