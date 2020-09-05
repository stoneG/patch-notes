module.exports = api => {
  const isTest = api.env('test')

  return {
    presets: [
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
    ],
  }
}
