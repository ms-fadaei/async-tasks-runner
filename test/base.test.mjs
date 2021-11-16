
import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { createTimeoutResolve } from '../dist/helpers.mjs'
import {
  createParallelTasksRunner,
  pushTasks,
  spliceTasks
} from '../dist/index.mjs'

use(chaiAsPromised)

// We use ParallelTasksRunner to test the basic functionality of the library.

describe('Basics', () => {
  it('pushing one task to the tasks-runner', () => {
    const runner = createParallelTasksRunner()

    const firstTask = () => createTimeoutResolve(1, 1)
    expect(pushTasks(runner, firstTask)).to.equal(0)
  })

  it('pushing three tasks at the same time to the tasks-runner', () => {
    const runner = createParallelTasksRunner()

    const firstTask = () => createTimeoutResolve(1, 1)
    const secondTask = () => createTimeoutResolve(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    expect(pushTasks(runner, firstTask, secondTask, thirdTask)).to.equal(2)
  })

  it('pushing empty list to the tasks-runner', () => {
    const runner = createParallelTasksRunner()

    expect(pushTasks(runner)).to.equal(-1)
  })

  it('pushing tasks in a more complicated way', () => {
    const runner = createParallelTasksRunner()

    // pushing the first task
    const firstTask = () => createTimeoutResolve(1, 1)
    expect(pushTasks(runner, firstTask)).to.equal(0)

    // pushing the second and third tasks at the same time
    const secondTask = () => createTimeoutResolve(2, 2)
    const thirdTask = () => createTimeoutResolve(3, 3)
    expect(pushTasks(runner, secondTask, thirdTask)).to.equal(2)

    // add forth task in separate call
    const forthTask = () => createTimeoutResolve(4, 4)
    expect(pushTasks(runner, forthTask)).to.equal(3)

    // pushing noting must return the last item index
    expect(pushTasks(runner)).to.equal(3)
  })

  it('splicing tasks with just start parameter', () => {
    const runner = createParallelTasksRunner()

    // create tasks
    const count = 5
    const tasks = []
    for (let i = 0; i < count; i++) {
      tasks.push(() => createTimeoutResolve(i, i))
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
    const runner = createParallelTasksRunner()

    // create tasks
    const count = 5
    const tasks = []
    for (let i = 0; i < count; i++) {
      tasks.push(() => createTimeoutResolve(i, i))
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
    const runner = createParallelTasksRunner()

    // create tasks
    const count = 5
    const tasks = []
    for (let i = 0; i < count; i++) {
      tasks.push(() => createTimeoutResolve(i, i))
    }

    // create new tasks
    const newCount = 4
    const newTasks = []
    for (let i = 0; i < newCount; i++) {
      newTasks.push(() => createTimeoutResolve(i, i))
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
