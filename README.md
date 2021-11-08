# Async Tasks Runner
With this module you can run your tasks in 3 different ways:

* Parallel: You can run your tasks in parallel. the result is an array, like the `Promise.allSettled` result.
* Serial: You can run your tasks in sequence. the result is an array, like the `Promise.allSettled` result.
* Pipeline: You can run your tasks in sequence. The result of the currently running task will be the argument of the next task.


## Parallel Tasks Runner
You can run your tasks in parallel. the result is an array, like the `Promise.allSettled` result.

### create instance
You can pass tasks to the constructor.

```js
const parallelTasks = new ParallelTasksRunner(...tasks);
```

Every task in the `ParallelTasksRunner` must be a function that returns a promise. You can use javascript closure to pass items to tasks.

```js
function createTasksRunner() {
    const url = "https://google.com";

    const task1 = () => {
        return fetch("${url}/first");
    }

    const task2 = () => {
        return fetch("${url}/second");
    }

    return new SerialTasksRunner(task1, task2);
}
```

### status
You can get status of the runner with this property. [See Status Section](#status-3)

```js
parallelTasks.statue // load | running | fulfilled | rejected
```

### add task(s)
You can add tasks to the runner only when its status is `load`. This method returns the index of the last added task in the tasks list.

```js
parallelTasks.add(task1, task2, ...tasks)
```

### remove task(s)
You can remove tasks from the runner only when it's status is `load`. this method returns the list of removed tasks.

```js
// remove 3 tasks, started from index 2
const startIndex = 2;
const count = 3;
parallelTasks.remove(startIndex, count)
```

### run tasks
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

### get specific running task
After calling the `run` method (no matter of status is `running` or `fulfilled`), you can access a specific task with this method. The only parameter of this method is an index of the task. This method returns a promise.

```js
const result = await parallelTasks.get(0);
```

### reset the runner
When the running process is done (`fulfilled` or `rejected`), you can reset the runner to add or remove tasks or run it again.

```js
parallelTasks.reset();
```

## Serial Tasks Runner
You can run your tasks in sequence. the result is an array, like the `Promise.allSettled` result.

### create instance
You can pass tasks to the constructor.

```js
const serialTasks = new SerialTasksRunner(...tasks);
```

Every task in the `SerialTasksRunner` must be a function that returns a promise. You can use javascript closure to pass items to tasks.

```js
function createTasksRunner() {
    const url = "https://google.com";

    const task1 = () => {
        return fetch("${url}/first");
    }

    const task2 = () => {
        return fetch("${url}/second");
    }

    return new SerialTasksRunner(task1, task2);
}
```

### status
You can get status of the runner with this property. [See Status Section](#status-3)

```js
serialTasks.statue // load | running | fulfilled | rejected
```

### add task(s)
You can add tasks to the runner only when its status is `load`. This method returns the index of the last added task in the tasks list.

```js
serialTasks.add(task1, task2, ...tasks)
```

### remove task(s)
You can remove tasks from the runner only when it's status is `load`. this method returns the list of removed tasks.

```js
// remove 3 tasks, started from index 2
const startIndex = 2;
const count = 3;
serialTasks.remove(startIndex, count)
```

### run tasks
With this method, you can start running the tasks. When it is called for the first time, the status changed to `running` and when it is done, the status changed to `fulfilled` if all tasks run successfully or `rejected` if one of the tasks in the list get failed (and the next tasks don't get run). If you run it again, it's not starting to run again and `fulfilled` or `rejected` with the previous result unless you reset the runner. This means you can start the runner then do some heavy work and call it again to get the result without getting the process blocked! This method always returns a promise that resolves or rejects an array of completed tasks like [Promise.allSettled]() format.

```js
const result = await serialTasks.run();

// [
//   {status: "fulfilled", value: 33},
//   {status: "fulfilled", value: 66},
//   {status: "fulfilled", value: 99},
// ]
```

### get specific running task
After calling the `run` method (no matter of status is `running` or `fulfilled` or `rejected`), you can access a specific task with this method. The only parameter of this method is an index of the task. This method returns a Promise that resolves with the task result or is rejected with the current or previous task failure error.

```js
const result = await serialTasks.get(0);
```

### reset the runner
When the running process is done (`fulfilled` or `rejected`), you can reset the runner to add or remove tasks or run it again.

```js
serialTasks.reset();
```

## Pipeline Tasks Runner
You can run your tasks in sequence. The result of the currently running task will be the argument of the next task.

### create instance
You can pass tasks to the constructor.

```js
const pipelineTasks = new PipelineTasksRunner(...tasks);
```

Every task in the `PipelineTasksRunner` must be a function that returns a promise. This function can accept one parameter. This parameter is filled with the previous task result. You can use javascript closure to pass items to tasks.

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

### status
You can get status of the runner with this property. [See Status Section](#status-3)

```js
pipelineTasks.statue // load | running | fulfilled | rejected
```

### add task(s)
You can add tasks to the runner only when its status is `load`. This method returns the index of the last added task in the tasks list.

```js
pipelineTasks.add(task1, task2, ...tasks)
```

### remove task(s)
You can remove tasks from the runner only when it's status is `load`. this method returns the list of removed tasks.

```js
// remove 3 tasks, started from index 2
const startIndex = 2;
const count = 3;
pipelineTasks.remove(startIndex, count)
```

### run tasks
With this method, you can start running the tasks. When it is called for the first time, the status changed to `running` and when it is done, the status changed to `fulfilled` if all tasks run successfully or `rejected` if one of the tasks in the list get failed (and the next tasks don't get run). If you run it again, it's not starting to run again and `fulfilled` or `rejected` with the previous result unless you reset the runner. This means you can start the runner then do some heavy work and call it again to get the result without getting the process blocked! This method always returns a promise that resolves with the final task result or rejects with an error.

```js
const result = await pipelineTasks.run();

// result: 99
```

### get specific running task
After calling the `run` method (no matter of status is `running` or `fulfilled` or `rejected`), you can access a specific task with this method. The only parameter of this method is an index of the task. This method returns a Promise that resolves with the task result or is rejected with the current or previous task failure error.

```js
const result = await pipelineTasks.get(0);
```

### reset the runner
When the running process is done (`fulfilled` or `rejected`), you can reset the runner to add or remove tasks or run it again.

```js
pipelineTasks.reset();
```

## status
All of the runners have 4 different status that represents of runner's status:
1. `load`: You can add or remove tasks to the runner. This status actually present that the runner is not started yet!
2. `running`: Represent that the runner starts running the tasks and in the meantime, you can't nor add/remove tasks to/from the runner neither reset the runner.
3. `fulfilled`: Represent that the runner did its job and now you can use the result or reset the runner to add/remove tasks to/from the runner and run them again.
4. `rejected`: In this status, the runner did its job but with an error in the process and the whole run is rejected. Like `fulfilled` status, you can reset the runner to add/remove tasks to/from the runner and run them again.
