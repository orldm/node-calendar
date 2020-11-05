// Promises and Microtasks

setTimeout(() => console.log("T"), 0);
process.nextTick(() => console.log("next tick 1"));
global.queueMicrotask(() => console.log("queueM"));
process.nextTick(() => console.log("next tick 2"));
Promise.resolve().then(() => console.log("nextP"));
console.log("simple log");

// Node.js vs browser JS

setTimeout(() => console.log("timeout 1"));
setTimeout(() => {
  console.log("timeout2");
  Promise.resolve().then(() => console.log("promise resolve"));
});
setTimeout(() => console.log("timeout3"));
setTimeout(() => console.log("timeout4"));

// Experiment with Promise, process.nextTick, setTimeout, setImmediate

Promise.resolve().then(() => console.log("promise1 resolved"));
Promise.resolve().then(() => console.log("promise2 resolved"));
Promise.resolve().then(() => {
  console.log("promise3 resolved");
  process.nextTick(() =>
    console.log("next tick inside promise resolve handler")
  );
});
Promise.resolve().then(() => console.log("promise4 resolved"));
Promise.resolve().then(() => console.log("promise5 resolved"));
setImmediate(() => console.log("set immediate1"));
setImmediate(() => console.log("set immediate2"));
process.nextTick(() => console.log("next tick1"));
process.nextTick(() => console.log("next tick2"));
process.nextTick(() => console.log("next tick3"));
setTimeout(() => console.log("set timeout"), 0);
setImmediate(() => console.log("set immediate3"));
setImmediate(() => console.log("set immediate4"));
