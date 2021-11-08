# Async Tasks Runner
> Work In Progress
With this module you can run your tasks in 3 different ways:
* Parallel: You can run your tasks in parallel.
* Serial: You can run your tasks in sequence. the result is an array, like the `Promise.allSettled` result.
* Pipeline: You can run your tasks in sequence. The result of the current task will be the argument of the next task.

## status
All of the runners have 4 different status that represents of runner's status:
1. `load`: You can add or remove tasks to the runner. This status actually present that the runner is not started yet!
2. `running`: Represent that the runner starts running the tasks and in the meantime, you can't nor add/remove tasks to/from the runner neither reset the runner.
3. `fulfilled`: Represent that the runner did its job and now you can use the result or reset the runner to add/remove tasks to/from the runner and run them again.
4. `rejected`: In this status, the runner did its job but with an error in the process and the whole run is rejected. Like `fulfilled` status, you can reset the runner to add/remove tasks to/from the runner and run them again.
