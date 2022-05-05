const compilerDom = (function() {
  
  // Parse inline CSS strings for static style attributes into an object.
  // This is a NodeTransform since it works on the static `style` attribute and
  // converts it into a dynamic equivalent:
  // style="color: red" -> :style='{ "color": "red" }'
  // It is then processed by `transformElement` and included in the generated
  // props.
  const transformStyle = node => {
    if (node.type === NodeTypes.ELEMENT) {
      node.props.forEach((p, i) => {
        if (p.type === NodeTypes.ATTRIBUTE && p.name === 'style' && p.value) {
          // replace p with an expression node
          node.props[i] = {
            type: NodeTypes.DIRECTIVE,
            name: `bind`,
            arg: createSimpleExpression(`style`, true, p.loc),
            exp: parseInlineCSS(p.value.content, p.loc),
            modifiers: [],
            loc: p.loc
          }
        }
      })
    }
  }
  
  const parseInlineCSS = (cssText, loc) => {
    const normalized = parseStringStyle(cssText)
    return createSimpleExpression(
      JSON.stringify(normalized),
      false,
      loc,
      ConstantTypes.CAN_STRINGIFY
    )
  }
  const transformVHtml = (dir, node, context) => {
    const { exp, loc } = dir
    if (!exp) {
      logg("v-html no exp")
    }
    if (node.children.length) {
      logg('v-html can not has children')
      node.children.length = 0
    }
    return {
      props: [
        createObjectProperty(
          createSimpleExpression(`innerHTML`, true, loc),
          exp || createSimpleExpression('', true)
        )
      ]
    }
  }
  const transformVText = (dir, node, context) => {
    const { exp, loc } = dir
    if (!exp) {
      logg('v-text no exp')
    }
    if (node.children.length) {
      logg('v-text can not have children')
      node.children.length = 0
    }
    return {
      props: [
        createObjectProperty(
          createSimpleExpression(`textContent`, true),
          exp
            ? createCallExpression(
                context.helperString(TO_DISPLAY_STRING),
                [exp],
                loc
              )
            : createSimpleExpression('', true)
        )
      ]
    }
  }
  const transformModel = (dir, node, context) => {
    const baseResult = transformModel(dir, node, context)
    // base transform has errors OR component v-model (only need props)
    if (!baseResult.props.length || node.tagType === ElementTypes.COMPONENT) {
      return baseResult
    }
  
    if (dir.arg) {
      logg("transfromModel - X_V_MODEL_ARG_ON_ELEMENT")
    }
  
    function checkDuplicatedValue() {
      const value = findProp(node, 'value')
      if (value) {
        logg("transfromModel - X_V_MODEL_UNNECESSARY_VALUE")
      }
    }
  
    const { tag } = node
    const isCustomElement = context.isCustomElement(tag)
    if (
      tag === 'input' ||
      tag === 'textarea' ||
      tag === 'select' ||
      isCustomElement
    ) {
      let directiveToUse = V_MODEL_TEXT
      let isInvalidType = false
      if (tag === 'input' || isCustomElement) {
        const type = findProp(node, `type`)
        if (type) {
          if (type.type === NodeTypes.DIRECTIVE) {
            // :type="foo"
            directiveToUse = V_MODEL_DYNAMIC
          } else if (type.value) {
            switch (type.value.content) {
              case 'radio':
                directiveToUse = V_MODEL_RADIO
                break
              case 'checkbox':
                directiveToUse = V_MODEL_CHECKBOX
                break
              case 'file':
                isInvalidType = true
                logg("[DOM]transformModel - X_V_MODEL_ON_FILE_INPUT_ELEMENT")
                break
              default:
                // text type
                __DEV__ && checkDuplicatedValue()
                break
            }
          }
        } else if (hasDynamicKeyVBind(node)) {
          // element has bindings with dynamic keys, which can possibly contain
          // "type".
          directiveToUse = V_MODEL_DYNAMIC
        } else {
          // text type
          __DEV__ && checkDuplicatedValue()
        }
      } else if (tag === 'select') {
        directiveToUse = V_MODEL_SELECT
      } else {
        // textarea
        __DEV__ && checkDuplicatedValue()
      }
      // inject runtime directive
      // by returning the helper symbol via needRuntime
      // the import will replaced a resolveDirective call.
      if (!isInvalidType) {
        baseResult.needRuntime = context.helper(directiveToUse)
      }
    } else {
      logg("[DOM]transformModel - X_V_MODEL_ON_INVALID_ELEMENT")
    }
  
    // native vmodel doesn't need the `modelValue` props since they are also
    // passed to the runtime as `binding.value`. removing it reduces code size.
    baseResult.props = baseResult.props.filter(
      p =>
        !(
          p.key.type === NodeTypes.SIMPLE_EXPRESSION &&
          p.key.content === 'modelValue'
        )
    )
  
    return baseResult
  }
  const isEventOptionModifier = /*#__PURE__*/ makeMap(`passive,once,capture`)
  const isNonKeyModifier = /*#__PURE__*/ makeMap(
    // event propagation management
    `stop,prevent,self,` +
      // system modifiers + exact
      `ctrl,shift,alt,meta,exact,` +
      // mouse
      `middle`
  )
  // left & right could be mouse or key modifiers based on event type
  const maybeKeyModifier = /*#__PURE__*/ makeMap('left,right')
  const isKeyboardEvent = /*#__PURE__*/ makeMap(
    `onkeyup,onkeydown,onkeypress`,
    true
  )
  
  // 将修饰符分类
  const resolveModifiers = (key, modifiers, context, loc) => {
    const keyModifiers = []
    const nonKeyModifiers = []
    const eventOptionModifiers = []
  
    for (let i = 0; i < modifiers.length; i++) {
      const modifier = modifiers[i]
  
      if (isEventOptionModifier(modifier)) {
        // eventOptionModifiers: modifiers for addEventListener() options,
        // e.g. .passive & .capture
        eventOptionModifiers.push(modifier)
      } else {
        // runtimeModifiers: modifiers that needs runtime guards
        if (maybeKeyModifier(modifier)) {
          if (isStaticExp(key)) {
            if (isKeyboardEvent(key.content)) {
              keyModifiers.push(modifier)
            } else {
              nonKeyModifiers.push(modifier)
            }
          } else {
            keyModifiers.push(modifier)
            nonKeyModifiers.push(modifier)
          }
        } else {
          if (isNonKeyModifier(modifier)) {
            nonKeyModifiers.push(modifier)
          } else {
            keyModifiers.push(modifier)
          }
        }
      }
    }
  
    return {
      keyModifiers,
      nonKeyModifiers,
      eventOptionModifiers
    }
  }
  
  // 原生 click 事件
  const transformClick = (key, event) => {
    const isStaticClick =
      isStaticExp(key) && key.content.toLowerCase() === 'onclick'
    return isStaticClick
      ? createSimpleExpression(event, true)
      : key.type !== NodeTypes.SIMPLE_EXPRESSION
      ? createCompoundExpression([
          `(`,
          key,
          `) === "onClick" ? "${event}" : (`,
          key,
          `)`
        ])
      : key
  }
  
  const transformOn = (dir, node, context) => {
    return transformOn(dir, node, context, baseResult => {
      const { modifiers } = dir
      if (!modifiers.length) return baseResult
  
      let { key, value: handlerExp } = baseResult.props[0]
      const { keyModifiers, nonKeyModifiers, eventOptionModifiers } =
        resolveModifiers(key, modifiers, context, dir.loc)
  
      // normalize click.right and click.middle since they don't actually fire
      if (nonKeyModifiers.includes('right')) {
        key = transformClick(key, `onContextmenu`)
      }
      if (nonKeyModifiers.includes('middle')) {
        key = transformClick(key, `onMouseup`)
      }
  
      if (nonKeyModifiers.length) {
        handlerExp = createCallExpression(context.helper(V_ON_WITH_MODIFIERS), [
          handlerExp,
          JSON.stringify(nonKeyModifiers)
        ])
      }
  
      if (
        keyModifiers.length &&
        // if event name is dynamic, always wrap with keys guard
        (!isStaticExp(key) || isKeyboardEvent(key.content))
      ) {
        handlerExp = createCallExpression(context.helper(V_ON_WITH_KEYS), [
          handlerExp,
          JSON.stringify(keyModifiers)
        ])
      }
  
      if (eventOptionModifiers.length) {
        const modifierPostfix = eventOptionModifiers.map(capitalize).join('')
        key = isStaticExp(key)
          ? createSimpleExpression(`${key.content}${modifierPostfix}`, true)
          : createCompoundExpression([`(`, key, `) + "${modifierPostfix}"`])
      }
  
      return {
        props: [createObjectProperty(key, handlerExp)]
      }
    })
  }
  const transformShow = (dir, node, context) => {
    const { exp, loc } = dir
    if (!exp) {
      logg('transformShow no exp.')
    }
  
    return {
      props: [],
      needRuntime: context.helper(V_SHOW)
    }
  }
   const StringifyThresholds = {
     ELEMENT_WITH_BINDING_COUNT: 5,
     NODE_COUNT: 20
  }
  
  /**
   * Regex for replacing placeholders for embedded constant variables
   * (e.g. import URL string constants generated by compiler-sfc)
   */
  const expReplaceRE = /__VUE_EXP_START__(.*?)__VUE_EXP_END__/g
  
  /**
   * Turn eligible hoisted static trees into stringified static nodes, e.g.
   *
   * ```js
   * const _hoisted_1 = createStaticVNode(`<div class="foo">bar</div>`)
   * ```
   *
   * A single static vnode can contain stringified content for **multiple**
   * consecutive nodes (element and plain text), called a "chunk".
   * `@vue/runtime-dom` will create the content via innerHTML in a hidden
   * container element and insert all the nodes in place. The call must also
   * provide the number of nodes contained in the chunk so that during hydration
   * we can know how many nodes the static vnode should adopt.
   *
   * The optimization scans a children list that contains hoisted nodes, and
   * tries to find the largest chunk of consecutive hoisted nodes before running
   * into a non-hoisted node or the end of the list. A chunk is then converted
   * into a single static vnode and replaces the hoisted expression of the first
   * node in the chunk. Other nodes in the chunk are considered "merged" and
   * therefore removed from both the hoist list and the children array.
   *
   * This optimization is only performed in Node.js.
   */
  const stringifyStatic = (children, context, parent) => {
    // bail stringification for slot content
    if (context.scopes.vSlot > 0) {
      return
    }
  
    let nc = 0 // current node count
    let ec = 0 // current element with binding count
    const currentChunk = []
  
    logg(`stringifyStatic - children.length = ${children.length}`)
    const stringifyCurrentChunk = (currentIndex) => {
      if (
        nc >= StringifyThresholds.NODE_COUNT ||
        ec >= StringifyThresholds.ELEMENT_WITH_BINDING_COUNT
      ) {
        logg(`stringifyCurrentChunk - index = ${currentIndex}`)
        // combine all currently eligible nodes into a single static vnode call
        const staticCall = createCallExpression(context.helper(CREATE_STATIC), [
          JSON.stringify(
            currentChunk.map(node => stringifyNode(node, context)).join('')
          ).replace(expReplaceRE, `" + $1 + "`),
          // the 2nd argument indicates the number of DOM nodes this static vnode
          // will insert / hydrate
          String(currentChunk.length)
        ])
        // replace the first node's hoisted expression with the static vnode call
        replaceHoist(currentChunk[0], staticCall, context)
  
        if (currentChunk.length > 1) {
          for (let i = 1; i < currentChunk.length; i++) {
            // for the merged nodes, set their hoisted expression to null
            replaceHoist(currentChunk[i], null, context)
          }
  
          // also remove merged nodes from children
          const deleteCount = currentChunk.length - 1
          children.splice(currentIndex - currentChunk.length + 1, deleteCount)
          return deleteCount
        }
      }
      return 0
    }
  
    let i = 0
    for (; i < children.length; i++) {
      const child = children[i]
      const hoisted = getHoistedNode(child)
      if (hoisted) {
        // presence of hoisted means child must be a stringifiable node
        const node = child
        const result = analyzeNode(node)
        if (result) {
          // node is stringifiable, record state
          nc += result[0]
          ec += result[1]
          currentChunk.push(node)
          continue
        }
      }
      // we only reach here if we ran into a node that is not stringifiable
      // check if currently analyzed nodes meet criteria for stringification.
      // adjust iteration index
      i -= stringifyCurrentChunk(i)
      // reset state
      nc = 0
      ec = 0
      currentChunk.length = 0
    }
    // in case the last node was also stringifiable
    stringifyCurrentChunk(i)
  }
  
  const getHoistedNode = (node) =>
    ((node.type === NodeTypes.ELEMENT && node.tagType === ElementTypes.ELEMENT) ||
      node.type == NodeTypes.TEXT_CALL) &&
    node.codegenNode &&
    node.codegenNode.type === NodeTypes.SIMPLE_EXPRESSION &&
    node.codegenNode.hoisted
  
  const dataAriaRE = /^(data|aria)-/
  const isStringifiableAttr = (name, ns) => {
    return (
      (ns === DOMNamespaces.HTML
        ? isKnownHtmlAttr(name)
        : ns === DOMNamespaces.SVG
        ? isKnownSvgAttr(name)
        : false) || dataAriaRE.test(name)
    )
  }
  
  const replaceHoist = (node,replacement,context) => {
    const hoistToReplace = node.codegenNode.hoisted
    context.hoists[context.hoists.indexOf(hoistToReplace)] = replacement
  }
  
  const isNonStringifiable = /*#__PURE__*/ makeMap(
    `caption,thead,tr,th,tbody,td,tfoot,colgroup,col`
  )
  
  /**
   * for a hoisted node, analyze it and return:
   * - false: bailed (contains non-stringifiable props or runtime constant)
   * - [nc, ec] where
   *   - nc is the number of nodes inside
   *   - ec is the number of element with bindings inside
   */
  function analyzeNode(node) {
    if (node.type === NodeTypes.ELEMENT && isNonStringifiable(node.tag)) {
      return false
    }
  
    if (node.type === NodeTypes.TEXT_CALL) {
      return [1, 0]
    }
  
    let nc = 1 // node count
    let ec = node.props.length > 0 ? 1 : 0 // element w/ binding count
    let bailed = false
    const bail = () => {
      bailed = true
      return false
    }
  
    // TODO: check for cases where using innerHTML will result in different
    // output compared to imperative node insertions.
    // probably only need to check for most common case
    // i.e. non-phrasing-content tags inside `<p>`
    function walk(node) {
      for (let i = 0; i < node.props.length; i++) {
        const p = node.props[i]
        // bail on non-attr bindings
        if (
          p.type === NodeTypes.ATTRIBUTE &&
          !isStringifiableAttr(p.name, node.ns)
        ) {
          return bail()
        }
        if (p.type === NodeTypes.DIRECTIVE && p.name === 'bind') {
          // bail on non-attr bindings
          if (
            p.arg &&
            (p.arg.type === NodeTypes.COMPOUND_EXPRESSION ||
              (p.arg.isStatic && !isStringifiableAttr(p.arg.content, node.ns)))
          ) {
            return bail()
          }
          if (
            p.exp &&
            (p.exp.type === NodeTypes.COMPOUND_EXPRESSION ||
              p.exp.constType < ConstantTypes.CAN_STRINGIFY)
          ) {
            return bail()
          }
        }
      }
      for (let i = 0; i < node.children.length; i++) {
        nc++
        const child = node.children[i]
        if (child.type === NodeTypes.ELEMENT) {
          if (child.props.length > 0) {
            ec++
          }
          walk(child)
          if (bailed) {
            return false
          }
        }
      }
      return true
    }
  
    return walk(node) ? [nc, ec] : false
  }
  
  function stringifyNode(node, context) {
    if (isString(node)) {
      return node
    }
    if (isSymbol(node)) {
      return ``
    }
    switch (node.type) {
      case NodeTypes.ELEMENT:
        return stringifyElement(node, context)
      case NodeTypes.TEXT:
        return escapeHtml(node.content)
      case NodeTypes.COMMENT:
        return `<!--${escapeHtml(node.content)}-->`
      case NodeTypes.INTERPOLATION:
        return escapeHtml(toDisplayString(evaluateConstant(node.content)))
      case NodeTypes.COMPOUND_EXPRESSION:
        return escapeHtml(evaluateConstant(node))
      case NodeTypes.TEXT_CALL:
        return stringifyNode(node.content, context)
      default:
        // static trees will not contain if/for nodes
        return ''
    }
  }
  
  function stringifyElement(node, context) {
    let res = `<${node.tag}`
    for (let i = 0; i < node.props.length; i++) {
      const p = node.props[i]
      if (p.type === NodeTypes.ATTRIBUTE) {
        res += ` ${p.name}`
        if (p.value) {
          res += `="${escapeHtml(p.value.content)}"`
        }
      } else if (p.type === NodeTypes.DIRECTIVE && p.name === 'bind') {
        const exp = p.exp
        if (exp.content[0] === '_') {
          // internally generated string constant references
          // e.g. imported URL strings via compiler-sfc transformAssetUrl plugin
          res += ` ${p.arg.content}="__VUE_EXP_START__${
            exp.content
          }__VUE_EXP_END__"`
          continue
        }
        // constant v-bind, e.g. :foo="1"
        let evaluated = evaluateConstant(exp)
        if (evaluated != null) {
          const arg = p.arg && p.arg.content
          if (arg === 'class') {
            evaluated = normalizeClass(evaluated)
          } else if (arg === 'style') {
            evaluated = stringifyStyle(normalizeStyle(evaluated))
          }
          res += ` ${p.arg.content}="${escapeHtml(evaluated)}"`
        }
      }
    }
    if (context.scopeId) {
      res += ` ${context.scopeId}`
    }
    res += `>`
    for (let i = 0; i < node.children.length; i++) {
      res += stringifyNode(node.children[i], context)
    }
    if (!isVoidTag(node.tag)) {
      res += `</${node.tag}>`
    }
    return res
  }
  
  // __UNSAFE__
  // Reason: eval.
  // It's technically safe to eval because only constant expressions are possible
  // here, e.g. `{{ 1 }}` or `{{ 'foo' }}`
  // in addition, constant exps bail on presence of parens so you can't even
  // run JSFuck in here. But we mark it unsafe for security review purposes.
  // (see compiler-core/src/transformExpressions)
  function evaluateConstant(exp) {
    if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
      return new Function(`return ${exp.content}`)()
    } else {
      // compound
      let res = ``
      exp.children.forEach(c => {
        if (isString(c) || isSymbol(c)) {
          return
        }
        if (c.type === NodeTypes.TEXT) {
          res += c.content
        } else if (c.type === NodeTypes.INTERPOLATION) {
          res += toDisplayString(evaluateConstant(c.content))
        } else {
          res += evaluateConstant(c)
        }
      })
      return res
    }
  }
  
  const DOMDirectiveTransforms = {
    cloak: noopDirectiveTransform,
    html: transformVHtml,
    text: transformVText,
    model: transformModel, // override compiler-core
    on: transformOn, // override compiler-core
    show: transformShow
  }
  const DOMNodeTransforms = [
    transformStyle,
    ...(__DEV__ ? [warnTransitionChildren] : [])
  ]
  function compile(template, options = {}) {
    return baseCompile(
      template,
      extend({}, parserOptions, options, {
        nodeTransforms: [
          // ignore <script> and <tag>
          // this is not put inside DOMNodeTransforms because that list is used
          // by compiler-ssr to generate vnode fallback branches
          ignoreSideEffectTags,
          ...DOMNodeTransforms,
          ...(options.nodeTransforms || [])
        ],
        directiveTransforms: extend(
          {},
          DOMDirectiveTransforms,
          options.directiveTransforms || {}
        ),
        transformHoist: __BROWSER__ ? null : stringifyStatic
      })
    )
  }
  function parse(template, options = {}) {
    return baseParse(template, extend({}, parserOptions, options))
  }

  return {
    DOMNodeTransforms,
    DOMDirectiveTransforms,
    compile,
    parse,
    transformStyle,
  }
}())
