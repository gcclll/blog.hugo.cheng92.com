/** jsx?|tsx? file header */
require('./compiler-sfc')

const mockId = 'xxxxxxxx'

function compileSFCScript(src, options) {
  const { descriptor } = babelParser.parse(src)
  return compileScript(descriptor, {
    ...options,
    id: mockId
  })
}

const result = compileSFCScript(`
      <script setup>
      import { x } from './x'
      let a = 1
      const b = 2
      function c() {}
      class d {}
      </script>

      <script>
      import { xx } from './x'
      let aa = 1
      const bb = 2
      function cc() {}
      class dd {}
      </script>
      `)

console.log(result)
