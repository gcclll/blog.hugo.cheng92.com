const __ESM_BROWSER__ = false, __GLOBAL__ = true
let MagicString = require(process.env.NODE_LIB + '/magic-string')

function createCache(size = 500) {
  return new Map()
}


const defaultExportRE = /((?:^|\n|;)\s*)export(\s*)default/
const namedDefaultExportRE = /((?:^|\n|;)\s*)export(.+)as(\s*)default/s
const exportDefaultClassRE =
  /((?:^|\n|;)\s*)export\s+default\s+class\s+([\w$]+)/

/**
 * Utility for rewriting `export default` in a script block into a variable
 * declaration so that we can inject things into it
 */
function rewriteDefault(input, as, parserPlugins) {
  if (!hasDefaultExport(input)) {
    return input + `\nconst ${as} = {}`
  }

  let replaced

  const classMatch = input.match(exportDefaultClassRE)
  if (classMatch) {
    replaced =
      input.replace(exportDefaultClassRE, '$1class $2') +
      `\nconst ${as} = ${classMatch[2]}`
  } else {
    replaced = input.replace(defaultExportRE, `$1const ${as} =`)
  }
  if (!hasDefaultExport(replaced)) {
    return replaced
  }

  // if the script somehow still contains `default export`, it probably has
  // multi-line comments or template strings. fallback to a full parse.
  const s = new MagicString(input)
  const ast = babelParser.parse(input, {
    sourceType: 'module',
    plugins: parserPlugins
  }).program.body
  ast.forEach(node => {
    if (node.type === 'ExportDefaultDeclaration') {
      s.overwrite(node.start, node.declaration.start, `const ${as} = `)
    }
    if (node.type === 'ExportNamedDeclaration') {
      node.specifiers.forEach(specifier => {
        if (
          specifier.type === 'ExportSpecifier' &&
          specifier.exported.type === 'Identifier' &&
          specifier.exported.name === 'default'
        ) {
          const end = specifier.end
          s.overwrite(
            specifier.start,
            input.charAt(end) === ',' ? end + 1 : end,
            ``
          )
          s.append(`\nconst ${as} = ${specifier.local.name}`)
        }
      })
    }
  })
  return s.toString()
}

function hasDefaultExport(input) {
  return defaultExportRE.test(input) || namedDefaultExportRE.test(input)
}
const RT = (function() {
  const CONVERT_SYMBOL = '$'
const ESCAPE_SYMBOL = '$$'
const shorthands = ['ref', 'computed', 'shallowRef', 'toRef', 'customRef']
const transformCheckRE = /[^\w]\$(?:\$|ref|computed|shallowRef)?\s*(\(|\<)/

function shouldTransform(src) {
  return transformCheckRE.test(src)
}

function transform(
  src,
  {
    filename,
    sourceMap,
    parserPlugins,
    importHelpersFrom = 'vue'
  } = {}
) {
  const plugins = parserPlugins || []
  if (filename) {
    if (/\.tsx?$/.test(filename)) {
      plugins.push('typescript')
    }
    if (filename.endsWith('x')) {
      plugins.push('jsx')
    }
  }

  const ast = babelParser.parse(src, {
    sourceType: 'module',
    plugins
  })
  const s = new MagicString(src)
  const res = transformAST(ast.program, s, 0)

  // inject helper imports
  if (res.importedHelpers.length) {
    s.prepend(
      `import { ${res.importedHelpers
        .map(h => `${h} as _${h}`)
        .join(', ')} } from '${importHelpersFrom}'\n`
    )
  }

  return {
    ...res,
    code: s.toString(),
    map: sourceMap
      ? s.generateMap({
          source: filename,
          hires: true,
          includeContent: true
        })
      : null
  }
}

function transformAST(
  ast,
  s,
  offset = 0,
  knownRefs,
  knownProps
) {
  let convertSymbol = CONVERT_SYMBOL
  let escapeSymbol = ESCAPE_SYMBOL

  // macro import handling
  for (const node of ast.body) {
    if (
      node.type === 'ImportDeclaration' &&
      node.source.value === 'vue/macros'
    ) {
      // remove macro imports
      s.remove(node.start + offset, node.end + offset)
      // check aliasing
      for (const specifier of node.specifiers) {
        if (specifier.type === 'ImportSpecifier') {
          const imported = specifier.imported.name
          const local = specifier.local.name
          if (local !== imported) {
            if (imported === ESCAPE_SYMBOL) {
              escapeSymbol = local
            } else if (imported === CONVERT_SYMBOL) {
              convertSymbol = local
            } else {
              error(
                `macro imports for ref-creating methods do not support aliasing.`,
                specifier
              )
            }
          }
        }
      }
    }
  }

  const importedHelpers = new Set()
  const rootScope = {}
  const scopeStack = [rootScope]
  let currentScope = rootScope
  let escapeScope // inside $$()
  const excludedIds = new WeakSet()
  const parentStack = []
  const propsLocalToPublicMap = Object.create(null)

  if (knownRefs) {
    for (const key of knownRefs) {
      rootScope[key] = true
    }
  }
  if (knownProps) {
    for (const key in knownProps) {
      const { local } = knownProps[key]
      rootScope[local] = 'prop'
      propsLocalToPublicMap[local] = key
    }
  }

  function isRefCreationCall(callee) {
    if (callee === convertSymbol) {
      return convertSymbol
    }
    if (callee[0] === '$' && shorthands.includes(callee.slice(1))) {
      return callee
    }
    return false
  }

  function error(msg, node) {
    const e = new Error(msg)
    e.node = node
    throw e
  }

  function helper(msg) {
    importedHelpers.add(msg)
    return `_${msg}`
  }

  function registerBinding(id, isRef = false) {
    excludedIds.add(id)
    if (currentScope) {
      currentScope[id.name] = isRef
    } else {
      error(
        'registerBinding called without active scope, something is wrong.',
        id
      )
    }
  }

  const registerRefBinding = (id) => registerBinding(id, true)

  let tempVarCount = 0
  function genTempVar() {
    return `__$temp_${++tempVarCount}`
  }

  function snip(nod) {
    return s.original.slice(node.start + offset, node.end + offset)
  }

  function walkScope(node, isRoot = false) {
    for (const stmt of node.body) {
      if (stmt.type === 'VariableDeclaration') {
        walkVariableDeclaration(stmt, isRoot)
      } else if (
        stmt.type === 'FunctionDeclaration' ||
        stmt.type === 'ClassDeclaration'
      ) {
        if (stmt.declare || !stmt.id) continue
        registerBinding(stmt.id)
      } else if (
        (stmt.type === 'ForOfStatement' || stmt.type === 'ForInStatement') &&
        stmt.left.type === 'VariableDeclaration'
      ) {
        walkVariableDeclaration(stmt.left)
      } else if (
        stmt.type === 'ExportNamedDeclaration' &&
        stmt.declaration &&
        stmt.declaration.type === 'VariableDeclaration'
      ) {
        walkVariableDeclaration(stmt.declaration, isRoot)
      } else if (
        stmt.type === 'LabeledStatement' &&
        stmt.body.type === 'VariableDeclaration'
      ) {
        walkVariableDeclaration(stmt.body, isRoot)
      }
    }
  }

  function walkVariableDeclaration(stmt, isRoot = false) {
    if (stmt.declare) {
      return
    }
    for (const decl of stmt.declarations) {
      let refCall
      const isCall =
        decl.init &&
        decl.init.type === 'CallExpression' &&
        decl.init.callee.type === 'Identifier'
      if (
        isCall &&
        (refCall = isRefCreationCall(decl.init.callee.name))
      ) {
        processRefDeclaration(refCall, decl.id, decl.init)
      } else {
        const isProps =
          isRoot && isCall && decl.init.callee.name === 'defineProps'
        for (const id of extractIdentifiers(decl.id)) {
          if (isProps) {
            // for defineProps destructure, only exclude them since they
            // are already passed in as knownProps
            excludedIds.add(id)
          } else {
            registerBinding(id)
          }
        }
      }
    }
  }

  function processRefDeclaration(method, id, call) {
    excludedIds.add(call.callee)
    if (method === convertSymbol) {
      // $
      // remove macro
      s.remove(call.callee.start + offset, call.callee.end + offset)
      if (id.type === 'Identifier') {
        // single variable
        registerRefBinding(id)
      } else if (id.type === 'ObjectPattern') {
        processRefObjectPattern(id, call)
      } else if (id.type === 'ArrayPattern') {
        processRefArrayPattern(id, call)
      }
    } else {
      // shorthands
      if (id.type === 'Identifier') {
        registerRefBinding(id)
        // replace call
        s.overwrite(
          call.start + offset,
          call.start + method.length + offset,
          helper(method.slice(1))
        )
      } else {
        error(`${method}() cannot be used with destructure patterns.`, call)
      }
    }
  }

  function processRefObjectPattern(pattern, call, tempVar, path = []) {
    if (!tempVar) {
      tempVar = genTempVar()
      // const { x } = $(useFoo()) --> const __$temp_1 = useFoo()
      s.overwrite(pattern.start + offset, pattern.end + offset, tempVar)
    }

    for (const p of pattern.properties) {
      let nameId
      let key
      let defaultValue
      if (p.type === 'ObjectProperty') {
        if (p.key.start === p.value.start) {
          // shorthand { foo }
          nameId = p.key
          if (p.value.type === 'Identifier') {
            // avoid shorthand value identifier from being processed
            excludedIds.add(p.value)
          } else if (
            p.value.type === 'AssignmentPattern' &&
            p.value.left.type === 'Identifier'
          ) {
            // { foo = 1 }
            excludedIds.add(p.value.left)
            defaultValue = p.value.right
          }
        } else {
          key = p.computed ? p.key : p.key.name
          if (p.value.type === 'Identifier') {
            // { foo: bar }
            nameId = p.value
          } else if (p.value.type === 'ObjectPattern') {
            processRefObjectPattern(p.value, call, tempVar, [...path, key])
          } else if (p.value.type === 'ArrayPattern') {
            processRefArrayPattern(p.value, call, tempVar, [...path, key])
          } else if (p.value.type === 'AssignmentPattern') {
            if (p.value.left.type === 'Identifier') {
              // { foo: bar = 1 }
              nameId = p.value.left
              defaultValue = p.value.right
            } else if (p.value.left.type === 'ObjectPattern') {
              processRefObjectPattern(p.value.left, call, tempVar, [
                ...path,
                [key, p.value.right]
              ])
            } else if (p.value.left.type === 'ArrayPattern') {
              processRefArrayPattern(p.value.left, call, tempVar, [
                ...path,
                [key, p.value.right]
              ])
            } else {
              // MemberExpression case is not possible here, ignore
            }
          }
        }
      } else {
        // rest element { ...foo }
        error(`reactivity destructure does not support rest elements.`, p)
      }
      if (nameId) {
        registerRefBinding(nameId)
        // inject toRef() after original replaced pattern
        const source = pathToString(tempVar, path)
        const keyStr = isString(key)
          ? `'${key}'`
          : key
          ? snip(key)
          : `'${nameId.name}'`
        const defaultStr = defaultValue ? `, ${snip(defaultValue)}` : ``
        s.appendLeft(
          call.end + offset,
          `,\n  ${nameId.name} = ${helper(
            'toRef'
          )}(${source}, ${keyStr}${defaultStr})`
        )
      }
    }
  }

  function processRefArrayPattern(pattern, call, tempVar, path = []) {
    if (!tempVar) {
      // const [x] = $(useFoo()) --> const __$temp_1 = useFoo()
      tempVar = genTempVar()
      s.overwrite(pattern.start + offset, pattern.end + offset, tempVar)
    }

    for (let i = 0; i < pattern.elements.length; i++) {
      const e = pattern.elements[i]
      if (!e) continue
      let nameId
      let defaultValue
      if (e.type === 'Identifier') {
        // [a] --> [__a]
        nameId = e
      } else if (e.type === 'AssignmentPattern') {
        // [a = 1]
        nameId = e.left
        defaultValue = e.right
      } else if (e.type === 'RestElement') {
        // [...a]
        error(`reactivity destructure does not support rest elements.`, e)
      } else if (e.type === 'ObjectPattern') {
        processRefObjectPattern(e, call, tempVar, [...path, i])
      } else if (e.type === 'ArrayPattern') {
        processRefArrayPattern(e, call, tempVar, [...path, i])
      }
      if (nameId) {
        registerRefBinding(nameId)
        // inject toRef() after original replaced pattern
        const source = pathToString(tempVar, path)
        const defaultStr = defaultValue ? `, ${snip(defaultValue)}` : ``
        s.appendLeft(
          call.end + offset,
          `,\n  ${nameId.name} = ${helper(
            'toRef'
          )}(${source}, ${i}${defaultStr})`
        )
      }
    }
  }

  function pathToString(source, path) {
    if (path.length) {
      for (const seg of path) {
        if (isArray(seg)) {
          source = `(${source}${segToString(seg[0])} || ${snip(seg[1])})`
        } else {
          source += segToString(seg)
        }
      }
    }
    return source
  }

  function segToString(seg) {
    if (typeof seg === 'number') {
      return `[${seg}]`
    } else if (typeof seg === 'string') {
      return `.${seg}`
    } else {
      return snip(seg)
    }
  }

  function rewriteId(scope, id, parent, parentStack) {
    if (hasOwn(scope, id.name)) {
      const bindingType = scope[id.name]
      if (bindingType) {
        const isProp = bindingType === 'prop'
        if (isStaticProperty(parent) && parent.shorthand) {
          // let binding used in a property shorthand
          // skip for destructure patterns
          if (
            !parent.inPattern ||
            isInDestructureAssignment(parent, parentStack)
          ) {
            if (isProp) {
              if (escapeScope) {
                // prop binding in $$()
                // { prop } -> { prop: __prop_prop }
                registerEscapedPropBinding(id)
                s.appendLeft(
                  id.end + offset,
                  `: __props_${propsLocalToPublicMap[id.name]}`
                )
              } else {
                // { prop } -> { prop: __prop.prop }
                s.appendLeft(
                  id.end + offset,
                  `: __props.${propsLocalToPublicMap[id.name]}`
                )
              }
            } else {
              // { foo } -> { foo: foo.value }
              s.appendLeft(id.end + offset, `: ${id.name}.value`)
            }
          }
        } else {
          if (isProp) {
            if (escapeScope) {
              // x --> __props_x
              registerEscapedPropBinding(id)
              s.overwrite(
                id.start + offset,
                id.end + offset,
                `__props_${propsLocalToPublicMap[id.name]}`
              )
            } else {
              // x --> __props.x
              s.overwrite(
                id.start + offset,
                id.end + offset,
                `__props.${propsLocalToPublicMap[id.name]}`
              )
            }
          } else {
            // x --> x.value
            s.appendLeft(id.end + offset, '.value')
          }
        }
      }
      return true
    }
    return false
  }

  const propBindingRefs = {}
  function registerEscapedPropBinding(id) {
    if (!propBindingRefs.hasOwnProperty(id.name)) {
      propBindingRefs[id.name] = true
      const publicKey = propsLocalToPublicMap[id.name]
      s.prependRight(
        offset,
        `const __props_${publicKey} = ${helper(
          `toRef`
        )}(__props, '${publicKey}')\n`
      )
    }
  }

  // check root scope first
  walkScope(ast, true)
  walk(ast, {
    enter(node, parent) {
      parent && parentStack.push(parent)

      // function scopes
      if (isFunctionType(node)) {
        scopeStack.push((currentScope = {}))
        walkFunctionParams(node, registerBinding)
        if (node.body.type === 'BlockStatement') {
          walkScope(node.body)
        }
        return
      }

      // catch param
      if (node.type === 'CatchClause') {
        scopeStack.push((currentScope = {}))
        if (node.param && node.param.type === 'Identifier') {
          registerBinding(node.param)
        }
        walkScope(node.body)
        return
      }

      // non-function block scopes
      if (node.type === 'BlockStatement' && !isFunctionType(parent)) {
        scopeStack.push((currentScope = {}))
        walkScope(node)
        return
      }

      // skip type nodes
      if (
        parent &&
        parent.type.startsWith('TS') &&
        parent.type !== 'TSAsExpression' &&
        parent.type !== 'TSNonNullExpression' &&
        parent.type !== 'TSTypeAssertion'
      ) {
        return this.skip()
      }

      if (
        node.type === 'Identifier' &&
        // if inside $$(), skip unless this is a destructured prop binding
        !(escapeScope && rootScope[node.name] !== 'prop') &&
        isReferencedIdentifier(node, parent, parentStack) &&
        !excludedIds.has(node)
      ) {
        // walk up the scope chain to check if id should be appended .value
        let i = scopeStack.length
        while (i--) {
          if (rewriteId(scopeStack[i], node, parent, parentStack)) {
            return
          }
        }
      }

      if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
        const callee = node.callee.name

        const refCall = isRefCreationCall(callee)
        if (refCall && (!parent || parent.type !== 'VariableDeclarator')) {
          return error(
            `${refCall} can only be used as the initializer of ` +
              `a variable declaration.`,
            node
          )
        }

        if (callee === escapeSymbol) {
          s.remove(node.callee.start + offset, node.callee.end + offset)
          escapeScope = node
        }

        // TODO remove when out of experimental
        if (callee === '$raw') {
          error(
            `$raw() has been replaced by $$(). ` +
              `See ${RFC_LINK} for latest updates.`,
            node
          )
        }
        if (callee === '$fromRef') {
          error(
            `$fromRef() has been replaced by $(). ` +
              `See ${RFC_LINK} for latest updates.`,
            node
          )
        }
      }
    },
    leave(node, parent) {
      parent && parentStack.pop()
      if (
        (node.type === 'BlockStatement' && !isFunctionType(parent)) ||
        isFunctionType(node)
      ) {
        scopeStack.pop()
        currentScope = scopeStack[scopeStack.length - 1] || null
      }
      if (node === escapeScope) {
        escapeScope = undefined
      }
    }
  })

  return {
    rootRefs: Object.keys(rootScope).filter(key => rootScope[key] === true),
    importedHelpers: [...importedHelpers]
  }
}

  return { transformAST, transform, shouldTransform }
}())

const range = 2

function generateCodeFrame(
  source,
  start = 0,
  end = source.length
) {
  // Split the content into individual lines but capture the newline sequence
  // that separated each line. This is important because the actual sequence is
  // needed to properly take into account the full line length for offset
  // comparison
  let lines = source.split(/(\r?\n)/)

  // Separate the lines and newline sequences into separate arrays for easier referencing
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1)
  lines = lines.filter((_, idx) => idx % 2 === 0)

  let count = 0
  const res = []
  for (let i = 0; i < lines.length; i++) {
    count +=
      lines[i].length +
      ((newlineSequences[i] && newlineSequences[i].length) || 0)
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length) continue
        const line = j + 1
        res.push(
          `${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${
            lines[j]
          }`
        )
        const lineLength = lines[j].length
        const newLineSeqLength =
          (newlineSequences[j] && newlineSequences[j].length) || 0

        if (j === i) {
          // push underline
          const pad = start - (count - (lineLength + newLineSeqLength))
          const length = Math.max(
            1,
            end > count ? lineLength - pad : end - start
          )
          res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length))
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1)
            res.push(`   |  ` + '^'.repeat(length))
          }

          count += lineLength + newLineSeqLength
        }
      }
      break
    }
  }
  return res.join('\n')
}

function registerBinding(bindings, node, type) {
  bindings[node.name] = type
}
function walkDeclaration(node, bindings, userImportAlias) {
  if (node.type === 'VariableDeclaration') {
    const isConst = node.kind === 'const'
    // export const foo = ...
    for (const { id, init } of node.declarations) {
      const isDefineCall = !!(
        isConst &&
        isCallOf(
          init,
          c => c === DEFINE_PROPS || c === DEFINE_EMITS || c === WITH_DEFAULTS
        )
      )
      if (id.type === 'Identifier') {
        let bindingType
        const userReactiveBinding = userImportAlias['reactive'] || 'reactive'
        if (isCallOf(init, userReactiveBinding)) {
          // treat reactive() calls as let since it's meant to be mutable
          bindingType = BindingTypes.SETUP_LET
        } else if (
          // if a declaration is a const literal, we can mark it so that
          // the generated render fn code doesn't need to unref() it
          isDefineCall ||
          (isConst && canNeverBeRef(init, userReactiveBinding))
        ) {
          bindingType = BindingTypes.SETUP_CONST
        } else if (isConst) {
          if (isCallOf(init, userImportAlias['ref'] || 'ref')) {
            bindingType = BindingTypes.SETUP_REF
          } else {
            bindingType = BindingTypes.SETUP_MAYBE_REF
          }
        } else {
          bindingType = BindingTypes.SETUP_LET
        }
        registerBinding(bindings, id, bindingType)
      } else {
        if (isCallOf(init, DEFINE_PROPS)) {
          // skip walking props destructure
          return
        }
        if (id.type === 'ObjectPattern') {
          walkObjectPattern(id, bindings, isConst, isDefineCall)
        } else if (id.type === 'ArrayPattern') {
          walkArrayPattern(id, bindings, isConst, isDefineCall)
        }
      }
    }
  } else if (
    node.type === 'TSEnumDeclaration' ||
    node.type === 'FunctionDeclaration' ||
    node.type === 'ClassDeclaration'
  ) {
    // export function foo() {} / export class Foo {}
    // export declarations must be named.
    bindings[node.id.name] = BindingTypes.SETUP_CONST
  }
}

function walkObjectPattern(node, bindings, isConst, isDefineCall = false) {
  for (const p of node.properties) {
    if (p.type === 'ObjectProperty') {
      if (p.key.type === 'Identifier' && p.key === p.value) {
        // shorthand: const { x } = ...
        const type = isDefineCall
          ? BindingTypes.SETUP_CONST
          : isConst
          ? BindingTypes.SETUP_MAYBE_REF
          : BindingTypes.SETUP_LET
        registerBinding(bindings, p.key, type)
      } else {
        walkPattern(p.value, bindings, isConst, isDefineCall)
      }
    } else {
      // ...rest
      // argument can only be identifier when destructuring
      const type = isConst ? BindingTypes.SETUP_CONST : BindingTypes.SETUP_LET
      registerBinding(bindings, p.argument, type)
    }
  }
}


function walkArrayPattern(node, bindings, isConst, isDefineCall = false) {
  for (const e of node.elements) {
    e && walkPattern(e, bindings, isConst, isDefineCall)
  }
}
function walkPattern(node, bindings, isConst, isDefineCall = false) {
  if (node.type === 'Identifier') {
    const type = isDefineCall
      ? BindingTypes.SETUP_CONST
      : isConst
      ? BindingTypes.SETUP_MAYBE_REF
      : BindingTypes.SETUP_LET
    registerBinding(bindings, node, type)
  } else if (node.type === 'RestElement') {
    // argument can only be identifier when destructuring
    const type = isConst ? BindingTypes.SETUP_CONST : BindingTypes.SETUP_LET
    registerBinding(bindings, node.argument, type)
  } else if (node.type === 'ObjectPattern') {
    walkObjectPattern(node, bindings, isConst)
  } else if (node.type === 'ArrayPattern') {
    walkArrayPattern(node, bindings, isConst)
  } else if (node.type === 'AssignmentPattern') {
    if (node.left.type === 'Identifier') {
      const type = isDefineCall
        ? BindingTypes.SETUP_CONST
        : isConst
        ? BindingTypes.SETUP_MAYBE_REF
        : BindingTypes.SETUP_LET
      registerBinding(bindings, node.left, type)
    } else {
      walkPattern(node.left, bindings, isConst)
    }
  }
}
function recordType(node, declaredTypes) {
  if (node.type === 'TSInterfaceDeclaration') {
    declaredTypes[node.id.name] = [`Object`]
  } else if (node.type === 'TSTypeAliasDeclaration') {
    declaredTypes[node.id.name] = inferRuntimeType(
      node.typeAnnotation,
      declaredTypes
    )
  } else if (node.type === 'ExportNamedDeclaration' && node.declaration) {
    recordType(node.declaration, declaredTypes)
  }
}
function extractRuntimeProps(node, props, declaredTypes, isProd) {
  const members = node.type === 'TSTypeLiteral' ? node.members : node.body
  for (const m of members) {
    if (
      (m.type === 'TSPropertySignature' || m.type === 'TSMethodSignature') &&
      m.key.type === 'Identifier'
    ) {
      let type
      if (m.type === 'TSMethodSignature') {
        type = ['Function']
      } else if (m.typeAnnotation) {
        type = inferRuntimeType(m.typeAnnotation.typeAnnotation, declaredTypes)
      }
      props[m.key.name] = {
        key: m.key.name,
        required: !m.optional,
        type: type || [`null`]
      }
    }
  }
}


function inferRuntimeType(node, declaredTypes) {
  switch (node.type) {
    case 'TSStringKeyword':
      return ['String']
    case 'TSNumberKeyword':
      return ['Number']
    case 'TSBooleanKeyword':
      return ['Boolean']
    case 'TSObjectKeyword':
      return ['Object']
    case 'TSTypeLiteral':
      // TODO (nice to have) generate runtime property validation
      return ['Object']
    case 'TSFunctionType':
      return ['Function']
    case 'TSArrayType':
    case 'TSTupleType':
      // TODO (nice to have) generate runtime element type/length checks
      return ['Array']

    case 'TSLiteralType':
      switch (node.literal.type) {
        case 'StringLiteral':
          return ['String']
        case 'BooleanLiteral':
          return ['Boolean']
        case 'NumericLiteral':
        case 'BigIntLiteral':
          return ['Number']
        default:
          return [`null`]
      }

    case 'TSTypeReference':
      if (node.typeName.type === 'Identifier') {
        if (declaredTypes[node.typeName.name]) {
          return declaredTypes[node.typeName.name]
        }
        switch (node.typeName.name) {
          case 'Array':
          case 'Function':
          case 'Object':
          case 'Set':
          case 'Map':
          case 'WeakSet':
          case 'WeakMap':
          case 'Date':
            return [node.typeName.name]
          case 'Record':
          case 'Partial':
          case 'Readonly':
          case 'Pick':
          case 'Omit':
          case 'Exclude':
          case 'Extract':
          case 'Required':
          case 'InstanceType':
            return ['Object']
        }
      }
      return [`null`]

    case 'TSParenthesizedType':
      return inferRuntimeType(node.typeAnnotation, declaredTypes)
    case 'TSUnionType':
      return [
        ...new Set(
          [].concat(
            ...(node.types.map(t => inferRuntimeType(t, declaredTypes)))
          )
        )
      ]
    case 'TSIntersectionType':
      return ['Object']

    case 'TSSymbolKeyword':
      return ['Symbol']

    default:
      return [`null`] // no runtime check
  }
}
function toRuntimeTypeString(types) {
  return types.length > 1 ? `[${types.join(', ')}]` : types[0]
}
function extractRuntimeEmits(node, emits) {
  if (node.type === 'TSTypeLiteral' || node.type === 'TSInterfaceBody') {
    const members = node.type === 'TSTypeLiteral' ? node.members : node.body
    for (let t of members) {
      if (t.type === 'TSCallSignatureDeclaration') {
        extractEventNames(t.parameters[0], emits)
      }
    }
    return
  } else {
    extractEventNames(node.parameters[0], emits)
  }
}
function extractEventNames(eventName, emits) {
  if (
    eventName.type === 'Identifier' &&
    eventName.typeAnnotation &&
    eventName.typeAnnotation.type === 'TSTypeAnnotation'
  ) {
    const typeNode = eventName.typeAnnotation.typeAnnotation
    if (typeNode.type === 'TSLiteralType') {
      if (typeNode.literal.type !== 'UnaryExpression') {
        emits.add(String(typeNode.literal.value))
      }
    } else if (typeNode.type === 'TSUnionType') {
      for (const t of typeNode.types) {
        if (
          t.type === 'TSLiteralType' &&
          t.literal.type !== 'UnaryExpression'
        ) {
          emits.add(String(t.literal.value))
        }
      }
    }
  }
}
function genRuntimeEmits(emits) {
  return emits.size
    ? `\n  emits: [${Array.from(emits)
        .map(p => JSON.stringify(p))
        .join(', ')}],`
    : ``
}
function isCallOf(node, test) {
  return !!(
    node &&
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    (typeof test === 'string'
      ? node.callee.name === test
      : test(node.callee.name))
  )
}
function canNeverBeRef(node, userReactiveImport) {
  if (isCallOf(node, userReactiveImport)) {
    return true
  }
  switch (node.type) {
    case 'UnaryExpression':
    case 'BinaryExpression':
    case 'ArrayExpression':
    case 'ObjectExpression':
    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
    case 'UpdateExpression':
    case 'ClassExpression':
    case 'TaggedTemplateExpression':
      return true
    case 'SequenceExpression':
      return canNeverBeRef(
        node.expressions[node.expressions.length - 1],
        userReactiveImport
      )
    default:
      if (node.type.endsWith('Literal')) {
        return true
      }
      return false
  }
}


/**
 * Analyze bindings in normal `<script>`
 * Note that `compileScriptSetup` already analyzes bindings as part of its
 * compilation process so this should only be used on single `<script>` SFCs.
 */
function analyzeScriptBindings(ast) {
  for (const node of ast) {
    if (
      node.type === 'ExportDefaultDeclaration' &&
      node.declaration.type === 'ObjectExpression'
    ) {
      return analyzeBindingsFromOptions(node.declaration)
    }
  }
  return {}
}
function analyzeBindingsFromOptions(node) {
  const bindings = {}
  // #3270, #3275
  // mark non-script-setup so we don't resolve components/directives from these
  Object.defineProperty(bindings, '__isScriptSetup', {
    enumerable: false,
    value: false
  })
  for (const property of node.properties) {
    if (
      property.type === 'ObjectProperty' &&
      !property.computed &&
      property.key.type === 'Identifier'
    ) {
      // props
      if (property.key.name === 'props') {
        // props: ['foo']
        // props: { foo: ... }
        for (const key of getObjectOrArrayExpressionKeys(property.value)) {
          bindings[key] = BindingTypes.PROPS
        }
      }

      // inject
      else if (property.key.name === 'inject') {
        // inject: ['foo']
        // inject: { foo: {} }
        for (const key of getObjectOrArrayExpressionKeys(property.value)) {
          bindings[key] = BindingTypes.OPTIONS
        }
      }

      // computed & methods
      else if (
        property.value.type === 'ObjectExpression' &&
        (property.key.name === 'computed' || property.key.name === 'methods')
      ) {
        // methods: { foo() {} }
        // computed: { foo() {} }
        for (const key of getObjectExpressionKeys(property.value)) {
          bindings[key] = BindingTypes.OPTIONS
        }
      }
    }

    // setup & data
    else if (
      property.type === 'ObjectMethod' &&
      property.key.type === 'Identifier' &&
      (property.key.name === 'setup' || property.key.name === 'data')
    ) {
      for (const bodyItem of property.body.body) {
        // setup() {
        //   return {
        //     foo: null
        //   }
        // }
        if (
          bodyItem.type === 'ReturnStatement' &&
          bodyItem.argument &&
          bodyItem.argument.type === 'ObjectExpression'
        ) {
          for (const key of getObjectExpressionKeys(bodyItem.argument)) {
            bindings[key] =
              property.key.name === 'setup'
                ? BindingTypes.SETUP_MAYBE_REF
                : BindingTypes.DATA
          }
        }
      }
    }
  }

  return bindings
}
function getObjectExpressionKeys(node) {
  const keys = []
  for (const prop of node.properties) {
    if (
      (prop.type === 'ObjectProperty' || prop.type === 'ObjectMethod') &&
      !prop.computed
    ) {
      if (prop.key.type === 'Identifier') {
        keys.push(prop.key.name)
      } else if (prop.key.type === 'StringLiteral') {
        keys.push(prop.key.value)
      }
    }
  }
  return keys
}
function getArrayExpressionKeys(node) {
  const keys = []
  for (const element of node.elements) {
    if (element && element.type === 'StringLiteral') {
      keys.push(element.value)
    }
  }
  return keys
}
function getObjectOrArrayExpressionKeys(value) {
  if (value.type === 'ArrayExpression') {
    return getArrayExpressionKeys(value)
  }
  if (value.type === 'ObjectExpression') {
    return getObjectExpressionKeys(value)
  }
  return []
}
function resolveTemplateUsageCheckString(sfc) {
  const { content, ast } = sfc.template
  const cached = templateUsageCheckCache.get(content)
  if (cached) {
    return cached
  }

  let code = ''
  transform(createRoot([ast]), {
    nodeTransforms: [
      node => {
        if (node.type === NodeTypes.ELEMENT) {
          if (
            !parserOptions.isNativeTag(node.tag) &&
            !parserOptions.isBuiltInComponent(node.tag)
          ) {
            code += `,${camelize(node.tag)},${capitalize(camelize(node.tag))}`
          }
          for (let i = 0; i < node.props.length; i++) {
            const prop = node.props[i]
            if (prop.type === NodeTypes.DIRECTIVE) {
              if (!isBuiltInDir(prop.name)) {
                code += `,v${capitalize(camelize(prop.name))}`
              }
              if (prop.exp) {
                code += `,${stripStrings(prop.exp.content)}`
              }
            }
          }
        } else if (node.type === NodeTypes.INTERPOLATION) {
          code += `,${stripStrings(node.content.content)}`
        }
      }
    ]
  })

  code += ';'
  templateUsageCheckCache.set(content, code)
  return code
}
function stripStrings(exp) {
  return exp
    .replace(/'[^']*'|"[^"]*"/g, '')
    .replace(/`[^`]+`/g, stripTemplateString)
}
function isImportUsed(local, sfc) {
  return new RegExp(
    // #4274 escape $ since it's a special char in regex
    // (and is the only regex special char that is valid in identifiers)
    `[^\\w$_]${local.replace(/\$/g, '\\$')}[^\\w$_]`
  ).test(resolveTemplateUsageCheckString(sfc))
}
/**
 * Note: this comparison assumes the prev/next script are already identical,
 * and only checks the special case where <script setup lang="ts"> unused import
 * pruning result changes due to template changes.
 */
function hmrShouldReload(prevImports, next) {
  if (
    !next.scriptSetup ||
    (next.scriptSetup.lang !== 'ts' && next.scriptSetup.lang !== 'tsx')
  ) {
    return false
  }

  // for each previous import, check if its used status remain the same based on
  // the next descriptor's template
  for (const key in prevImports) {
    // if an import was previous unused, but now is used, we need to force
    // reload so that the script now includes that import.
    if (!prevImports[key].isUsedInTemplate && isImportUsed(key, next)) {
      return true
    }
  }

  return false
}
function compileTemplate(options) {
  // ...??????????????????????????? compile

  return doCompileTemplate(options)
}

function doCompileTemplate({
  filename,
  id,
  scoped,
  slotted,
  inMap,
  source,
  ssr = false,
  ssrCssVars,
  isProd = false,
  compiler,
  compilerOptions = {},
  transformAssetUrls
}) {
  const errors = []
  const warnings = []

  let nodeTransforms = []
  if (isObject(transformAssetUrls)) {
    const assetOptions = normalizeOptions(transformAssetUrls)
    nodeTransforms = [
      createAssetUrlTransformWithOptions(assetOptions),
      createSrcsetTransformWithOptions(assetOptions)
    ]
  } else if (transformAssetUrls !== false) {
    nodeTransforms = [transformAssetUrl, transformSrcset]
  }

  if (!id) {
    id = ''
  }

  const shortId = id.replace(/^data-v-/, '')
  const longId = `data-v-${shortId}`

  let { code, ast, preamble, map } = baseCompile(source, {
    mode: 'module',
    prefixIdentifiers: true,
    hoistStatic: true,
    cacheHandlers: true,
    ssrCssVars:
      ssr && ssrCssVars && ssrCssVars.length
        ? genCssVarsFromList(ssrCssVars, shortId, isProd)
        : '',
    scopeId: scoped ? longId : undefined,
    slotted,
    sourceMap: true,
    ...compilerOptions,
    nodeTransforms: nodeTransforms.concat(compilerOptions.nodeTransforms || []),
    filename,
    onError: e => errors.push(e),
    onWarn: w => warnings.push(w)
  })

  return { code, ast, preamble, source, errors, tips, map }
}
const hash = require(process.env.NODE_LIB + '/hash-sum')
const CSS_VARS_HELPER = `useCssVars`
// match v-bind() with max 2-levels of nested parens.
const cssVarRE = /v-bind\s*\(((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*)\)/g

function genCssVarsFromList(
  vars,
  id,
  isProd
) {
  return `{\n  ${vars
    .map(key => `"${genVarName(id, key, isProd)}": (${key})`)
    .join(',\n  ')}\n}`
}

function genVarName(id, raw, isProd) {
  if (isProd) {
    return hash(id + raw)
  } else {
    return `${id}-${raw.replace(/([^\w-])/g, '_')}`
  }
}

function noramlizeExpression(exp) {
  exp = exp.trim()
  if (
    (exp[0] === `'` && exp[exp.length - 1] === `'`) ||
    (exp[0] === `"` && exp[exp.length - 1] === `"`)
  ) {
    return exp.slice(1, -1)
  }
  return exp
}

function parseCssVars(sfc) {
  const vars = []
  sfc.styles.forEach(style => {
    let match
    // ignore v-bind() in comments /* ... */
    const content = style.content.replace(/\/\*([\s\S]*?)\*\//g, '')
    while ((match = cssVarRE.exec(content))) {
      const variable = noramlizeExpression(match[1])
      if (!vars.includes(variable)) {
        vars.push(variable)
      }
    }
  })
  return vars
}

// for compileStyle

const cssVarsPlugin = opts => {
  const { id, isProd } = opts
  return {
    postcssPlugin: 'vue-sfc-vars',
    Declaration(decl) {
      // rewrite CSS variables
      if (cssVarRE.test(decl.value)) {
        decl.value = decl.value.replace(cssVarRE, (_, $1) => {
          return `var(--${genVarName(id, noramlizeExpression($1), isProd)})`
        })
      }
    }
  }
}
cssVarsPlugin.postcss = true

function genCssVarsCode(
  vars,
  bindings,
  id,
  isProd
) {
  const varsExp = genCssVarsFromList(vars, id, isProd)
  const exp = createSimpleExpression(varsExp, false)
  const context = createTransformContext(createRoot([]), {
    prefixIdentifiers: true,
    inline: true,
    bindingMetadata: bindings.__isScriptSetup === false ? undefined : bindings
  })
  const transformed = processExpression(exp, context)
  const transformedString =
    transformed.type === NodeTypes.SIMPLE_EXPRESSION
      ? transformed.content
      : transformed.children
          .map(c => {
            return typeof c === 'string'
              ? c
              : c.content
          })
          .join('')

  return `_${CSS_VARS_HELPER}(_ctx => (${transformedString}))`
}

// <script setup> already gets the calls injected as part of the transform
// this is only for single normal <script>
function genNormalScriptCssVarsCode(
  cssVars,
  bindings,
  id,
  isProd
) {
  return (
    `\nimport { ${CSS_VARS_HELPER} as _${CSS_VARS_HELPER} } from 'vue'\n` +
    `const __injectCSSVars__ = () => {\n${genCssVarsCode(
      cssVars,
      bindings,
      id,
      isProd
    )}}\n` +
    `const __setup__ = __default__.setup\n` +
    `__default__.setup = __setup__\n` +
    `  ? (props, ctx) => { __injectCSSVars__();return __setup__(props, ctx) }\n` +
    `  : __injectCSSVars__\n`
  )
}


// Special compiler macros
const DEFINE_PROPS = 'defineProps'
const DEFINE_EMITS = 'defineEmits'
const DEFINE_EXPOSE = 'defineExpose'
const WITH_DEFAULTS = 'withDefaults'
const templateUsageCheckCache = createCache()

// constants
const DEFAULT_VAR = `__default__`

const isBuiltInDir = makeMap(
  `once,memo,if,else,else-if,slot,text,html,on,bind,model,show,cloak,is`
)

function compileScript(sfc, options) {
  let { script, scriptSetup, source, filename } = sfc
  // feature flags
  // TODO remove support for deprecated options when out of experimental
  const enableReactivityTransform =
    !!options.reactivityTransform ||
    !!options.refSugar ||
    !!options.refTransform
  const enablePropsTransform =
    !!options.reactivityTransform || !!options.propsDestructureTransform
  const isProd = !!options.isProd
  const genSourceMap = options.sourceMap !== false
  // ref ???????????????
  let refBindings

  const scopeId = options.id ? options.id.replace(/^data-v-/, '') : ''
  const cssVars = sfc.cssVars
  const scriptLang = script && script.lang
  const scriptSetupLang = scriptSetup && scriptSetup.lang
  const isTS =
    scriptLang === 'ts' ||
    scriptLang === 'tsx' ||
    scriptSetupLang === 'ts' ||
    scriptSetupLang === 'tsx'

  // resolve parser plugins
  const plugins = []
  if (!isTS || scriptLang === 'tsx' || scriptSetupLang === 'tsx') {
    plugins.push('jsx')
  }
  if (options.babelParserPlugins) plugins.push(...options.babelParserPlugins)
  if (isTS) plugins.push('typescript', 'decorators-legacy')

  if (!scriptSetup) {
    if (!script) {
      throw new Error(`[@vue/compiler-sfc] SFC contains no <script> tags.`)
    }
    if (scriptLang && !isTS && scriptLang !== 'jsx') {
      // do not process non js/ts script blocks
      return script
    }
    try {
      let content = script.content
      let map = script.map
      const scriptAst = babelParser.parse(content, {
        plugins,
        sourceType: 'module'
      }).program
      const bindings = analyzeScriptBindings(scriptAst.body)
      if (enableReactivityTransform && RT.shouldTransform(content)) {
        const s = new MagicString(source)
        const startOffset = script.loc.start.offset
        const endOffset = script.loc.end.offset
        const { importedHelpers } = RT.transformAST(scriptAst, s, startOffset)
        if (importedHelpers.length) {
          s.prepend(
            `import { ${importedHelpers
              .map(h => `${h} as _${h}`)
              .join(', ')} } from 'vue'\n`
          )
        }
        s.remove(0, startOffset)
        s.remove(endOffset, source.length)
        content = s.toString()
        if (genSourceMap) {
          map = s.generateMap({
            source: filename,
            hires: true,
            includeContent: true
          })
        }
      }
      if (cssVars.length) {
        content = rewriteDefault(content, DEFAULT_VAR, plugins)
        content += genNormalScriptCssVarsCode(
          cssVars,
          bindings,
          scopeId,
          isProd
        )
        content += `\nexport default ${DEFAULT_VAR}`
      }
      return {
        ...script,
        content,
        map,
        bindings,
        scriptAst: scriptAst.body
      }
    } catch (e) {
      // silently fallback if parse fails since user may be using custom
      // babel syntax
      return script
    }
  }

  // script ??? script setup ?????????????????????
  if (script && scriptLang !== scriptSetupLang) {
    throw new Error(
      `[@vue/compiler-sfc] <script> and <script setup> must have the same ` +
        `language type.`
    )
  }

  // ????????? js/ts script
  if (scriptSetupLang && !isTS && scriptSetupLang !== 'jsx') {
    return scriptSetup
  }

  // ?????????imports ???????????????
  const bindingMetadata = {}
  const helperImports = new Set()
  const userImports = Object.create(null)
  const userImportAlias = Object.create(null)
  const scriptBindings = Object.create(null)
  const setupBindings = Object.create(null)

  let defaultExport // export default
  let hasDefinePropsCall = false // defineProps()
  let hasDefineEmitCall = false // defineEmits()
  let hasDefineExposeCall = false // defineExpose()
  let propsRuntimeDecl // ????????????
  let propsRuntimeDefaults // ???????????????
  let propsDestructureDecl // ??????????????????
  let propsDestructureRestId // ??????????????? ... ??????
  let propsTypeDecl // ??????????????????
  let propsTypeDeclRaw
  let propsIdentifier
  let emitsRuntimeDecl
  let emitsTypeDecl
  let emitsTypeDeclRaw
  let emitIdentifier
  let hasAwait = false // ?????? await ?????????????????????????????? async setup
  let hasInlinedSsrRenderFn = false
  // props/emits declared via types
  const typeDeclaredProps = {}
  const typeDeclaredEmits = new Set()
  // record declared types for runtime props type generation
  const declaredTypes = {}
  // props destructure data
  const propsDestructuredBindings = Object.create(null)

  // magic-string state
  const s = new MagicString(source)
  const startOffset = scriptSetup.loc.start.offset
  const endOffset = scriptSetup.loc.end.offset
  const scriptStartOffset = script && script.loc.start.offset
  const scriptEndOffset = script && script.loc.end.offset

  function helper(key) {
    helperImports.add(key)
    return `_${key}`
  }
    function parse(input, options, offset) {
      try {
        return babelParser.parse(input, options).program
      } catch (e) {
        e.message = `[@vue/compiler-sfc] ${e.message}\n\n${
          sfc.filename
        }\n${generateCodeFrame(source, e.pos + offset, e.pos + offset + 1)}`
        throw e
      }
    }
  
  
  function error(msg, node, end = node.end + startOffset) {
    throw new Error(
      `[@vue/compiler-sfc] ${msg}\n\n${sfc.filename}\n${generateCodeFrame(
      source,
      node.start + startOffset,
      end
      )}`
    )
  }
    function registerUserImport(source, local, imported, isType, isFromSetup) {
      if (source === 'vue' && imported) {
        userImportAlias[imported] = local
      }
  
      let isUsedInTemplate = true
      if (isTS && sfc.template && !sfc.template.src && !sfc.template.lang) {
        isUsedInTemplate = isImportUsed(local, sfc)
      }
  
      userImports[local] = {
        isType,
        imported: imported || 'default',
        source,
        isFromSetup,
        isUsedInTemplate
      }
    }
  
    function processDefineProps(node, declId) {
      if (!isCallOf(node, DEFINE_PROPS)) {
        return false
      }
  
      if (hasDefinePropsCall) {
        error(`duplicate ${DEFINE_PROPS}() call`, node)
      }
      hasDefinePropsCall = true
  
      propsRuntimeDecl = node.arguments[0]
  
      // call has type parameters - infer runtime types from it
      if (node.typeParameters) {
        if (propsRuntimeDecl) {
          error(
            `${DEFINE_PROPS}() cannot accept both type and non-type arguments ` +
              `at the same time. Use one or the other.`,
            node
          )
        }
  
        propsTypeDeclRaw = node.typeParameters.params[0]
        propsTypeDecl = resolveQualifiedType(
          propsTypeDeclRaw,
          node => node.type === 'TSTypeLiteral'
        )
  
        if (!propsTypeDecl) {
          error(
            `type argument passed to ${DEFINE_PROPS}() must be a literal type, ` +
              `or a reference to an interface or literal type.`,
            propsTypeDeclRaw
          )
        }
      }
  
      if (declId) {
        if (enablePropsTransform && declId.type === 'ObjectPattern') {
          propsDestructureDecl = declId
          // props destructure - handle compilation sugar
          for (const prop of declId.properties) {
            if (prop.type === 'ObjectProperty') {
              if (prop.computed) {
                error(
                  `${DEFINE_PROPS}() destructure cannot use computed key.`,
                  prop.key
                )
              }
              const propKey = prop.key.name
              if (prop.value.type === 'AssignmentPattern') {
                // default value { foo = 123 }
                const { left, right } = prop.value
                if (left.type !== 'Identifier') {
                  error(
                    `${DEFINE_PROPS}() destructure does not support nested patterns.`,
                    left
                  )
                }
                // store default value
                propsDestructuredBindings[propKey] = {
                  local: left.name,
                  default: right
                }
              } else if (prop.value.type === 'Identifier') {
                // simple destructure
                propsDestructuredBindings[propKey] = {
                  local: prop.value.name
                }
              } else {
                error(
                  `${DEFINE_PROPS}() destructure does not support nested patterns.`,
                  prop.value
                )
              }
            } else {
              // rest spread
              propsDestructureRestId = prop.argument.name
            }
          }
        } else {
          propsIdentifier = scriptSetup.content.slice(declId.start, declId.end)
        }
      }
  
      return true
    }
  
  
    function processWithDefaults(node, declId) {
      if (!isCallOf(node, WITH_DEFAULTS)) {
        return false
      }
      if (processDefineProps(node.arguments[0], declId)) {
        if (propsRuntimeDecl) {
          error(
            `${WITH_DEFAULTS} can only be used with type-based ` +
              `${DEFINE_PROPS} declaration.`,
            node
          )
        }
        if (propsDestructureDecl) {
          error(
            `${WITH_DEFAULTS}() is unnecessary when using destructure with ${DEFINE_PROPS}().\n` +
              `Prefer using destructure default values, e.g. const { foo = 1 } = defineProps(...).`,
            node.callee
          )
        }
        propsRuntimeDefaults = node.arguments[1]
        if (
          !propsRuntimeDefaults ||
          propsRuntimeDefaults.type !== 'ObjectExpression'
        ) {
          error(
            `The 2nd argument of ${WITH_DEFAULTS} must be an object literal.`,
            propsRuntimeDefaults || node
          )
        }
      } else {
        error(
          `${WITH_DEFAULTS}' first argument must be a ${DEFINE_PROPS} call.`,
          node.arguments[0] || node
        )
      }
      return true
    }
  
  
  
    function processDefineEmits(node, declId) {
      if (!isCallOf(node, DEFINE_EMITS)) {
        return false
      }
      if (hasDefineEmitCall) {
        error(`duplicate ${DEFINE_EMITS}() call`, node)
      }
      hasDefineEmitCall = true
      emitsRuntimeDecl = node.arguments[0]
      if (node.typeParameters) {
        if (emitsRuntimeDecl) {
          error(
            `${DEFINE_EMITS}() cannot accept both type and non-type arguments ` +
              `at the same time. Use one or the other.`,
            node
          )
        }
  
        emitsTypeDeclRaw = node.typeParameters.params[0]
        emitsTypeDecl = resolveQualifiedType(
          emitsTypeDeclRaw,
          node => node.type === 'TSFunctionType' || node.type === 'TSTypeLiteral'
        )
  
        if (!emitsTypeDecl) {
          error(
            `type argument passed to ${DEFINE_EMITS}() must be a function type, ` +
              `a literal type with call signatures, or a reference to the above types.`,
            emitsTypeDeclRaw
          )
        }
      }
  
      if (declId) {
        emitIdentifier = scriptSetup.content.slice(declId.start, declId.end)
      }
  
      return true
    }
  
  
  
    function resolveQualifiedType(node, qualifier) {
      if (qualifier(node)) {
        return node
      }
      if (
        node.type === 'TSTypeReference' &&
        node.typeName.type === 'Identifier'
      ) {
        const refName = node.typeName.name
        const isQualifiedType = (node) => {
          if (
            node.type === 'TSInterfaceDeclaration' &&
            node.id.name === refName
          ) {
            return node.body
          } else if (
            node.type === 'TSTypeAliasDeclaration' &&
            node.id.name === refName &&
            qualifier(node.typeAnnotation)
          ) {
            return node.typeAnnotation
          } else if (node.type === 'ExportNamedDeclaration' && node.declaration) {
            return isQualifiedType(node.declaration)
          }
        }
        const body = scriptAst
          ? [...scriptSetupAst.body, ...scriptAst.body]
          : scriptSetupAst.body
        for (const node of body) {
          const qualified = isQualifiedType(node)
          if (qualified) {
            return qualified
          }
        }
      }
    }
  
  
  function processDefineExpose(node) {
      if (isCallOf(node, DEFINE_EXPOSE)) {
        if (hasDefineExposeCall) {
          error(`duplicate ${DEFINE_EXPOSE}() call`, node)
        }
        hasDefineExposeCall = true
        return true
      }
      return false
    }
  
  /**
     * await foo()
     * -->
     * ;(
     *   ([__temp,__restore] = withAsyncContext(() => foo())),
     *   await __temp,
     *   __restore()
     * )
     *
     * const a = await foo()
     * -->
     * const a = (
     *   ([__temp, __restore] = withAsyncContext(() => foo())),
     *   __temp = await __temp,
     *   __restore(),
     *   __temp
     * )
     */
    function processAwait(node, needSemi, isStatement) {
      const argumentStart =
        node.argument.extra && node.argument.extra.parenthesized
          ? node.argument.extra.parenStart
          : node.argument.start
  
      const argumentStr = source.slice(
        argumentStart + startOffset,
        node.argument.end + startOffset
      )
  
      const containsNestedAwait = /\bawait\b/.test(argumentStr)
  
      s.overwrite(
        node.start + startOffset,
        argumentStart + startOffset,
        `${needSemi ? `;` : ``}(\n  ([__temp,__restore] = ${helper(
          `withAsyncContext`
        )}(${containsNestedAwait ? `async ` : ``}() => `
      )
      s.appendLeft(
        node.end + startOffset,
        `)),\n  ${isStatement ? `` : `__temp = `}await __temp,\n  __restore()${
          isStatement ? `` : `,\n  __temp`
        }\n)`
      )
    }
  
  
  /**
     * check defaults. If the default object is an object literal with only
     * static properties, we can directly generate more optimized default
     * declarations. Otherwise we will have to fallback to runtime merging.
     */
    function hasStaticWithDefaults() {
      return (
        propsRuntimeDefaults &&
        propsRuntimeDefaults.type === 'ObjectExpression' &&
        propsRuntimeDefaults.properties.every(
          node =>
            (node.type === 'ObjectProperty' && !node.computed) ||
            node.type === 'ObjectMethod'
        )
      )
    }
  function genRuntimeProps(props) {
      const keys = Object.keys(props)
      if (!keys.length) {
        return ``
      }
      const hasStaticDefaults = hasStaticWithDefaults()
      const scriptSetupSource = scriptSetup.content
      let propsDecls = `{
      ${keys
        .map(key => {
          let defaultString
          const destructured = genDestructuredDefaultValue(key)
          if (destructured) {
            defaultString = `default: ${destructured}`
          } else if (hasStaticDefaults) {
            const prop = propsRuntimeDefaults.properties.find(
              (node) => node.key.name === key
            )
            if (prop) {
              if (prop.type === 'ObjectProperty') {
                // prop has corresponding static default value
                defaultString = `default: ${scriptSetupSource.slice(
                  prop.value.start,
                  prop.value.end
                )}`
              } else {
                defaultString = `default() ${scriptSetupSource.slice(
                  prop.body.start,
                  prop.body.end
                )}`
              }
            }
          }
  
          const { type, required } = props[key]
          if (!isProd) {
            return `${key}: { type: ${toRuntimeTypeString(
              type
            )}, required: ${required}${
              defaultString ? `, ${defaultString}` : ``
            } }`
          } else if (
            type.some(
              el => el === 'Boolean' || (defaultString && el === 'Function')
            )
          ) {
            // #4783 production: if boolean or defaultString and function exists, should keep the type.
            return `${key}: { type: ${toRuntimeTypeString(type)}${
              defaultString ? `, ${defaultString}` : ``
            } }`
          } else {
            // production: checks are useless
            return `${key}: ${defaultString ? `{ ${defaultString} }` : 'null'}`
          }
        })
        .join(',\n    ')}\n  }`
  
      if (propsRuntimeDefaults && !hasStaticDefaults) {
        propsDecls = `${helper('mergeDefaults')}(${propsDecls}, ${source.slice(
          propsRuntimeDefaults.start + startOffset,
          propsRuntimeDefaults.end + startOffset
        )})`
      }
  
      return `\n  props: ${propsDecls},`
    }
  
  
  function genDestructuredDefaultValue(key) {
      const destructured = propsDestructuredBindings[key]
      if (destructured && destructured.default) {
        const value = scriptSetup.content.slice(
          destructured.default.start,
          destructured.default.end
        )
        const isLiteral = destructured.default.type.endsWith('Literal')
        return isLiteral ? value : `() => ${value}`
      }
    }
  
    function genSetupPropsType(node) {
      const scriptSetupSource = scriptSetup.content
      if (hasStaticWithDefaults()) {
        // if withDefaults() is used, we need to remove the optional flags
        // on props that have default values
        let res = `{ `
        const members = node.type === 'TSTypeLiteral' ? node.members : node.body
        for (const m of members) {
          if (
            (m.type === 'TSPropertySignature' ||
              m.type === 'TSMethodSignature') &&
            m.typeAnnotation &&
            m.key.type === 'Identifier'
          ) {
            if (
              propsRuntimeDefaults.properties.some(
                (p) => p.key.name === m.key.name
              )
            ) {
              res +=
                m.key.name +
                (m.type === 'TSMethodSignature' ? '()' : '') +
                scriptSetupSource.slice(
                  m.typeAnnotation.start,
                  m.typeAnnotation.end
                ) +
                ', '
            } else {
              res +=
                scriptSetupSource.slice(m.start, m.typeAnnotation.end) + `, `
            }
          }
        }
        return (res.length ? res.slice(0, -2) : res) + ` }`
      } else {
        return scriptSetupSource.slice(node.start, node.end)
      }
    }
  function processNormalScript() {
    let scriptAst
    if (script) {
      scriptAst = parse(
        script.content,
        {
          plugins,
          sourceType: 'module'
        },
        scriptStartOffset
      )
  
      for (const node of scriptAst.body) {
        if (node.type === 'ImportDeclaration') {
          // record imports for dedupe
          for (const specifier of node.specifiers) {
            const imported =
              specifier.type === 'ImportSpecifier' &&
              specifier.imported.type === 'Identifier' &&
              specifier.imported.name
            registerUserImport(
              node.source.value,
              specifier.local.name,
              imported,
              node.importKind === 'type' ||
                (specifier.type === 'ImportSpecifier' &&
                  specifier.importKind === 'type'),
              false
            )
          }
        } else if (node.type === 'ExportDefaultDeclaration') {
          // export default
          defaultExport = node
          // export default { ... } --> const __default__ = { ... }
          const start = node.start + scriptStartOffset
          const end = node.declaration.start + scriptStartOffset
          s.overwrite(start, end, `const ${DEFAULT_VAR} = `)
        } else if (node.type === 'ExportNamedDeclaration') {
          const defaultSpecifier = node.specifiers.find(
            s => s.exported.type === 'Identifier' && s.exported.name === 'default'
          )
          if (defaultSpecifier) {
            defaultExport = node
            // 1. remove specifier
            if (node.specifiers.length > 1) {
              s.remove(
                defaultSpecifier.start + scriptStartOffset,
                defaultSpecifier.end + scriptStartOffset
              )
            } else {
              s.remove(
                node.start + scriptStartOffset,
                node.end + scriptStartOffset
              )
            }
            if (node.source) {
              // export { x as default } from './x'
              // rewrite to `import { x as __default__ } from './x'` and
              // add to top
              s.prepend(
                `import { ${defaultSpecifier.local.name} as ${DEFAULT_VAR} } from '${node.source.value}'\n`
              )
            } else {
              // export { x as default }
              // rewrite to `const __default__ = x` and move to end
              s.appendLeft(
                scriptEndOffset,
                `\nconst ${DEFAULT_VAR} = ${defaultSpecifier.local.name}\n`
              )
            }
          }
          if (node.declaration) {
            walkDeclaration(node.declaration, scriptBindings, userImportAlias)
          }
        } else if (
          (node.type === 'VariableDeclaration' ||
            node.type === 'FunctionDeclaration' ||
            node.type === 'ClassDeclaration' ||
            node.type === 'TSEnumDeclaration') &&
          !node.declare
        ) {
          walkDeclaration(node, scriptBindings, userImportAlias)
        }
      }
  
      // apply reactivity transform
      if (enableReactivityTransform && RT.shouldTransform(script.content)) {
        const { rootRefs, importedHelpers } = transformAST(
          scriptAst,
          s,
          scriptStartOffset
        )
        refBindings = rootRefs
        for (const h of importedHelpers) {
          helperImports.add(h)
        }
      }
  
      // <script> after <script setup>
      // we need to move the block up so that `const __default__` is
      // declared before being used in the actual component definition
      if (scriptStartOffset > startOffset) {
        s.move(scriptStartOffset, scriptEndOffset, 0)
      }
    }
  
    return scriptAst
  }
  function processSetupScript() {
    const scriptSetupAst = babelParser.parse(
      scriptSetup.content,
      {
        plugins: [
          ...plugins,
          // allow top level await but only inside <script setup>
          'topLevelAwait'
        ],
        sourceType: 'module'
      },
      startOffset
    )
  
    for (const node of scriptSetupAst.body) {
      const start = node.start + startOffset
      let end = node.end + startOffset
      // locate comment
      if (node.trailingComments && node.trailingComments.length > 0) {
        const lastCommentNode =
          node.trailingComments[node.trailingComments.length - 1]
        end = lastCommentNode.end + startOffset
      }
      // locate the end of whitespace between this statement and the next
      while (end <= source.length) {
        if (!/\s/.test(source.charAt(end))) {
          break
        }
        end++
      }
  
      // (Dropped) `ref: x` bindings
      if (
        node.type === 'LabeledStatement' &&
        node.label.name === 'ref' &&
        node.body.type === 'ExpressionStatement'
      ) {
        error(
          `ref sugar using the label syntax was an experimental proposal and ` +
            `has been dropped based on community feedback. Please check out ` +
            `the new proposal at https://github.com/vuejs/rfcs/discussions/369`,
          node
        )
      }
  
      if (node.type === 'ImportDeclaration') {
        // import declarations are moved to top
        s.move(start, end, 0)
  
        // dedupe imports
        let removed = 0
        const removeSpecifier = (i) => {
          const removeLeft = i > removed
          removed++
          const current = node.specifiers[i]
          const next = node.specifiers[i + 1]
          s.remove(
            removeLeft
              ? node.specifiers[i - 1].end + startOffset
              : current.start + startOffset,
            next && !removeLeft
              ? next.start + startOffset
              : current.end + startOffset
          )
        }
  
        for (let i = 0; i < node.specifiers.length; i++) {
          const specifier = node.specifiers[i]
          const local = specifier.local.name
          const imported =
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.type === 'Identifier' &&
            specifier.imported.name
          const source = node.source.value
          const existing = userImports[local]
          if (
            source === 'vue' &&
            (imported === DEFINE_PROPS ||
              imported === DEFINE_EMITS ||
              imported === DEFINE_EXPOSE)
          ) {
            removeSpecifier(i)
          } else if (existing) {
            if (existing.source === source && existing.imported === imported) {
              // already imported in <script setup>, dedupe
              removeSpecifier(i)
            } else {
              error(`different imports aliased to same local name.`, specifier)
            }
          } else {
            registerUserImport(
              source,
              local,
              imported,
              node.importKind === 'type' ||
                (specifier.type === 'ImportSpecifier' &&
                  specifier.importKind === 'type'),
              true
            )
          }
        }
        if (node.specifiers.length && removed === node.specifiers.length) {
          s.remove(node.start + startOffset, node.end + startOffset)
        }
      }
  
      if (node.type === 'ExpressionStatement') {
        // process `defineProps` and `defineEmit(s)` calls
        if (
          processDefineProps(node.expression) ||
          processDefineEmits(node.expression) ||
          processWithDefaults(node.expression)
        ) {
          s.remove(node.start + startOffset, node.end + startOffset)
        } else if (processDefineExpose(node.expression)) {
          // defineExpose({}) -> expose({})
          const callee = node.expression.callee
          s.overwrite(
            callee.start + startOffset,
            callee.end + startOffset,
            'expose'
          )
        }
      }
  
      if (node.type === 'VariableDeclaration' && !node.declare) {
        const total = node.declarations.length
        let left = total
        for (let i = 0; i < total; i++) {
          const decl = node.declarations[i]
          if (decl.init) {
            // defineProps / defineEmits
            const isDefineProps =
              processDefineProps(decl.init, decl.id) ||
              processWithDefaults(decl.init, decl.id)
            const isDefineEmits = processDefineEmits(decl.init, decl.id)
            if (isDefineProps || isDefineEmits) {
              if (left === 1) {
                s.remove(node.start + startOffset, node.end + startOffset)
              } else {
                let start = decl.start + startOffset
                let end = decl.end + startOffset
                if (i < total - 1) {
                  // not the last one, locate the start of the next
                  end = node.declarations[i + 1].start + startOffset
                } else {
                  // last one, locate the end of the prev
                  start = node.declarations[i - 1].end + startOffset
                }
                s.remove(start, end)
                left--
              }
            }
          }
        }
      }
  
      // walk declarations to record declared bindings
      if (
        (node.type === 'VariableDeclaration' ||
          node.type === 'FunctionDeclaration' ||
          node.type === 'ClassDeclaration') &&
        !node.declare
      ) {
        walkDeclaration(node, setupBindings, userImportAlias)
      }
  
      // walk statements & named exports / variable declarations for top level
      // await
      if (
        (node.type === 'VariableDeclaration' && !node.declare) ||
        node.type.endsWith('Statement')
      ) {
        walk(node, {
          enter(child, parent) {
            if (isFunctionType(child)) {
              this.skip()
            }
            if (child.type === 'AwaitExpression') {
              hasAwait = true
              const needsSemi = scriptSetupAst.body.some(n => {
                return n.type === 'ExpressionStatement' && n.start === child.start
              })
              processAwait(
                child,
                needsSemi,
                parent.type === 'ExpressionStatement'
              )
            }
          }
        })
      }
  
      if (
        (node.type === 'ExportNamedDeclaration' && node.exportKind !== 'type') ||
        node.type === 'ExportAllDeclaration' ||
        node.type === 'ExportDefaultDeclaration'
      ) {
        error(
          `<script setup> cannot contain ES module exports. ` +
            `If you are using a previous version of <script setup>, please ` +
            `consult the updated RFC at https://github.com/vuejs/rfcs/pull/227.`,
          node
        )
      }
  
      if (isTS) {
        // runtime enum
        if (node.type === 'TSEnumDeclaration') {
          registerBinding(setupBindings, node.id, BindingTypes.SETUP_CONST)
        }
  
        // move all Type declarations to outer scope
        if (
          node.type.startsWith('TS') ||
          (node.type === 'ExportNamedDeclaration' &&
            node.exportKind === 'type') ||
          (node.type === 'VariableDeclaration' && node.declare)
        ) {
          recordType(node, declaredTypes)
          s.move(start, end, 0)
        }
      }
    }
  
    return scriptSetupAst
  }
  function applyReactivityTransform() {
    if (
      (enableReactivityTransform &&
        // normal <script> had ref bindings that maybe used in <script setup>
        (refBindings || RT.shouldTransform(scriptSetup.content))) ||
      propsDestructureDecl
    ) {
      const { rootRefs, importedHelpers } = transformAST(
        scriptSetupAst,
        s,
        startOffset,
        refBindings,
        propsDestructuredBindings
      )
      refBindings = refBindings ? [...refBindings, ...rootRefs] : rootRefs
      for (const h of importedHelpers) {
        helperImports.add(h)
      }
    }
  }
  function extractRuntimePropsEmits() {
    if (propsTypeDecl) {
      extractRuntimeProps(propsTypeDecl, typeDeclaredProps, declaredTypes, isProd)
    }
    if (emitsTypeDecl) {
      extractRuntimeEmits(emitsTypeDecl, typeDeclaredEmits)
    }
  }
  function checkUseOptions() {
    checkInvalidScopeReference(propsRuntimeDecl, DEFINE_PROPS)
    checkInvalidScopeReference(propsRuntimeDefaults, DEFINE_PROPS)
    checkInvalidScopeReference(propsDestructureDecl, DEFINE_PROPS)
    checkInvalidScopeReference(emitsRuntimeDecl, DEFINE_PROPS)
  }
  function removeNonScriptContent() {
    if (script) {
      if (startOffset < scriptStartOffset) {
        // <script setup> before <script>
        s.remove(0, startOffset)
        s.remove(endOffset, scriptStartOffset)
        s.remove(scriptEndOffset, source.length)
      } else {
        // <script> before <script setup>
        s.remove(0, scriptStartOffset)
        s.remove(scriptEndOffset, startOffset)
        s.remove(endOffset, source.length)
      }
    } else {
      // only <script setup>
      s.remove(0, startOffset)
      s.remove(endOffset, source.length)
    }
  }
  function analyzeBindingMetadata() {
    if (scriptAst) {
      Object.assign(bindingMetadata, analyzeScriptBindings(scriptAst.body))
    }
    if (propsRuntimeDecl) {
      for (const key of getObjectOrArrayExpressionKeys(propsRuntimeDecl)) {
        bindingMetadata[key] = BindingTypes.PROPS
      }
    }
    for (const key in typeDeclaredProps) {
      bindingMetadata[key] = BindingTypes.PROPS
    }
    // props aliases
    if (propsDestructureDecl) {
      if (propsDestructureRestId) {
        bindingMetadata[propsDestructureRestId] = BindingTypes.SETUP_CONST
      }
      for (const key in propsDestructuredBindings) {
        const { local } = propsDestructuredBindings[key]
        if (local !== key) {
          bindingMetadata[local] = BindingTypes.PROPS_ALIASED
          ;(bindingMetadata.__propsAliases ||
            (bindingMetadata.__propsAliases = {}))[local] = key
        }
      }
    }
    for (const [key, { isType, imported, source }] of Object.entries(
      userImports
    )) {
      if (isType) continue
      bindingMetadata[key] =
        (imported === 'default' && source.endsWith('.vue')) || source === 'vue'
          ? BindingTypes.SETUP_CONST
          : BindingTypes.SETUP_MAYBE_REF
    }
    for (const key in scriptBindings) {
      bindingMetadata[key] = scriptBindings[key]
    }
    for (const key in setupBindings) {
      bindingMetadata[key] = setupBindings[key]
    }
    // known ref bindings
    if (refBindings) {
      for (const key of refBindings) {
        bindingMetadata[key] = BindingTypes.SETUP_REF
      }
    }
  }
  function injectUseCssVarsCalls() {
    if (cssVars.length) {
      helperImports.add(CSS_VARS_HELPER)
      helperImports.add('unref')
      s.prependRight(
        startOffset,
        `\n${genCssVarsCode(cssVars, bindingMetadata, scopeId, isProd)}\n`
      )
    }
  }
  function finalizeSetupArgumentSignature() {
    if (propsTypeDecl) {
      // mark as any and only cast on assignment
      // since the user defined complex types may be incompatible with the
      // inferred type from generated runtime declarations
      args += `: any`
    }
    // inject user assignment of props
    // we use a default __props so that template expressions referencing props
    // can use it directly
    if (propsIdentifier) {
      s.prependLeft(
        startOffset,
        `\nconst ${propsIdentifier} = __props${
          propsTypeDecl ? ` as ${genSetupPropsType(propsTypeDecl)}` : ``
        }\n`
      )
    }
    if (propsDestructureRestId) {
      s.prependLeft(
        startOffset,
        `\nconst ${propsDestructureRestId} = ${helper(
          `createPropsRestProxy`
        )}(__props, ${JSON.stringify(Object.keys(propsDestructuredBindings))})\n`
      )
    }
    // inject temp variables for async context preservation
    if (hasAwait) {
      const any = isTS ? `: any` : ``
      s.prependLeft(startOffset, `\nlet __temp${any}, __restore${any}\n`)
    }
  
    const destructureElements =
      hasDefineExposeCall || !options.inlineTemplate ? [`expose`] : []
    if (emitIdentifier) {
      destructureElements.push(
        emitIdentifier === `emit` ? `emit` : `emit: ${emitIdentifier}`
      )
    }
    if (destructureElements.length) {
      args += `, { ${destructureElements.join(', ')} }`
      if (emitsTypeDecl) {
        args += `: { emit: (${scriptSetup.content.slice(
          emitsTypeDecl.start,
          emitsTypeDecl.end
        )}), expose: any, slots: any, attrs: any }`
      }
    }
  }
  function finalizeSetupArgumentSignature() {
    if (propsTypeDecl) {
      // mark as any and only cast on assignment
      // since the user defined complex types may be incompatible with the
      // inferred type from generated runtime declarations
      args += `: any`
    }
    // inject user assignment of props
    // we use a default __props so that template expressions referencing props
    // can use it directly
    if (propsIdentifier) {
      s.prependLeft(
        startOffset,
        `\nconst ${propsIdentifier} = __props${
          propsTypeDecl ? ` as ${genSetupPropsType(propsTypeDecl)}` : ``
        }\n`
      )
    }
    if (propsDestructureRestId) {
      s.prependLeft(
        startOffset,
        `\nconst ${propsDestructureRestId} = ${helper(
          `createPropsRestProxy`
        )}(__props, ${JSON.stringify(Object.keys(propsDestructuredBindings))})\n`
      )
    }
    // inject temp variables for async context preservation
    if (hasAwait) {
      const any = isTS ? `: any` : ``
      s.prependLeft(startOffset, `\nlet __temp${any}, __restore${any}\n`)
    }
  
    const destructureElements =
      hasDefineExposeCall || !options.inlineTemplate ? [`expose`] : []
    if (emitIdentifier) {
      destructureElements.push(
        emitIdentifier === `emit` ? `emit` : `emit: ${emitIdentifier}`
      )
    }
    if (destructureElements.length) {
      args += `, { ${destructureElements.join(', ')} }`
      if (emitsTypeDecl) {
        args += `: { emit: (${scriptSetup.content.slice(
          emitsTypeDecl.start,
          emitsTypeDecl.end
        )}), expose: any, slots: any, attrs: any }`
      }
    }
  }
  function generateReturnStatement() {
    if (options.inlineTemplate) {
      if (sfc.template && !sfc.template.src) {
        if (options.templateOptions && options.templateOptions.ssr) {
          hasInlinedSsrRenderFn = true
        }
        // inline render function mode - we are going to compile the template and
        // inline it right here
        const { code, ast, preamble, tips, errors } = compileTemplate({
          filename,
          source: sfc.template.content,
          inMap: sfc.template.map,
          ...options.templateOptions,
          id: scopeId,
          scoped: sfc.styles.some(s => s.scoped),
          isProd: options.isProd,
          ssrCssVars: sfc.cssVars,
          compilerOptions: {
            ...(options.templateOptions &&
              options.templateOptions.compilerOptions),
            inline: true,
            isTS,
            bindingMetadata
          }
        })
  
        const err = errors[0]
        if (typeof err === 'string') {
          throw new Error(err)
        } else if (err) {
          if (err.loc) {
            err.message +=
              `\n\n` +
              sfc.filename +
              '\n' +
              generateCodeFrame(
                source,
                err.loc.start.offset,
                err.loc.end.offset
              ) +
              `\n`
          }
          throw err
        }
        if (preamble) {
          s.prepend(preamble)
        }
        // avoid duplicated unref import
        // as this may get injected by the render function preamble OR the
        // css vars codegen
        if (ast && ast.helpers.includes(UNREF)) {
          helperImports.delete('unref')
        }
        returned = code
      } else {
        returned = `() => {}`
      }
    } else {
      // return bindings from script and script setup
      const allBindings= {
        ...scriptBindings,
        ...setupBindings
      }
      for (const key in userImports) {
        if (!userImports[key].isType && userImports[key].isUsedInTemplate) {
          allBindings[key] = true
        }
      }
      returned = `{ ${Object.keys(allBindings).join(', ')} }`
    }
  
    if (!options.inlineTemplate) {
      // in non-inline mode, the `__isScriptSetup: true` flag is used by
      // componentPublicInstance proxy to allow properties that start with $ or _
      s.appendRight(
        endOffset,
        `\nconst __returned__ = ${returned}\n` +
          `Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })\n` +
          `return __returned__` +
          `\n}\n\n`
      )
    } else {
      s.appendRight(endOffset, `\nreturn ${returned}\n}\n\n`)
    }
  }
  function finalizeDefaultExport() {
    let runtimeOptions = ``
    if (hasInlinedSsrRenderFn) {
      runtimeOptions += `\n  __ssrInlineRender: true,`
    }
    if (propsRuntimeDecl) {
      let declCode = scriptSetup.content
        .slice(propsRuntimeDecl.start, propsRuntimeDecl.end)
        .trim()
      if (propsDestructureDecl) {
        const defaults = []
        for (const key in propsDestructuredBindings) {
          const d = genDestructuredDefaultValue(key)
          if (d) defaults.push(`${key}: ${d}`)
        }
        if (defaults.length) {
          declCode = `${helper(
            `mergeDefaults`
          )}(${declCode}, {\n  ${defaults.join(',\n  ')}\n})`
        }
      }
      runtimeOptions += `\n  props: ${declCode},`
    } else if (propsTypeDecl) {
      runtimeOptions += genRuntimeProps(typeDeclaredProps)
    }
    if (emitsRuntimeDecl) {
      runtimeOptions += `\n  emits: ${scriptSetup.content
        .slice(emitsRuntimeDecl.start, emitsRuntimeDecl.end)
        .trim()},`
    } else if (emitsTypeDecl) {
      runtimeOptions += genRuntimeEmits(typeDeclaredEmits)
    }
  
    // <script setup> components are closed by default. If the user did not
    // explicitly call `defineExpose`, call expose() with no args.
    const exposeCall =
      hasDefineExposeCall || options.inlineTemplate ? `` : `  expose();\n`
    // wrap setup code with function.
    if (isTS) {
      // for TS, make sure the exported type is still valid type with
      // correct props information
      // we have to use object spread for types to be merged properly
      // user's TS setting should compile it down to proper targets
      // export default defineComponent({ ...__default__, ... })
      const def = defaultExport ? `\n  ...${DEFAULT_VAR},` : ``
      s.prependLeft(
        startOffset,
        `\nexport default /*#__PURE__*/${helper(
          `defineComponent`
        )}({${def}${runtimeOptions}\n  ${
          hasAwait ? `async ` : ``
        }setup(${args}) {\n${exposeCall}`
      )
      s.appendRight(endOffset, `})`)
    } else {
      if (defaultExport) {
        // without TS, can't rely on rest spread, so we use Object.assign
        // export default Object.assign(__default__, { ... })
        s.prependLeft(
          startOffset,
          `\nexport default /*#__PURE__*/Object.assign(${DEFAULT_VAR}, {${runtimeOptions}\n  ` +
            `${hasAwait ? `async ` : ``}setup(${args}) {\n${exposeCall}`
        )
        s.appendRight(endOffset, `})`)
      } else {
        s.prependLeft(
          startOffset,
          `\nexport default {${runtimeOptions}\n  ` +
            `${hasAwait ? `async ` : ``}setup(${args}) {\n${exposeCall}`
        )
        s.appendRight(endOffset, `}`)
      }
    }
  }
  function finalizeVueHelperImports() {
    if (helperImports.size > 0) {
      s.prepend(
        `import { ${[...helperImports]
          .map(h => `${h} as _${h}`)
          .join(', ')} } from 'vue'\n`
      )
    }
  }

  // 1. process normal <script> first if it exists
  let scriptAst = processNormalScript()
  // 2. parse <script setup> and  walk over top level statements
  const scriptSetupAst = processSetupScript()

  // 3. Apply reactivity transform
  applyReactivityTransform()
  // 4. extract runtime props/emits code from setup context type
  extractRuntimePropsEmits()
  // 5. check useOptions args to make sure it doesn't reference setup scope
  // variables
  checkUseOptions()
  // 6. remove non-script content
  removeNonScriptContent()
  // 7. analyze binding metadata
  analyzeBindingMetadata()
  // 8. inject `useCssVars` calls
  injectUseCssVarsCalls()
  // 9. finalize setup() argument signature
  let args = `__props`
  finalizeSetupArgumentSignature()
  // 10. generate return statement
  let returned
  generateReturnStatement()
  // 11. finalize default export
  let runtimeOptions = ''
  finalizeDefaultExport()
  // 12. finalize Vue helper imports
  finalizeVueHelperImports()

  s.trim()

  return {
    ...scriptSetup,
    bindings: bindingMetadata,
    imports: userImports,
    content: s.toString(),
    map: genSourceMap
      ? (s.generateMap({
          source: filename,
          hires: true,
          includeContent: true
        }))
      : undefined,
    scriptAst: scriptAst?.body,
    scriptSetupAst: scriptSetupAst?.body
  }
}
