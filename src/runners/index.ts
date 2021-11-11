import { Task, TasksRunner } from './types'

export function addTask (taskRunner: TasksRunner, ...tasks: Task[]) {
  // can't add tasks if the runner is closed
  if (taskRunner.status === 'load') {
    return taskRunner.tasks.push(...tasks) - 1
  }

  return -1
}

export function removeTask (taskRunner: TasksRunner, start: number, count: number) {
  // can't remove tasks if the runner is closed
  if (taskRunner.status === 'load') {
    return taskRunner.tasks.splice(start, count)
  }

  return []
}

export function resetTasksRunner (taskRunner: TasksRunner) {
  // can't remove tasks if the runner is closed
  if (taskRunner.status !== 'pending') {
    taskRunner.pendingTasks = []
    taskRunner.status = 'load'
  }
}
