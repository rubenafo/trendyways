import * as assert from 'assert';
import * as tw from '../dist/index.js';

describe('Statistics', function () {
  it('Max value in a simple serie', function () {
    const serie = [0, 6, 2, 7, 8, 9];
    assert.deepEqual(tw.max(serie), 9, 'Correct max value of a sample serie');
  });

  it('Min value in a simple serie', function () {
    const serie = [0, 6, 2, 7, 8, 9];
    assert.deepEqual(tw.min(serie), 0, 'Correct min value of a sample serie');
  });

  it('Mean of zero is zero', function () {
    const serie: any[] = [];
    assert.deepEqual(tw.mean(serie), 0, 'Mean of zeor values is zero');
  });

  it('Mean of a simple serie', function () {
    const serie = [2, 6, 5, 7, 10, 9, 12, 5];
    assert.deepEqual(tw.mean(serie), 7, 'Mean value of a sample serie');
  });

  it('Standard deviation of a serie', function () {
    const serie = [2, 4, 4, 4, 5, 5, 7, 9];
    assert.deepEqual(tw.sd(serie), 2, 'Correct standard deviation of a sample serie');
  });
});
