
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  createParallelTasksRunner,
  runParallelTasks,
  getParallelTasks,
  pushTasks,
  spliceTasks,
  resetTasks
} from '../dist/index.mjs'

use(chaiAsPromised)

describe('ParallelTasksRunner', () => {
  function rejectFn (response, delay) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => setTimeout(reject, delay, response))
  }

  function resolveFn (response, delay) {
    return new Promise(resolve => setTimeout(resolve, delay, response))
  }

  it('add tasks', () => {
    const runner = createParallelTasksRunner()

    // add first task
    const firstTask = resolveFn.bind(null, 10, 10)
    expect(pushTasks(runner, firstTask)).to.equal(0)

    // add second and third task in same call
    const secondTask = resolveFn.bind(null, 20, 20)
    const thirdTask = rejectFn.bind(null, 30, 30)
    expect(pushTasks(runner, secondTask, thirdTask)).to.equal(2)

    // add forth task in separate call
    const forthTask = resolveFn.bind(null, 40, 40)
    expect(pushTasks(runner, forthTask)).to.equal(3)
  })

  it('remove tasks', () => {
    const runner = createParallelTasksRunner()

    // add tasks
    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]
    expect(pushTasks(runner, ...tasks)).to.equal(4)

    // remove task number 2 and 3
    expect(spliceTasks(runner, 1, 2)).to.have.length(2)

    // add new task
    const newTask = resolveFn.bind(null, 12, 12)
    expect(pushTasks(runner, newTask)).to.equal(3)
  })

  it('run tasks', async () => {
    const runner = createParallelTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    pushTasks(runner, ...tasks)

    expect(runner.status).to.equal('standby')

    // run all tasks
    await expect(runParallelTasks(runner)).to.eventually.have.length(5)

    expect(runner.status).to.equal('fulfilled')
  })

  it('unable to add tasks after run', async () => {
    const runner = createParallelTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    pushTasks(runner, ...tasks)

    // run all tasks
    await runParallelTasks(runner)

    // add new task
    const newTask = resolveFn.bind(null, 1, 1)
    expect(pushTasks(runner, newTask)).to.equal(-1)
  })

  it('unable to remove tasks after run', async () => {
    const runner = createParallelTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    pushTasks(runner, ...tasks)

    // run all tasks
    await runParallelTasks(runner)

    // add new task
    expect(spliceTasks(runner, 1, 2)).to.have.length(0)
  })

  it('reset after run', async () => {
    const runner = createParallelTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    pushTasks(runner, ...tasks)

    // status before run
    expect(runner.status).to.equal('standby')

    // run all tasks
    await runParallelTasks(runner)

    // status after run
    expect(runner.status).to.equal('fulfilled')

    // reset runner
    resetTasks(runner)

    // status after reset
    expect(runner.status).to.equal('standby')

    // no pending task
    await expect(getParallelTasks(runner, 1)).to.eventually.rejectedWith(Error)
  })

  it('add task after run and reset', async () => {
    const runner = createParallelTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    pushTasks(runner, ...tasks)

    // run all tasks
    await runParallelTasks(runner)

    // add new task
    const newTask = resolveFn.bind(null, 1, 1)
    expect(pushTasks(runner, newTask)).to.equal(-1)

    // reset runner
    resetTasks(runner)

    // add new task (sixth task)
    expect(pushTasks(runner, newTask)).to.equal(5)
  })

  it('get specific task after run', async () => {
    const runner = createParallelTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    pushTasks(runner, ...tasks)

    // run all tasks
    await runParallelTasks(runner)

    // get first task
    await expect(getParallelTasks(runner, 0)).to.eventually.equal(2)

    // get second task
    await expect(getParallelTasks(runner, 1)).to.eventually.equal(4)

    // get third task
    await expect(getParallelTasks(runner, 2)).to.eventually.rejectedWith(6)

    // get forth task
    await expect(getParallelTasks(runner, 3)).to.eventually.equal(8)

    // get fifth task
    await expect(getParallelTasks(runner, 4)).to.eventually.equal(10)
  })
})
