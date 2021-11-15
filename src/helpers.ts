import { Task, NormalTask, PipelineTask } from './runners/types'

export const timeoutResult: Symbol = Symbol('timeout')

export function createTimeoutResolve<T> (timeout: number, response: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout, response)
  })
}

export function createTimeoutReject<T> (timeout: number, error: T): Promise<T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((resolve, reject) => {
    setTimeout(reject, timeout, error)
  })
}

/* eslint-disable no-redeclare */
export function createTaskWithTimeout<T> (task: NormalTask<T>, timeout: number): NormalTask<T>;
export function createTaskWithTimeout<T> (task: PipelineTask<T>, timeout: number): PipelineTask<T>;
export function createTaskWithTimeout<T> (task: Task<T>, timeout: number): Task<T> {
  return (arg: T) => Promise.race([task(arg), createTimeoutReject(timeout, timeoutResult)]) as Promise<T>
}
/* eslint-enable no-redeclare */
