# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.0.0-beta.1](https://github.com/ms-fadaei/async-tasks-runner/compare/v1.0.0-beta.0...v1.0.0-beta.1) (2021-11-16)


### ⚠ BREAKING CHANGES

* `resetTasks` removed. you can use `runner = create*TasksRunner(...runner.tasks)` instead
* use `ParallelTask` & `SerialTask`type instead of `NormalTask`
* use `NormalTask` type instead of `Task` type for `parallel` and `serial` runners

### Features

* add heplers module ([a5da6d4](https://github.com/ms-fadaei/async-tasks-runner/commit/a5da6d41afe746846e48249e03a3af6980ea2a79))
* add the ability to update tasks even after run ([5eaa3f9](https://github.com/ms-fadaei/async-tasks-runner/commit/5eaa3f99d19b1f90134c9b3d43717d98a8df4e0e))


### Bug Fixes

* fix executeCount type ([d4ef5bd](https://github.com/ms-fadaei/async-tasks-runner/commit/d4ef5bde2809e60a6f78f7ee375967f0c3268fde))


* use strict type for tasks ([845ae89](https://github.com/ms-fadaei/async-tasks-runner/commit/845ae893b8ff367ca15abf83d7fdd5eda370a05d))


### refator

* split `NormalTask` type ([d74c394](https://github.com/ms-fadaei/async-tasks-runner/commit/d74c39420ccfa010edd8839ae3448f7d115cd61d))


### fractor

* remove `resetTasks` function ([1892230](https://github.com/ms-fadaei/async-tasks-runner/commit/189223004167505f30cf046b6e0c42596f9eaafc))

## [1.0.0-beta.0](https://github.com/ms-fadaei/async-tasks-runner/compare/v0.0.2...v1.0.0-beta.0) (2021-11-15)


### ⚠ BREAKING CHANGES

* use `TasksRunnerStatus` type instead of `TaskRunnerStatus`
* you need to use `standby` instead of `load`
* You need to use new `create*TasksRunner()` exports
* you need to use `pending` instead of `running`

### Features

* fully type support ([434d4b0](https://github.com/ms-fadaei/async-tasks-runner/commit/434d4b05b3addab86d58197277a374b458606e83))
* tasks can be added in any position ([c5b0dba](https://github.com/ms-fadaei/async-tasks-runner/commit/c5b0dba0bc859a766d4763b7648fbf5d3ccf5013))


### Bug Fixes

* fix common js bug in importing package ([901e9c1](https://github.com/ms-fadaei/async-tasks-runner/commit/901e9c12a0c599ced91225f72303a821b60d32fa))


* rename `load` status to `standby` ([2fd713b](https://github.com/ms-fadaei/async-tasks-runner/commit/2fd713b119cd1d9018f923f82ee9295a1f86e3ae))
* rename `running` status to `pending` ([89abebe](https://github.com/ms-fadaei/async-tasks-runner/commit/89abebe544cb74e1499f65152fe8554283119637))
* use conversational naming ([ab71221](https://github.com/ms-fadaei/async-tasks-runner/commit/ab7122176daf04a03eddc2392f1bbc1273673ef6))
* use named functions instead of classes ([7d07ba9](https://github.com/ms-fadaei/async-tasks-runner/commit/7d07ba912807791d9d13144692f5ff52ea963d37))

### [0.0.2](https://github.com/ms-fadaei/async-tasks-runner/compare/v0.0.1...v0.0.2) (2021-11-08)

### 0.0.1 (2021-11-08)


### Features

* add ci ([b8fb1d7](https://github.com/ms-fadaei/async-tasks-runner/commit/b8fb1d7617b7565ecf411d86e9838f34ac4945a8))
* add more detail on getRunningTask rejection ([8ac119f](https://github.com/ms-fadaei/async-tasks-runner/commit/8ac119f1d201decd4390bf17ebdd09870e0933bf))
* add playground ([b5d57c1](https://github.com/ms-fadaei/async-tasks-runner/commit/b5d57c1b058d5b1de8a9405cde0e857b438a5991))
* add project structure ([502ed4f](https://github.com/ms-fadaei/async-tasks-runner/commit/502ed4f1384624f167168460ec3dedc8f0a8e941))
* add remove(tasks) method to runners ([6662910](https://github.com/ms-fadaei/async-tasks-runner/commit/666291019c38c676d7345e2b8af8331542090884))
* add reset method ([119d44d](https://github.com/ms-fadaei/async-tasks-runner/commit/119d44d1ffa88a9853df13c9359bfbb5a5ef6836))
* getRunningTask now return the task always ([53ee9a7](https://github.com/ms-fadaei/async-tasks-runner/commit/53ee9a7c0a4c5b9698762be0ad2e12e17de357c9))
* init project ([6975963](https://github.com/ms-fadaei/async-tasks-runner/commit/69759634614ca7d0370c84e3105bf0a1b40999f8))
* pass tasks to class constractor ([77590b5](https://github.com/ms-fadaei/async-tasks-runner/commit/77590b5d7e2d262e9fa4809de036183e892eeb34))
* use cached firstArg for getRunningTask in pipline ([a248244](https://github.com/ms-fadaei/async-tasks-runner/commit/a24824491e788359803e7c2a0abef62a72d1e01f))


### Bug Fixes

* remove throwing an error on addTask ([eee0ef6](https://github.com/ms-fadaei/async-tasks-runner/commit/eee0ef625514fe38d60de6db9020bf3fe1c6f3e6))
* use parrent-like add methode in pipleine ([0cef38e](https://github.com/ms-fadaei/async-tasks-runner/commit/0cef38e85dc4e62a7fc30292de1c36303ff963b8))
* use promise rejection on absente running task ([12ec4fd](https://github.com/ms-fadaei/async-tasks-runner/commit/12ec4fd369b4857a378ba464b90a1641285a4874))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
