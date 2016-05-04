import niftBabel from 'nift-babel'
export const def = ['reggi-left-pad@1.0.0', niftBabel({presets: ['es2015']}]
export default (v, n, c = '0') => String(v).length >= n ? '' + v : (String(c).repeat(n) + v).slice(-n)
