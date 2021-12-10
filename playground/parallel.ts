/* eslint-disable no-console */
import { createParallelTasksRunner, runParallelTasks, getParallelTasks, pushTasks, spliceTasks } from '../src/index';

export async function _runParallelTasks(...tasks) {
  // 1. Create the runner with two first tasks (blocking result)
  console.log('1. Create the runner with two first tasks (blocking result)');
  let runner = createParallelTasksRunner(tasks[0], tasks[1]);

  // 1.1. Run the runner with task 8 and 2
  {
    console.log('\n\n1.1. Run the runner with task 8 and 2');
    console.time('parallel-run-time');
    const result = await runParallelTasks(runner).catch((e) => `!!!ERROR: ${e}`);
    console.timeEnd('parallel-run-time');
    console.log('parallel-result', result);
  }

  // 1.2. Push task 6 and run it again
  {
    console.log('\n\n1.2. Push task 6 and run it again');
    pushTasks(runner, tasks[2]);
    console.time('parallel-run-time');
    const result = await runParallelTasks(runner).catch((e) => `!!!ERROR: ${e}`);
    console.timeEnd('parallel-run-time');
    console.log('parallel-result', result);
  }

  // 1.3. Push task 16 and run it again
  {
    console.log('\n\n1.3. Push task 16 and run it again');
    pushTasks(runner, tasks[3]);
    console.time('parallel-run-time');
    const result = await runParallelTasks(runner).catch((e) => `!!!ERROR: ${e}`);
    console.timeEnd('parallel-run-time');
    console.log('parallel-result', result);
  }

  // 1.4. Remove task 16 and insert 12 abd 4 instead
  {
    console.log('\n\n1.4. Remove task 16 and insert 12 abd 4 instead');
    spliceTasks(runner, 3, 1, tasks[4], tasks[5]);
    console.time('parallel-run-time');
    const result = await runParallelTasks(runner).catch((e) => `!!!ERROR: ${e}`);
    console.timeEnd('parallel-run-time');
    console.log('parallel-result', result);
  }

  // 1.5. Remove all tasks and insert 18, 14, 10, 20
  {
    console.log('\n\n1.5. Remove all tasks and insert 18, 14, 10, 20');
    spliceTasks(runner, 0, 5, tasks[6], tasks[7], tasks[8], tasks[9]);
    console.time('parallel-run-time');
    const result = await runParallelTasks(runner).catch((e) => `!!!ERROR: ${e}`);
    console.timeEnd('parallel-run-time');
    console.log('parallel-result', result);
  }

  // 1.6. get task 10
  {
    console.log('\n\n1.6. get task 10');
    console.time('parallel-run-time');
    const result = await getParallelTasks(runner, 2).catch((e) => `!!!ERROR: ${e}`);
    console.timeEnd('parallel-run-time');
    console.log('parallel-result', result);
  }

  // 1.7. get task 20 (rejected task)
  {
    console.log('\n\n1.7. get task 20 (rejected task)');
    console.time('parallel-run-time');
    const result = await getParallelTasks(runner, 3).catch((e) => `!!!ERROR: ${e}`);
    console.timeEnd('parallel-run-time');
    console.log('parallel-result', result);
  }

  // 2. Create the runner with two first tasks (non-blocking result)
  console.log('\n\n\n2. Create the runner with two first tasks (non-blocking result)');
  runner = createParallelTasksRunner(tasks[0], tasks[1]);

  // 2.1. Run the runner with task 8 and 2
  console.time('parallel-run-time');
  runParallelTasks(runner)
    .catch((e) => `!!!ERROR: ${e}`)
    .then((result) => {
      console.log('\n\n2.1. Run the runner with task 8 and 2');
      console.timeEnd('parallel-run-time');
      console.log('parallel-result', result);
    });

  // 2.2. Push task 6 and run it again
  pushTasks(runner, tasks[2]);
  console.time('parallel-run-time-1');
  runParallelTasks(runner)
    .catch((e) => `!!!ERROR: ${e}`)
    .then((result) => {
      console.log('\n\n2.2. Push task 6 and run it again');
      console.timeEnd('parallel-run-time-1');
      console.log('parallel-result', result);
    });

  // 2.3. Push task 16 and run it again
  pushTasks(runner, tasks[3]);
  console.time('parallel-run-time-2');
  runParallelTasks(runner)
    .catch((e) => `!!!ERROR: ${e}`)
    .then((result) => {
      console.log('\n\n2.3. Push task 16 and run it again');
      console.timeEnd('parallel-run-time-2');
      console.log('parallel-result', result);
    });

  // 2.4. Remove task 16 and insert 12 abd 4 instead
  spliceTasks(runner, 3, 1, tasks[4], tasks[5]);
  console.time('parallel-run-time-3');
  runParallelTasks(runner)
    .catch((e) => `!!!ERROR: ${e}`)
    .then((result) => {
      console.log('\n\n2.4. Remove task 16 and insert 12 abd 4 instead');
      console.timeEnd('parallel-run-time-3');
      console.log('parallel-result', result);
    });

  // 2.5. Remove all tasks and insert 18, 14, 10, 20
  spliceTasks(runner, 0, 5, tasks[6], tasks[7], tasks[8], tasks[9]);
  console.time('parallel-run-time-4');
  runParallelTasks(runner)
    .catch((e) => `!!!ERROR: ${e}`)
    .then((result) => {
      console.log('\n\n2.5. Remove all tasks and insert 18, 14, 10, 20');
      console.timeEnd('parallel-run-time-4');
      console.log('parallel-result', result);
    });

  // 2.6. get task 10
  console.time('parallel-run-time-5');
  getParallelTasks(runner, 2)
    .catch((e) => `!!!ERROR: ${e}`)
    .then((result) => {
      console.log('\n\n2.6. get task 10');
      console.timeEnd('parallel-run-time-5');
      console.log('parallel-result', result);
    });

  // 2.7. get task 20 (rejected task)
  console.time('parallel-run-time-6');
  getParallelTasks(runner, 3)
    .catch((e) => `!!!ERROR: ${e}`)
    .then((result) => {
      console.log('\n\n2.7. get task 20 (rejected task)');
      console.timeEnd('parallel-run-time-6');
      console.log('parallel-result', result);
    });
}
