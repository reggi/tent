import niftBabel from 'nift-babel'
export const def = ['nift-babel@1.0.0', niftBabel({presets: ['es2015', 'stage-2']})]

export default function niftBabel ({presets, plugins, buildScript}) {

  let presets = presets.map(preset => `babel-preset-${preset}`)
  let plugins = plugins.map(plugin => `babel-plugin-${plugin}`)

  return {
    "scripts": {
      [buildScript]: "babel {incoming} --out-file {outgoing}"
    },
    "devDependencies": [
      'babel-cli',
      ...plugins,
      ...presets
    ]
  }
}
