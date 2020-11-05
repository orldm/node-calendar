// fibonacci number calculation on worker thread
// usage: node fibonacci.js n
// where n - number to calculate
const {
  Worker,
  workerData,
  parentPort,
  isMainThread,
} = require("worker_threads");

if (isMainThread) {
  const args = process.argv.slice(2);
  const number = args.length && parseInt(args[0], 10);
  const value = Number.isFinite(number) ? number : 0;
  const worker = new Worker(__filename, { workerData: { value } });
  worker.on("message", (result) => {
    console.log(result);
  });
} else {
  function fib(n) {
    if (n <= 0) {
      return 0;
    } else if (n === 1) {
      return 1;
    } else {
      return fib(n - 1) + fib(n - 2);
    }
  }
  parentPort.postMessage(fib(workerData.value));
}
