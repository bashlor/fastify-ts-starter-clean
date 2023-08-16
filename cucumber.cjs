const common = [
  './module/core/feature/**/*.feature', // Specify our feature files
  '--import ./build/feature/**/*.step.js', // Load step definitions
  '--format progress-bar',
  '--publish-quiet',
].join(' ');

module.exports = {
  default: common,
};
