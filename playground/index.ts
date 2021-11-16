/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { createTimeoutResolve, createTimeoutReject } from '../src/helpers'
import { Task } from '../src/index'
import { _runParallelTasks } from './parallel'
import { _runSerialTasks } from './serial'
import { _runPipelineTasks } from './pipeline'

((async () => {
  const exampleTasks: Task<number>[] = [
    (arg = 0) => createTimeoutResolve(8, 8 + arg),
    (arg = 0) => createTimeoutResolve(2, 2 + arg),
    (arg = 0) => createTimeoutResolve(6, 6 + arg),
    (arg = 0) => createTimeoutResolve(16, 16 + arg),
    (arg = 0) => createTimeoutResolve(12, 12 + arg),
    (arg = 0) => createTimeoutReject(4, 4 + arg),
    (arg = 0) => createTimeoutResolve(18, 18 + arg),
    (arg = 0) => createTimeoutResolve(14, 14 + arg),
    (arg = 0) => createTimeoutResolve(10, 10 + arg),
    (arg = 0) => createTimeoutReject(20, 20 + arg)
  ]

  // console.log('Parallel Tasks:\n')
  // await _runParallelTasks(...exampleTasks)

  console.log('Serial Tasks:\n')
  await _runSerialTasks(...exampleTasks)

  // console.log('Pipeline Tasks:\n')
  // await _runPipelineTasks(...exampleTasks)
})())
