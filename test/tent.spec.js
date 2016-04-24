import assert from 'assert'
import {
  parseNpmModuleSytax,
  parseJsbinUrl,
  parseGistUrl,
  getComments,
  parseComments
} from '../src/main'

// parseNpmModuleSytax
assert.deepEqual(parseNpmModuleSytax('lodash'), {"module":"lodash","version":false,"path":false,"method":false})
assert.deepEqual(parseNpmModuleSytax('lodash@4.11.1'), {"module":"lodash","version":"4.11.1","path":false,"method":false})
assert.deepEqual(parseNpmModuleSytax('lodash/file'), {"module":"lodash","version":false,"path":"file","method":false})
assert.deepEqual(parseNpmModuleSytax('lodash[uniq]'), {"module":"lodash","version":false,"path":false,"method":"uniq"})
assert.deepEqual(parseNpmModuleSytax('lodash@4.11.1/file'), {"module":"lodash","version":"4.11.1","path":"file","method":false})
assert.deepEqual(parseNpmModuleSytax('lodash@4.11.1[uniq]'), {"module":"lodash","version":"4.11.1","path":false,"method":"uniq"})
assert.deepEqual(parseNpmModuleSytax('lodash/file[uniq]'), {"module":"lodash","version":false,"path":"file","method":"uniq"})
assert.deepEqual(parseNpmModuleSytax('lodash@4.11.1/file[uniq]'), {"module":"lodash","version":"4.11.1","path":"file","method":"uniq"})

// parseJsbinUrl
assert.deepEqual(parseJsbinUrl('https://jsbin.com/api/wanegavisa'), {"id": "wanegavisa"})
assert.deepEqual(parseJsbinUrl('https://output.jsbin.com/wanegavisa'), {"id": "wanegavisa"})
assert.deepEqual(parseJsbinUrl('https://jsbin.com/api/wanegavisa'), {"id": "wanegavisa"})

// parseGistUrl
assert.deepEqual(parseGistUrl('https://gist.github.com/reggi/91d576d29c76521e7a4f57d2f25e20a9'), {"username": "reggi", "id": "91d576d29c76521e7a4f57d2f25e20a9", "anchor": false})
assert.deepEqual(parseGistUrl('https://gist.github.com/reggi/91d576d29c76521e7a4f57d2f25e20a9#file-left-pad-js'), {"username": "reggi", "id": "91d576d29c76521e7a4f57d2f25e20a9", "anchor": "file-left-pad-js"})

// getComments
assert.deepEqual(getComments('alpha /* beta */ gamma'), ['beta'])
assert.deepEqual(getComments('alpha /* /* beta */ */ gamma'), ['/* beta'])
assert.deepEqual(getComments('alpha /* beta */ gamma // delta'), ['beta', 'delta'])
assert.deepEqual(getComments('alpha // alpha // beta'), ['alpha // beta'])
assert.deepEqual(getComments('alpha // beta'), ['beta'])
assert.deepEqual(getComments('alpha beta'), [])
assert.deepEqual(getComments(''), [])

assert.deepEqual(parseComments(['tent build my-module@1.0.0'], {'key': 'build', 'value': 'my-module@1.0.0'})
