import { Task, TasksRunner } from './types'

export function pushTasks<T> (taskRunner: TasksRunner<T>, ...tasks: Task<T>[]): number {
  // https://mdn.io/JavaScript/Reference/Global_Objects/Array/push
  return taskRunner.tasks.push(...tasks) - 1
}

export function spliceTasks<T> (taskRunner: TasksRunner<T>, start: number, deleteCount?: number, ...tasks: Task<T>[]): Task<T>[] {
  // https://mdn.io/JavaScript/Reference/Global_Objects/Array/splice
  if (typeof deleteCount === 'undefined') {
    return taskRunner.tasks.splice(start)
  } else {
    return taskRunner.tasks.splice(start, deleteCount, ...tasks)
  }
}
