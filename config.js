const regex = /-env=([a-z]+)/;
const args = process.argv.slice(2)[0];
const match = args && args.match(regex) && args.match(regex)[1];
const ENV = match || "dev";
module.exports = {
  PORT: process.env.PORT || 3000,
  ENV,
};
