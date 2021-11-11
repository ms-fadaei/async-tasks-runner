import { Task, ParallelTasksRunner, RunParallelTasksResult } from './types'

export function createParallelTasksRunner (...tasks: Task[]): ParallelTasksRunner {
  const _tasks = tasks
  const _pendingTasks:Promise<unknown>[] = []
  const _status = 'load'

  return {
    tasks: _tasks,
    pendingTasks: _pendingTasks,
    status: _status
  }
}

export function runParallelTasks (taskRunner: ParallelTasksRunner): RunParallelTasksResult {
  // add all tasks to the pending tasks list on first run
  if (taskRunner.status === 'load') {
    taskRunner.status = 'pending'
    taskRunner.pendingTasks = taskRunner.tasks.map(task => task())
  }

  return Promise.allSettled(taskRunner.pendingTasks)
    .then((results) => {
      taskRunner.status = 'fulfilled'
      return results
    })
}

export function getParallelTask (taskRunner: ParallelTasksRunner, index: number): Promise<unknown> {
  if (taskRunner.status === 'load') {
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
