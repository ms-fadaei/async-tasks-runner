import { PipelineTask, PipelineTasksRunner, RunPipelineTasksResult } from './types';

export function createPipelineTasksRunner<T>(...tasks: PipelineTask<T>[]): PipelineTasksRunner<T> {
  return Object.create(null, {
    tasks: {
      value: tasks,
    },
    pendingTasks: {
      value: new WeakMap(),
    },
    executeCount: {
      value: 0,
      writable: true,
    },
    status: {
      value: 'standby',
      writable: true,
    },
    runnerFirstArgCache: {
      value: undefined,
      writable: true,
    },
  });
}

export async function runPipelineTasks<T>(taskRunner: PipelineTasksRunner<T>, firstArg: T): RunPipelineTasksResult<T> {
  taskRunner.status = 'pending';
  const currentExecuteCount = ++taskRunner.executeCount;

  // The difference in the firstArg cause to start the runner from the beginning
  let forceReRun = false;
  if (taskRunner.runnerFirstArgCache !== firstArg) {
    taskRunner.runnerFirstArgCache = firstArg;
    forceReRun = true;
  }

  // Iterate the tasks with serial-iterator
  let lastResult: T = firstArg;
  const taskIterator = iterateTasks<T>(taskRunner, lastResult, forceReRun);

  let nextTask = taskIterator.next();
  while (!nextTask.done) {
    try {
      // run tasks one by one
      lastResult = await nextTask.value;
    } catch (error) {
      // If this is the result of the last run, then set the state
      if (currentExecuteCount === taskRunner.executeCount) {
        taskRunner.status = 'rejected';
      }

      // If task failed, the runner stops pending tasks
      return Promise.reject(error);
    }

    nextTask = taskIterator.next(lastResult);
  }

  // If this is the result of the last run, then set the state
  if (currentExecuteCount === taskRunner.executeCount) {
    taskRunner.status = 'fulfilled';
  }
  return Promise.resolve(lastResult);
}

function* iterateTasks<T>(taskRunner: PipelineTasksRunner<T>, firstArg: T, forceReRun = false): Generator<Promise<T>> {
  // lastResult need as next task argument
  let lastResult: T = firstArg;

  // Creating a clone from tasks to get every run separate
  // and keep a reference for each task until the end because of WeakMap
  const tasksClone = [...taskRunner.tasks];
  for (let i = 0; i < tasksClone.length; i++) {
    // start pending the task if it's not already pending
    if (!taskRunner.pendingTasks.has(tasksClone[i]) || forceReRun) {
      forceReRun = true;
      taskRunner.pendingTasks.set(tasksClone[i], tasksClone[i](lastResult));
    }

    lastResult = (yield taskRunner.pendingTasks.get(tasksClone[i]) as Promise<T>) as unknown as T;
  }
}

export async function getPipelineTasks<T>(taskRunner: PipelineTasksRunner<T>, index: number): Promise<T> {
  if (taskRunner.status === 'standby') {
    return Promise.reject(new Error('Task runner is not yet started'));
  }

  // show error if the index is out of bounds
  if (index < 0 || index >= taskRunner.tasks.length) {
    return Promise.reject(new Error('Index out of bounds'));
  }

  // Task already executed
  const task = taskRunner.tasks[index];
  if (taskRunner.pendingTasks.has(task)) {
    return taskRunner.pendingTasks.get(task) as Promise<T>;
  }

  // At this point, the task is not executed yet.
  // Running the tasks one by one until the index is reached.
  let lastResult: T = taskRunner.runnerFirstArgCache as T;
  const taskIterator = iterateTasks<T>(taskRunner, lastResult, false);
  for (let i = 0; i < index; i++) {
    try {
      const nextTask = taskIterator.next(lastResult);
      lastResult = await nextTask.value;
    } catch {
      return Promise.reject(new Error('Task failed before reach'));
    }
  }

  return taskIterator.next().value;
}
