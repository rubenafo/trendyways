import * as assert from 'assert';
import * as tw from '../dist/index.js';

describe('Vectors', function () {
  describe('diffVectors', function () {
    it('subtracts two equal-length arrays element-wise', function () {
      const result = tw.diffVectors([5, 3, 8], [2, 1, 6]);
      assert.deepEqual(result, [3, 2, 2]);
    });

    it('handles series of different lengths (pads missing elements with 0)', function () {
      const result = tw.diffVectors([5, 3], [2, 1, 6]);
      assert.deepEqual(result, [3, 2, -6]);
    });

    it('returns a single zero element for two empty inputs', function () {
      // stats.max([0, 0]) evaluates to 0, but the implementation still pushes
      // one zero-difference item — this documents the actual boundary behavior.
      const result = tw.diffVectors([], []);
      assert.deepEqual(result, [0]);
    });
  });

  describe('powVector', function () {
    it('squares every element', function () {
      const result = tw.powVector([2, 3, 4]);
      assert.deepEqual(result, [4, 9, 16]);
    });

    it('returns an empty array for empty input', function () {
      assert.deepEqual(tw.powVector([]), []);
    });

    it('handles negative values', function () {
      const result = tw.powVector([-3, -2, 5]);
      assert.deepEqual(result, [9, 4, 25]);
    });
  });

  describe('sumVector', function () {
    it('sums a plain numeric array', function () {
      assert.equal(tw.sumVector([1, 2, 3]), 6);
    });

    it('sums values from an array of objects using targetAttr', function () {
      assert.equal(tw.sumVector([{ v: 5 }, { v: 10 }], 'v'), 15);
    });

    it('returns 0 for an empty array', function () {
      assert.equal(tw.sumVector([]), 0);
    });
  });

  describe('avgVector', function () {
    it('computes the average of a plain numeric array', function () {
      assert.equal(tw.avgVector([2, 4, 6]), 4);
    });

    it('returns 0 for an empty array', function () {
      assert.equal(tw.avgVector([]), 0);
    });

    it('computes average with a targetAttr on object arrays', function () {
      const avg = tw.avgVector([{ x: 10 }, { x: 20 }, { x: 30 }], 'x');
      assert.equal(avg, 20);
    });
  });

  describe('absVector', function () {
    it('returns absolute values for a mixed array', function () {
      assert.deepEqual(tw.absVector([-1, -2, 3]), [1, 2, 3]);
    });

    it('leaves positive values unchanged', function () {
      assert.deepEqual(tw.absVector([4, 5, 6]), [4, 5, 6]);
    });

    it('returns an empty array for empty input', function () {
      assert.deepEqual(tw.absVector([]), []);
    });
  });

  describe('divVector', function () {
    it('divides two arrays element-wise', function () {
      assert.deepEqual(tw.divVector([4, 6, 9], [2, 3, 3]), [2, 2, 3]);
    });

    it('returns fractional values', function () {
      const result = tw.divVector([1, 1], [4, 2]);
      assert.equal(result[0], 0.25);
      assert.equal(result[1], 0.5);
    });
  });

  describe('combineVectors', function () {
    it('applies a function pairwise to two same-length arrays', function () {
      const result = tw.combineVectors([1, 2], [3, 4], (a, b) => a + b);
      assert.deepEqual(result, [4, 6]);
    });

    it('returns [-1] when arrays have different lengths', function () {
      const result = tw.combineVectors([1, 2], [3], (a, b) => a + b);
      assert.deepEqual(result, [-1]);
    });

    it('returns [-1] when both arrays are empty', function () {
      const result = tw.combineVectors([], [], (a, b) => a + b);
      assert.deepEqual(result, [-1]);
    });

    it('applies a multiplication function', function () {
      const result = tw.combineVectors([2, 3, 4], [5, 6, 7], (a, b) => a * b);
      assert.deepEqual(result, [10, 18, 28]);
    });
  });
});
