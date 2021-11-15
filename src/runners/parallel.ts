import { ParallelTask, ParallelTasksRunner, RunParallelTasksResult } from './types'

export function createParallelTasksRunner<T> (...tasks: ParallelTask<T>[]): ParallelTasksRunner<T> {
  return {
    tasks,
    pendingTasks: new WeakMap(),
    executeCount: 0,
    status: 'standby'
  }
}

export function runParallelTasks<T> (taskRunner: ParallelTasksRunner<T>): RunParallelTasksResult<T> {
  taskRunner.status = 'pending'
  const currentExecuteCount = ++taskRunner.executeCount

  const executedTasks = taskRunner.tasks.map((task) => {
    // Just for new tasks added to the runner
    if (!taskRunner.pendingTasks.has(task)) {
      taskRunner.pendingTasks.set(task, task())
    }

    return taskRunner.pendingTasks.get(task) as Promise<T>
  })

  return Promise.allSettled(executedTasks)
    .then((results) => {
      // If this is the result of the last run, then set the state
      if (currentExecuteCount === taskRunner.executeCount) {
        taskRunner.status = 'fulfilled'
      }

      return results
    })
}

export function getParallelTasks<T> (taskRunner: ParallelTasksRunner<T>, index: number): Promise<T> {
  if (taskRunner.status === 'standby') {
    return Promise.reject(new Error('Task runner not yet started'))
  }

  if (index < 0 || index >= taskRunner.tasks.length) {
    return Promise.reject(new Error('Index out of bounds'))
  }

  const task = taskRunner.tasks[index]
  if (!taskRunner.pendingTasks.has(task)) {
    return Promise.reject(new Error('Run the runner again after modifications'))
  }

  return taskRunner.pendingTasks.get(task) as Promise<T>
}
