import { package } from 'nift'
import niftBabel from 'nift-babel'
import niftForReggi from 'nift-for-reggi'

let myCustomPackageDesigner = [
  niftAutoDeps(),
  niftAutoVersionedDeps(),
  niftAuthor('Thomas Reggi'),
  niftBabel({presets: ['es2015']},
  niftBabelAsyncAwait(),
  niftGithubRepo(),
  niftMochaBabel('test'),
  niftBabelBuild('build'),
  niftPostNpmInstall(['build']),
  niftPrePublish(['build', 'test']),
  niftPreCommit(['build', 'test'])
]

// nift create-package
// nift install (nift create-package && npm install)
// nift build ./holy-grail --temp / --location
// nift publish ./holy-grail
// nift ./holy-grail (compiles then runs)
// nift publish gist https://gist.github.com/reggi/ca7a486ccd5307f58fa5b0d4ded3fadb

let pkg = package('nift-mocha-babel@1.0.0', niftForReggi()))
export pkg

export function documentation () {
  return `
    # hello world
    This is my documentation for this function / module / file.
  `
}

export function test () {

}

export default function niftMochaBabel (testScript = 'test') {
  return {
    "scripts": {
      [testScript]: "mocha --compilers js:babel-core/register --recursive"
    },
    "devDependencies": [
      "mocha",
      "babel-cli"
    ]
  }
}
