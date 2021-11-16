/* eslint-disable no-console */
import { createPipelineTasksRunner, runPipelineTasks, getPipelineTasks, pushTasks, spliceTasks } from '../src/index'

export async function _runPipelineTasks (...tasks) {
  // 1. Create the runner with two first tasks (blocking result)
  console.log('1. Create the runner with two first tasks (blocking result)')
  let runner = createPipelineTasksRunner(tasks[0], tasks[1])

  // 1.1. Run the runner with task 8 and 2
  {
    console.log('\n\n1.1. Run the runner with task 8 and 2')
    console.time('pipeline-run-time')
    const result = await runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`)
    console.timeEnd('pipeline-run-time')
    console.log('pipeline-result', result)
  }

  // 1.2. Push task 6 and run it again
  {
    console.log('\n\n1.2. Push task 6 and run it again')
    pushTasks(runner, tasks[2])
    console.time('pipeline-run-time')
    const result = await runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`)
    console.timeEnd('pipeline-run-time')
    console.log('pipeline-result', result)
  }

  // 1.3. Push task 16 and run it again
  {
    console.log('\n\n1.3. Push task 16 and run it again')
    pushTasks(runner, tasks[3])
    console.time('pipeline-run-time')
    const result = await runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`)
    console.timeEnd('pipeline-run-time')
    console.log('pipeline-result', result)
  }

  // 1.4. Remove task 16 and insert 12 and 4 instead
  {
    console.log('\n\n1.4. Remove task 16 and insert 12 and 4 instead')
    spliceTasks(runner, 3, 1, tasks[4], tasks[5])
    console.time('pipeline-run-time')
    const result = await runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`)
    console.timeEnd('pipeline-run-time')
    console.log('pipeline-result', result)
  }

  // 1.5. Remove all tasks and insert 18, 14, 10, 20
  {
    console.log('\n\n1.5. Remove all tasks and insert 18, 14, 10, 20')
    spliceTasks(runner, 0, 5, tasks[6], tasks[7], tasks[8], tasks[9])
    console.time('pipeline-run-time')
    const result = await runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`)
    console.timeEnd('pipeline-run-time')
    console.log('pipeline-result', result)
  }

  // 1.6. get task 10
  {
    console.log('\n\n1.6. get task 10')
    console.time('pipeline-run-time')
    const result = await getPipelineTasks(runner, 2).catch(e => `!!!ERROR: ${e}`)
    console.timeEnd('pipeline-run-time')
    console.log('pipeline-result', result)
  }

  // 1.7. get task 20 (rejected task)
  {
    console.log('\n\n1.7. get task 20 (rejected task)')
    console.time('pipeline-run-time')
    const result = await getPipelineTasks(runner, 3).catch(e => `!!!ERROR: ${e}`)
    console.timeEnd('pipeline-run-time')
    console.log('pipeline-result', result)
  }

  // 2. Create the runner with two first tasks (non-blocking result)
  console.log('\n\n\n2. Create the runner with two first tasks (non-blocking result)')
  runner = createPipelineTasksRunner(tasks[0], tasks[1])

  // 2.1. Run the runner with task 8 and 2
  console.time('pipeline-run-time')
  runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`).then((result) => {
    console.log('\n\n2.1. Run the runner with task 8 and 2')
    console.timeEnd('pipeline-run-time')
    console.log('pipeline-result', result)
  })

  // 2.2. Push task 6 and run it again
  pushTasks(runner, tasks[2])
  console.time('pipeline-run-time-1')
  runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`).then((result) => {
    console.log('\n\n2.2. Push task 6 and run it again')
    console.timeEnd('pipeline-run-time-1')
    console.log('pipeline-result', result)
  })

  // 2.3. Push task 16 and run it again
  pushTasks(runner, tasks[3])
  console.time('pipeline-run-time-2')
  runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`).then((result) => {
    console.log('\n\n2.3. Push task 16 and run it again')
    console.timeEnd('pipeline-run-time-2')
    console.log('pipeline-result', result)
  })

  // 2.4. Remove task 16 and insert 12 and 4 instead
  spliceTasks(runner, 3, 1, tasks[4], tasks[5])
  console.time('pipeline-run-time-3')
  runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`).then((result) => {
    console.log('\n\n2.4. Remove task 16 and insert 12 and 4 instead')
    console.timeEnd('pipeline-run-time-3')
    console.log('pipeline-result', result)
  })

  // 2.5. Remove all tasks and insert 18, 14, 10, 20
  spliceTasks(runner, 0, 5, tasks[6], tasks[7], tasks[8], tasks[9])
  console.time('pipeline-run-time-4')
  runPipelineTasks(runner, 0).catch(e => `!!!ERROR: ${e}`).then((result) => {
    console.log('\n\n2.5. Remove all tasks and insert 18, 14, 10, 20')
    console.timeEnd('pipeline-run-time-4')
    console.log('pipeline-result', result)
  })

  // 2.6. get task 10
  console.time('pipeline-run-time-5')
  getPipelineTasks(runner, 2).catch(e => `!!!ERROR: ${e}`).then((result) => {
    console.log('\n\n2.6. get task 10')
    console.timeEnd('pipeline-run-time-5')
    console.log('pipeline-result', result)
  })

  // 2.7. get task 20 (rejected task)
  console.time('pipeline-run-time-6')
  getPipelineTasks(runner, 3).catch(e => `!!!ERROR: ${e}`).then((result) => {
    console.log('\n\n2.7. get task 20 (rejected task)')
    console.timeEnd('pipeline-run-time-6')
    console.log('pipeline-result', result)
  })
}
