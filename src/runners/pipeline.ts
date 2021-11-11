import { PipelineTask, PipelineTasksRunner, RunPipelineTasksResult } from './types'

export function createPipelineTasksRunner<T> (...tasks: PipelineTask<T>[]): PipelineTasksRunner<T> {
  return {
    tasks,
    pendingTasks: [],
    status: 'standby',
    runnerFirstArgCache: undefined
  }
}

export async function runPipelineTasks<T> (taskRunner: PipelineTasksRunner<T>, firstArg: T): RunPipelineTasksResult<T> {
  // add all tasks to the pending tasks list on first run
  if (taskRunner.status === 'standby') {
    taskRunner.runnerFirstArgCache = firstArg
    taskRunner.status = 'pending'
  } else {
    firstArg = taskRunner.runnerFirstArgCache as T
  }

  // lastResult need as next task argument
  let lastResult: T = firstArg
  const taskIterator = iterateTasks<T>(taskRunner, lastResult)

  let nextTask = taskIterator.next()
  while (!nextTask.done) {
    try {
      // run tasks one by one
      lastResult = await nextTask.value
    } catch (error) {
      // if task failed, the runner stops pending tasks
      taskRunner.status = 'rejected'
      return Promise.reject(error)
    }

    nextTask = taskIterator.next(lastResult)
  }

  taskRunner.status = 'fulfilled'
  return Promise.resolve(lastResult)
}

function* iterateTasks<T> (taskRunner: PipelineTasksRunner<T>, firstArg: T): Generator<Promise<T>> {
  // lastResult need as next task argument
  let lastResult: T = firstArg
  for (let i = 0; i < taskRunner.tasks.length; i++) {
    // start pending the task if it's not already pending
    if (!(i in taskRunner.pendingTasks)) {
      taskRunner.pendingTasks.push(taskRunner.tasks[i](lastResult))
    }

    lastResult = (yield taskRunner.pendingTasks[i]) as unknown as T
  }
}

export async function getPipelineTask<T> (taskRunner: PipelineTasksRunner<T>, index: number): Promise<T> {
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
  let lastResult: T = taskRunner.runnerFirstArgCache as T
  const taskIterator = iterateTasks<T>(taskRunner, lastResult)
  for (let i = 0; i < index; i++) {
    try {
      // run tasks one by one
      const nextTask = taskIterator.next(lastResult)
      lastResult = await nextTask.value
    } catch {
      return Promise.reject(new Error('Task failed before reach'))
    }
  }

  return taskIterator.next().value
}
