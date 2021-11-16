
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { createTimeoutResolve, createTimeoutReject } from '../dist/helpers.mjs'
import {
  createSerialTasksRunner,
  runParallelTasks,
  getParallelTasks,
  pushTasks,
  spliceTasks
} from '../dist/index.mjs'

use(chaiAsPromised)

describe('SerialTasksRunner', () => {
  it('Running some fulfilled tasks in parallel', async () => {
    const runner = createSerialTasksRunner()

    // pushing 3 tasks
    const firstTask = () => createTimeoutResolve(1, 1)
    const secondTask = () => createTimeoutResolve(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    pushTasks(runner, firstTask, secondTask, thirdTask)

    expect(runner.status).to.equal('standby')

    const runningTasks = runParallelTasks(runner)

    expect(runner.status).to.equal('pending')

    const results = await runningTasks

    expect(runner.status).to.equal('fulfilled')

    expect(results).to.deep.equal([1, 2, 3].map(value => ({ status: 'fulfilled', value })))
  })

  it('Running some fulfilled & rejected tasks in parallel', async () => {
    const runner = createSerialTasksRunner()

    // pushing 3 tasks
    const firstTask = () => createTimeoutResolve(1, 1)
    const secondTask = () => createTimeoutReject(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    pushTasks(runner, firstTask, secondTask, thirdTask)

    expect(runner.status).to.equal('standby')

    const runningTasks = runParallelTasks(runner)

    expect(runner.status).to.equal('pending')

    const results = await runningTasks

    expect(runner.status).to.equal('fulfilled')

    expect(results).to.deep.equal([
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: 2 },
      { status: 'fulfilled', value: 3 }
    ])
  })

  it('Running some rejected tasks in parallel', async () => {
    const runner = createSerialTasksRunner()

    // pushing 3 tasks
    const firstTask = () => createTimeoutReject(1, 1)
    const secondTask = () => createTimeoutReject(2, 2)
    const thirdTask = () => createTimeoutReject(3, 3)
    pushTasks(runner, firstTask, secondTask, thirdTask)

    expect(runner.status).to.equal('standby')

    const runningTasks = runParallelTasks(runner)

    expect(runner.status).to.equal('pending')

    const results = await runningTasks

    expect(runner.status).to.equal('fulfilled')

    expect(results).to.deep.equal([1, 2, 3].map(value => ({ status: 'rejected', reason: value })))
  })

  it('Adding some tasks after first run (without waiting) & run again', async () => {
    const runner = createSerialTasksRunner()

    // pushing 3 tasks
    const firstTask = () => createTimeoutResolve(1, 1)
    const secondTask = () => createTimeoutResolve(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    pushTasks(runner, firstTask, secondTask, thirdTask)

    expect(runner.status).to.equal('standby')

    const firstRunningTasks = runParallelTasks(runner)

    expect(runner.status).to.equal('pending')

    // splice second task and insert two new tasks
    spliceTasks(runner, 1, 1, () => createTimeoutResolve(4, 4), () => createTimeoutResolve(5, 5))

    const secondRunningTasks = runParallelTasks(runner)

    expect(runner.status).to.equal('pending')

    const firstResults = await firstRunningTasks

    expect(firstResults).to.deep.equal([1, 2, 3].map(value => ({ status: 'fulfilled', value })))

    // status should be still pending because it depend to last run status
    expect(runner.status).to.equal('pending')

    const secondResults = await secondRunningTasks

    expect(runner.status).to.equal('fulfilled')

    expect(secondResults).to.deep.equal([1, 4, 5, 3].map(value => ({ status: 'fulfilled', value })))
  })

  it('Getting a specific task before running', async () => {
    const runner = createSerialTasksRunner()

    // pushing 3 tasks
    const firstTask = () => createTimeoutResolve(1, 1)
    const secondTask = () => createTimeoutResolve(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    pushTasks(runner, firstTask, secondTask, thirdTask)

    await expect(getParallelTasks(runner, 2)).to.eventually.rejectedWith(Error)
  })

  it('Getting a specific task after running but out of the bound', async () => {
    const runner = createSerialTasksRunner()

    // pushing 3 tasks
    const firstTask = () => createTimeoutResolve(1, 1)
    const secondTask = () => createTimeoutResolve(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    pushTasks(runner, firstTask, secondTask, thirdTask)

    await expect(getParallelTasks(runner, 4)).to.eventually.rejectedWith(Error)
  })

  it('Getting a specific task after running', async () => {
    const runner = createSerialTasksRunner()

    // pushing 3 tasks
    const firstTask = () => createTimeoutResolve(1, 1)
    const secondTask = () => createTimeoutResolve(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    pushTasks(runner, firstTask, secondTask, thirdTask)

    runParallelTasks(runner)

    await expect(getParallelTasks(runner, 1)).to.eventually.equal(2)
  })

  it('Getting a specific task that added after the first run but before the second run', async () => {
    const runner = createSerialTasksRunner()

    // pushing 3 tasks
    const firstTask = () => createTimeoutResolve(1, 1)
    const secondTask = () => createTimeoutResolve(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    pushTasks(runner, firstTask, secondTask, thirdTask)

    runParallelTasks(runner)

    spliceTasks(runner, 1, 1, () => createTimeoutResolve(4, 4))

    await expect(getParallelTasks(runner, 1)).to.eventually.rejectedWith(Error)
  })

  it('Getting a specific task that added after the first and the second run', async () => {
    const runner = createSerialTasksRunner()

    // pushing 3 tasks
    const firstTask = () => createTimeoutResolve(1, 1)
    const secondTask = () => createTimeoutResolve(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    pushTasks(runner, firstTask, secondTask, thirdTask)

    runParallelTasks(runner)

    spliceTasks(runner, 1, 1, () => createTimeoutResolve(4, 4))

    await expect(getParallelTasks(runner, 1)).to.eventually.rejectedWith(Error)
  })
})
