import { SerialTask, SerialTasksRunner, RunSerialTasksResult } from './types'

export function createSerialTasksRunner<T> (...tasks: SerialTask<T>[]): SerialTasksRunner<T> {
  return {
    tasks,
    pendingTasks: new WeakMap(),
    executeCount: 0,
    status: 'standby'
  }
}

export async function runSerialTasks<T> (taskRunner: SerialTasksRunner<T>): RunSerialTasksResult<T> {
  taskRunner.status = 'pending'
  const currentExecuteCount = ++taskRunner.executeCount
  const results: PromiseSettledResult<T>[] = []
  const taskIterator = iterateTasks<T>(taskRunner)

  // Iterate the tasks with serial-iterator
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
      // If this is the result of the last run, then set the state
      if (currentExecuteCount === taskRunner.executeCount) {
        taskRunner.status = 'rejected'
      }

      // If task failed, the runner stops pending tasks
      results.push({
        status: 'rejected',
        reason: error
      })
      return Promise.reject(results)
    }

    // If this is the result of the last run, then set the state
    if (currentExecuteCount === taskRunner.executeCount) {
      taskRunner.status = 'fulfilled'
    }
    nextTask = taskIterator.next()
  }

  // If this is the result of the last run, then set the state
  if (currentExecuteCount === taskRunner.executeCount) {
    taskRunner.status = 'fulfilled'
  }
  return Promise.resolve(results)
}

function * iterateTasks<T> (taskRunner: SerialTasksRunner<T>): Generator<Promise<T>> {
  // Creating a clone from tasks to get every run separate
  // and keep a reference for each task until the end because of WeakMap
  const tasksClone = [...taskRunner.tasks]
  for (let i = 0; i < tasksClone.length; i++) {
    if (!taskRunner.pendingTasks.has(tasksClone[i])) {
      taskRunner.pendingTasks.set(tasksClone[i], tasksClone[i]())
    }

    yield taskRunner.pendingTasks.get(tasksClone[i]) as Promise<T>
  }
}

export async function getSerialTasks<T> (taskRunner: SerialTasksRunner<T>, index: number): Promise<T> {
  if (taskRunner.status === 'standby') {
    return Promise.reject(new Error('Task runner is not yet started'))
  }

  if (index < 0 || index >= taskRunner.tasks.length) {
    return Promise.reject(new Error('Index out of bounds'))
  }

  // Task already executed
  const task = taskRunner.tasks[index]
  if (taskRunner.pendingTasks.has(task)) {
    return taskRunner.pendingTasks.get(task) as Promise<T>
  }

  // At this point, the task is not executed yet.
  // Running the tasks one by one until the index is reached.
  const taskIterator = iterateTasks(taskRunner)
  for (let i = 0; i < index; i++) {
    try {
      const nextTask = taskIterator.next()
      await nextTask.value
    } catch {
      return Promise.reject(new Error('Task failed before reach'))
    }
  }

  return taskIterator.next().value
}
