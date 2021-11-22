import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createTimeoutResolve, createTimeoutReject, createTaskWithTimeout, timeoutResult } from '../dist/helpers.mjs';

use(chaiAsPromised);

describe('Helpers', () => {
  it('create timeout resolve', async () => {
    await expect(createTimeoutResolve(2, 'resolve')).to.eventually.equal('resolve');
  });

  it('create timeout reject', async () => {
    await expect(createTimeoutReject(2, 'reject')).to.eventually.rejectedWith('reject');
  });

  it('create task with timeout: fulfilled task', async () => {
    const task = createTaskWithTimeout(createTimeoutResolve.bind(null, 2, 'resolve'), 3);
    await expect(task()).to.eventually.equal('resolve');
  });

  it('create task with timeout: rejected task', async () => {
    const task = createTaskWithTimeout(createTimeoutReject.bind(null, 2, 'reject'), 3);
    await expect(task()).to.eventually.rejectedWith('reject');
  });

  it('create task with timeout: rejected timeout', async () => {
    const task = createTaskWithTimeout(createTimeoutReject.bind(null, 4, 'reject'), 3);
    await expect(task()).to.eventually.rejectedWith(timeoutResult);
  });
});
