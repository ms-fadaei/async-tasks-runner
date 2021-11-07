/* eslint-disable no-console */
import { ParallelTasksRunner } from '../src/index'

export async function runParallelTasks (...exampleTasks) {
  // 1. run all tasks with run method
  let parallel = new ParallelTasksRunner(...exampleTasks)
  console.time('parallel 1 timing')
  const result1 = await parallel.run()
  console.timeEnd('parallel 1 timing')
  console.log('parallel 1 result', result1)

  console.log('\n\n')

  // 2. run all tasks, but just waiting for task number 3 (resolve)
  parallel = new ParallelTasksRunner(...exampleTasks)
  console.time('parallel 2 timing')
  let result3: any = parallel.run()
  const result2 = await parallel.get(2)
  console.timeEnd('parallel 2 timing')
  console.log('parallel 2 result', result2)

  console.log('\n\n')

  // 3. get tasks result from pervious run
  console.time('parallel 3 timing')
  result3 = await result3
  console.timeEnd('parallel 3 timing')
  console.log('parallel 3 result', result3)

  console.log('\n\n')

  // 4. run all tasks, but just waiting for task number 4 (reject)
  parallel = new ParallelTasksRunner(...exampleTasks)
  console.time('parallel 4 timing')
  let result5: any = parallel.run()
  const result4 = await parallel.get(3).catch(e => new Error(e))
  console.timeEnd('parallel 4 timing')
  console.log('parallel 4 result', result4)

  console.log('\n\n')

  // 5. get tasks result from pervious run
  console.time('parallel 5 timing')
  result5 = await result5
  console.timeEnd('parallel 5 timing')
  console.log('parallel 5 result', result5)

  console.log('\n\n')

  // 6. run all tasks, but just waiting for task number 5 (resolve)
  parallel = new ParallelTasksRunner(...exampleTasks)
  console.time('parallel 6 timing')
  let result7: any = parallel.run()
  const result6 = await parallel.get(4)
  console.timeEnd('parallel 6 timing')
  console.log('parallel 6 result', result6)

  console.log('\n\n')

  // 7. get tasks result from pervious run
  console.time('parallel 7 timing')
  result7 = await result7
  console.timeEnd('parallel 7 timing')
  console.log('parallel 7 result', result7)
}
