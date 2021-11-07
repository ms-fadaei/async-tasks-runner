const getExport = name => import('../dist/index.mjs').then(r => r[name])
const createCaller = name => (input, init) => getExport(name).then(fn => fn(input, init))

exports.ParallelTasksRunner = createCaller('ParallelTasksRunner')
exports.SerialTasksRunner = createCaller('SerialTasksRunner')
exports.PipelineTasksRunner = createCaller('PipelineTasksRunner')