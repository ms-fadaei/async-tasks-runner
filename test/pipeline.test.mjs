
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { createTimeoutResolve } from '../dist/helpers.mjs'
import {
  createPipelineTasksRunner,
  pushTasks,
  spliceTasks
} from '../dist/index.mjs'

use(chaiAsPromised)

describe('PipelineTasksRunner', () => {
  it('pushing one task to the tasks-runner', () => {
    const runner = createPipelineTasksRunner()

    const firstTask = () => createTimeoutResolve(1, 1)
    expect(pushTasks(runner, firstTask)).to.equal(0)
  })

  it('pushing three tasks at the same time to the tasks-runner', () => {
    const runner = createPipelineTasksRunner()

    const firstTask = arg => createTimeoutResolve(1, 1 + arg)
    const secondTask = arg => createTimeoutResolve(2, 2 + arg)
    const thirdTask = arg => createTimeoutResolve(3, 3 + arg)
    expect(pushTasks(runner, firstTask, secondTask, thirdTask)).to.equal(2)
  })

  it('pushing empty list to the tasks-runner', () => {
    const runner = createPipelineTasksRunner()

    expect(pushTasks(runner)).to.equal(-1)
  })

  it('pushing tasks in a more complicated way', () => {
    const runner = createPipelineTasksRunner()

    // pushing the first task
    const firstTask = arg => createTimeoutResolve(1, 1 + arg)
    expect(pushTasks(runner, firstTask)).to.equal(0)

    // pushing the second and third tasks at the same time
    const secondTask = arg => createTimeoutResolve(2, 2 + arg)
    const thirdTask = arg => createTimeoutResolve(3, 3 + arg)
    expect(pushTasks(runner, secondTask, thirdTask)).to.equal(2)

    // add forth task in separate call
    const forthTask = arg => createTimeoutResolve(4, 4 + arg)
    expect(pushTasks(runner, forthTask)).to.equal(3)

    // pushing noting must return the last item index
    expect(pushTasks(runner)).to.equal(3)
  })

  it('splicing tasks with just start parameter', () => {
    const runner = createPipelineTasksRunner()

    // create tasks
    const count = 5
    const tasks = []
    for (let i = 0; i < count; i++) {
      tasks.push(arg => createTimeoutResolve(i, i + arg))
    }

    // push tasks
    pushTasks(runner, ...tasks)

    // splice tasks
    expect(spliceTasks(runner, 2)).to.have.length(count - 2)

    // get tasks length
    // pushing noting must return the last item index
    expect(pushTasks(runner) + 1).to.equal(2)
  })

  it('splicing tasks with start and deleteCount parameter', () => {
    const runner = createPipelineTasksRunner()

    // create tasks
    const count = 5
    const tasks = []
    for (let i = 0; i < count; i++) {
      tasks.push(arg => createTimeoutResolve(i, i + arg))
    }

    // push tasks
    pushTasks(runner, ...tasks)

    // splice tasks
    expect(spliceTasks(runner, 2, 2)).to.have.length(2)

    // get tasks length
    // pushing noting must return the last item index
    expect(pushTasks(runner) + 1).to.equal(count - 2)
  })

  it('splicing tasks with start and deleteCount and newTasks parameter', () => {
    const runner = createPipelineTasksRunner()

    // create tasks
    const count = 5
    const tasks = []
    for (let i = 0; i < count; i++) {
      tasks.push(arg => createTimeoutResolve(i, i + arg))
    }

    // create new tasks
    const newCount = 4
    const newTasks = []
    for (let i = 0; i < newCount; i++) {
      newTasks.push(arg => createTimeoutResolve(i, i + arg))
    }

    // push tasks
    pushTasks(runner, ...tasks)

    // splice tasks
    expect(spliceTasks(runner, 2, 2, ...newTasks)).to.have.length(2)

    // get tasks length
    // pushing noting must return the last item index
    expect(pushTasks(runner) + 1).to.equal(count - 2 + newCount)
  })
})
