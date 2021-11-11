import { Task, SerialTasksRunner, RunSerialTasksResult } from './types'

export function createSerialTasksRunner<T> (...tasks: Task<T>[]): SerialTasksRunner<T> {
  const _tasks = tasks
  const _pendingTasks:Promise<T>[] = []
  const _status = 'standby'

  return {
    tasks: _tasks,
    pendingTasks: _pendingTasks,
    status: _status
  }
}

export async function runSerialTasks<T> (taskRunner: SerialTasksRunner<T>): RunSerialTasksResult<T> {
  // add all tasks to the pending tasks list on first run
  if (taskRunner.status === 'standby') {
    taskRunner.status = 'pending'
  }

  const results: PromiseSettledResult<T>[] = []
  const taskIterator = iterateTasks<T>(taskRunner)

  let nextTask = taskIterator.next()
  while (!nextTask.done) {
    try {
      // run tasks one by one
      const result = await nextTask.value
      results.push({
        status: 'fulfilled',
        value: result
      })
    } catch (error) {
      // if task failed, the runner stops pending tasks
      taskRunner.status = 'rejected'
      results.push({
        status: 'rejected',
        reason: error
      })
      return Promise.reject(results)
    }

    nextTask = taskIterator.next()
  }

  taskRunner.status = 'fulfilled'
  return Promise.resolve(results)
}

function* iterateTasks<T> (taskRunner: SerialTasksRunner<T>): Generator<Promise<T>> {
  for (let i = 0; i < taskRunner.tasks.length; i++) {
    // start pending the task if it's not already pending
    if (!(i in taskRunner.pendingTasks)) {
      taskRunner.pendingTasks.push(taskRunner.tasks[i]())
    }

    yield taskRunner.pendingTasks[i]
  }
}

export async function getSerialTask<T> (taskRunner: SerialTasksRunner<T>, index: number): Promise<unknown> {
  if (taskRunner.status === 'standby') {
    return Promise.reject(new Error('Task runner is not yet started'))
  }

  // show error if the index is out of bounds
  if (index < 0 || index >= taskRunner.tasks.length) {
    return Promise.reject(new Error('Index out of bounds'))
  }

  // return the task if it's already pending
  if (index in taskRunner.pendingTasks) {
    return taskRunner.pendingTasks[index]
  }

  // run tasks one by one until the index is reached
  const taskIterator = iterateTasks(taskRunner)
  for (let i = 0; i < index; i++) {
    try {
      // run tasks one by one
      const nextTask = taskIterator.next()
      await nextTask.value
    } catch {
      return Promise.reject(new Error('Task failed before reach'))
    }
  }

  return taskIterator.next().value
}
