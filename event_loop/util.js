module.exports = {
  repeat: (num) => {
    for (let i = 0; i < num; i++) {
      for (let j = 0; j < num; j++) {
        console.log(`${i}.${j}`);
      }
    }
  },
};
