# Async Tasks Runner
> Work In Progress
With this module you can run your tasks in 3 different ways:
* Parallel: You can run your tasks in parallel.
* Serial: You can run your tasks in sequence. the result is an array, like the `Promise.allSettled` result.
* Pipeline: You can run your tasks in sequence. The result of the current task will be the argument of the next task.