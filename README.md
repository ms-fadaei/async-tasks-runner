# Async Tasks Runner

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![License][license-src]][license-href]

> tiny (~ 1kb gzipped), side-effect free, tree shakable, zero dependencies, and fully typed Tasks Runner. Run your tasks in parallel, serial & pipeline in a more complicated and performant way.

With this module you can run your tasks in 3 different ways:

* Parallel: Run your independent tasks in parallel. The result is an array, like the `Promise.allSettled` result.
* Serial: Run your independent tasks in sequence. The result is an array, like the `Promise.allSettled` result.
* Pipeline: Run your dependent tasks in sequence. The result of every task will be passed to the next task.

![Async Tasks Runner](https://user-images.githubusercontent.com/54557683/140879231-30adf612-9149-4a10-af9f-6af094fa9152.jpg)



⚠️ Attention: This package comes without any polyfills. If you want to support an older environment, please polyfills it depending on what you need.
* ES2015
* ES2017 async/await
* ES2020 Promise.allSettled (Just for the ParallelTasksRunner)

<img width="460" alt="environment support" src="https://user-images.githubusercontent.com/54557683/140879289-456a341b-d272-45e8-8a6d-7d6b4ba83bf6.jpg">


## Setup

1. Add `async-tasks-runner` dependency with `yarn` or `npm` to your project

```bash
yarn add async-tasks-runner

# or

npm install async-tasks-runner
```

2. Use it everywhere you want
```js
// ES Module
import {createParallelTasksRunner, runParallelTasks, getParallelTasks} from "async-tasks-runner"

// CJS
const {createParallelTasksRunner, runParallelTasks, getParallelTasks} = require("async-tasks-runner")
```

## Runners

| Runner | Example |
| ------ | ------- |
| ParallelTasksRunner | See [Examples](#parallel-tasks-runner) |
| SerialTasksRunner | See [Examples](#serial-tasks-runner) |
| PipelineTasksRunner | See [Examples](#pipeline-tasks-runner) |

## Global Helper Functions

| Functions | Description| Parameter(s) | Return Value |
| ------ | ------- | ------ | ------- |
| pushTasks | push tasks to the runner. [See pushTasks Section](#pushTasks) | taskRunnerObject, tasks[] | number: the new length of tasks |
| spliceTasks | removing or replacing existing tasks and/or adding new elements in place [See spliceTasks Section](#spliceTasks) | taskRunnerObject, startIndex, deleteCount, newTasks[] | array: list of removed tasks |
| getTasksRunnerStatus | current status of the runner. [See getTasksRunnerStatus Section](#getTasksRunnerStatus) | taskRunnerObject | string: status |

### pushTasks
With this function, you can push new tasks to the runner (like `Array.prototype.push()`).
```js
pushTasks(taskRunnerObject, ...newTasks[]);
```

### spliceTasks
With this function, you can change the contents of an array by removing or replacing existing elements and/or adding new elements in place (like `Array.prototype.splice()`).
```js
spliceTasks(taskRunnerObject, start, deleteCount, ...newTasks[] );
```

### getTasksRunnerStatus
With this function, you can get the current status of the runner.
```js
const currentStatus = getTasksRunnerStatus(taskRunnerObject)
```

This function returns 4 different statuses:
1. `standby`: The runner is open to adding or removing tasks. This status actually present that the runner is not started yet!
2. `pending`: Represent that the runner starts pending the tasks and in the meantime, you can't nor add/remove tasks to/from the runner neither reset the runner.
3. `fulfilled`: Represent that the runner did its job and now you can get the result or reset the runner to add/remove tasks to/from the runner and run them again.
4. `rejected`: In this status, the runner did its job but with an error in the process, and the whole run is rejected. Like `fulfilled` status, you can reset the runner to add/remove tasks to/from the runner and run them again.

## Examples

### Parallel Tasks Runner
You can run your tasks in parallel. the result is an array, like the `Promise.allSettled` result.

#### Create
You can create a parallel task runner object by the calling of `createParallelTaskRunner`. The result will be an object that must be passed as the first argument to any helper functions that you want to use.

```js
import {createParallelTasksRunner} from "async-tasks-runner"
const taskRunnerObject = createParallelTasksRunner(...tasks);
```

Every task in the `ParallelTasksRunner` must be a function without a parameter and return a promise.

```js
const url = "https://google.com";

const task1 = () => {
    return fetch(`${url}/first`);
}

const task2 = () => {
    return fetch(`${url}/second`);
}

const taskRunnerObject = createParallelTasksRunner(task1, task2);
```

#### Run
Start pending the runner. When it is called, the status changed to `pending` and when it is done, the status changed to `fulfilled`. If you run it again, it's not starting to run again and fulfilled with the previous result unless you reset the runner. This means you can start the runner then do some heavy work and call it again to get the result without getting the process blocked! This method returns a promise that resolves after all of the given promises have either been fulfilled or rejected, with an array of objects that each describes the outcome of each promise.

```js
import {runParallelTasks} from "async-tasks-runner"
const result = await runParallelTasks(taskRunnerObject);

// [
//   {status: "fulfilled", value: 33},
//   {status: "fulfilled", value: 66},
//   {status: "fulfilled", value: 99},
//   {status: "rejected",  reason: Error: an error}
// ]
```

#### Result of Specific Task
After running the runner (no matter of status is `pending` or `fulfilled` or `rejected`), you can access a specific task with this method. The only parameter of this method is the index of the task. This method returns a Promise that resolves with the task result or is rejected with the current or previous task rejection.

```js
import {getParallelTasks} from "async-tasks-runner"
const result = await getParallelTasks(taskRunnerObject, 0);
```

#### Clone
You can clone tasks of your runner and create a new tasks runner.

```js
import {createParallelTasksRunner} from "async-tasks-runner"
const newTaskRunnerObject = createParallelTasksRunner(...taskRunnerObject.tasks);
```

### Serial Tasks Runner
You can run your tasks in sequence. the result is an array, like the `Promise.allSettled` result.

#### Create
You can create a serial task runner object by the calling of `createSerialTaskRunner`. The result will be an object that must be passed as the first argument to any helper functions that you want to use.

```js
import {createSerialTasksRunner} from "async-tasks-runner"
const taskRunnerObject = createSerialTasksRunner(...tasks);
```

Every task in the `SerialTasksRunner` must be a function without a parameter and return a promise.

```js
const url = "https://google.com";

const task1 = () => {
    return fetch(`${url}/first`);
}

const task2 = () => {
    return fetch(`${url}/second`);
}

const taskRunnerObject = createSerialTasksRunner(task1, task2);
```

#### Run
Start pending the runner. When it is called, the status changed to `pending` and when it is done, the status changed to `fulfilled`. If you run it again, it's not starting to run again and fulfilled with the previous result unless you reset the runner. This means you can start the runner then do some heavy work and call it again to get the result without getting the process blocked! This method returns a promise that resolves after all of the given promises have either been fulfilled or rejected, with an array of objects that each describes the outcome of each promise.

```js
import {runSerialTasks} from "async-tasks-runner"
const result = await runSerialTasks(taskRunnerObject);

// [
//   {status: "fulfilled", value: 33},
//   {status: "fulfilled", value: 66},
//   {status: "fulfilled", value: 99},
//   {status: "rejected",  reason: Error: an error}
// ]
```

#### Result of Specific Task
After running the runner (no matter of status is `pending` or `fulfilled` or `rejected`), you can access a specific task with this method. The only parameter of this method is the index of the task. This method returns a Promise that resolves with the task result or is rejected with the current or previous task rejection.

```js
import {getSerialTasks} from "async-tasks-runner"
const result = await getSerialTasks(taskRunnerObject, 0);
```

#### Clone
You can clone tasks of your runner and create a new tasks runner.

```js
import {createSerialTasksRunner} from "async-tasks-runner"
const newTaskRunnerObject = createSerialTasksRunner(...taskRunnerObject.tasks);
```

### Pipeline Tasks Runner
You can run your tasks in sequence. The result of the currently pending task will be the argument of the next task.

#### Create
You can create a serial task runner object by the calling of `createPipelineTaskRunner`. The result will be an object that must be passed as the first argument to any helper functions that you want to use.

```js
import {createPipelineTasksRunner} from "async-tasks-runner"
const taskRunnerObject = createPipelineTasksRunner(...tasks);
```

Every task in the `PipelineTasksRunner` must be a function that returns a promise. This function can accept one parameter that will be filled with the previous fulfilled task result.

```js
const url = "https://google.com";

const task1 = (code) => {
    return fetch(`${url}/${code}`);
}

const task2 = (data) => {
    return fetch(data.url);
}

const taskRunnerObject = createPipelineTasksRunner(task1, task2);
```

#### Run
With this method, you can start pending the tasks. When it is called, the status changed to `pending` and when it is done, the status changed to `fulfilled` if all tasks run successfully or `rejected` if one of the tasks in the list get failed (and the next tasks don't get run). If you run it again, it's not starting to run again and `fulfilled` or `rejected` with the previous result unless you reset the runner. This means you can start the runner then do some heavy work and call it again to get the result without getting the process blocked! This method always returns a promise that resolves with the final task result or rejects with an error. The `runPipelineTasks` function needs an extra argument for the parameter of the first task function (initial parameter).

```js
import {runPipelineTasks} from "async-tasks-runner"
const result = await runPipelineTasks(taskRunnerObject, firstArgument);

// [
//   {status: "fulfilled", value: 33},
//   {status: "fulfilled", value: 66},
//   {status: "fulfilled", value: 99},
//   {status: "rejected",  reason: Error: an error}
// ]
```

#### Result of Specific Task
After running the runner (no matter of status is `pending` or `fulfilled` or `rejected`), you can access a specific task with this method. The only parameter of this method is an index of the task. This method returns a Promise that resolves with the task result or is rejected with the current or previous task failure error.

```js
import {getPipelineTasks} from "async-tasks-runner"
const result = await getPipelineTasks(taskRunnerObject, 0);
```

#### Clone
You can clone tasks of your runner and create a new tasks runner.

```js
import {createPipelineTasksRunner} from "async-tasks-runner"
const newTaskRunnerObject = createPipelineTasksRunner(...taskRunnerObject.tasks);
```

## Extra Helper Functions

| Functions | Description| Parameter(s) | Return Value |
| ------ | ------- | ------ | ------- |
| createTimeoutResolve | create a delay with resolve | timeout: number, response: T, cancelToken?: Promise | promise |
| createTimeoutReject | create a delay with reject | timeout: number, response: T, cancelToken?: Promise | promise |
| createTaskWithTimeout | create a task with timeout | task: Task, timeout: number | Task

## Contribution

1. Fork this repository
2. Install dependencies using `yarn install` or `npm install`
3. Making your changes
4. Run the `yarn lint` command
5. Run the `yarn test` command
6. Push and make a PR

## License

[MIT License](./LICENSE)

Copyright (c) Mohammad Saleh Fadaei ([@ms-fadaei](https://github.com/ms-fadaei))


<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/async-tasks-runner/latest.svg
[npm-version-href]: https://npmjs.com/package/async-tasks-runner

[npm-downloads-src]: https://img.shields.io/npm/dt/async-tasks-runner.svg
[npm-downloads-href]: https://npmjs.com/package/async-tasks-runner

[github-actions-ci-src]: https://github.com/ms-fadaei/async-tasks-runner/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/ms-fadaei/async-tasks-runner/actions?query=workflow%3Aci

[license-src]: https://img.shields.io/npm/l/async-tasks-runner.svg
[license-href]: https://npmjs.com/package/async-tasks-runner
