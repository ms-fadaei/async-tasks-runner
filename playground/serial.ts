/* eslint-disable no-console */
import { createSerialTasksRunner, runSerialTasks, getSerialTasks } from '../src/index'

export async function _runSerialTasks (...exampleTasks) {
  // 1. run all tasks with run method
  let serial = createSerialTasksRunner(...exampleTasks)
  console.time('serial 1 timing')
  const result1 = await runSerialTasks(serial).catch(e => new Error(e))
  console.timeEnd('serial 1 timing')
  console.log('serial 1 result', result1)

  console.log('\n\n')

  // 2. run all tasks, but just waiting for task number 3 (resolve)
  serial = createSerialTasksRunner(...exampleTasks)
  console.time('serial 2 timing')
  let result3: any = runSerialTasks(serial).catch(e => new Error(e))
  const result2 = await getSerialTasks(serial, 2).catch(e => new Error(e))
  console.timeEnd('serial 2 timing')
  console.log('serial 2 result', result2)

  console.log('\n\n')

  // 3. get tasks result from pervious run
  console.time('serial 3 timing')
  result3 = await result3
  console.timeEnd('serial 3 timing')
  console.log('serial 3 result', result3)

  console.log('\n\n')

  // 4. run all tasks, but just waiting for task number 4 (reject)
  serial = createSerialTasksRunner(...exampleTasks)
  console.time('serial 4 timing')
  let result5: any = runSerialTasks(serial).catch(e => new Error(e))
  const result4 = await getSerialTasks(serial, 3).catch(e => new Error(e))
  console.timeEnd('serial 4 timing')
  console.log('serial 4 result', result4)

  console.log('\n\n')

  // 5. get tasks result from pervious run
  console.time('serial 5 timing')
  result5 = await result5
  console.timeEnd('serial 5 timing')
  console.log('serial 5 result', result5)

  console.log('\n\n')

  // 6. run all tasks, but just waiting for task number 5 (reject because of task 4)
  serial = createSerialTasksRunner(...exampleTasks)
  console.time('serial 6 timing')
  let result7: any = runSerialTasks(serial).catch(e => new Error(e))
  const result6 = await getSerialTasks(serial, 4).catch(e => new Error(e))
  console.timeEnd('serial 6 timing')
  console.log('serial 6 result', result6)

  console.log('\n\n')

  // 7. get tasks result from pervious run
  console.time('serial 7 timing')
  result7 = await result7
  console.timeEnd('serial 7 timing')
  console.log('serial 7 result', result7)
}
