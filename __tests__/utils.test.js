import { hlsa2rgba } from '../utils'
import { isTSAnyKeyword } from '@babel/types';

describe('hlsa2rgba', () => {
  it('returns the correct value', () => {
    const rgba = hlsa2rgba(208.8118811881188 / 360, 0.8211, 0.5176, 0.4)
    expect(rgba).toEqual([31, 136, 233, 0.4])
  })
})
