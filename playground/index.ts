/* eslint-disable no-console */
// import { _runParallelTasks } from './parallel'
import { _runParallelTasks } from './parallel-new'
// import { _runSerialTasks } from './serial'
// import { _runPipelineTasks } from './pipeline'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function rejectFn1 (response: unknown, delay: number): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((resolve, reject) => setTimeout(reject, delay, response))
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function resolveFn1 (response: unknown, delay: number): Promise<number> {
  return new Promise(resolve => setTimeout(resolve, delay, response))
}

((async () => {
  console.log('Parallel Tasks:\n')
  await _runParallelTasks()

  // console.log('\n\n\nSerial Tasks:\n')
  // await _runSerialTasks(...exampleTasks)

  // console.log('\n\n\nPipeline Tasks:\n')
  // await _runPipelineTasks(...exampleTasks)
})())
