const regex = /-([a-z]+)=([a-z]+)/;
const args = process.argv.slice(2);
const data = {};
args.forEach((item) => {
  const match = item.match(regex);
  if (match) data[match[1]] = match[2];
});
module.exports = {
  PORT: process.env.PORT || 3000,
  ENV: data.env || "dev",
};
