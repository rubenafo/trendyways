/**
 * This test checks multiple window of size n and different k values on
 * a sample serie.
 */

import * as assert from 'assert';
import * as tw from '../dist/index.js';

describe('Bollinger', function () {
  it('Bollinger bands values for a sample serie', function () {
    const serie = [{ c: 2.1 }, { c: 4.3 }, { c: 4.5 }, { c: 4.8 }, { c: 5.0 }, { c: 5.8 }, { c: 7.1 }, { c: 9.1 }];
    for (let k = 1; k < 4; k++) {
      for (let n = 1; n < serie.length; n++) {
        const bands = tw.bollinger(serie, n, k);
        for (let i = n; i < serie.length - n + 1; i++) {
          const stdDev = tw.sd(serie.slice(i, i + n), ['c']);
          assert.deepEqual(bands[i].ub, bands[i].ma + stdDev * k, 'Upper value nº ' + i + ' correct (n=' + n + ',k=' + k + ')');
          assert.deepEqual(bands[i].lb, bands[i].ma - stdDev * k, 'Lower value nº ' + i + ' correct (n=' + n + ',k=' + k + ')');
        }
      }
    }
  });
});
