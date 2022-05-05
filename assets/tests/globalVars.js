/** jsx?|tsx? file header */
let debugOn = true
let currentLogKey = 'cc'
let __BROWSER__ = typeof window !== 'undefined'
let logs = {}
const __DEV__ = true
const log = (fn, message) => {
  if (debugOn) {
    if (message === undefined) {
      console.log(fn)
    } else {
      console.log(`[${fn}] ${message}`)
    }
  }
}
const logOn = () => (debugOn = true)
const logOff = () => (debugOn = false)
const logEnd = (hint = 'END') => {
  const m = `--------- ${hint} ---------`
  if (debugOn) pushLog(m, 'title')
  return m
}
const logBr = () => console.log('\n')
let debugTraverseOn = false
const logTraverseOn = () => (debugTraverseOn = true)
const logTraverseOff = () => (debugTraverseOn = false)
const logg = (hint, ...msg) => {
  if (!debugTraverseOn && hint === 'traverseNode') return
  if (debugOn) {
    const m = logEnd(hint)
    msg.forEach((m) => pushLog(m))
  }
}
function pushLog(m, type = 'normal') {
  ;(logs[currentLogKey] || (logs[currentLogKey] = [])).push({ value: m, type })
  log(m)
}
function clearLog(key) {
  if (key) {
    logs[key] = []
  } else {
    logs = {}
  }
}

let w = {}
let debugEle = null
if (__BROWSER__) {
  w = typeof window !== 'undefined' ? window : {}
}
w.log = (msg, isLine = false) => {
  if (debugEle) {
    const cls = ['debug', isLine ? 'line' : ''].filter(Boolen)
    ele.innerHTML = `${debugEl.innerHTML}<pre class="${cls.join(' ')}"><code>${
      typeof msg === 'object' ? syntaxHighlight(msg) : msg
    }</code></pre>`
    return ele.innerHTML
  }
}

function syntaxHighlight(json) {
  if (typeof json != 'string') {
    json = JSON.stringify(json, undefined, 2)
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      var cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return '<span class="' + cls + '">' + match + '</span>'
    }
  )
}

let babelParser
if (!__BROWSER__) {
  babelParser = require(process.env.NODE_LIB + '/@babel/parser')
}
// The default decoder only provides escapes for characters reserved as part of
// the template syntax, and is only used if the custom renderer did not provide
// a platform-specific decoder.
const decodeRE = /&(gt|lt|amp|apos|quot);/g
const decodeMap = {
  gt: '>',
  lt: '<',
  amp: '&',
  apos: "'",
  quot: '"'
}

const EMPTY_OBJ = {}
const NO = () => false
const NOOP = () => {}
const locStub = {
  source: '',
  start: { line: 1, column: 1, offset: 0 },
  end: { line: 1, column: 1, offset: 0 }
}

const ConstantTypes = {
  NOT_CONSTANT: 0,
  CAN_SKIP_PATCH: 1,
  CAN_HOIST: 2,
  CAN_STRINGIFY: 3
}

const ElementTypes = {
  ELEMENT: 0,
  COMPONENT: 1,
  SLOT: 2,
  TEMPLATE: 3
}

const Namespaces = {
  HTML: 0
}

const NodeTypes = {
  ROOT: 0,
  ELEMENT: 1,
  TEXT: 2,
  COMMENT: 3,
  SIMPLE_EXPRESSION: 4,
  INTERPOLATION: 5,
  ATTRIBUTE: 6,
  DIRECTIVE: 7,
  // containers
  COMPOUND_EXPRESSION: 8,
  IF: 9,
  IF_BRANCH: 10,
  FOR: 11,
  TEXT_CALL: 12,
  // codegen
  VNODE_CALL: 13,
  JS_CALL_EXPRESSION: 14,
  JS_OBJECT_EXPRESSION: 15,
  JS_PROPERTY: 16,
  JS_ARRAY_EXPRESSION: 17,
  JS_FUNCTION_EXPRESSION: 18,
  JS_CONDITIONAL_EXPRESSION: 19,
  JS_CACHE_EXPRESSION: 20,

  // ssr codegen
  JS_BLOCK_STATEMENT: 21,
  JS_TEMPLATE_LITERAL: 22,
  JS_IF_STATEMENT: 23,
  JS_ASSIGNMENT_EXPRESSION: 24,
  JS_SEQUENCE_EXPRESSION: 25,
  JS_RETURN_STATEMENT: 26
}

const defaultParserOptions = {
  delimiters: [`{{`, `}}`],
  getNamespace: () => Namespaces.HTML,
  getTextMode: () => TextModes.DATA,
  isVoidTag: NO,
  isPreTag: NO,
  isCustomElement: NO,
  decodeEntities: (rawText) =>
    rawText.replace(decodeRE, (_, p1) => decodeMap[p1]),
  onError: defaultOnError,
  onWarn: defaultOnWarn,
  comments: __DEV__
}

const TagType = {
  Start: 0,
  End: 1
}

const TextModes = {
  DATA: 0,
  RCDATA: 1,
  RAWTEXT: 2,
  CDATA: 3,
  ATTRIBUTE_VALUE: 4
}

const extend = Object.assign

function defaultOnError(error) {
  throw error
}

function defaultOnWarn(msg) {
  __DEV__ && console.warn(`[Vue warn] ${msg.message}`)
}

function makeMap(str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? (val) => !!map[val.toLowerCase()]
    : (val) => !!map[val]
}

const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (val, key) => hasOwnProperty.call(val, key)

const isArray = Array.isArray
const isMap = (val) => toTypeString(val) === '[object Map]'
const isSet = (val) => toTypeString(val) === '[object Set]'

const isDate = (val) => val instanceof Date
const isFunction = (val) => typeof val === 'function'
const isString = (val) => typeof val === 'string'
const isSymbol = (val) => typeof val === 'symbol'
const isObject = (val) => val !== null && typeof val === 'object'
const onRE = /^on[^a-z]/
const isOn = (key) => onRE.test(key)

const isPromise = (val) => {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

const objectToString = Object.prototype.toString
const toTypeString = (value) => objectToString.call(value)

const toRawType = (value) => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}

function isText(node) {
  // (ref:isText)
  return node.type === NodeTypes.INTERPOLATION || node.type === NodeTypes.TEXT
}

const isPlainObject = (val) => toTypeString(val) === '[object Object]'
const isIntegerKey = (key) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key

const isReservedProp = /*#__PURE__*/ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ',key,ref,ref_for,ref_key,' +
    'onVnodeBeforeMount,onVnodeMounted,' +
    'onVnodeBeforeUpdate,onVnodeUpdated,' +
    'onVnodeBeforeUnmount,onVnodeUnmounted'
)

const GLOBALS_WHITE_LISTED =
  'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
  'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
  'Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt'

const isGloballyWhitelisted = /*#__PURE__*/ makeMap(GLOBALS_WHITE_LISTED)

const nonIdentifierRE = /^\d|[^\$\w]/
const isSimpleIdentifier = (name) => !nonIdentifierRE.test(name)

const isBuiltInDirective = /*#__PURE__*/ makeMap(
  'bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo'
)

function getCursor(context) {
  const { column, line, offset } = context
  return { column, line, offset }
}

function getSelection(context, start, end) {
  end = end || getCursor(context)
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset)
  }
}

function last(xs) {
  return xs[xs.length - 1]
}

function startsWith(source, searchString) {
  return source.startsWith(searchString)
}

function advancePositionWithMutation(
  pos,
  source,
  numberOfCharacters = source.length
) {
  let linesCount = 0
  let lastNewLinePos = -1
  for (let i = 0; i < numberOfCharacters; i++) {
    if (source.charCodeAt(i) === 10 /* newline char code */) {
      linesCount++
      lastNewLinePos = i
    }
  }

  pos.offset += numberOfCharacters
  pos.line += linesCount
  pos.column =
    lastNewLinePos === -1
      ? pos.column + numberOfCharacters
      : numberOfCharacters - lastNewLinePos

  return pos
}

function advancePositionWithClone(
  pos,
  source,
  numberOfCharacters = source.length
) {
  return advancePositionWithMutation(
    extend({}, pos),
    source,
    numberOfCharacters
  )
}

function advanceBy(context, numberOfCharacters) {
  const { source } = context
  advancePositionWithMutation(context, source, numberOfCharacters)
  context.source = source.slice(numberOfCharacters)
}

function advanceSpaces(context) {
  const match = /^[\t\r\n\f ]+/.exec(context.source)
  if (match) {
    advanceBy(context, match[0].length)
  }
}

function getNewPosition(context, start, numberOfCharacters) {
  return advancePositionWithClone(
    start,
    context.originalSource.slice(start.offset, numberOfCharacters),
    numberOfCharacters
  )
}

function emitError(context, code, offset, loc = getCursor(context)) {
  if (offset) {
    loc.offset += offset
    loc.column += offset
  }
  // ignore...
}

function isEnd(context, mode, ancestors) {
  const s = context.source

  switch (mode) {
    case TextModes.DATA:
      if (startsWith(s, '</')) {
        // TODO: probably bad performance
        for (let i = ancestors.length - 1; i >= 0; --i) {
          if (startsWithEndTagOpen(s, ancestors[i].tag)) {
            return true
          }
        }
      }
      break

    case TextModes.RCDATA:
    case TextModes.RAWTEXT: {
      const parent = last(ancestors)
      if (parent && startsWithEndTagOpen(s, parent.tag)) {
        return true
      }
      break
    }

    case TextModes.CDATA:
      if (startsWith(s, ']]>')) {
        return true
      }
      break
  }

  return !s
}

function startsWithEndTagOpen(source, tag) {
  return (
    startsWith(source, '</') &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase() &&
    /[\t\r\n\f />]/.test(source[2 + tag.length] || '>')
  )
}

const cacheStringFunction = (fn) => {
  const cache = Object.create(null)
  return (str) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}

const camelizeRE = /-(\w)/g
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
})

const hyphenateRE = /\B([A-Z])/g
const hyphenate = cacheStringFunction((str) =>
  str.replace(hyphenateRE, '-$1').toLowerCase()
)
const capitalize = cacheStringFunction(
  (str) => str.charAt(0).toUpperCase() + str.slice(1)
)
const toHandlerKey = cacheStringFunction((str) =>
  str ? `on${capitalize(str)}` : ``
)

const isBuiltInType = (tag, expected) =>
  tag === expected || tag === hyphenate(expected)

function isCoreComponent(tag) {
  if (isBuiltInType(tag, 'Teleport')) {
    return TELEPORT
  } else if (isBuiltInType(tag, 'Suspense')) {
    return SUSPENSE
  } else if (isBuiltInType(tag, 'KeepAlive')) {
    return KEEP_ALIVE
  } else if (isBuiltInType(tag, 'BaseTransition')) {
    return BASE_TRANSITION
  }
}

const isSpecialTemplateDirective = /*#__PURE__*/ makeMap(
  `if,else,else-if,for,slot`
)

function getVNodeHelper(ssr, isComponent) {
  return ssr || isComponent ? CREATE_VNODE : CREATE_ELEMENT_VNODE
}

function getVNodeBlockHelper(ssr, isComponent) {
  return ssr || isComponent ? CREATE_BLOCK : CREATE_ELEMENT_BLOCK
}

function isSingleElementRoot(root, child) {
  const { children } = root
  return (
    children.length === 1 &&
    child.type === NodeTypes.ELEMENT &&
    !isSlotOutlet(child)
  )
}

function isSlotOutlet(node) {
  return node.type === NodeTypes.ELEMENT && node.tagType === ElementTypes.SLOT
}

function findDir(node, name, allowEmpty = false) {
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i]
    if (
      p.type === NodeTypes.DIRECTIVE &&
      (allowEmpty || p.exp) &&
      (isString(name) ? p.name === name : name.test(p.name))
    ) {
      return p
    }
  }
}

function findProp(node, name, dynamicOnly = false, allowEmpty = false) {
  for (let i = 0; i < node.props.length; i++) {
    const p = node.props[i]
    if (p.type === NodeTypes.ATTRIBUTE) {
      if (dynamicOnly) continue
      if (p.name === name && (p.value || allowEmpty)) {
        return p
      }
    } else if (
      p.name === 'bind' &&
      (p.exp || allowEmpty) &&
      isStaticArgOf(p.arg, name)
    ) {
      return p
    }
  }
}

const isStaticExp = (p) => p.type === NodeTypes.SIMPLE_EXPRESSION && p.isStatic

function isStaticArgOf(arg, name) {
  return !!(arg && isStaticExp(arg) && arg.content === name)
}

function isVSlot(p) {
  return p.type === NodeTypes.DIRECTIVE && p.name === 'slot'
}

function getMemoedVNodeCall(node) {
  if (node.type === NodeTypes.JS_CALL_EXPRESSION && node.callee === WITH_MEMO) {
    return node.arguments[1].returns
  } else {
    return node
  }
}

function getInnerRange(loc, offset, length) {
  const source = loc.source.slice(offset, offset + length)
  const newLoc = {
    source,
    start: advancePositionWithClone(loc.start, loc.source, offset),
    end: loc.end
  }

  if (length != null) {
    newLoc.end = advancePositionWithClone(
      loc.start,
      loc.source,
      offset + length
    )
  }

  return newLoc
}

function toValidAssetId(name, type) {
  // see issue#4422, we need adding identifier on validAssetId if variable `name` has specific character
  return `_${type}_${name.replace(/[^\w]/g, (searchValue, replaceValue) => {
    return searchValue === '-' ? '_' : name.charCodeAt(replaceValue).toString()
  })}`
}

function isTemplateNode(node) {
  return (
    node.type === NodeTypes.ELEMENT && node.tagType === ElementTypes.TEMPLATE
  )
}

function isComponent(tag, props, context) {
  const options = context.options
  if (options.isCustomElement(tag)) {
    return false
  }
  if (
    tag === 'component' ||
    /^[A-Z]/.test(tag) ||
    isCoreComponent(tag) ||
    (options.isBuiltInComponent && options.isBuiltInComponent(tag)) ||
    (options.isNativeTag && !options.isNativeTag(tag))
  ) {
    return true
  }
  // at this point the tag should be a native tag, but check for potential "is"
  // casting
  for (let i = 0; i < props.length; i++) {
    const p = props[i]
    if (p.type === NodeTypes.ATTRIBUTE) {
      if (p.name === 'is' && p.value) {
        if (p.value.content.startsWith('vue:')) {
          return true
        }
      }
    } else {
      // directive
      // v-is (TODO Deprecate)
      if (p.name === 'is') {
        return true
      }
    }
  }
}

function pushNode(nodes, node) {
  if (node.type === NodeTypes.TEXT) {
    const prev = last(nodes)
    // Merge if both this and the previous node are text and those are
    // consecutive. This happens for cases like "a < b".
    if (
      prev &&
      prev.type === NodeTypes.TEXT &&
      prev.loc.end.offset === node.loc.start.offset
    ) {
      prev.content += node.content
      prev.loc.end = node.loc.end
      prev.loc.source += node.loc.source
      return
    }
  }

  nodes.push(node)
}

const FRAGMENT = Symbol(__DEV__ ? `Fragment` : ``)
const TELEPORT = Symbol(__DEV__ ? `Teleport` : ``)
const SUSPENSE = Symbol(__DEV__ ? `Suspense` : ``)
const KEEP_ALIVE = Symbol(__DEV__ ? `KeepAlive` : ``)
const BASE_TRANSITION = Symbol(__DEV__ ? `BaseTransition` : ``)
const OPEN_BLOCK = Symbol(__DEV__ ? `openBlock` : ``)
const CREATE_BLOCK = Symbol(__DEV__ ? `createBlock` : ``)
const CREATE_ELEMENT_BLOCK = Symbol(__DEV__ ? `createElementBlock` : ``)
const CREATE_VNODE = Symbol(__DEV__ ? `createVNode` : ``)
const CREATE_ELEMENT_VNODE = Symbol(__DEV__ ? `createElementVNode` : ``)
const CREATE_COMMENT = Symbol(__DEV__ ? `createCommentVNode` : ``)
const CREATE_TEXT = Symbol(__DEV__ ? `createTextVNode` : ``)
const CREATE_STATIC = Symbol(__DEV__ ? `createStaticVNode` : ``)
const RESOLVE_COMPONENT = Symbol(__DEV__ ? `resolveComponent` : ``)
const RESOLVE_DYNAMIC_COMPONENT = Symbol(
  __DEV__ ? `resolveDynamicComponent` : ``
)
const RESOLVE_DIRECTIVE = Symbol(__DEV__ ? `resolveDirective` : ``)
const RESOLVE_FILTER = Symbol(__DEV__ ? `resolveFilter` : ``)
const WITH_DIRECTIVES = Symbol(__DEV__ ? `withDirectives` : ``)
const RENDER_LIST = Symbol(__DEV__ ? `renderList` : ``)
const RENDER_SLOT = Symbol(__DEV__ ? `renderSlot` : ``)
const CREATE_SLOTS = Symbol(__DEV__ ? `createSlots` : ``)
const TO_DISPLAY_STRING = Symbol(__DEV__ ? `toDisplayString` : ``)
const MERGE_PROPS = Symbol(__DEV__ ? `mergeProps` : ``)
const NORMALIZE_CLASS = Symbol(__DEV__ ? `normalizeClass` : ``)
const NORMALIZE_STYLE = Symbol(__DEV__ ? `normalizeStyle` : ``)
const NORMALIZE_PROPS = Symbol(__DEV__ ? `normalizeProps` : ``)
const GUARD_REACTIVE_PROPS = Symbol(__DEV__ ? `guardReactiveProps` : ``)
const TO_HANDLERS = Symbol(__DEV__ ? `toHandlers` : ``)
const CAMELIZE = Symbol(__DEV__ ? `camelize` : ``)
const CAPITALIZE = Symbol(__DEV__ ? `capitalize` : ``)
const TO_HANDLER_KEY = Symbol(__DEV__ ? `toHandlerKey` : ``)
const SET_BLOCK_TRACKING = Symbol(__DEV__ ? `setBlockTracking` : ``)
const PUSH_SCOPE_ID = Symbol(__DEV__ ? `pushScopeId` : ``)
const POP_SCOPE_ID = Symbol(__DEV__ ? `popScopeId` : ``)
const WITH_CTX = Symbol(__DEV__ ? `withCtx` : ``)
const UNREF = Symbol(__DEV__ ? `unref` : ``)
const IS_REF = Symbol(__DEV__ ? `isRef` : ``)
const WITH_MEMO = Symbol(__DEV__ ? `withMemo` : ``)
const IS_MEMO_SAME = Symbol(__DEV__ ? `isMemoSame` : ``)

// Name mapping for runtime helpers that need to be imported from 'vue' in
// generated code. Make sure these are correctly exported in the runtime!
// Using `any` here because TS doesn't allow symbols as index type.
const helperNameMap = {
  [FRAGMENT]: `Fragment`,
  [TELEPORT]: `Teleport`,
  [SUSPENSE]: `Suspense`,
  [KEEP_ALIVE]: `KeepAlive`,
  [BASE_TRANSITION]: `BaseTransition`,
  [OPEN_BLOCK]: `openBlock`,
  [CREATE_BLOCK]: `createBlock`,
  [CREATE_ELEMENT_BLOCK]: `createElementBlock`,
  [CREATE_VNODE]: `createVNode`,
  [CREATE_ELEMENT_VNODE]: `createElementVNode`,
  [CREATE_COMMENT]: `createCommentVNode`,
  [CREATE_TEXT]: `createTextVNode`,
  [CREATE_STATIC]: `createStaticVNode`,
  [RESOLVE_COMPONENT]: `resolveComponent`,
  [RESOLVE_DYNAMIC_COMPONENT]: `resolveDynamicComponent`,
  [RESOLVE_DIRECTIVE]: `resolveDirective`,
  [RESOLVE_FILTER]: `resolveFilter`,
  [WITH_DIRECTIVES]: `withDirectives`,
  [RENDER_LIST]: `renderList`,
  [RENDER_SLOT]: `renderSlot`,
  [CREATE_SLOTS]: `createSlots`,
  [TO_DISPLAY_STRING]: `toDisplayString`,
  [MERGE_PROPS]: `mergeProps`,
  [NORMALIZE_CLASS]: `normalizeClass`,
  [NORMALIZE_STYLE]: `normalizeStyle`,
  [NORMALIZE_PROPS]: `normalizeProps`,
  [GUARD_REACTIVE_PROPS]: `guardReactiveProps`,
  [TO_HANDLERS]: `toHandlers`,
  [CAMELIZE]: `camelize`,
  [CAPITALIZE]: `capitalize`,
  [TO_HANDLER_KEY]: `toHandlerKey`,
  [SET_BLOCK_TRACKING]: `setBlockTracking`,
  [PUSH_SCOPE_ID]: `pushScopeId`,
  [POP_SCOPE_ID]: `popScopeId`,
  [WITH_CTX]: `withCtx`,
  [UNREF]: `unref`,
  [IS_REF]: `isRef`,
  [WITH_MEMO]: `withMemo`,
  [IS_MEMO_SAME]: `isMemoSame`
}

function registerRuntimeHelpers(helpers) {
  Object.getOwnPropertySymbols(helpers).forEach((s) => {
    helperNameMap[s] = helpers[s]
  })
}

/**
 * Patch flags are optimization hints generated by the compiler.
 * when a block with dynamicChildren is encountered during diff, the algorithm
 * enters "optimized mode". In this mode, we know that the vdom is produced by
 * a render function generated by the compiler, so the algorithm only needs to
 * handle updates explicitly marked by these patch flags.
 *
 * Patch flags can be combined using the | bitwise operator and can be checked
 * using the & operator, e.g.
 *
 * ```js
 * const flag = TEXT | CLASS
 * if (flag & TEXT) { ... }
 * ```
 *
 * Check the `patchElement` function in '../../runtime-core/src/renderer.ts' to see how the
 * flags are handled during diff.
 */
const PatchFlags = {
  /**
   * Indicates an element with dynamic textContent (children fast path)
   */
  TEXT: 1,

  /**
   * Indicates an element with dynamic class binding.
   */
  CLASS: 1 << 1,

  /**
   * Indicates an element with dynamic style
   * The compiler pre-compiles static string styles into static objects
   * + detects and hoists inline static objects
   * e.g. `style="color: red"` and `:style="{ color: 'red' }"` both get hoisted
   * as:
   * ```js
   * const style = { color: 'red' }
   * render() { return e('div', { style }) }
   * ```
   */
  STYLE: 1 << 2,

  /**
   * Indicates an element that has non-class/style dynamic props.
   * Can also be on a component that has any dynamic props (includes
   * class/style). when this flag is present, the vnode also has a dynamicProps
   * array that contains the keys of the props that may change so the runtime
   * can diff them faster (without having to worry about removed props)
   */
  PROPS: 1 << 3,

  /**
   * Indicates an element with props with dynamic keys. When keys change, a full
   * diff is always needed to remove the old key. This flag is mutually
   * exclusive with CLASS, STYLE and PROPS.
   */
  FULL_PROPS: 1 << 4,

  /**
   * Indicates an element with event listeners (which need to be attached
   * during hydration)
   */
  HYDRATE_EVENTS: 1 << 5,

  /**
   * Indicates a fragment whose children order doesn't change.
   */
  STABLE_FRAGMENT: 1 << 6,

  /**
   * Indicates a fragment with keyed or partially keyed children
   */
  KEYED_FRAGMENT: 1 << 7,

  /**
   * Indicates a fragment with unkeyed children.
   */
  UNKEYED_FRAGMENT: 1 << 8,

  /**
   * Indicates an element that only needs non-props patching, e.g. ref or
   * directives (onVnodeXXX hooks). since every patched vnode checks for refs
   * and onVnodeXXX hooks, it simply marks the vnode so that a parent block
   * will track it.
   */
  NEED_PATCH: 1 << 9,

  /**
   * Indicates a component with dynamic slots (e.g. slot that references a v-for
   * iterated value, or dynamic slot names).
   * Components with this flag are always force updated.
   */
  DYNAMIC_SLOTS: 1 << 10,

  /**
   * Indicates a fragment that was created only because the user has placed
   * comments at the root level of a template. This is a dev-only flag since
   * comments are stripped in production.
   */
  DEV_ROOT_FRAGMENT: 1 << 11,

  /**
   * SPECIAL FLAGS -------------------------------------------------------------
   * Special flags are negative integers. They are never matched against using
   * bitwise operators (bitwise matching should only happen in branches where
   * patchFlag > 0), and are mutually exclusive. When checking for a special
   * flag, simply check patchFlag === FLAG.
   */

  /**
   * Indicates a hoisted static vnode. This is a hint for hydration to skip
   * the entire sub tree since static content never needs to be updated.
   */
  HOISTED: -1,
  /**
   * A special flag that indicates that the diffing algorithm should bail out
   * of optimized mode. For example, on block fragments created by renderSlot()
   * when encountering non-compiler generated slots (i.e. manually written
   * render functions, which should always be fully diffed)
   * OR manually cloneVNodes
   */
  BAIL: -2
}

/**
 * dev only flag -> name mapping
 */
const PatchFlagNames = {
  [PatchFlags.TEXT]: `TEXT`,
  [PatchFlags.CLASS]: `CLASS`,
  [PatchFlags.STYLE]: `STYLE`,
  [PatchFlags.PROPS]: `PROPS`,
  [PatchFlags.FULL_PROPS]: `FULL_PROPS`,
  [PatchFlags.HYDRATE_EVENTS]: `HYDRATE_EVENTS`,
  [PatchFlags.STABLE_FRAGMENT]: `STABLE_FRAGMENT`,
  [PatchFlags.KEYED_FRAGMENT]: `KEYED_FRAGMENT`,
  [PatchFlags.UNKEYED_FRAGMENT]: `UNKEYED_FRAGMENT`,
  [PatchFlags.NEED_PATCH]: `NEED_PATCH`,
  [PatchFlags.DYNAMIC_SLOTS]: `DYNAMIC_SLOTS`,
  [PatchFlags.DEV_ROOT_FRAGMENT]: `DEV_ROOT_FRAGMENT`,
  [PatchFlags.HOISTED]: `HOISTED`,
  [PatchFlags.BAIL]: `BAIL`
}

function genFlagText(flag, names = PatchFlagNames) {
  if (isArray(flag)) {
    let f = 0
    flag.forEach((ff) => {
      f |= ff
    })
    return `${f} /* ${flag.map((f) => names[f]).join(', ')} */`
  } else {
    return `${flag} /* ${names[flag]} */`
  }
}

const propsHelperSet = new Set([NORMALIZE_PROPS, GUARD_REACTIVE_PROPS])

function getUnnormalizedProps(props, callPath = []) {
  if (
    props &&
    !isString(props) &&
    props.type === NodeTypes.JS_CALL_EXPRESSION
  ) {
    const callee = props.callee
    if (!isString(callee) && propsHelperSet.has(callee)) {
      return getUnnormalizedProps(props.arguments[0], callPath.concat(props))
    }
  }
  return [props, callPath]
}

function injectProp(node, prop, context) {
  let propsWithInjection
  /**
   * 1. mergeProps(...)
   * 2. toHandlers(...)
   * 3. normalizeProps(...)
   * 4. normalizeProps(guardReactiveProps(...))
   *
   * we need to get the real props before normalization
   */
  let props =
    node.type === NodeTypes.VNODE_CALL ? node.props : node.arguments[2]
  let callPath = []
  let parentCall
  if (
    props &&
    !isString(props) &&
    props.type === NodeTypes.JS_CALL_EXPRESSION
  ) {
    const ret = getUnnormalizedProps(props)
    props = ret[0]
    callPath = ret[1]
    parentCall = callPath[callPath.length - 1]
  }

  if (props == null || isString(props)) {
    propsWithInjection = createObjectExpression([prop])
  } else if (props.type === NodeTypes.JS_CALL_EXPRESSION) {
    // merged props... add ours
    // only inject key to object literal if it's the first argument so that
    // if doesn't override user provided keys
    const first = props.arguments[0] | JSChildNode
    if (!isString(first) && first.type === NodeTypes.JS_OBJECT_EXPRESSION) {
      first.properties.unshift(prop)
    } else {
      if (props.callee === TO_HANDLERS) {
        // #2366
        propsWithInjection = createCallExpression(context.helper(MERGE_PROPS), [
          createObjectExpression([prop]),
          props
        ])
      } else {
        props.arguments.unshift(createObjectExpression([prop]))
      }
    }
    !propsWithInjection && (propsWithInjection = props)
  } else if (props.type === NodeTypes.JS_OBJECT_EXPRESSION) {
    let alreadyExists = false
    // check existing key to avoid overriding user provided keys
    if (prop.key.type === NodeTypes.SIMPLE_EXPRESSION) {
      const propKeyName = prop.key.content
      alreadyExists = props.properties.some(
        (p) =>
          p.key.type === NodeTypes.SIMPLE_EXPRESSION &&
          p.key.content === propKeyName
      )
    }
    if (!alreadyExists) {
      props.properties.unshift(prop)
    }
    propsWithInjection = props
  } else {
    // single v-bind with expression, return a merged replacement
    propsWithInjection = createCallExpression(context.helper(MERGE_PROPS), [
      createObjectExpression([prop]),
      props
    ])
    // in the case of nested helper call, e.g. `normalizeProps(guardReactiveProps(props))`,
    // it will be rewritten as `normalizeProps(mergeProps({ key: 0 }, props))`,
    // the `guardReactiveProps` will no longer be needed
    if (parentCall && parentCall.callee === GUARD_REACTIVE_PROPS) {
      parentCall = callPath[callPath.length - 2]
    }
  }
  if (node.type === NodeTypes.VNODE_CALL) {
    if (parentCall) {
      parentCall.arguments[0] = propsWithInjection
    } else {
      node.props = propsWithInjection
    }
  } else {
    if (parentCall) {
      parentCall.arguments[0] = propsWithInjection
    } else {
      node.arguments[2] = propsWithInjection
    }
  }
}

const BindingTypes = {
  /**
   * returned from data()
   */
  DATA: 'data',
  /**
   * declared as a prop
   */
  PROPS: 'props',
  /**
   * a local alias of a `<script setup>` destructured prop.
   * the original is stored in __propsAliases of the bindingMetadata object.
   */
  PROPS_ALIASED: 'props-aliased',
  /**
   * a let binding (may or may not be a ref)
   */
  SETUP_LET: 'setup-let',
  /**
   * a const binding that can never be a ref.
   * these bindings don't need `unref()` calls when processed in inlined
   * template expressions.
   */
  SETUP_CONST: 'setup-const',
  /**
   * a const binding that may be a ref.
   */
  SETUP_MAYBE_REF: 'setup-maybe-ref',
  /**
   * bindings that are guaranteed to be refs
   */
  SETUP_REF: 'setup-ref',
  /**
   * declared by other options, e.g. computed, inject
   */
  OPTIONS: 'options'
}

class WalkerBase {
  constructor() {
    /** @type {boolean} */
    this.should_skip = false

    /** @type {boolean} */
    this.should_remove = false

    /** @type {BaseNode | null} */
    this.replacement = null

    /** @type {WalkerContext} */
    this.context = {
      skip: () => (this.should_skip = true),
      remove: () => (this.should_remove = true),
      replace: (node) => (this.replacement = node)
    }
  }

  replace(parent, prop, index, node) {
    if (parent) {
      if (index !== null) {
        parent[prop][index] = node
      } else {
        parent[prop] = node
      }
    }
  }

  remove(parent, prop, index) {
    if (parent) {
      if (index !== null) {
        parent[prop].splice(index, 1)
      } else {
        delete parent[prop]
      }
    }
  }
}

class SyncWalker extends WalkerBase {
  constructor(enter, leave) {
    super()

    /** @type {SyncHandler} */
    this.enter = enter

    /** @type {SyncHandler} */
    this.leave = leave
  }

  visit(node, parent, prop, index) {
    if (node) {
      if (this.enter) {
        const _should_skip = this.should_skip
        const _should_remove = this.should_remove
        const _replacement = this.replacement
        this.should_skip = false
        this.should_remove = false
        this.replacement = null

        this.enter.call(this.context, node, parent, prop, index)

        if (this.replacement) {
          node = this.replacement
          this.replace(parent, prop, index, node)
        }

        if (this.should_remove) {
          this.remove(parent, prop, index)
        }

        const skipped = this.should_skip
        const removed = this.should_remove

        this.should_skip = _should_skip
        this.should_remove = _should_remove
        this.replacement = _replacement

        if (skipped) return node
        if (removed) return null
      }

      for (const key in node) {
        const value = node[key]

        if (typeof value !== 'object') {
          continue
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i += 1) {
            if (value[i] !== null && typeof value[i].type === 'string') {
              if (!this.visit(value[i], node, key, i)) {
                // removed
                i--
              }
            }
          }
        } else if (value !== null && typeof value.type === 'string') {
          this.visit(value, node, key, null)
        }
      }

      if (this.leave) {
        const _replacement = this.replacement
        const _should_remove = this.should_remove
        this.replacement = null
        this.should_remove = false

        this.leave.call(this.context, node, parent, prop, index)

        if (this.replacement) {
          node = this.replacement
          this.replace(parent, prop, index, node)
        }

        if (this.should_remove) {
          this.remove(parent, prop, index)
        }

        const removed = this.should_remove

        this.replacement = _replacement
        this.should_remove = _should_remove

        if (removed) return null
      }
    }

    return node
  }
}

class AsyncWalker extends WalkerBase {
  constructor(enter, leave) {
    super()

    /** @type {AsyncHandler} */
    this.enter = enter

    /** @type {AsyncHandler} */
    this.leave = leave
  }

  async visit(node, parent, prop, index) {
    if (node) {
      if (this.enter) {
        const _should_skip = this.should_skip
        const _should_remove = this.should_remove
        const _replacement = this.replacement
        this.should_skip = false
        this.should_remove = false
        this.replacement = null

        await this.enter.call(this.context, node, parent, prop, index)

        if (this.replacement) {
          node = this.replacement
          this.replace(parent, prop, index, node)
        }

        if (this.should_remove) {
          this.remove(parent, prop, index)
        }

        const skipped = this.should_skip
        const removed = this.should_remove

        this.should_skip = _should_skip
        this.should_remove = _should_remove
        this.replacement = _replacement

        if (skipped) return node
        if (removed) return null
      }

      for (const key in node) {
        const value = node[key]

        if (typeof value !== 'object') {
          continue
        } else if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i += 1) {
            if (value[i] !== null && typeof value[i].type === 'string') {
              if (!(await this.visit(value[i], node, key, i))) {
                // removed
                i--
              }
            }
          }
        } else if (value !== null && typeof value.type === 'string') {
          await this.visit(value, node, key, null)
        }
      }

      if (this.leave) {
        const _replacement = this.replacement
        const _should_remove = this.should_remove
        this.replacement = null
        this.should_remove = false

        await this.leave.call(this.context, node, parent, prop, index)

        if (this.replacement) {
          node = this.replacement
          this.replace(parent, prop, index, node)
        }

        if (this.should_remove) {
          this.remove(parent, prop, index)
        }

        const removed = this.should_remove

        this.replacement = _replacement
        this.should_remove = _should_remove

        if (removed) return null
      }
    }

    return node
  }
}

function walk(ast, { enter, leave }) {
  const instance = new SyncWalker(enter, leave)
  return instance.visit(ast, null)
}

async function asyncWalk(ast, { enter, leave }) {
  const instance = new AsyncWalker(enter, leave)
  return await instance.visit(ast, null)
}

function isInDestructureAssignment(parent, parentStack) {
  if (
    parent &&
    (parent.type === 'ObjectProperty' || parent.type === 'ArrayPattern')
  ) {
    let i = parentStack.length
    while (i--) {
      const p = parentStack[i]
      if (p.type === 'AssignmentExpression') {
        return true
      } else if (p.type !== 'ObjectProperty' && !p.type.endsWith('Pattern')) {
        break
      }
    }
  }
  return false
}

function walkIdentifiers(
  root,
  onIdentifier,
  includeAll = false,
  parentStack = [],
  knownIds = Object.create(null)
) {
  if (__BROWSER__) {
    return
  }

  const rootExp =
    root.type === 'Program' &&
    root.body[0].type === 'ExpressionStatement' &&
    root.body[0].expression

  walk(root, {
    enter(node, parent) {
      parent && parentStack.push(parent)
      if (
        parent &&
        parent.type.startsWith('TS') &&
        parent.type !== 'TSAsExpression' &&
        parent.type !== 'TSNonNullExpression' &&
        parent.type !== 'TSTypeAssertion'
      ) {
        return this.skip()
      }
      if (node.type === 'Identifier') {
        const isLocal = !!knownIds[node.name]
        const isRefed = isReferencedIdentifier(node, parent, parentStack)
        if (includeAll || (isRefed && !isLocal)) {
          onIdentifier(node, parent, parentStack, isRefed, isLocal)
        }
      } else if (
        node.type === 'ObjectProperty' &&
        parent.type === 'ObjectPattern'
      ) {
        // mark property in destructure pattern
        node.inPattern = true
      } else if (isFunctionType(node)) {
        // walk function expressions and add its arguments to known identifiers
        // so that we don't prefix them
        walkFunctionParams(node, (id) =>
          markScopeIdentifier(node, id, knownIds)
        )
      } else if (node.type === 'BlockStatement') {
        // #3445 record block-level local variables
        walkBlockDeclarations(node, (id) =>
          markScopeIdentifier(node, id, knownIds)
        )
      }
    },
    leave(node, parent) {
      parent && parentStack.pop()
      if (node !== rootExp && node.scopeIds) {
        for (const id of node.scopeIds) {
          knownIds[id]--
          if (knownIds[id] === 0) {
            delete knownIds[id]
          }
        }
      }
    }
  })
}

function isReferencedIdentifier(id, parent, parentStack) {
  if (__BROWSER__) {
    return false
  }

  if (!parent) {
    return true
  }

  // is a special keyword but parsed as identifier
  if (id.name === 'arguments') {
    return false
  }

  if (isReferenced(id, parent)) {
    return true
  }

  // babel's isReferenced check returns false for ids being assigned to, so we
  // need to cover those cases here
  switch (parent.type) {
    case 'AssignmentExpression':
    case 'AssignmentPattern':
      return true
    case 'ObjectPattern':
    case 'ArrayPattern':
      return isInDestructureAssignment(parent, parentStack)
  }

  return false
}

function isInDestructureAssignment(parent, parentStack) {
  if (
    parent &&
    (parent.type === 'ObjectProperty' || parent.type === 'ArrayPattern')
  ) {
    let i = parentStack.length
    while (i--) {
      const p = parentStack[i]
      if (p.type === 'AssignmentExpression') {
        return true
      } else if (p.type !== 'ObjectProperty' && !p.type.endsWith('Pattern')) {
        break
      }
    }
  }
  return false
}

function walkFunctionParams(node, onIdent) {
  for (const p of node.params) {
    for (const id of extractIdentifiers(p)) {
      onIdent(id)
    }
  }
}

function walkBlockDeclarations(block, onIdent) {
  for (const stmt of block.body) {
    if (stmt.type === 'VariableDeclaration') {
      if (stmt.declare) continue
      for (const decl of stmt.declarations) {
        for (const id of extractIdentifiers(decl.id)) {
          onIdent(id)
        }
      }
    } else if (
      stmt.type === 'FunctionDeclaration' ||
      stmt.type === 'ClassDeclaration'
    ) {
      if (stmt.declare || !stmt.id) continue
      onIdent(stmt.id)
    }
  }
}

function extractIdentifiers(param, nodes = []) {
  switch (param.type) {
    case 'Identifier':
      nodes.push(param)
      break

    case 'MemberExpression':
      let object = param
      while (object.type === 'MemberExpression') {
        object = object.object
      }
      nodes.push(object)
      break

    case 'ObjectPattern':
      for (const prop of param.properties) {
        if (prop.type === 'RestElement') {
          extractIdentifiers(prop.argument, nodes)
        } else {
          extractIdentifiers(prop.value, nodes)
        }
      }
      break

    case 'ArrayPattern':
      param.elements.forEach((element) => {
        if (element) extractIdentifiers(element, nodes)
      })
      break

    case 'RestElement':
      extractIdentifiers(param.argument, nodes)
      break

    case 'AssignmentPattern':
      extractIdentifiers(param.left, nodes)
      break
  }

  return nodes
}

function markScopeIdentifier(node, child, knownIds) {
  const { name } = child
  if (node.scopeIds && node.scopeIds.has(name)) {
    return
  }
  if (name in knownIds) {
    knownIds[name]++
  } else {
    knownIds[name] = 1
  }
  ;(node.scopeIds || (node.scopeIds = new Set())).add(name)
}

const isFunctionType = (node) => {
  return /Function(?:Expression|Declaration)$|Method$/.test(node.type)
}

const isStaticProperty = (node) =>
  node &&
  (node.type === 'ObjectProperty' || node.type === 'ObjectMethod') &&
  !node.computed

const isStaticPropertyKey = (node, parent) =>
  isStaticProperty(parent) && parent.key === node

/**
 * Copied from https://github.com/babel/babel/blob/main/packages/babel-types/src/validators/isReferenced.ts
 * To avoid runtime dependency on @babel/types (which includes process references)
 * This file should not change very often in babel but we may need to keep it
 * up-to-date from time to time.
 *
 * https://github.com/babel/babel/blob/main/LICENSE
 *
 */
function isReferenced(node, parent, grandparent) {
  switch (parent.type) {
    // yes: PARENT[NODE]
    // yes: NODE.child
    // no: parent.NODE
    case 'MemberExpression':
    case 'OptionalMemberExpression':
      if (parent.property === node) {
        return !!parent.computed
      }
      return parent.object === node

    case 'JSXMemberExpression':
      return parent.object === node
    // no: let NODE = init;
    // yes: let id = NODE;
    case 'VariableDeclarator':
      return parent.init === node

    // yes: () => NODE
    // no: (NODE) => {}
    case 'ArrowFunctionExpression':
      return parent.body === node

    // no: class { #NODE; }
    // no: class { get #NODE() {} }
    // no: class { #NODE() {} }
    // no: class { fn() { return this.#NODE; } }
    case 'PrivateName':
      return false

    // no: class { NODE() {} }
    // yes: class { [NODE]() {} }
    // no: class { foo(NODE) {} }
    case 'ClassMethod':
    case 'ClassPrivateMethod':
    case 'ObjectMethod':
      if (parent.key === node) {
        return !!parent.computed
      }
      return false

    // yes: { [NODE]: "" }
    // no: { NODE: "" }
    // depends: { NODE }
    // depends: { key: NODE }
    case 'ObjectProperty':
      if (parent.key === node) {
        return !!parent.computed
      }
      // parent.value === node
      return !grandparent || grandparent.type !== 'ObjectPattern'
    // no: class { NODE = value; }
    // yes: class { [NODE] = value; }
    // yes: class { key = NODE; }
    case 'ClassProperty':
      if (parent.key === node) {
        return !!parent.computed
      }
      return true
    case 'ClassPrivateProperty':
      return parent.key !== node

    // no: class NODE {}
    // yes: class Foo extends NODE {}
    case 'ClassDeclaration':
    case 'ClassExpression':
      return parent.superClass === node

    // yes: left = NODE;
    // no: NODE = right;
    case 'AssignmentExpression':
      return parent.right === node

    // no: [NODE = foo] = [];
    // yes: [foo = NODE] = [];
    case 'AssignmentPattern':
      return parent.right === node

    // no: NODE: for (;;) {}
    case 'LabeledStatement':
      return false

    // no: try {} catch (NODE) {}
    case 'CatchClause':
      return false

    // no: function foo(...NODE) {}
    case 'RestElement':
      return false

    case 'BreakStatement':
    case 'ContinueStatement':
      return false

    // no: function NODE() {}
    // no: function foo(NODE) {}
    case 'FunctionDeclaration':
    case 'FunctionExpression':
      return false

    // no: export NODE from "foo";
    // no: export * as NODE from "foo";
    case 'ExportNamespaceSpecifier':
    case 'ExportDefaultSpecifier':
      return false

    // no: export { foo as NODE };
    // yes: export { NODE as foo };
    // no: export { NODE as foo } from "foo";
    case 'ExportSpecifier':
      // @ts-expect-error
      if (grandparent?.source) {
        return false
      }
      return parent.local === node

    // no: import NODE from "foo";
    // no: import * as NODE from "foo";
    // no: import { NODE as foo } from "foo";
    // no: import { foo as NODE } from "foo";
    // no: import NODE from "bar";
    case 'ImportDefaultSpecifier':
    case 'ImportNamespaceSpecifier':
    case 'ImportSpecifier':
      return false

    // no: import "foo" assert { NODE: "json" }
    case 'ImportAttribute':
      return false

    // no: <div NODE="foo" />
    case 'JSXAttribute':
      return false

    // no: [NODE] = [];
    // no: ({ NODE }) = [];
    case 'ObjectPattern':
    case 'ArrayPattern':
      return false

    // no: new.NODE
    // no: NODE.target
    case 'MetaProperty':
      return false

    // yes: type X = { someProperty: NODE }
    // no: type X = { NODE: OtherType }
    case 'ObjectTypeProperty':
      return parent.key !== node

    // yes: enum X { Foo = NODE }
    // no: enum X { NODE }
    case 'TSEnumMember':
      return parent.id !== node

    // yes: { [NODE]: value }
    // no: { NODE: value }
    case 'TSPropertySignature':
      if (parent.key === node) {
        return !!parent.computed
      }

      return true
  }

  return true
}

const validFirstIdentCharRE = /[A-Za-z_$\xA0-\uFFFF]/
const validIdentCharRE = /[\.\?\w$\xA0-\uFFFF]/
const whitespaceRE = /\s+[.[]\s*|\s*[.[]\s+/g

const MemberExpLexState = {
  inMemberExp: 0,
  inBrackets: 1,
  inParens: 2,
  inString: 3
}

const isMemberExpressionBrowser = (path) => {
  // remove whitespaces around . or [ first
  path = path.trim().replace(whitespaceRE, (s) => s.trim())

  let state = MemberExpLexState.inMemberExp
  let stateStack = []
  let currentOpenBracketCount = 0
  let currentOpenParensCount = 0
  let currentStringType = null

  for (let i = 0; i < path.length; i++) {
    const char = path.charAt(i)
    switch (state) {
      case MemberExpLexState.inMemberExp:
        if (char === '[') {
          stateStack.push(state)
          state = MemberExpLexState.inBrackets
          currentOpenBracketCount++
        } else if (char === '(') {
          stateStack.push(state)
          state = MemberExpLexState.inParens
          currentOpenParensCount++
        } else if (
          !(i === 0 ? validFirstIdentCharRE : validIdentCharRE).test(char)
        ) {
          return false
        }
        break
      case MemberExpLexState.inBrackets:
        if (char === `'` || char === `"` || char === '`') {
          stateStack.push(state)
          state = MemberExpLexState.inString
          currentStringType = char
        } else if (char === `[`) {
          currentOpenBracketCount++
        } else if (char === `]`) {
          if (!--currentOpenBracketCount) {
            state = stateStack.pop()
          }
        }
        break
      case MemberExpLexState.inParens:
        if (char === `'` || char === `"` || char === '`') {
          stateStack.push(state)
          state = MemberExpLexState.inString
          currentStringType = char
        } else if (char === `(`) {
          currentOpenParensCount++
        } else if (char === `)`) {
          // if the exp ends as a call then it should not be considered valid
          if (i === path.length - 1) {
            return false
          }
          if (!--currentOpenParensCount) {
            state = stateStack.pop()
          }
        }
        break
      case MemberExpLexState.inString:
        if (char === currentStringType) {
          state = stateStack.pop()
          currentStringType = null
        }
        break
    }
  }
  return !currentOpenBracketCount && !currentOpenParensCount
}

const isMemberExpressionNode = __BROWSER__
  ? NOOP
  : (path, context) => {
      try {
        let ret = babelParser.parseExpression(path, {
          plugins: context.expressionPlugins
        })
        if (ret.type === 'TSAsExpression' || ret.type === 'TSTypeAssertion') {
          ret = ret.expression
        }
        return (
          ret.type === 'MemberExpression' ||
          ret.type === 'OptionalMemberExpression' ||
          ret.type === 'Identifier'
        )
      } catch (e) {
        return false
      }
    }

const isMemberExpression = __BROWSER__
  ? isMemberExpressionBrowser
  : isMemberExpressionNode

// Check if a node contains expressions that reference current context scope ids
function hasScopeRef(node, ids) {
  if (!node || Object.keys(ids).length === 0) {
    return false
  }
  switch (node.type) {
    case NodeTypes.ELEMENT:
      for (let i = 0; i < node.props.length; i++) {
        const p = node.props[i]
        if (
          p.type === NodeTypes.DIRECTIVE &&
          (hasScopeRef(p.arg, ids) || hasScopeRef(p.exp, ids))
        ) {
          return true
        }
      }
      return node.children.some((c) => hasScopeRef(c, ids))
    case NodeTypes.FOR:
      if (hasScopeRef(node.source, ids)) {
        return true
      }
      return node.children.some((c) => hasScopeRef(c, ids))
    case NodeTypes.IF:
      return node.branches.some((b) => hasScopeRef(b, ids))
    case NodeTypes.IF_BRANCH:
      if (hasScopeRef(node.condition, ids)) {
        return true
      }
      return node.children.some((c) => hasScopeRef(c, ids))
    case NodeTypes.SIMPLE_EXPRESSION:
      return (
        !node.isStatic &&
        isSimpleIdentifier(node.content) &&
        !!ids[node.content]
      )
    case NodeTypes.COMPOUND_EXPRESSION:
      return node.children.some((c) => isObject(c) && hasScopeRef(c, ids))
    case NodeTypes.INTERPOLATION:
    case NodeTypes.TEXT_CALL:
      return hasScopeRef(node.content, ids)
    case NodeTypes.TEXT:
    case NodeTypes.COMMENT:
      return false
    default:
      if (__DEV__) {
        const exhaustiveCheck = node
        exhaustiveCheck
      }
      return false
  }
}

const SlotFlags = {
  // (ref:SlotFlags)
  /**
   * Stable slots that only reference slot props or context state. The slot
   * can fully capture its own dependencies so when passed down the parent won't
   * need to force the child to update.
   */
  STABLE: 1,
  /**
   * Slots that reference scope variables (v-for or an outer slot prop), or
   * has conditional structure (v-if, v-for). The parent will need to force
   * the child to update because the slot does not fully capture its dependencies.
   */
  DYNAMIC: 2,
  /**
   * `<slot/>` being forwarded into a child component. Whether the parent needs
   * to update the child is dependent on what kind of slots the parent itself
   * received. This has to be refined at runtime, when the child's vnode
   * is being created (in `normalizeChildren`)
   */
  FORWARDED: 3
}

/**
 * Dev only
 */
const slotFlagsText = {
  [SlotFlags.STABLE]: 'STABLE',
  [SlotFlags.DYNAMIC]: 'DYNAMIC',
  [SlotFlags.FORWARDED]: 'FORWARDED'
}

function createElementWithCodegen(
  tag,
  props,
  children,
  patchFlag,
  dynamicProps
) {
  return {
    type: NodeTypes.ELEMENT,
    loc: locStub,
    ns: Namespaces.HTML,
    tag: 'div',
    tagType: ElementTypes.ELEMENT,
    isSelfClosing: false,
    props: [],
    children: [],
    codegenNode: {
      type: NodeTypes.VNODE_CALL,
      tag,
      props,
      children,
      patchFlag,
      dynamicProps,
      directives: undefined,
      isBlock: false,
      disableTracking: false,
      isComponent: false,
      loc: locStub
    }
  }
}

// codegen utils
const PURE_ANNOTATION = `/*#__PURE__*/`

function isText$1(n) {
  return (
    isString(n) ||
    n.type === NodeTypes.SIMPLE_EXPRESSION ||
    n.type === NodeTypes.TEXT ||
    n.type === NodeTypes.INTERPOLATION ||
    n.type === NodeTypes.COMPOUND_EXPRESSION
  )
}

// 过滤掉后面空值参数fn(a, b, c, null, undefined, '') => fn(a,b,c)
function genNullableArgs(args) {
  let i = args.length
  while (i--) {
    if (args[i] != null) break
  }
  return args.slice(0, i + 1).map((arg) => arg || `null`)
}

// 生成对象的 key 值，可能是个表达式，如： { [a + b + c]: value }
function genExpressionAsPropertyKey(node, context) {
  const { push } = context
  if (node.type === NodeTypes.COMPOUND_EXPRESSION) {
    push(`[`)
    genCompoundExpression(node, context)
    push(`]`)
  } else if (node.isStatic) {
    // only quote keys if necessary
    const text = isSimpleIdentifier(node.content)
      ? node.content
      : JSON.stringify(node.content)
    push(text, node)
  } else {
    push(`[${node.content}]`, node)
  }
}
