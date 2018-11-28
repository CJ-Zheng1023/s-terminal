// 通过该文件引入所有该目录下的组件
const files = require.context('.', false, /\.vue$/)
const components = {}
files.keys().forEach(key => {
  components[key.replace(/(\.\/|\.vue)/g, '').toLowerCase()] = files(key).default
})
export default components
