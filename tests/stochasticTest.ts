import * as assert from 'assert';
import * as tw from '../dist/index.js';

describe('Stochastic Oscillator', function () {
  it('Stochastic values for a sample serie', function () {
    const highs = [10, 12, 11, 13, 15, 14, 16, 18, 17, 19];
    const lows = [8, 10, 9, 11, 13, 12, 14, 16, 15, 17];
    const closes = [9, 11, 10, 12, 14, 13, 15, 17, 16, 18];

    const stoch = tw.stochastic(highs, lows, closes, 5, 3);

    assert.strictEqual(stoch.length, closes.length, 'Result length matches input length');

    for (let i = 0; i < stoch.length; i++) {
      assert.strictEqual(typeof stoch[i].k, 'number', `stoch[${i}].k is a number`);
      if (i >= 2) {
        assert.strictEqual(typeof stoch[i].d, 'number', `stoch[${i}].d is a number`);
      }
    }

    for (let i = 0; i < stoch.length; i++) {
      assert.strictEqual(stoch[i].k >= 0 && stoch[i].k <= 100, true, `%K value is between 0-100 at index ${i}`);
    }

    const expectedK = ((closes[4] - Math.min(...lows.slice(0, 5))) / (Math.max(...highs.slice(0, 5)) - Math.min(...lows.slice(0, 5)))) * 100;
    assert.strictEqual(stoch[4].k, expectedK, 'First full-window %K value calculated correctly');
  });

  it('Stochastic with different periods', function () {
    const highs = [10, 12, 11, 13, 15, 14, 16, 18, 17, 19, 20, 21];
    const lows = [8, 10, 9, 11, 13, 12, 14, 16, 15, 17, 18, 19];
    const closes = [9, 11, 10, 12, 14, 13, 15, 17, 16, 18, 19, 20];

    const stoch14 = tw.stochastic(highs, lows, closes, 14, 3);
    const stoch5 = tw.stochastic(highs, lows, closes, 5, 3);

    assert.strictEqual(stoch14.length, closes.length, '14-period result has correct length');
    assert.strictEqual(stoch5.length, closes.length, '5-period result has correct length');
    assert.notStrictEqual(stoch14[10].k, stoch5[10].k, 'Different periods produce different %K values');
  });

  it('Stochastic throws error for mismatched input lengths', function () {
    const highs = [10, 12, 11];
    const lows = [8, 10];
    const closes = [9, 11, 10];

    assert.throws(() => {
      tw.stochastic(highs, lows, closes, 5, 3);
    }, 'Should throw error for mismatched array lengths');
  });
});
