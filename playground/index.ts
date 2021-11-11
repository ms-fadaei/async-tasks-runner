/* eslint-disable no-console */
import { _runParallelTasks } from './parallel'
import { _runSerialTasks } from './serial'
import { _runPipelineTasks } from './pipeline'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function rejectFn1 (response: unknown, delay: number): Promise<number> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise((resolve, reject) => setTimeout(reject, delay, response))
}

function resolveFn1 (response: unknown, delay: number): Promise<number> {
  return new Promise(resolve => setTimeout(resolve, delay, response))
}

((async () => {
  const exampleTasks = [
    (val?: number): Promise<number> => resolveFn1((val || 0) + 100, 100),
    (val?: number): Promise<number> => resolveFn1((val || 0) + 500, 500),
    (val?: number): Promise<number> => resolveFn1((val || 0) + 200, 200),
    (val?: number): Promise<number> => rejectFn1((val || 0) + 400, 400),
    (val?: number): Promise<number> => resolveFn1((val || 0) + 300, 300)
  ]

  console.log('Parallel Tasks:\n')
  await _runParallelTasks(...exampleTasks)

  console.log('\n\n\nSerial Tasks:\n')
  await _runSerialTasks(...exampleTasks)

  console.log('\n\n\nPipeline Tasks:\n')
  await _runPipelineTasks(...exampleTasks)
})())
