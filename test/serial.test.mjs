
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  createSerialTasksRunner,
  runSerialTasks,
  getSerialTask,
  addTask,
  removeTask,
  resetTasksRunner
} from '../dist/index.mjs'

use(chaiAsPromised)

describe('SerialTasksRunner', () => {
  function rejectFn (response, delay) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => setTimeout(reject, delay, response))
  }

  function resolveFn (response, delay) {
    return new Promise(resolve => setTimeout(resolve, delay, response))
  }

  it('add tasks', () => {
    const runner = createSerialTasksRunner()

    // add first task
    const firstTask = resolveFn.bind(null, 10, 10)
    expect(addTask(runner, firstTask)).to.equal(0)

    // add second and third task in same call
    const secondTask = resolveFn.bind(null, 20, 20)
    const thirdTask = rejectFn.bind(null, 30, 30)
    expect(addTask(runner, secondTask, thirdTask)).to.equal(2)

    // add forth task in separate call
    const forthTask = resolveFn.bind(null, 40, 40)
    expect(addTask(runner, forthTask)).to.equal(3)
  })

  it('remove tasks', () => {
    const runner = createSerialTasksRunner()

    // add tasks
    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]
    expect(addTask(runner, ...tasks)).to.equal(4)

    // remove task number 2 and 3
    expect(removeTask(runner, 1, 2)).to.have.length(2)

    // add new task
    const newTask = resolveFn.bind(null, 12, 12)
    expect(addTask(runner, newTask)).to.equal(3)
  })

  it('run tasks (with success)', async () => {
    const runner = createSerialTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      resolveFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    addTask(runner, ...tasks)

    expect(runner.status).to.equal('load')

    // run all tasks
    await expect(runSerialTasks(runner)).to.eventually.have.length(5)

    expect(runner.status).to.equal('fulfilled')
  })

  it('run tasks contain error', async () => {
    const runner = createSerialTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    addTask(runner, ...tasks)

    expect(runner.status).to.equal('load')

    // run all tasks
    await expect(runSerialTasks(runner)).to.eventually.rejected.with.length(3)

    expect(runner.status).to.equal('rejected')
  })

  it('unable to add tasks after run', async () => {
    const runner = createSerialTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      resolveFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    addTask(runner, ...tasks)

    // run all tasks
    await runSerialTasks(runner).catch(e => e)

    // add new task
    const newTask = resolveFn.bind(null, 1, 1)
    expect(addTask(runner, newTask)).to.equal(-1)
  })

  it('unable to remove tasks after run', async () => {
    const runner = createSerialTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      resolveFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    addTask(runner, ...tasks)

    // run all tasks
    await runSerialTasks(runner)

    // add new task
    expect(removeTask(runner, 1, 2)).to.have.length(0)
  })

  it('reset after run', async () => {
    const runner = createSerialTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      resolveFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    addTask(runner, ...tasks)

    // status before run
    expect(runner.status).to.equal('load')

    // run all tasks
    await runSerialTasks(runner)

    // status after run
    expect(runner.status).to.equal('fulfilled')

    // reset runner
    resetTasksRunner(runner)

    // status after reset
    expect(runner.status).to.equal('load')

    // no pending task
    await expect(getSerialTask(runner, 1)).to.eventually.rejectedWith(Error)
  })

  it('add task after run and reset', async () => {
    const runner = createSerialTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      resolveFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    addTask(runner, ...tasks)

    // run all tasks
    await runSerialTasks(runner)

    // add new task
    const newTask = resolveFn.bind(null, 1, 1)
    expect(addTask(runner, newTask)).to.equal(-1)

    // reset runner
    resetTasksRunner(runner)

    // add new task (sixth task)
    expect(addTask(runner, newTask)).to.equal(5)
  })

  it('get specific task after run (with success)', async () => {
    const runner = createSerialTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      resolveFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    addTask(runner, ...tasks)

    // run all tasks
    await runSerialTasks(runner)

    // get first task
    await expect(getSerialTask(runner, 0)).to.eventually.equal(2)

    // get second task
    await expect(getSerialTask(runner, 1)).to.eventually.equal(4)

    // get third task
    await expect(getSerialTask(runner, 2)).to.eventually.equal(6)

    // get forth task
    await expect(getSerialTask(runner, 3)).to.eventually.equal(8)

    // get fifth task
    await expect(getSerialTask(runner, 4)).to.eventually.equal(10)
  })

  it('get specific task after run (contain error)', async () => {
    const runner = createSerialTasksRunner()

    const tasks = [
      resolveFn.bind(null, 2, 2),
      resolveFn.bind(null, 4, 4),
      rejectFn.bind(null, 6, 6),
      resolveFn.bind(null, 8, 8),
      resolveFn.bind(null, 10, 10)
    ]

    // add all tasks
    addTask(runner, ...tasks)

    // run all tasks with error
    await runSerialTasks(runner).catch(e => e)

    // get first task
    await expect(getSerialTask(runner, 0)).to.eventually.equal(2)

    // get second task
    await expect(getSerialTask(runner, 1)).to.eventually.equal(4)

    // get third task
    await expect(getSerialTask(runner, 2)).to.eventually.rejectedWith(6)

    // get forth task
    await expect(getSerialTask(runner, 3)).to.eventually.rejectedWith(Error)

    // get fifth task
    await expect(getSerialTask(runner, 4)).to.eventually.rejectedWith(Error)
  })
})
