import { Task, ParallelTask, SerialTask, PipelineTask } from './runners/types';

export const timeoutResult = Symbol('timeout');

export function createTimeoutResolve<T>(timeout: number, response: T, cancelToken?: Promise<unknown>): Promise<T> {
  // Returning the promise Immediately when cancelToken is not provided
  if (typeof cancelToken === 'undefined') {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout, response);
    });
  }

  // clearing timeout with cancel token
  let timeoutId: ReturnType<typeof setTimeout>;
  const _clearTimeout = () => clearTimeout(timeoutId);
  cancelToken.then(_clearTimeout, _clearTimeout);

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(resolve, timeout, response);
  });

  // Clearing the timeout if the cancel-token promise settled first.
  return Promise.race([timeoutPromise, cancelToken]) as Promise<T>;
}

export function createTimeoutReject<T>(timeout: number, error: T, cancelToken?: Promise<unknown>): Promise<T> {
  // Returning the promise Immediately when cancelToken is not provided
  if (typeof cancelToken === 'undefined') {
    // eslint-disable-next-line promise/param-names
    return new Promise((_resolve, reject) => {
      setTimeout(reject, timeout, error);
    });
  }

  // clearing timeout with cancel token
  let timeoutId: ReturnType<typeof setTimeout>;
  const _clearTimeout = () => clearTimeout(timeoutId);
  cancelToken.then(_clearTimeout, _clearTimeout);

  // eslint-disable-next-line promise/param-names
  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutId = setTimeout(reject, timeout, error);
  });

  // Clearing the timeout if the cancel-token promise settled first.
  return Promise.race([timeoutPromise, cancelToken]) as Promise<T>;
}

/* eslint-disable no-redeclare */
export function createTaskWithTimeout<T>(task: ParallelTask<T>, timeout: number): ParallelTask<T>;
export function createTaskWithTimeout<T>(task: SerialTask<T>, timeout: number): SerialTask<T>;
export function createTaskWithTimeout<T>(task: PipelineTask<T>, timeout: number): PipelineTask<T>;
export function createTaskWithTimeout<T>(task: Task<T>, timeout: number): Task<T> {
  return function taskWithTimeout(arg: T) {
    const taskPromise = task(arg);

    // Use taskPromise as timeoutRejects cancelToken
    const timeoutPromise = createTimeoutReject(timeout, timeoutResult, taskPromise);

    return Promise.race([taskPromise, timeoutPromise]) as Promise<T>;
  };
}
/* eslint-enable no-redeclare */
