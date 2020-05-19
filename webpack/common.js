const path = require('path');

// environment

exports.isDevelopment = function isDevelopment() {
  return process.env.NODE_ENV === 'development';
};

// paths

const OUTPUT_DIR = 'dist';

exports.getContext = function getContext() {
  return process.cwd();
};

exports.getWorkingPath = function getWorkingPath(filePath = '') {
  return path.resolve(exports.getContext(), filePath);
};

exports.getOutputPath = function getOutputPath(filePath = '') {
  return path.resolve(exports.getContext(), OUTPUT_DIR, filePath);
};
