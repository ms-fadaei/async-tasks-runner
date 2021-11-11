/* eslint-disable no-console */
import { createPipelineTasksRunner, runPipelineTasks, getPipelineTask } from '../src/index'

export async function _runPipelineTasks (...exampleTasks) {
  // 1. run all tasks with run method
  let pipeline = createPipelineTasksRunner(...exampleTasks)
  console.time('pipeline 1 timing')
  const result1 = await runPipelineTasks(pipeline, 0).catch(e => new Error(e))
  console.timeEnd('pipeline 1 timing')
  console.log('pipeline 1 result', result1)

  console.log('\n\n')

  // 2. run all tasks, but just waiting for task number 3 (resolve)
  pipeline = createPipelineTasksRunner(...exampleTasks)
  console.time('pipeline 2 timing')
  let result3: any = runPipelineTasks(pipeline, 0).catch(e => new Error(e))
  const result2 = await getPipelineTask(pipeline, 2).catch(e => new Error(e))
  console.timeEnd('pipeline 2 timing')
  console.log('pipeline 2 result', result2)

  console.log('\n\n')

  // 3. get tasks result from pervious run
  console.time('pipeline 3 timing')
  result3 = await result3
  console.timeEnd('pipeline 3 timing')
  console.log('pipeline 3 result', result3)

  console.log('\n\n')

  // 4. run all tasks, but just waiting for task number 4 (reject)
  pipeline = createPipelineTasksRunner(...exampleTasks)
  console.time('pipeline 4 timing')
  let result5: any = runPipelineTasks(pipeline, 0).catch(e => new Error(e))
  const result4 = await getPipelineTask(pipeline, 3).catch(e => new Error(e))
  console.timeEnd('pipeline 4 timing')
  console.log('pipeline 4 result', result4)

  console.log('\n\n')

  // 5. get tasks result from pervious run
  console.time('pipeline 5 timing')
  result5 = await result5
  console.timeEnd('pipeline 5 timing')
  console.log('pipeline 5 result', result5)

  console.log('\n\n')

  // 6. run all tasks, but just waiting for task number 5 (reject because of task 4)
  pipeline = createPipelineTasksRunner(...exampleTasks)
  console.time('pipeline 6 timing')
  let result7: any = runPipelineTasks(pipeline, 0).catch(e => new Error(e))
  const result6 = await getPipelineTask(pipeline, 4).catch(e => new Error(e))
  console.timeEnd('pipeline 6 timing')
  console.log('pipeline 6 result', result6)

  console.log('\n\n')

  // 7. get tasks result from pervious run
  console.time('pipeline 7 timing')
  result7 = await result7
  console.timeEnd('pipeline 7 timing')
  console.log('pipeline 7 result', result7)
}
