# Async Tasks Runner

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> 1KB GZIPPED, side-effect free, tree shakable, zero dependencies, and fully typed Tasks Runner. Run your tasks in parallel, serial & pipeline in a more complicated and performant way.

With this module you can run your tasks in 3 different ways:

* Parallel: You can run your tasks in parallel. the result is an array, like the `Promise.allSettled` result.
* Serial: You can run your tasks in sequence. the result is an array, like the `Promise.allSettled` result.
* Pipeline: You can run your tasks in sequence. The result of the currently running task will be the argument of the next task.

⚠️ Attention: This package comes without any polyfills. If you want to support an older environment, please polyfills it depending on what you need.
* ES2015 const/let
* ES2015 Classes
* ES2015 Generator Functions
* ES2015 Promise
* ES2018 async/await
* ES2020 Promise.allSettled (Just for the ParallelTasksRunner)
<img width="500" alt="support" src="https://user-images.githubusercontent.com/54557683/140873841-a323fc0c-5bc1-4b65-adcd-654f572da2d1.png">

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
import {ParallelTasksRunner, SerialTasksRunner, PipelineTasksRunner} from "async-tasks-runner"

// CJS
const ParallelTasksRunner = require("async-tasks-runner").ParallelTasksRunner
```

## Classes

| Class | Example |
| ------ | ------- |
| ParallelTasksRunner | See [Examples](#parallel-tasks-runner) |
| SerialTasksRunner | See [Examples](#serial-tasks-runner) |
| PipelineTasksRunner | See [Examples](#pipeline-tasks-runner) |

## Properties

| Property | Description |
| ------ | ------- |
| status | current status of the runner. [See Status Section](#status) |

### status
All of the runners have 4 different status that represents of runner's status:
1. `load`: You can add or remove tasks to the runner. This status actually present that the runner is not started yet!
2. `running`: Represent that the runner starts running the tasks and in the meantime, you can't nor add/remove tasks to/from the runner neither reset the runner.
3. `fulfilled`: Represent that the runner did its job and now you can use the result or reset the runner to add/remove tasks to/from the runner and run them again.
4. `rejected`: In this status, the runner did its job but with an error in the process and the whole run is rejected. Like `fulfilled` status, you can reset the runner to add/remove tasks to/from the runner and run them again.

## Methods

| Method | Description | Parameter(s) | Retrun |
| ------ | ------- | ------- | ------- |
| add  | add tasks to the runner | ...tasks | number: index of last addaed tasks |
| remove | remove tasks from the runner | start index, count | array: list of removed tasks |
| reset | resets the runner to start over | none | this: the class instance |
| run | starts the runner | none | array: list of removed tasks |
| get | get promise of the task by index | index of the task | promise: promise of the task |

## Examples

### Parallel Tasks Runner
You can run your tasks in parallel. the result is an array, like the `Promise.allSettled` result.

#### create instance
You can pass tasks to the constructor.

```js
import {ParallelTasksRunner} from "async-tasks-runner"
const parallelTasks = new ParallelTasksRunner(...tasks);
```

Every task in the `ParallelTasksRunner` must be a function without a parameter that returns a promise.

```js
function createTasksRunner() {
    const url = "https://google.com";

    const task1 = () => {
        return fetch(`${url}/first`);
    }

    const task2 = () => {
        return fetch(`${url}/second`);
    }

    return new SerialTasksRunner(task1, task2);
}
```

#### status
You can get status of the runner with this property. [See Status Section](#status)

```js
parallelTasks.statue // load | running | fulfilled | rejected
```

#### add task(s)
You can add tasks to the runner only when its status is `load`. This method returns the index of the last added task in the tasks list.

```js
parallelTasks.add(task1, task2, ...tasks)
```

#### remove task(s)
You can remove tasks from the runner only when it's status is `load`. this method returns the list of removed tasks.

```js
// remove 3 tasks, started from index 2
const startIndex = 2;
const count = 3;
parallelTasks.remove(startIndex, count)
```

#### run tasks
With this method, you can start running the tasks. When it is called for the first time, the status changed to `running` and when it is done, the status changed to `fulfilled`. If you run it again, it's not starting to run again and fulfilled with the previous result unless you reset the runner. This means you can start the runner then do some heavy work and call it again to get the result without getting the process blocked! This method always returns a promise that resolves an array of completed tasks like [Promise.allSettled]() format.

```js
const result = await parallelTasks.run();

// [
//   {status: "fulfilled", value: 33},
//   {status: "fulfilled", value: 66},
//   {status: "fulfilled", value: 99},
//   {status: "rejected",  reason: Error: an error}
// ]
```

#### get specific running task
After calling the `run` method (no matter of status is `running` or `fulfilled`), you can access a specific task with this method. The only parameter of this method is an index of the task. This method returns a promise.

```js
const result = await parallelTasks.get(0);
```

#### reset the runner
When the running process is done (`fulfilled` or `rejected`), you can reset the runner to add or remove tasks or run it again.

```js
parallelTasks.reset();
```

### Serial Tasks Runner
You can run your tasks in sequence. the result is an array, like the `Promise.allSettled` result.

#### create instance
You can pass tasks to the constructor.

```js
import {SerialTasksRunner} from "async-tasks-runner"
const serialTasks = new SerialTasksRunner(...tasks);
```

Every task in the `SerialTasksRunner` must be a function without a parameter that returns a promise.

```js
function createTasksRunner() {
    const url = "https://google.com";

    const task1 = () => {
        return fetch(`${url}/first`);
    }

    const task2 = () => {
        return fetch(`${url}/second`);
    }

    return new SerialTasksRunner(task1, task2);
}
```

#### status
You can get status of the runner with this property. [See Status Section](#status)

```js
serialTasks.statue // load | running | fulfilled | rejected
```

#### add task(s)
You can add tasks to the runner only when its status is `load`. This method returns the index of the last added task in the tasks list.

```js
serialTasks.add(task1, task2, ...tasks)
```

#### remove task(s)
You can remove tasks from the runner only when it's status is `load`. this method returns the list of removed tasks.

```js
// remove 3 tasks, started from index 2
const startIndex = 2;
const count = 3;
serialTasks.remove(startIndex, count)
```

#### run tasks
With this method, you can start running the tasks. When it is called for the first time, the status changed to `running` and when it is done, the status changed to `fulfilled` if all tasks run successfully or `rejected` if one of the tasks in the list get failed (and the next tasks don't get run). If you run it again, it's not starting to run again and `fulfilled` or `rejected` with the previous result unless you reset the runner. This means you can start the runner then do some heavy work and call it again to get the result without getting the process blocked! This method always returns a promise that resolves or rejects an array of completed tasks like [Promise.allSettled]() format.

```js
const result = await serialTasks.run();

// [
//   {status: "fulfilled", value: 33},
//   {status: "fulfilled", value: 66},
//   {status: "fulfilled", value: 99},
// ]
```

#### get specific running task
After calling the `run` method (no matter of status is `running` or `fulfilled` or `rejected`), you can access a specific task with this method. The only parameter of this method is an index of the task. This method returns a Promise that resolves with the task result or is rejected with the current or previous task failure error.

```js
const result = await serialTasks.get(0);
```

#### reset the runner
When the running process is done (`fulfilled` or `rejected`), you can reset the runner to add or remove tasks or run it again.

```js
serialTasks.reset();
```

### Pipeline Tasks Runner
You can run your tasks in sequence. The result of the currently running task will be the argument of the next task.

#### create instance
You can pass tasks to the constructor.

```js
import {PipelineTasksRunner} from "async-tasks-runner"
const pipelineTasks = new PipelineTasksRunner(...tasks);
```

Every task in the `PipelineTasksRunner` must be a function that returns a promise. This function can accept one parameter that will be filled with the previous fulfilled task result.

```js
function createTasksRunner() {
    const url = "https://google.com";

    const task1 = (code) => {
        return fetch(`${url}/${code}`);
    }

    const task2 = (code) => {
        return fetch(`${url}/${code}`);
    }

    return new PipelineTasksRunner(task1, task2);
}
```

#### status
You can get status of the runner with this property. [See Status Section](#status)

```js
pipelineTasks.statue // load | running | fulfilled | rejected
```

#### add task(s)
You can add tasks to the runner only when its status is `load`. This method returns the index of the last added task in the tasks list.

```js
pipelineTasks.add(task1, task2, ...tasks)
```

#### remove task(s)
You can remove tasks from the runner only when it's status is `load`. this method returns the list of removed tasks.

```js
// remove 3 tasks, started from index 2
const startIndex = 2;
const count = 3;
pipelineTasks.remove(startIndex, count)
```

#### run tasks
With this method, you can start running the tasks. When it is called for the first time, the status changed to `running` and when it is done, the status changed to `fulfilled` if all tasks run successfully or `rejected` if one of the tasks in the list get failed (and the next tasks don't get run). If you run it again, it's not starting to run again and `fulfilled` or `rejected` with the previous result unless you reset the runner. This means you can start the runner then do some heavy work and call it again to get the result without getting the process blocked! This method always returns a promise that resolves with the final task result or rejects with an error. The `run` method in the `PipelineTaskRunner` needs an argument for the parameter of the first task function (initial parameter).

```js
const result = await pipelineTasks.run(firstTaskParameterValue);

// result: 99
```

#### get specific running task
After calling the `run` method (no matter of status is `running` or `fulfilled` or `rejected`), you can access a specific task with this method. The only parameter of this method is an index of the task. This method returns a Promise that resolves with the task result or is rejected with the current or previous task failure error.

```js
const result = await pipelineTasks.get(0);
```

#### reset the runner
When the running process is done (`fulfilled` or `rejected`), you can reset the runner to add or remove tasks or run it again.

```js
pipelineTasks.reset();
```

## Contribution

1. Fork this repository
2. Install dependencies using `yarn install` or `npm install`
3. Making your changes
4. Run the `yarn lint` command
5. Run the` yarn test` command
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

[codecov-src]: https://img.shields.io/codecov/c/github/ms-fadaei/async-tasks-runner.svg
[codecov-href]: https://codecov.io/gh/ms-fadaei/async-tasks-runner

[license-src]: https://img.shields.io/npm/l/async-tasks-runner.svg
[license-href]: https://npmjs.com/package/async-tasks-runner
