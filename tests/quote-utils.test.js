const test = require('node:test');
const assert = require('node:assert/strict');

const utils = require('../js/utils/quote-utils.js');

test('formatPercentage adds plus sign for positive numbers', () => {
  assert.equal(utils.formatPercentage(1.2345), '+1.23%');
});

test('formatPercentage handles zero and negative values', () => {
  assert.equal(utils.formatPercentage(0), '0.00%');
  assert.equal(utils.formatPercentage(-3.456), '-3.46%');
});

test('formatPercentage falls back to placeholder when invalid', () => {
  assert.equal(utils.formatPercentage(null), '--');
  assert.equal(utils.formatPercentage('1.23'), '--');
});

test('getDirection compares current and previous prices', () => {
  assert.equal(utils.getDirection(120, 100), 'up');
  assert.equal(utils.getDirection(80, 100), 'down');
  assert.equal(utils.getDirection(100, 100), 'neutral');
});

test('getDirection validates inputs', () => {
  assert.equal(utils.getDirection(undefined, 100), 'neutral');
  assert.equal(utils.getDirection(120, undefined), 'neutral');
  assert.equal(utils.getDirection(NaN, 100), 'neutral');
});

test('getChangeDirection classifies variation sign correctly', () => {
  assert.equal(utils.getChangeDirection(3.2), 'up');
  assert.equal(utils.getChangeDirection(-1.8), 'down');
  assert.equal(utils.getChangeDirection(0), 'neutral');
});

test('getChangeDirection returns neutral when value is invalid', () => {
  assert.equal(utils.getChangeDirection(null), 'neutral');
  assert.equal(utils.getChangeDirection('2'), 'neutral');
  assert.equal(utils.getChangeDirection(NaN), 'neutral');
});
