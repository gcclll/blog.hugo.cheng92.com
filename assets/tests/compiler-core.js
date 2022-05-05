  function createParserContext(content, rawOptions) {
    const options = extend({}, defaultParserOptions)
  
    let key
    for (key in rawOptions) {
      // @ts-ignore
      options[key] =
        rawOptions[key] === undefined
          ? defaultParserOptions[key]
          : rawOptions[key]
    }
    return {
      options,
      column: 1,
      line: 1,
      offset: 0,
      originalSource: content,
      source: content,
      inPre: false,
      inVPre: false,
      onWarn: options.onWarn
    }
  }
  function createRoot(children, loc = locStub) {
    return {
      type: NodeTypes.ROOT,
      children,
      helpers: [],
      components: [],
      directives: [],
      hoists: [],
      imports: [],
      cached: 0,
      temps: 0,
      codegenNode: undefined,
      loc
    }
  }
  function parseChildren(context, mode, ancestors) {
    const parent = last(ancestors)
    const ns = parent ? parent.ns : Namespaces.HTML
    const nodes = [] // -> ancestors
  
    // 1. while -> isEnd ? 游标不断往前走直接所以 source 都解析完成
    while (!isEnd(context, mode, ancestors)) {
      const s = context.source
      let node = undefined
  
      if (mode === TextModes.DATA || mode === TextModes.RCDATA) {
        if (!context.inVPre && startsWith(s, context.options.delimiters[0])) {
          // '{{' 插值开始
          node = parseInterpolation(context, mode)
        } else if (mode === TextModes.DATA && s[0] === '<') {
          if (s[1] === '/') {
            // 结束标签
            if (/[a-z]/i.test(s[2])) {
              // 异常结束，如：`<div>some text<a`
              emitError(context, 'X_INVALID_END_TAG')
              parseTag(context, TagType.End, parent)
              continue
            }
          } else if (/[a-z]/i.test(s[1])) {
            // 正常的开始标签
            node = parseElement(context, ancestors)
            // 2.x <template> 无指令兼容，这里就不实现了，重点关注 3.x 的代码
          }
        }
      }
      // 以上都不是，说明应该是纯文本节点
      if (!node) {
        node = parseText(context, mode)
      }
  
      // 用 pushNode 在其中合并相邻的文本节点
      if (isArray(node)) {
        for (let i = 0; i < node.length; i++) {
          pushNode(nodes, node[i])
        }
      } else {
        pushNode(nodes, node)
      }
    }
  
    // 2. 合并相邻文本节点，空格处理，会将多个空格合并成一个空格
    let removedWhitespace = false
    if (mode !== TextModes.RAWTEXT && mode !== TextModes.RCDATA) {
      removedWhitespace = _removeWhitespace(nodes, context)
    }
  
    // 3. 最后返回解析后的节点树
    return removedWhitespace ? nodes.filter(Boolean) : nodes
  }
  
  function _removeWhitespace(nodes, context) {
    let removedWhitespace = false
    // 可以通过选项来指定是不是保留空格，否则多余的会合并成一个
    const shouldCondense = context.options.whitespace !== 'preserve'
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (!context.inPre && node.type === NodeTypes.TEXT) {
        if (!/[^\t\r\n\f]/.test(node.content)) {
          const prev = nodes[i - 1]
          const next = nodes[i + 1]
  
          if (
            !prev ||
              !next ||
              (shouldCondense && (
                prev.type === NodeTypes.COMMENT || next.type === NodeTypes.COMMENT || (
                  prev.type === NodeTypes.ELEMENT && next.type === NodeTypes.ELEMENT && /[\r\n]/.test(node.content)
                )
              ))
          ) {
            removedWhitespace = true
            nodes[i] = null
          } else {
            // 合并成一个
            node.content = ' '
          }
        } else if (shouldCondense) {
          // 保留空格
          node.content = node.content.replace(/[\t\r\n\f]+/g, ' ')
        }
      } else if (node.type === NodeTypes.COMMENT && !context.options.comments) {
        // 可以通过配置删除注释节点
        removedWhitespace = true
        nodes[i] = null
      }
    }
  
    if (context.inPre && parent && context.options.isPreTag(parent.tag)) {
      // 删除 <pre> 中的第一行的空行
      const first = nodes[0]
      if (first && first.type === NodeTypes.TEXT) {
        first.content = first.content.replace(/^\r?\n/, '')
      }
    }
  
    return removedWhitespace
  }
  function parseElement(context, ancestors) {
    const parent = last(ancestors)
    // 1. 解析出开始标签
    const element = parseTag(context, TagType.Start, parent)
  
    // 自闭合的标签： <div/>
    if (element.isSelfClosing || context.options.isVoidTag(element.tag)) {
      return element
    }
  
    // children
    ancestors.push(element)
  
    const mode = context.options.getTextMode(element, parent)
    // 递归解析子节点
    const children = parseChildren(context, mode, ancestors)
    // 解析完出栈 [root, parent1, parent2, ...] 代表层级
    // <root><parent1><parent2></parent><parent1></root> -> 解析过程中通过
    // ancestors 来维护这个层级关系
    ancestors.pop()
  
    element.children = children
  
    // 2. 解析结束标签
    if (startsWithEndTagOpen(context.source, element.tag)) {
      parseTag(context, TagType.End, parent)
    }
  
    // 更新解析后节点在源码中的位置信息
    element.loc = getSelection(context, element.loc.start)
  
    return element
  }
  function parseTag(context, type, parent) {
    // 1. 开始标签
    const start = getCursor(context)
    // 合法标签的正则匹配
    const match = /^<\/?([a-z][^\t\r\n\f />]*)/i.exec(context.source)
    const tag = match[1]
    const ns = context.options.getNamespace(tag, parent)
  
    // 游标前进标签名长度的位置，如： <div id="foo"> -> ` id="foo">`
    advanceBy(context, match[0].length)
    // 空格处理
    advanceSpaces(context)
  
    // parse attributes
    let props = parseAttributes(context, type)
  
    // TODO v-pre 检测
  
    // 2. 闭合标签
    let isSelfClosing = false
    if (context.source.length === 0) {
      // 非法情况, ignore
    } else {
      isSelfClosing = startsWith(context.source, '/>')
      advanceBy(context, isSelfClosing ? 2 : 1)
    }
  
    if (type === TagType.End) {
      return
    }
  
    // 3. 分析出标签的类型
    let tagType = ElementTypes.ELEMENT
    if (!context.inVPre) {
      if (tag === 'slot') {
        tagType = ElementTypes.SLOT
      } else if (tag === 'template') {
        if (props.some(p => p.type === NodeTypes.DIRECTIVE && isSpecialTemplateDirective(p.name))) {
          tagType = ElementTypes.TEMPLATE
        }
      } else if (isComponent(tag, props, context)) {
        tagType = ElementTypes.COMPONENT
      }
    }
  
    return {
      type: NodeTypes.ELEMENT,
      ns,
      tag,
      tagType,
      props,
      isSelfClosing,
      children: [],
      loc: getSelection(context, start),
      codegenNode: undefined // 在 transform 阶段生成的产物
    }
  }
  function parseText(context, mode) {
    const endTokens = mode === TextModes.CDATA ? [']]>'] : ['<', context.options.delimiters[0]]
  
    let endIndex = context.source.length
    for (let i = 0; i < endTokens.length; i++) {
      const index = context.source.indexOf(endTokens[i], 1)
      if (index !== -1 && endIndex > index) {
        endIndex = index
      }
    }
  
    const start = getCursor(context)
    const content = parseTextData(context, endIndex, mode)
  
    return {
      type: NodeTypes.TEXT,
      content,
      loc: getSelection(context, start)
    }
  }
  function parseTextData(context, length, mode) {
    const rawText = context.source.slice(0, length)
    advanceBy(context, length)
  
    // 不含HTML entities
    if (mode === TextModes.RAWTEXT || mode === TextModes.CDATA || !rawText.includes('&')) {
      return rawText
    } else {
      // 将 &gt; -> `>`, &lt; -> `<`, &amp; -> `&`, &apos; -> `'`, &quot; -> `"`
      return context.options.decodeEntities(rawText, mode === TextModes.ATTRIBUTE_VALUE)
    }
  }
  function parseInterpolation(context, mode) {
    const [open, close] = context.options.delimiters
  
    // 如： source = "{{ a + b }}"
    // closeIndex = indexOf("}}", "{{".length) = 9
    const closeIndex = context.source.indexOf(close, open.length)
    if (closeIndex === -1) {
      emitError(context, 'X_MISSING_INTERPOLATION_END')
      return undefined
    }
  
    const start = getCursor(context)
    // >> 2 -> " a + b }}"
    advanceBy(context, open.length)
  
    // { line, column, offset }
    const innerStart = getCursor(context)
    const innerEnd = getCursor(context)
    // 9 - '{{'.length = 7
    const rawContentLength = closeIndex - open.length
    // " a + b }}".slice(0, 7) => " a + b "
    const rawContent = context.source.slice(0, rawContentLength)
    const preTrimContent = parseTextData(context, rawContentLength, mode)
    // " a + b " => "a + b"
    const content = preTrimContent.trim()
    const startOffset = preTrimContent.indexOf(content)
    if (startOffset > 0) {
      // 处理换行问题
      advancePositionWithMutation(innerStart, rawContent, startOffset)
    }
    const endOffset = rawContentLength - (preTrimContent.length - content.length - startOffset)
    advancePositionWithMutation(innerEnd, rawContent, endOffset)
    advanceBy(context, close.length)
  
    return {
      type: NodeTypes.INTERPOLATION,
      content: {
        type: NodeTypes.SIMPLE_EXPRESSION,
        isStatic: false,
        // Set `isConstant` to false by default and will decide in transformExpression
        constType: ConstantTypes.NOT_CONSTANT,
        content,
        loc: getSelection(context, innerStart, innerEnd)
      },
      loc: getSelection(context, start)
    }
  }
  function parseAttributes(context, type) {
    const props = []
    // 用 set 避免重复属性
    const attributeNames = new Set()
    while (
      context.source.length > 0 &&
        !startsWith(context.source, '>') &&
        !startsWith(context.source, '/>')
    ) {
  
      // 一些非法检测, ignore
  
      const attr = parseAttribute(context, attributeNames)
  
      logg('ATTR', attr)
      // 去掉 class 之间多余的空格，如： `foo   bar  ` -> `foo bar`
      if (attr.type === NodeTypes.ATTRIBUTE &&
         attr.value && attr.name === 'class') {
        attr.value.content = attr.value.content.replace(/\s+/g, ' ').trim()
      }
  
      if (type === TagType.Start) {
        props.push(attr)
      }
  
      advanceSpaces(context)
    }
  
    return props
  }
  function parseAttribute(context, nameSet) {
    const start = getCursor(context)
    const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)
    const name = match[0]
  
    nameSet.add(name)
  
    advanceBy(context, name.length)
  
    let value = undefined
  
    if (/^[\t\r\n\f ]*=/.test(context.source)) {
      advanceSpaces(context)
      advanceBy(context, 1)
      advanceSpaces(context)
      value = parseAttributeValue(context)
    }
  
    const loc = getSelection(context, start)
  
    // v-on(@), v-bind(:), v-if, v-else, v-slot(#) 指令
    if (!context.inVPre && /^(v-[A-Za-z0-9-]|:|\.|@|#)/.test(name)) {
      const match = /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(name)
  
      log(`parseAttribute| match=${match}`)
      let isPropShorthand = startsWith(name, '.')
      let dirName =
          match[1] ||
          (isPropShorthand || startsWith(name, ':')
           ? 'bind'
           : startsWith(name, '@')
          ? 'on'
          : 'slot')
      let arg
  
      if (match[2]) {
        const isSlot = dirName === 'slot'
        const startOffset = name.lastIndexOf(match[2])
        const loc = getSelection(
          context,
          getNewPosition(context, start, startOffset),
          getNewPosition(
            context,
            start,
            startOffset + match[2].length + ((isSlot && match[3]) || '').length
          )
        )
  
        let content = match[2]
        let isStatic = true
  
        if (content.startsWith('[')) {
          isStatic = false
  
          content = content.slice(1, content.length - 1)
        } else if (isSlot){
          content += match[3] || ''
        }
  
        arg = {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content,
          isStatic,
          constType: isStatic
            ? ConstantTypes.CAN_STRINGIFY
            : ConstantTypes.NOT_CONSTANT,
          loc
        }
      }
  
      // quoted: `foo="bar"`, not quoted: `foo=bar`
      if (value && value.isQuoted) {
        const valueLoc = value.loc
        valueLoc.start.offset++
        valueLoc.start.column++
        valueLoc.end = advancePositionWithClone(valueLoc.start, value.content)
        valueLoc.source = valueLoc.source.slice(1, -1)
      }
  
      // 修饰符 v-bind.number="foo" => '.number' => ['number']
      const modifiers = match[3] ? match[3].slice(1).split('.') : []
      // `<div foo.prop="bar">` 如果不加 `.prop` 这个会被解析到 `$attrs` 中
      // 如果加了 `.prop` 则会被解析到 `$props` 中去
      if (isPropShorthand) {
        modifiers.push('prop')
      }
  
      return {
        type: NodeTypes.DIRECTIVE,
        name: dirName,
        exp: value && {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: value.content,
          isStatic: false,
          // Treat as non-constant by default. This can be potentially set to
          // other values by `transformExpression` to make it eligible for hoisting.
          constType: ConstantTypes.NOT_CONSTANT,
          loc: value.loc
        },
        arg,
        modifiers,
        loc
      }
    }
  
    return {
      type: NodeTypes.ATTRIBUTE,
      name,
      value: value && {
        type: NodeTypes.TEXT,
        content: value.content,
        loc: value.loc
      },
      loc
    }
  }
  function parseAttributeValue(context) {
    const start = getCursor(context)
    let content
  
    const quote = context.source[0]
    // value 分两种情况，可以用引号包起来也可以不使用引号
    // `<div foo="value">` 或 `<div foo=value>`
    const isQuoted = quote === `"` || quote === `'`
    if (isQuoted) {
      // Quoted value.
      advanceBy(context, 1)
  
      const endIndex = context.source.indexOf(quote)
      if (endIndex === -1) {
        content = parseTextData(
          context,
          context.source.length,
          TextModes.ATTRIBUTE_VALUE
        )
      } else {
        content = parseTextData(context, endIndex, TextModes.ATTRIBUTE_VALUE)
        advanceBy(context, 1)
      }
    } else {
      // Unquoted
      const match = /^[^\t\r\n\f >]+/.exec(context.source)
      if (!match) {
        return undefined
      }
      content = parseTextData(context, match[0].length, TextModes.ATTRIBUTE_VALUE)
    }
  
    return { content, isQuoted, loc: getSelection(context, start) }
  }
  
  function baseParse(content, options = {}) {
    const context = createParserContext(content, options)
    const start = getCursor(context)
    return createRoot(
      parseChildren(context, TextModes.DATA, []),
      getSelection(context, start)
    )
  }
  function createTransformContext(
    root,
    {
      filename = '',
      prefixIdentifiers = false,
      hoistStatic = false,
      cacheHandlers = false,
      nodeTransforms = [],
      directiveTransforms = {},
      transformHoist = null,
      isBuiltInComponent = NOOP,
      isCustomElement = NOOP,
      expressionPlugins = [],
      scopeId = null,
      slotted = true,
      ssr = false,
      inSSR = false,
      ssrCssVars = ``,
      bindingMetadata = EMPTY_OBJ,
      inline = false,
      isTS = false,
      onError = defaultOnError,
      onWarn = defaultOnWarn,
      compatConfig
    }
  ) {
    const nameMatch = filename.replace(/\?.*$/, '').match(/([^/\\]+)\.\w+$/)
    const context = {
      // options
      selfName: nameMatch && capitalize(camelize(nameMatch[1])),
      prefixIdentifiers,
      hoistStatic,
      cacheHandlers,
      nodeTransforms,
      directiveTransforms,
      transformHoist,
      isBuiltInComponent,
      isCustomElement,
      expressionPlugins,
      scopeId,
      slotted,
      ssr,
      inSSR,
      ssrCssVars,
      bindingMetadata,
      inline,
      isTS,
      onError,
      onWarn,
      compatConfig,
  
      // state
      root,
      helpers: new Map(),
      components: new Set(),
      directives: new Set(),
      hoists: [],
      imports: [],
      constantCache: new Map(),
      temps: 0,
      cached: 0,
      identifiers: Object.create(null),
      scopes: { // 记录下面四个指令的嵌套层次
        vFor: 0,
        vSlot: 0,
        vPre: 0,
        vOnce: 0
      },
      parent: null,
      currentNode: root,
      childIndex: 0,
      inVOnce: false,
  
      // methods
      helper(name) {
        const count = context.helpers.get(name) || 0
        context.helpers.set(name, count + 1)
        return name
      },
      removeHelper(name) {
        const count = context.helpers.get(name)
        if (count) {
          const currentCount = count - 1
          if (!currentCount) {
            context.helpers.delete(name)
          } else {
            context.helpers.set(name, currentCount)
          }
        }
      },
      helperString(name) {
        return `_${helperNameMap[context.helper(name)]}`
      },
      replaceNode(node) {
        context.parent.children[context.childIndex] = context.currentNode = node
      },
      removeNode(node) {
        const list = context.parent.children
        const removalIndex = node
          ? list.indexOf(node)
          : context.currentNode
          ? context.childIndex
          : -1
  
        if (!node || node === context.currentNode) {
          // current node removed
          context.currentNode = null
          context.onNodeRemoved()
        } else {
          // sibling node removed
          if (context.childIndex > removalIndex) {
            context.childIndex--
            context.onNodeRemoved()
          }
        }
        context.parent.children.splice(removalIndex, 1)
      },
      onNodeRemoved: () => {},
      addIdentifiers(exp) {
        // identifier tracking only happens in non-browser builds.
        if (!__BROWSER__) {
          if (isString(exp)) {
            addId(exp)
          } else if (exp.identifiers) {
            exp.identifiers.forEach(addId)
          } else if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
            addId(exp.content)
          }
        }
      },
      removeIdentifiers(exp) {
        if (!__BROWSER__) {
          if (isString(exp)) {
            removeId(exp)
          } else if (exp.identifiers) {
            exp.identifiers.forEach(removeId)
          } else if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
            removeId(exp.content)
          }
        }
      },
      hoist(exp) {
        if (isString(exp)) exp = createSimpleExpression(exp)
        context.hoists.push(exp)
        const identifier = createSimpleExpression(
          `_hoisted_${context.hoists.length}`,
          false,
          exp.loc,
          ConstantTypes.CAN_HOIST
        )
        identifier.hoisted = exp
        return identifier
      },
      cache(exp, isVNode = false) {
        return createCacheExpression(context.cached++, exp, isVNode)
      }
    }
  
    function addId(id) {
      const { identifiers } = context
      if (identifiers[id] === undefined) {
        identifiers[id] = 0
      }
      identifiers[id]++
    }
  
    function removeId(id) {
      context.identifiers[id]--
    }
  
    return context
  }
  function traverseNode(node, context) {
    // 记录当前正在处理的节点
    context.currentNode = node
    // 对节点转换时使用到的插件(外部可通过这个来修改某个指令)
    const { nodeTransforms } = context
    // 递归遍历结束，回溯时调用的函数列表
    // 也就是这个函数最后执行的函数，当一颗树遍历完成执行的函数
    // 随后的 for 循环是用来收集这些函数的
    const exitFns = []
  
    logg('traverseNode', node)
    for (let i = 0; i < nodeTransforms.length; i++) {
      const onExit = nodeTransforms[i](node, context)
      if (onExit) {
        if (isArray(onExit)) {
          exitFns.push(...onExit)
        } else {
          exitFns.push(onExit)
        }
      }
      if (!context.currentNode) {
        // node was removed
        return
      } else {
        // node may have been replaced
        node = context.currentNode
      }
    }
  
    // 根据节点类型来分别处理，这里忽略注释
    switch (node.type) {
      case NodeTypes.INTERPOLATION:
        // no need to traverse, but we need to inject toString helper
        if (!context.ssr) {
          context.helper(TO_DISPLAY_STRING)
        }
        break
  
      // for container types, further traverse downwards
      // 处理 if...else if...else 分支
      case NodeTypes.IF:
        for (let i = 0; i < node.branches.length; i++) {
          traverseNode(node.branches[i], context)
        }
        break
      case NodeTypes.IF_BRANCH: // else..if
      case NodeTypes.FOR: // for
      case NodeTypes.ELEMENT:
      case NodeTypes.ROOT:
        traverseChildren(node, context)
        break
    }
  
    // 收集完成，执行这些收集到的函数，作用到当前节点上
    context.currentNode = node
    let i = exitFns.length
    while (i--) {
      exitFns[i]()
    }
  }
  
  function traverseChildren(parent, context) {
    let i = 0
    const nodeRemoved = () => {
      i--
    }
    for (; i < parent.children.length; i++) {
      const child = parent.children[i]
      if (isString(child)) continue
      context.parent = parent
      context.childIndex = i
      context.onNodeRemoved = nodeRemoved
      traverseNode(child, context)
    }
  }
  function hoistStatic(root, context) {
    _walk(
      root,
      context,
      // Root node is unfortunately non-hoistable due to potential parent
      // fallthrough attributes.
      isSingleElementRoot(root, root.children[0])
    )
  }
  
  function isSingleElementRoot(
    root,
    child
  ) {
    const { children } = root
    return (
      children.length === 1 &&
      child.type === NodeTypes.ELEMENT &&
      !isSlotOutlet(child)
    )
  }
  
  function _walk(
    node,
    context,
    doNotHoistNode = false
  ) {
    const { children } = node
    const originalCount = children.length
    let hoistedCount = 0
  
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      // only plain elements & text calls are eligible for hoisting.
      if (
        child.type === NodeTypes.ELEMENT &&
        child.tagType === ElementTypes.ELEMENT
      ) {
        const constantType = doNotHoistNode
          ? ConstantTypes.NOT_CONSTANT
          : getConstantType(child, context)
        if (constantType > ConstantTypes.NOT_CONSTANT) {
          if (constantType >= ConstantTypes.CAN_HOIST) {
            child.codegenNode.patchFlag =
              PatchFlags.HOISTED + (__DEV__ ? ` /* HOISTED */` : ``)
            child.codegenNode = context.hoist(child.codegenNode)
            hoistedCount++
            continue
          }
        } else {
          // node may contain dynamic children, but its props may be eligible for
          // hoisting.
          const codegenNode = child.codegenNode
          if (codegenNode.type === NodeTypes.VNODE_CALL) {
            const flag = getPatchFlag(codegenNode)
            if (
              (!flag ||
                flag === PatchFlags.NEED_PATCH ||
                flag === PatchFlags.TEXT) &&
              getGeneratedPropsConstantType(child, context) >=
                ConstantTypes.CAN_HOIST
            ) {
              const props = getNodeProps(child)
              if (props) {
                codegenNode.props = context.hoist(props)
              }
            }
            if (codegenNode.dynamicProps) {
              codegenNode.dynamicProps = context.hoist(codegenNode.dynamicProps)
            }
          }
        }
      } else if (
        child.type === NodeTypes.TEXT_CALL &&
        getConstantType(child.content, context) >= ConstantTypes.CAN_HOIST
      ) {
        child.codegenNode = context.hoist(child.codegenNode)
        hoistedCount++
      }
  
      // walk further
      if (child.type === NodeTypes.ELEMENT) {
        const isComponent = child.tagType === ElementTypes.COMPONENT
        if (isComponent) {
          context.scopes.vSlot++
        }
        _walk(child, context)
        if (isComponent) {
          context.scopes.vSlot--
        }
      } else if (child.type === NodeTypes.FOR) {
        // Do not hoist v-for single child because it has to be a block
        _walk(child, context, child.children.length === 1)
      } else if (child.type === NodeTypes.IF) {
        for (let i = 0; i < child.branches.length; i++) {
          // Do not hoist v-if single child because it has to be a block
          _walk(
            child.branches[i],
            context,
            child.branches[i].children.length === 1
          )
        }
      }
    }
  
    if (hoistedCount && context.transformHoist) {
      logg(`hoist walk -> transformHoist, hoistedCount = ${hoistedCount}`)
      context.transformHoist(children, context, node)
    }
  
    // all children were hoisted - the entire children array is hoistable.
    if (
      hoistedCount &&
      hoistedCount === originalCount &&
      node.type === NodeTypes.ELEMENT &&
      node.tagType === ElementTypes.ELEMENT &&
      node.codegenNode &&
      node.codegenNode.type === NodeTypes.VNODE_CALL &&
      isArray(node.codegenNode.children)
    ) {
      node.codegenNode.children = context.hoist(
        createArrayExpression(node.codegenNode.children)
      )
    }
  }
  
  function getConstantType(node, context) {
    const { constantCache } = context
    switch (node.type) {
      case NodeTypes.ELEMENT:
        if (node.tagType !== ElementTypes.ELEMENT) {
          return ConstantTypes.NOT_CONSTANT
        }
        const cached = constantCache.get(node)
        if (cached !== undefined) {
          return cached
        }
        const codegenNode = node.codegenNode
        if (codegenNode.type !== NodeTypes.VNODE_CALL) {
          return ConstantTypes.NOT_CONSTANT
        }
        if (
          codegenNode.isBlock &&
          node.tag !== 'svg' &&
          node.tag !== 'foreignObject'
        ) {
          return ConstantTypes.NOT_CONSTANT
        }
        const flag = getPatchFlag(codegenNode)
        if (!flag) {
          let returnType = ConstantTypes.CAN_STRINGIFY
  
          // Element itself has no patch flag. However we still need to check:
  
          // 1. Even for a node with no patch flag, it is possible for it to contain
          // non-hoistable expressions that refers to scope variables, e.g. compiler
          // injected keys or cached event handlers. Therefore we need to always
          // check the codegenNode's props to be sure.
          const generatedPropsType = getGeneratedPropsConstantType(node, context)
          if (generatedPropsType === ConstantTypes.NOT_CONSTANT) {
            constantCache.set(node, ConstantTypes.NOT_CONSTANT)
            return ConstantTypes.NOT_CONSTANT
          }
          if (generatedPropsType < returnType) {
            returnType = generatedPropsType
          }
  
          // 2. its children.
          for (let i = 0; i < node.children.length; i++) {
            const childType = getConstantType(node.children[i], context)
            if (childType === ConstantTypes.NOT_CONSTANT) {
              constantCache.set(node, ConstantTypes.NOT_CONSTANT)
              return ConstantTypes.NOT_CONSTANT
            }
            if (childType < returnType) {
              returnType = childType
            }
          }
  
          // 3. if the type is not already CAN_SKIP_PATCH which is the lowest non-0
          // type, check if any of the props can cause the type to be lowered
          // we can skip can_patch because it's guaranteed by the absence of a
          // patchFlag.
          if (returnType > ConstantTypes.CAN_SKIP_PATCH) {
            for (let i = 0; i < node.props.length; i++) {
              const p = node.props[i]
              if (p.type === NodeTypes.DIRECTIVE && p.name === 'bind' && p.exp) {
                const expType = getConstantType(p.exp, context)
                if (expType === ConstantTypes.NOT_CONSTANT) {
                  constantCache.set(node, ConstantTypes.NOT_CONSTANT)
                  return ConstantTypes.NOT_CONSTANT
                }
                if (expType < returnType) {
                  returnType = expType
                }
              }
            }
          }
  
          // only svg/foreignObject could be block here, however if they are
          // static then they don't need to be blocks since there will be no
          // nested updates.
          if (codegenNode.isBlock) {
            context.removeHelper(OPEN_BLOCK)
            context.removeHelper(
              getVNodeBlockHelper(context.inSSR, codegenNode.isComponent)
            )
            codegenNode.isBlock = false
            context.helper(getVNodeHelper(context.inSSR, codegenNode.isComponent))
          }
  
          constantCache.set(node, returnType)
          return returnType
        } else {
          constantCache.set(node, ConstantTypes.NOT_CONSTANT)
          return ConstantTypes.NOT_CONSTANT
        }
      case NodeTypes.TEXT:
      case NodeTypes.COMMENT:
        return ConstantTypes.CAN_STRINGIFY
      case NodeTypes.IF:
      case NodeTypes.FOR:
      case NodeTypes.IF_BRANCH:
        return ConstantTypes.NOT_CONSTANT
      case NodeTypes.INTERPOLATION:
      case NodeTypes.TEXT_CALL:
        return getConstantType(node.content, context)
      case NodeTypes.SIMPLE_EXPRESSION:
        return node.constType
      case NodeTypes.COMPOUND_EXPRESSION:
        let returnType = ConstantTypes.CAN_STRINGIFY
        for (let i = 0; i < node.children.length; i++) {
          const child = node.children[i]
          if (isString(child) || isSymbol(child)) {
            continue
          }
          const childType = getConstantType(child, context)
          if (childType === ConstantTypes.NOT_CONSTANT) {
            return ConstantTypes.NOT_CONSTANT
          } else if (childType < returnType) {
            returnType = childType
          }
        }
        return returnType
      default:
        return ConstantTypes.NOT_CONSTANT
    }
  }
  
  const allowHoistedHelperSet = new Set([
    NORMALIZE_CLASS,
    NORMALIZE_STYLE,
    NORMALIZE_PROPS,
    GUARD_REACTIVE_PROPS
  ])
  
  function getConstantTypeOfHelperCall(value, context){
    if (
      value.type === NodeTypes.JS_CALL_EXPRESSION &&
      !isString(value.callee) &&
      allowHoistedHelperSet.has(value.callee)
    ) {
      const arg = value.arguments[0]
      if (arg.type === NodeTypes.SIMPLE_EXPRESSION) {
        return getConstantType(arg, context)
      } else if (arg.type === NodeTypes.JS_CALL_EXPRESSION) {
        // in the case of nested helper call, e.g. `normalizeProps(guardReactiveProps(exp))`
        return getConstantTypeOfHelperCall(arg, context)
      }
    }
    return ConstantTypes.NOT_CONSTANT
  }
  
  function getGeneratedPropsConstantType(node, context) {
    let returnType = ConstantTypes.CAN_STRINGIFY
    const props = getNodeProps(node)
    if (props && props.type === NodeTypes.JS_OBJECT_EXPRESSION) {
      const { properties } = props
      for (let i = 0; i < properties.length; i++) {
        const { key, value } = properties[i]
        const keyType = getConstantType(key, context)
        if (keyType === ConstantTypes.NOT_CONSTANT) {
          return keyType
        }
        if (keyType < returnType) {
          returnType = keyType
        }
        let valueType
        if (value.type === NodeTypes.SIMPLE_EXPRESSION) {
          valueType = getConstantType(value, context)
        } else if (value.type === NodeTypes.JS_CALL_EXPRESSION) {
          // some helper calls can be hoisted,
          // such as the `normalizeProps` generated by the compiler for pre-normalize class,
          // in this case we need to respect the ConstantType of the helper's arguments
          valueType = getConstantTypeOfHelperCall(value, context)
        } else {
          valueType = ConstantTypes.NOT_CONSTANT
        }
        if (valueType === ConstantTypes.NOT_CONSTANT) {
          return valueType
        }
        if (valueType < returnType) {
          returnType = valueType
        }
      }
    }
    return returnType
  }
  
  function getNodeProps(node) {
    const codegenNode = node.codegenNode
    if (codegenNode.type === NodeTypes.VNODE_CALL) {
      return codegenNode.props
    }
  }
  
  function getPatchFlag(node) {
    const flag = node.patchFlag
    return flag ? parseInt(flag, 10) : undefined
  }
  
  function createRootCodegen(root, context) {
    const { helper } = context
    const { children } = root
    logg('createRootCodegen', `children=${children.length}, 只有一个用 block, 多个用Fragment`)
    if (children.length === 1) {
      const child = children[0]
      // if the single child is an element, turn it into a block.
      // 如果只有一个根元素，如： <template><div>...</div></template>
      if (isSingleElementRoot(root, child) && child.codegenNode) {
        // single element root is never hoisted so codegenNode will never be
        // SimpleExpressionNode
        const codegenNode = child.codegenNode
        if (codegenNode.type === NodeTypes.VNODE_CALL) {
          makeBlock(codegenNode, context)
        }
        root.codegenNode = codegenNode
      } else {
        // - single <slot/>, IfNode, ForNode: already blocks.
        // - single text node: always patched.
        // root codegen falls through via genNode()
        root.codegenNode = child
      }
    } else if (children.length > 1) {
      // root 下有多个节点时，使用 fragment block，3.x 特性，2.x中是不支持多个元素的
      let patchFlag = PatchFlags.STABLE_FRAGMENT
      let patchFlagText = PatchFlagNames[PatchFlags.STABLE_FRAGMENT]
  
      root.codegenNode = createVNodeCall(
        context,
        helper(FRAGMENT),
        undefined,
        root.children,
        patchFlag + (__DEV__ ? ` /* ${patchFlagText} */` : ``),
        undefined,
        undefined,
        true,
        undefined,
        false /* isComponent */
      )
    } else {
      // no children = noop. codegen will return null.
    }
  }
  function createStructuralDirectiveTransform(name, fn) {
    // 正则就用 test 方法，字符串直接比较
    const matches = isString(name)
      ? (n) => n === name
      : (n) => name.test(n)
  
    logg('createStructuralDirectiveTransform', `name=${name}, matches=${matches}`)
    return (node, context) => {
      if (node.type === NodeTypes.ELEMENT) {
        const { props } = node
        // v-slot 指令特殊处理，代码在 vSlot.ts 中，所以这里跳过它
        if (node.tagType === ElementTypes.TEMPLATE && props.some(isVSlot)) {
          return
        }
        const exitFns = []
        for (let i = 0; i < props.length; i++) {
          const prop = props[i]
          if (prop.type === NodeTypes.DIRECTIVE && matches(prop.name)) {
            // structural directives are removed to avoid infinite recursion
            // also we remove them *before* applying so that it can further
            // traverse itself in case it moves the node around
            props.splice(i, 1)
            i--
            const onExit = fn(node, prop, context)
            if (onExit) exitFns.push(onExit)
          }
        }
        return exitFns
      }
    }
  }
  
  function getBaseTransformPreset(prefixIdentifiers) {
    return [
      [
        transformOnce,
        transformIf,
        transformMemo,
        transformFor,
        ...(!__BROWSER__ && prefixIdentifiers
          ? [
              // order is important
              trackVForSlotScopes,
              transformExpression
            ]
          : __BROWSER__ && __DEV__
          ? [transformExpression]
          : []),
        transformSlotOutlet,
        transformElement,
        trackSlotScopes,
        transformText
      ],
      {
        on: transformOn,
        bind: transformBind,
        model: transformModel
      }
    ]
  }
  function makeBlock(node, { helper, removeHelper, inSSR }) {
    if (!node.isBlock) {
      node.isBlock = true
      removeHelper(getVNodeHelper(inSSR, node.isComponent))
      helper(OPEN_BLOCK)
      helper(getVNodeBlockHelper(inSSR, node.isComponent))
    }
  }
  const defaultFallback = createSimpleExpression(`undefined`, false)
  
  // A NodeTransform that:
  // 1. Tracks scope identifiers for scoped slots so that they don't get prefixed
  //    by transformExpression. This is only applied in non-browser builds with
  //    { prefixIdentifiers: true }.
  // 2. Track v-slot depths so that we know a slot is inside another slot.
  //    Note the exit callback is executed before buildSlots() on the same node,
  //    so only nested slots see positive numbers.
  const trackSlotScopes = (node, context) => {
    if (
      node.type === NodeTypes.ELEMENT &&
      (node.tagType === ElementTypes.COMPONENT ||
        node.tagType === ElementTypes.TEMPLATE)
    ) {
      // We are only checking non-empty v-slot here
      // since we only care about slots that introduce scope variables.
      const vSlot = findDir(node, 'slot')
      if (vSlot) {
        const slotProps = vSlot.exp
        if (!__BROWSER__ && context.prefixIdentifiers) {
          slotProps && context.addIdentifiers(slotProps)
        }
        context.scopes.vSlot++
        return () => {
          if (!__BROWSER__ && context.prefixIdentifiers) {
            slotProps && context.removeIdentifiers(slotProps)
          }
          context.scopes.vSlot--
        }
      }
    }
  }
  
  
  // A NodeTransform that tracks scope identifiers for scoped slots with v-for.
  // This transform is only applied in non-browser builds with { prefixIdentifiers: true }
  const trackVForSlotScopes = (node, context) => {
    let vFor
    if (
      isTemplateNode(node) &&
      node.props.some(isVSlot) &&
      (vFor = findDir(node, 'for'))
    ) {
      const result = (vFor.parseResult = parseForExpression(
        vFor.exp,
        context
      ))
      if (result) {
        const { value, key, index } = result
        const { addIdentifiers, removeIdentifiers } = context
        value && addIdentifiers(value)
        key && addIdentifiers(key)
        index && addIdentifiers(index)
  
        return () => {
          value && removeIdentifiers(value)
          key && removeIdentifiers(key)
          index && removeIdentifiers(index)
        }
      }
    }
  }
  
  const buildClientSlotFn = (props, children, loc) =>
    createFunctionExpression(
      props,
      children,
      false /* newline */,
      true /* isSlot */,
      children.length ? children[0].loc : loc
    )
  
  
  // Instead of being a DirectiveTransform, v-slot processing is called during
  // transformElement to build the slots object for a component.
  function buildSlots(node, context, buildSlotFn= buildClientSlotFn) {
    context.helper(WITH_CTX)
  
    const { children, loc } = node
    const slotsProperties = []
    const dynamicSlots= []
  
    // If the slot is inside a v-for or another v-slot, force it to be dynamic
    // since it likely uses a scope variable.
    let hasDynamicSlots = context.scopes.vSlot > 0 || context.scopes.vFor > 0
    // with `prefixIdentifiers: true`, this can be further optimized to make
    // it dynamic only when the slot actually uses the scope variables.
    if (!__BROWSER__ && !context.ssr && context.prefixIdentifiers) {
      hasDynamicSlots = hasScopeRef(node, context.identifiers)
    }
  
    // 1. Check for slot with slotProps on component itself.
    //    <Comp v-slot="{ prop }"/>
    const onComponentSlot = findDir(node, 'slot', true)
    if (onComponentSlot) {
      const { arg, exp } = onComponentSlot
      if (arg && !isStaticExp(arg)) {
        hasDynamicSlots = true
      }
      slotsProperties.push(
        createObjectProperty(
          arg || createSimpleExpression('default', true),
          buildSlotFn(exp, children, loc)
        )
      )
    }
  
    // 2. Iterate through children and check for template slots
    //    <template v-slot:foo="{ prop }">
    let hasTemplateSlots = false
    let hasNamedDefaultSlot = false
    const implicitDefaultChildren = []
    const seenSlotNames = new Set()
  
    for (let i = 0; i < children.length; i++) {
      const slotElement = children[i]
      let slotDir
  
      if (
        !isTemplateNode(slotElement) ||
        !(slotDir = findDir(slotElement, 'slot', true))
      ) { // 收集不在 template v-slot 中的元素/组件，这些都会合并到默认插槽中去
        if (slotElement.type !== NodeTypes.COMMENT) {
          implicitDefaultChildren.push(slotElement)
        }
        continue
      }
  
      if (onComponentSlot) {
        logg(`buildSlots already has on-component slot - this is incorrect usage`)
        break
      }
  
      hasTemplateSlots = true
      const { children: slotChildren, loc: slotLoc } = slotElement
      const {
        arg: slotName = createSimpleExpression(`default`, true),
        exp: slotProps,
        loc: dirLoc
      } = slotDir
  
      // check if name is dynamic.
      let staticSlotName
      if (isStaticExp(slotName)) {
        staticSlotName = slotName ? slotName.content : `default`
      } else {
        hasDynamicSlots = true
      }
  
      const slotFunction = buildSlotFn(slotProps, slotChildren, slotLoc)
      // check if this slot is conditional (v-if/v-for)
      let vIf
      let vElse
      let vFor
      if ((vIf = findDir(slotElement, 'if'))) {
        hasDynamicSlots = true
        dynamicSlots.push(
          createConditionalExpression(
            vIf.exp,
            buildDynamicSlot(slotName, slotFunction),
            defaultFallback
          )
        )
      } else if (
        (vElse = findDir(slotElement, /^else(-if)?$/, true /* allowEmpty */))
      ) {
        // find adjacent v-if
        let j = i
        let prev
        while (j--) {
          prev = children[j]
          if (prev.type !== NodeTypes.COMMENT) {
            break
          }
        }
        if (prev && isTemplateNode(prev) && findDir(prev, 'if')) {
          // remove node
          children.splice(i, 1)
          i--
  
          // attach this slot to previous conditional
          let conditional = dynamicSlots[
            dynamicSlots.length - 1
          ]
          while (
            conditional.alternate.type === NodeTypes.JS_CONDITIONAL_EXPRESSION
          ) {
            conditional = conditional.alternate
          }
          conditional.alternate = vElse.exp
            ? createConditionalExpression(
                vElse.exp,
                buildDynamicSlot(slotName, slotFunction),
                defaultFallback
              )
            : buildDynamicSlot(slotName, slotFunction)
        }
      } else if ((vFor = findDir(slotElement, 'for'))) {
        hasDynamicSlots = true
        const parseResult =
          vFor.parseResult ||
          parseForExpression(vFor.exp , context)
        if (parseResult) {
          // Render the dynamic slots as an array and add it to the createSlot()
          // args. The runtime knows how to handle it appropriately.
          dynamicSlots.push(
            createCallExpression(context.helper(RENDER_LIST), [
              parseResult.source,
              createFunctionExpression(
                createForLoopParams(parseResult),
                buildDynamicSlot(slotName, slotFunction),
                true /* force newline */
              )
            ])
          )
        }
      } else {
        // check duplicate static names
        if (staticSlotName) {
          if (seenSlotNames.has(staticSlotName)) {
            logg(`buildSlots seenSlotNames has slot name`)
            continue
          }
          seenSlotNames.add(staticSlotName)
          if (staticSlotName === 'default') {
            hasNamedDefaultSlot = true
          }
        }
        slotsProperties.push(createObjectProperty(slotName, slotFunction))
      }
    }
  
    if (!onComponentSlot) {
      const buildDefaultSlotProperty = (props, children) => {
        const fn = buildSlotFn(props, children, loc)
  
        return createObjectProperty(`default`, fn)
      }
  
      if (!hasTemplateSlots) {
        // implicit default slot (on component)
        slotsProperties.push(buildDefaultSlotProperty(undefined, children))
      } else if (
        implicitDefaultChildren.length &&
        // #3766
        // with whitespace: 'preserve', whitespaces between slots will end up in
        // implicitDefaultChildren. Ignore if all implicit children are whitespaces.
        implicitDefaultChildren.some(node => isNonWhitespaceContent(node))
      ) {
        // implicit default slot (mixed with named slots)
        if (hasNamedDefaultSlot) {
          logg(`buildSlots hasNamedDefaultSlot`)
        } else {
          // 合并到默认插槽
          slotsProperties.push(
            buildDefaultSlotProperty(undefined, implicitDefaultChildren)
          )
        }
      }
    }
  
    const slotFlag = hasDynamicSlots
      ? SlotFlags.DYNAMIC
      : hasForwardedSlots(node.children)
      ? SlotFlags.FORWARDED
      : SlotFlags.STABLE
  
    let slots = createObjectExpression(
      slotsProperties.concat(
        createObjectProperty(
          `_`,
          // 2 = compiled but dynamic = can skip normalization, but must run diff
          // 1 = compiled and static = can skip normalization AND diff as optimized
          createSimpleExpression(
            slotFlag + (__DEV__ ? ` /* ${slotFlagsText[slotFlag]} */` : ``),
            false
          )
        )
      ),
      loc
    )
    if (dynamicSlots.length) {
      slots = createCallExpression(context.helper(CREATE_SLOTS), [
        slots,
        createArrayExpression(dynamicSlots)
      ])
    }
  
    return {
      slots,
      hasDynamicSlots
    }
  }
  
  function buildDynamicSlot(name, fn) {
    return createObjectExpression([
      createObjectProperty(`name`, name),
      createObjectProperty(`fn`, fn)
    ])
  }
  
  function hasForwardedSlots(children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      switch (child.type) {
        case NodeTypes.ELEMENT:
          if (
            child.tagType === ElementTypes.SLOT ||
            hasForwardedSlots(child.children)
          ) {
            return true
          }
          break
        case NodeTypes.IF:
          if (hasForwardedSlots(child.branches)) return true
          break
        case NodeTypes.IF_BRANCH:
        case NodeTypes.FOR:
          if (hasForwardedSlots(child.children)) return true
          break
        default:
          break
      }
    }
    return false
  }
  
  function isNonWhitespaceContent(node){
    if (node.type !== NodeTypes.TEXT && node.type !== NodeTypes.TEXT_CALL)
      return true
    return node.type === NodeTypes.TEXT
      ? !!node.content.trim()
      : isNonWhitespaceContent(node.content)
  }
  // some directive transforms (e.g. v-model) may return a symbol for runtime
  // import, which should be used instead of a resolveDirective call.
  const directiveImportMap = new WeakMap()
  
  // generate a JavaScript AST for this element's codegen
  const transformElement = (node, context) => {
    // perform the work on exit, after all child expressions have been
    // processed and merged.
    return function postTransformElement() {
      node = context.currentNode
  
      if (
        !(
          node.type === NodeTypes.ELEMENT &&
          (node.tagType === ElementTypes.ELEMENT ||
            node.tagType === ElementTypes.COMPONENT)
        )
      ) {
        return
      }
  
      const { tag, props } = node
      const isComponent = node.tagType === ElementTypes.COMPONENT
  
      // The goal of the transform is to create a codegenNode implementing the
      // VNodeCall interface.
      let vnodeTag = isComponent
        ? resolveComponentType(node, context)
        : `"${tag}"`
  
      const isDynamicComponent =
        isObject(vnodeTag) && vnodeTag.callee === RESOLVE_DYNAMIC_COMPONENT
  
      let vnodeProps
      let vnodeChildren
      let vnodePatchFlag
      let patchFlag = 0
      let vnodeDynamicProps
      let dynamicPropNames
      let vnodeDirectives
  
      let shouldUseBlock =
        // dynamic component may resolve to plain elements
        isDynamicComponent ||
        vnodeTag === TELEPORT ||
        vnodeTag === SUSPENSE ||
        (!isComponent &&
          // <svg> and <foreignObject> must be forced into blocks so that block
          // updates inside get proper isSVG flag at runtime. (#639, #643)
          // This is technically web-specific, but splitting the logic out of core
          // leads to too much unnecessary complexity.
          (tag === 'svg' || tag === 'foreignObject'))
  
      // props
      if (props.length > 0) {
        const propsBuildResult = buildProps(node, context)
        vnodeProps = propsBuildResult.props
        patchFlag = propsBuildResult.patchFlag
        dynamicPropNames = propsBuildResult.dynamicPropNames
        const directives = propsBuildResult.directives
        vnodeDirectives =
          directives && directives.length
            ? (createArrayExpression(
                directives.map(dir => buildDirectiveArgs(dir, context))
              ))
            : undefined
  
        if (propsBuildResult.shouldUseBlock) {
          shouldUseBlock = true
        }
      }
  
      // children
      if (node.children.length > 0) {
        if (vnodeTag === KEEP_ALIVE) {
          // Although a built-in component, we compile KeepAlive with raw children
          // instead of slot functions so that it can be used inside Transition
          // or other Transition-wrapping HOCs.
          // To ensure correct updates with block optimizations, we need to:
          // 1. Force keep-alive into a block. This avoids its children being
          //    collected by a parent block.
          shouldUseBlock = true
          // 2. Force keep-alive to always be updated, since it uses raw children.
          patchFlag |= PatchFlags.DYNAMIC_SLOTS
        }
  
        const shouldBuildAsSlots =
          isComponent &&
          // Teleport is not a real component and has dedicated runtime handling
          vnodeTag !== TELEPORT &&
          // explained above.
          vnodeTag !== KEEP_ALIVE
  
        if (shouldBuildAsSlots) {
          const { slots, hasDynamicSlots } = buildSlots(node, context)
          vnodeChildren = slots
          if (hasDynamicSlots) {
            patchFlag |= PatchFlags.DYNAMIC_SLOTS
          }
        } else if (node.children.length === 1 && vnodeTag !== TELEPORT) {
          const child = node.children[0]
          const type = child.type
          // check for dynamic text children
          const hasDynamicTextChild =
            type === NodeTypes.INTERPOLATION ||
            type === NodeTypes.COMPOUND_EXPRESSION
          if (
            hasDynamicTextChild &&
            getConstantType(child, context) === ConstantTypes.NOT_CONSTANT
          ) {
            patchFlag |= PatchFlags.TEXT
          }
          // pass directly if the only child is a text node
          // (plain / interpolation / expression)
          if (hasDynamicTextChild || type === NodeTypes.TEXT) {
            vnodeChildren = child
          } else {
            vnodeChildren = node.children
          }
        } else {
          vnodeChildren = node.children
        }
      }
  
      // patchFlag & dynamicPropNames
      if (patchFlag !== 0) {
        vnodePatchFlag = String(patchFlag)
        if (dynamicPropNames && dynamicPropNames.length) {
          vnodeDynamicProps = stringifyDynamicPropNames(dynamicPropNames)
        }
      }
  
      node.codegenNode = createVNodeCall(
        context,
        vnodeTag,
        vnodeProps,
        vnodeChildren,
        vnodePatchFlag,
        vnodeDynamicProps,
        vnodeDirectives,
        !!shouldUseBlock,
        false /* disableTracking */,
        isComponent,
        node.loc
      )
    }
  }
  
  function resolveComponentType(
    node,
    context,
    ssr = false
  ) {
    let { tag } = node
  
    // 1. dynamic component
    const isExplicitDynamic = isComponentTag(tag)
    const isProp = findProp(node, 'is')
    if (isProp) {
      if (isExplicitDynamic ) {
        const exp =
          isProp.type === NodeTypes.ATTRIBUTE
            ? isProp.value && createSimpleExpression(isProp.value.content, true)
            : isProp.exp
        if (exp) {
          return createCallExpression(context.helper(RESOLVE_DYNAMIC_COMPONENT), [
            exp
          ])
        }
      } else if (
        isProp.type === NodeTypes.ATTRIBUTE &&
        isProp.value.content.startsWith('vue:')
      ) {
        // <button is="vue:xxx">
        // if not <component>, only is value that starts with "vue:" will be
        // treated as component by the parse phase and reach here, unless it's
        // compat mode where all is values are considered components
        tag = isProp.value.content.slice(4)
      }
    }
  
    // 1.5 v-is (TODO: Deprecate)
    const isDir = !isExplicitDynamic && findDir(node, 'is')
    if (isDir && isDir.exp) {
      return createCallExpression(context.helper(RESOLVE_DYNAMIC_COMPONENT), [
        isDir.exp
      ])
    }
  
    // 2. built-in components (Teleport, Transition, KeepAlive, Suspense...)
    const builtIn = isCoreComponent(tag) || context.isBuiltInComponent(tag)
    if (builtIn) {
      // built-ins are simply fallthroughs / have special handling during ssr
      // so we don't need to import their runtime equivalents
      if (!ssr) context.helper(builtIn)
      return builtIn
    }
  
    // 3. user component (from setup bindings)
    // this is skipped in browser build since browser builds do not perform
    // binding analysis.
    if (!__BROWSER__) {
      const fromSetup = resolveSetupReference(tag, context)
      if (fromSetup) {
        return fromSetup
      }
      const dotIndex = tag.indexOf('.')
      if (dotIndex > 0) {
        const ns = resolveSetupReference(tag.slice(0, dotIndex), context)
        if (ns) {
          return ns + tag.slice(dotIndex)
        }
      }
    }
  
    // 4. Self referencing component (inferred from filename)
    if (
      !__BROWSER__ &&
      context.selfName &&
      capitalize(camelize(tag)) === context.selfName
    ) {
      context.helper(RESOLVE_COMPONENT)
      // codegen.ts has special check for __self postfix when generating
      // component imports, which will pass additional `maybeSelfReference` flag
      // to `resolveComponent`.
      context.components.add(tag + `__self`)
      return toValidAssetId(tag, `component`)
    }
  
    // 5. user component (resolve)
    context.helper(RESOLVE_COMPONENT)
    context.components.add(tag)
    return toValidAssetId(tag, `component`)
  }
  
  
  function resolveSetupReference(name, context) {
    const bindings = context.bindingMetadata
    if (!bindings || bindings.__isScriptSetup === false) {
      return
    }
  
    const camelName = camelize(name)
    const PascalName = capitalize(camelName)
    const checkType = (type) => {
      if (bindings[name] === type) {
        return name
      }
      if (bindings[camelName] === type) {
        return camelName
      }
      if (bindings[PascalName] === type) {
        return PascalName
      }
    }
  
    const fromConst = checkType(BindingTypes.SETUP_CONST)
    if (fromConst) {
      return context.inline
        ? // in inline mode, const setup bindings (e.g. imports) can be used as-is
          fromConst
        : `$setup[${JSON.stringify(fromConst)}]`
    }
  
    const fromMaybeRef =
      checkType(BindingTypes.SETUP_LET) ||
      checkType(BindingTypes.SETUP_REF) ||
      checkType(BindingTypes.SETUP_MAYBE_REF)
    if (fromMaybeRef) {
      return context.inline
        ? // setup scope bindings that may be refs need to be unrefed
          `${context.helperString(UNREF)}(${fromMaybeRef})`
        : `$setup[${JSON.stringify(fromMaybeRef)}]`
    }
  }
  
  function buildProps(
    node,
    context,
    props = node.props,
    ssr = false
  ) {
    const { tag, loc: elementLoc, children } = node
    const isComponent = node.tagType === ElementTypes.COMPONENT
    let properties = []
    const mergeArgs = []
    const runtimeDirectives = []
    const hasChildren = children.length > 0
    let shouldUseBlock = false
  
    // patchFlag analysis
    let patchFlag = 0
    let hasRef = false
    let hasClassBinding = false
    let hasStyleBinding = false
    let hasHydrationEventBinding = false
    let hasDynamicKeys = false
    let hasVnodeHook = false
    const dynamicPropNames = []
  
    const analyzePatchFlag = ({ key, value }) => {
      if (isStaticExp(key)) {
        const name = key.content
        const isEventHandler = isOn(name)
        if (
          !isComponent &&
          isEventHandler &&
          // omit the flag for click handlers because hydration gives click
          // dedicated fast path.
          name.toLowerCase() !== 'onclick' &&
          // omit v-model handlers
          name !== 'onUpdate:modelValue' &&
          // omit onVnodeXXX hooks
          !isReservedProp(name)
        ) {
          hasHydrationEventBinding = true
        }
  
        if (isEventHandler && isReservedProp(name)) {
          hasVnodeHook = true
        }
  
        if (
          value.type === NodeTypes.JS_CACHE_EXPRESSION ||
          ((value.type === NodeTypes.SIMPLE_EXPRESSION ||
            value.type === NodeTypes.COMPOUND_EXPRESSION) &&
            getConstantType(value, context) > 0)
        ) {
          // skip if the prop is a cached handler or has constant value
          return
        }
  
        if (name === 'ref') {
          hasRef = true
        } else if (name === 'class') {
          hasClassBinding = true
        } else if (name === 'style') {
          hasStyleBinding = true
        } else if (name !== 'key' && !dynamicPropNames.includes(name)) {
          dynamicPropNames.push(name)
        }
  
        // treat the dynamic class and style binding of the component as dynamic props
        if (
          isComponent &&
          (name === 'class' || name === 'style') &&
          !dynamicPropNames.includes(name)
        ) {
          dynamicPropNames.push(name)
        }
      } else {
        hasDynamicKeys = true
      }
    }
  
    for (let i = 0; i < props.length; i++) {
      // static attribute
      const prop = props[i]
      if (prop.type === NodeTypes.ATTRIBUTE) {
        const { loc, name, value } = prop
        let isStatic = true
        if (name === 'ref') {
          hasRef = true
          if (context.scopes.vFor > 0) {
            properties.push(
              createObjectProperty(
                createSimpleExpression('ref_for', true),
                createSimpleExpression('true')
              )
            )
          }
          // in inline mode there is no setupState object, so we can't use string
          // keys to set the ref. Instead, we need to transform it to pass the
          // actual ref instead.
          if (
            !__BROWSER__ &&
            value &&
            context.inline &&
            context.bindingMetadata[value.content]
          ) {
            isStatic = false
            properties.push(
              createObjectProperty(
                createSimpleExpression('ref_key', true),
                createSimpleExpression(value.content, true, value.loc)
              )
            )
          }
        }
        // skip is on <component>, or is="vue:xxx"
        if (
          name === 'is' &&
          (isComponentTag(tag) ||
            (value && value.content.startsWith('vue:')))
        ) {
          continue
        }
        properties.push(
          createObjectProperty(
            createSimpleExpression(
              name,
              true,
              getInnerRange(loc, 0, name.length)
            ),
            createSimpleExpression(
              value ? value.content : '',
              isStatic,
              value ? value.loc : loc
            )
          )
        )
      } else {
        // directives
        const { name, arg, exp, loc } = prop
        const isVBind = name === 'bind'
        const isVOn = name === 'on'
  
        // skip v-slot - it is handled by its dedicated transform.
        if (name === 'slot') {
          continue
        }
        // skip v-once/v-memo - they are handled by dedicated transforms.
        if (name === 'once' || name === 'memo') {
          continue
        }
        // skip v-is and :is on <component>
        if (
          name === 'is' ||
          (isVBind &&
            isStaticArgOf(arg, 'is') &&
            isComponentTag(tag))
        ) {
          continue
        }
        // skip v-on in SSR compilation
        if (isVOn && ssr) {
          continue
        }
  
        if (
          // #938: elements with dynamic keys should be forced into blocks
          (isVBind && isStaticArgOf(arg, 'key')) ||
          // inline before-update hooks need to force block so that it is invoked
          // before children
          (isVOn && hasChildren && isStaticArgOf(arg, 'vue:before-update'))
        ) {
          shouldUseBlock = true
        }
  
        if (isVBind && isStaticArgOf(arg, 'ref') && context.scopes.vFor > 0) {
          properties.push(
            createObjectProperty(
              createSimpleExpression('ref_for', true),
              createSimpleExpression('true')
            )
          )
        }
  
        // special case for v-bind and v-on with no argument
        if (!arg && (isVBind || isVOn)) {
          hasDynamicKeys = true
          if (exp) {
            if (properties.length) {
              mergeArgs.push(
                createObjectExpression(dedupeProperties(properties), elementLoc)
              )
              properties = []
            }
            if (isVBind) {
              mergeArgs.push(exp)
            } else {
              // v-on="obj" -> toHandlers(obj)
              mergeArgs.push({
                type: NodeTypes.JS_CALL_EXPRESSION,
                loc,
                callee: context.helper(TO_HANDLERS),
                arguments: [exp]
              })
            }
          }
          continue
        }
  
        const directiveTransform = context.directiveTransforms[name]
        if (directiveTransform) {
          // has built-in directive transform.
          const { props, needRuntime } = directiveTransform(prop, node, context)
          !ssr && props.forEach(analyzePatchFlag)
          properties.push(...props)
          if (needRuntime) {
            runtimeDirectives.push(prop)
            if (isSymbol(needRuntime)) {
              directiveImportMap.set(prop, needRuntime)
            }
          }
        } else if (!isBuiltInDirective(name)) {
          // no built-in transform, this is a user custom directive.
          runtimeDirectives.push(prop)
          // custom dirs may use beforeUpdate so they need to force blocks
          // to ensure before-update gets called before children update
          if (hasChildren) {
            shouldUseBlock = true
          }
        }
      }
    }
  
    let propsExpression = undefined
  
    // has v-bind="object" or v-on="object", wrap with mergeProps
    if (mergeArgs.length) {
      if (properties.length) {
        mergeArgs.push(
          createObjectExpression(dedupeProperties(properties), elementLoc)
        )
      }
      if (mergeArgs.length > 1) {
        propsExpression = createCallExpression(
          context.helper(MERGE_PROPS),
          mergeArgs,
          elementLoc
        )
      } else {
        // single v-bind with nothing else - no need for a mergeProps call
        propsExpression = mergeArgs[0]
      }
    } else if (properties.length) {
      propsExpression = createObjectExpression(
        dedupeProperties(properties),
        elementLoc
      )
    }
  
    // patchFlag analysis
    if (hasDynamicKeys) {
      patchFlag |= PatchFlags.FULL_PROPS
    } else {
      if (hasClassBinding && !isComponent) {
        patchFlag |= PatchFlags.CLASS
      }
      if (hasStyleBinding && !isComponent) {
        patchFlag |= PatchFlags.STYLE
      }
      if (dynamicPropNames.length) {
        patchFlag |= PatchFlags.PROPS
      }
      if (hasHydrationEventBinding) {
        patchFlag |= PatchFlags.HYDRATE_EVENTS
      }
    }
    if (
      !shouldUseBlock &&
      (patchFlag === 0 || patchFlag === PatchFlags.HYDRATE_EVENTS) &&
      (hasRef || hasVnodeHook || runtimeDirectives.length > 0)
    ) {
      patchFlag |= PatchFlags.NEED_PATCH
    }
  
    // pre-normalize props, SSR is skipped for now
    if (!context.inSSR && propsExpression) {
      switch (propsExpression.type) {
        case NodeTypes.JS_OBJECT_EXPRESSION:
          // means that there is no v-bind,
          // but still need to deal with dynamic key binding
          let classKeyIndex = -1
          let styleKeyIndex = -1
          let hasDynamicKey = false
  
          for (let i = 0; i < propsExpression.properties.length; i++) {
            const key = propsExpression.properties[i].key
            if (isStaticExp(key)) {
              if (key.content === 'class') {
                classKeyIndex = i
              } else if (key.content === 'style') {
                styleKeyIndex = i
              }
            } else if (!key.isHandlerKey) {
              hasDynamicKey = true
            }
          }
  
          const classProp = propsExpression.properties[classKeyIndex]
          const styleProp = propsExpression.properties[styleKeyIndex]
  
          // no dynamic key
          if (!hasDynamicKey) {
            if (classProp && !isStaticExp(classProp.value)) {
              classProp.value = createCallExpression(
                context.helper(NORMALIZE_CLASS),
                [classProp.value]
              )
            }
            if (
              styleProp &&
              !isStaticExp(styleProp.value) &&
              // the static style is compiled into an object,
              // so use `hasStyleBinding` to ensure that it is a dynamic style binding
              (hasStyleBinding ||
                // v-bind:style and style both exist,
                // v-bind:style with static literal object
                styleProp.value.type === NodeTypes.JS_ARRAY_EXPRESSION)
            ) {
              styleProp.value = createCallExpression(
                context.helper(NORMALIZE_STYLE),
                [styleProp.value]
              )
            }
          } else {
            // dynamic key binding, wrap with `normalizeProps`
            propsExpression = createCallExpression(
              context.helper(NORMALIZE_PROPS),
              [propsExpression]
            )
          }
          break
        case NodeTypes.JS_CALL_EXPRESSION:
          // mergeProps call, do nothing
          break
        default:
          // single v-bind
          propsExpression = createCallExpression(
            context.helper(NORMALIZE_PROPS),
            [
              createCallExpression(context.helper(GUARD_REACTIVE_PROPS), [
                propsExpression
              ])
            ]
          )
          break
      }
    }
  
    return {
      props: propsExpression,
      directives: runtimeDirectives,
      patchFlag,
      dynamicPropNames,
      shouldUseBlock
    }
  }
  
  // Dedupe props in an object literal.
  // Literal duplicated attributes would have been warned during the parse phase,
  // however, it's possible to encounter duplicated `onXXX` handlers with different
  // modifiers. We also need to merge static and dynamic class / style attributes.
  // - onXXX handlers / style: merge into array
  // - class: merge into single expression with concatenation
  function dedupeProperties(properties) {
    const knownProps = new Map()
    const deduped = []
    for (let i = 0; i < properties.length; i++) {
      const prop = properties[i]
      // dynamic keys are always allowed
      if (prop.key.type === NodeTypes.COMPOUND_EXPRESSION || !prop.key.isStatic) {
        deduped.push(prop)
        continue
      }
      const name = prop.key.content
      const existing = knownProps.get(name)
      if (existing) {
        if (name === 'style' || name === 'class' || isOn(name)) {
          mergeAsArray(existing, prop)
        }
        // unexpected duplicate, should have emitted error during parse
      } else {
        knownProps.set(name, prop)
        deduped.push(prop)
      }
    }
    return deduped
  }
  
  function mergeAsArray(existing, incoming) {
    if (existing.value.type === NodeTypes.JS_ARRAY_EXPRESSION) {
      existing.value.elements.push(incoming.value)
    } else {
      existing.value = createArrayExpression(
        [existing.value, incoming.value],
        existing.loc
      )
    }
  }
  
  function buildDirectiveArgs(
    dir,
    context
  ) {
    const dirArgs = []
    const runtime = directiveImportMap.get(dir)
    if (runtime) {
      // built-in directive with runtime
      dirArgs.push(context.helperString(runtime))
    } else {
      // user directive.
      // see if we have directives exposed via <script setup>
      const fromSetup =
        !__BROWSER__ && resolveSetupReference('v-' + dir.name, context)
      if (fromSetup) {
        dirArgs.push(fromSetup)
      } else {
        // inject statement for resolving directive
        context.helper(RESOLVE_DIRECTIVE)
        context.directives.add(dir.name)
        dirArgs.push(toValidAssetId(dir.name, `directive`))
      }
    }
    const { loc } = dir
    if (dir.exp) dirArgs.push(dir.exp)
    if (dir.arg) {
      if (!dir.exp) {
        dirArgs.push(`void 0`)
      }
      dirArgs.push(dir.arg)
    }
    if (Object.keys(dir.modifiers).length) {
      if (!dir.arg) {
        if (!dir.exp) {
          dirArgs.push(`void 0`)
        }
        dirArgs.push(`void 0`)
      }
      const trueExpression = createSimpleExpression(`true`, false, loc)
      dirArgs.push(
        createObjectExpression(
          dir.modifiers.map(modifier =>
            createObjectProperty(modifier, trueExpression)
          ),
          loc
        )
      )
    }
    return createArrayExpression(dirArgs, dir.loc)
  }
  
  function stringifyDynamicPropNames(props) {
    let propsNamesString = `[`
    for (let i = 0, l = props.length; i < l; i++) {
      propsNamesString += JSON.stringify(props[i])
      if (i < l - 1) propsNamesString += ', '
    }
    return propsNamesString + `]`
  }
  
  function isComponentTag(tag) {
    return tag === 'component' || tag === 'Component'
  }
  
  
  const isLiteralWhitelisted = /*#__PURE__*/ makeMap('true,false,null,this')
  
  const transformExpression = (node, context) => {
    logg(`transformExpression`, node)
    // 插值处理
    if (node.type === NodeTypes.INTERPOLATION) {
      node.content = processExpression(
        node.content ,
        context
      )
    } else if (node.type === NodeTypes.ELEMENT) {
      // 处理元素上的指令
      for (let i = 0; i < node.props.length; i++) {
        const dir = node.props[i]
        logg(`transformExpression - prop[${i}] - directive`, node.props[i])
        // do not process for v-on & v-for since they are special handled
        if (dir.type === NodeTypes.DIRECTIVE && dir.name !== 'for') { // v-for 在 vFor.ts 中处理
          const exp = dir.exp
          const arg = dir.arg
          // do not process exp if this is v-on:arg - we need special handling
          // for wrapping inline statements.
          if (
            exp &&
            exp.type === NodeTypes.SIMPLE_EXPRESSION &&
            !(dir.name === 'on' && arg)
          ) {
            dir.exp = processExpression(
              exp,
              context,
              // slot args must be processed as function params
              dir.name === 'slot'
            )
          }
          if (arg && arg.type === NodeTypes.SIMPLE_EXPRESSION && !arg.isStatic) {
            dir.arg = processExpression(arg, context)
          }
        }
      }
    }
  }
  
  // Important: since this function uses Node.js only dependencies, it should
  // always be used with a leading !__BROWSER__ check so that it can be
  // tree-shaken from the browser build.
  function processExpression(
    node,
    context,
    // some expressions like v-slot props & v-for aliases should be parsed as
    // function params
    asParams = false,
    // v-on handler values may contain multiple statements
    asRawStatements = false,
    localVars = Object.create(context.identifiers)
  ) {
    if (__BROWSER__) {
      return node
    }
  
    if (!context.prefixIdentifiers || !node.content.trim()) {
      return node
    }
  
    const { inline, bindingMetadata } = context
    const rewriteIdentifier = (raw, parent, id) => {
      const type = hasOwn(bindingMetadata, raw) && bindingMetadata[raw]
      if (inline) {
        // x = y
        const isAssignmentLVal =
          parent && parent.type === 'AssignmentExpression' && parent.left === id
        // x++
        const isUpdateArg =
          parent && parent.type === 'UpdateExpression' && parent.argument === id
        // ({ x } = y)
        const isDestructureAssignment =
          parent && isInDestructureAssignment(parent, parentStack)
  
        if (type === BindingTypes.SETUP_CONST || localVars[raw]) {
          return raw
        } else if (type === BindingTypes.SETUP_REF) {
          return `${raw}.value`
        } else if (type === BindingTypes.SETUP_MAYBE_REF) {
          // const binding that may or may not be ref
          // if it's not a ref, then assignments don't make sense -
          // so we ignore the non-ref assignment case and generate code
          // that assumes the value to be a ref for more efficiency
          return isAssignmentLVal || isUpdateArg || isDestructureAssignment
            ? `${raw}.value`
            : `${context.helperString(UNREF)}(${raw})`
        } else if (type === BindingTypes.SETUP_LET) {
          if (isAssignmentLVal) {
            // let binding.
            // this is a bit more tricky as we need to cover the case where
            // let is a local non-ref value, and we need to replicate the
            // right hand side value.
            // x = y --> isRef(x) ? x.value = y : x = y
            const { right: rVal, operator } = parent
            const rExp = rawExp.slice(rVal.start - 1, rVal.end - 1)
            const rExpString = stringifyExpression(
              processExpression(
                createSimpleExpression(rExp, false),
                context,
                false,
                false,
                knownIds
              )
            )
            return `${context.helperString(IS_REF)}(${raw})${``} ? ${raw}.value ${operator} ${rExpString} : ${raw}`
          } else if (isUpdateArg) {
            // make id replace parent in the code range so the raw update operator
            // is removed
            id.start = parent.start
            id.end = parent.end
            const { prefix: isPrefix, operator } = parent
            const prefix = isPrefix ? operator : ``
            const postfix = isPrefix ? `` : operator
            // let binding.
            // x++ --> isRef(a) ? a.value++ : a++
            return `${context.helperString(IS_REF)}(${raw})${``} ? ${prefix}${raw}.value${postfix} : ${prefix}${raw}${postfix}`
          } else if (isDestructureAssignment) {
            // TODO
            // let binding in a destructure assignment - it's very tricky to
            // handle both possible cases here without altering the original
            // structure of the code, so we just assume it's not a ref here
            // for now
            return raw
          } else {
            return `${context.helperString(UNREF)}(${raw})`
          }
        } else if (type === BindingTypes.PROPS) {
          // use __props which is generated by compileScript so in ts mode
          // it gets correct type
          return `__props.${raw}`
        } else if (type === BindingTypes.PROPS_ALIASED) {
          // prop with a different local alias (from defineProps() destructure)
          return `__props.${bindingMetadata.__propsAliases[raw]}`
        }
      } else {
        if (type && type.startsWith('setup')) {
          // setup bindings in non-inline mode
          return `$setup.${raw}`
        } else if (type === BindingTypes.PROPS_ALIASED) {
          return `$props.${bindingMetadata.__propsAliases[raw]}`
        } else if (type) {
          return `$${type}.${raw}`
        }
      }
  
      // fallback to ctx
      return `_ctx.${raw}`
    }
  
    // fast path if expression is a simple identifier.
    const rawExp = node.content
    // bail constant on parens (function invocation) and dot (member access)
    const bailConstant = rawExp.indexOf(`(`) > -1 || rawExp.indexOf('.') > 0
  
    logg(`processExpression - node.content: ${rawExp}`)
    if (isSimpleIdentifier(rawExp)) {
      const isScopeVarReference = context.identifiers[rawExp]
      const isAllowedGlobal = isGloballyWhitelisted(rawExp)
      const isLiteral = isLiteralWhitelisted(rawExp)
      if (!asParams && !isScopeVarReference && !isAllowedGlobal && !isLiteral) {
        // const bindings exposed from setup can be skipped for patching but
        // cannot be hoisted to module scope
        if (bindingMetadata[node.content] === BindingTypes.SETUP_CONST) {
          node.constType = ConstantTypes.CAN_SKIP_PATCH
        }
        node.content = rewriteIdentifier(rawExp)
      } else if (!isScopeVarReference) {
        if (isLiteral) {
          node.constType = ConstantTypes.CAN_STRINGIFY
        } else {
          node.constType = ConstantTypes.CAN_HOIST
        }
      }
      return node
    }
  
    let ast
    // exp needs to be parsed differently:
    // 1. Multiple inline statements (v-on, with presence of `;`): parse as raw
    //    exp, but make sure to pad with spaces for consistent ranges
    // 2. Expressions: wrap with parens (for e.g. object expressions)
    // 3. Function arguments (v-for, v-slot): place in a function argument position
    const source = asRawStatements
      ? ` ${rawExp} `
      : `(${rawExp})${asParams ? `=>{}` : ``}`
    try {
      ast = babelParser.parse(source, {
        plugins: context.expressionPlugins
      }).program
    } catch (e) {
      return node
    }
  
    logg(`processExpression - babel parse`, ast)
    const ids = []
    const parentStack = []
    const knownIds = Object.create(context.identifiers)
  
    walkIdentifiers(
      ast,
      (node, parent, _, isReferenced, isLocal) => {
        if (isStaticPropertyKey(node, parent)) {
          return
        }
  
        const needPrefix = isReferenced && canPrefix(node)
        if (needPrefix && !isLocal) {
          if (isStaticProperty(parent) && parent.shorthand) {
            // property shorthand like { foo }, we need to add the key since
            // we rewrite the value
            node.prefix = `${node.name}: `
          }
          node.name = rewriteIdentifier(node.name, parent, node)
          ids.push(node)
        } else {
          // The identifier is considered constant unless it's pointing to a
          // local scope variable (a v-for alias, or a v-slot prop)
          if (!(needPrefix && isLocal) && !bailConstant) {
            node.isConstant = true
          }
          // also generate sub-expressions for other identifiers for better
          // source map support. (except for property keys which are static)
          ids.push(node)
        }
      },
      true, // invoke on ALL identifiers
      parentStack,
      knownIds
    )
  
    // We break up the compound expression into an array of strings and sub
    // expressions (for identifiers that have been prefixed). In codegen, if
    // an ExpressionNode has the `.children` property, it will be used instead of
    // `.content`.
    const children = []
    ids.sort((a, b) => a.start - b.start)
    ids.forEach((id, i) => {
      // range is offset by -1 due to the wrapping parens when parsed
      const start = id.start - 1
      const end = id.end - 1
      const last = ids[i - 1]
      const leadingText = rawExp.slice(last ? last.end - 1 : 0, start)
      if (leadingText.length || id.prefix) {
        children.push(leadingText + (id.prefix || ``))
      }
      const source = rawExp.slice(start, end)
      children.push(
        createSimpleExpression(
          id.name,
          false,
          {
            source,
            start: advancePositionWithClone(node.loc.start, source, start),
            end: advancePositionWithClone(node.loc.start, source, end)
          },
          id.isConstant ? ConstantTypes.CAN_STRINGIFY : ConstantTypes.NOT_CONSTANT
        )
      )
      if (i === ids.length - 1 && end < rawExp.length) {
        children.push(rawExp.slice(end))
      }
    })
  
    let ret
    if (children.length) {
      ret = createCompoundExpression(children, node.loc)
    } else {
      ret = node
      ret.constType = bailConstant
        ? ConstantTypes.NOT_CONSTANT
        : ConstantTypes.CAN_STRINGIFY
    }
    ret.identifiers = Object.keys(knownIds)
    return ret
  }
  
  function canPrefix(id) {
    // skip whitelisted globals
    if (isGloballyWhitelisted(id.name)) {
      return false
    }
    // special case for webpack compilation
    if (id.name === 'require') {
      return false
    }
    return true
  }
  
  function stringifyExpression(exp) {
    if (isString(exp)) {
      return exp
    } else if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
      return exp.content
    } else {
      return (exp.children)
        .map(stringifyExpression)
        .join('')
    }
  }
  
  const transformSlotOutlet = (node, context) => {
    if (isSlotOutlet(node)) { // <slot/>
      const { children, loc } = node
      const { slotName, slotProps } = processSlotOutlet(node, context)
  
      const slotArgs = [
        context.prefixIdentifiers ? `_ctx.$slots` : `$slots`,
        slotName,
        '{}', //  props
        'undefined', // children
        'true'
      ]
      let expectedLen = 2
  
      if (slotProps) {
        slotArgs[2] = slotProps
        expectedLen = 3
      }
  
      if (children.length) {
        slotArgs[3] = createFunctionExpression([], children, false, false, loc)
        expectedLen = 4
      }
  
      if (context.scopeId && !context.slotted) {
        expectedLen = 5
      }
      slotArgs.splice(expectedLen) // remove unused arguments
  
      // -> renderSlot($slots, slotName, props, children, true)
      node.codegenNode = createCallExpression(
        context.helper(RENDER_SLOT), // renderSlot
        slotArgs,
        loc
      )
    }
  }
  
  function processSlotOutlet(
    node,
    context
  ) {
    let slotName = `"default"`
    let slotProps = undefined
  
    const nonNameProps = [] // 无名插槽
    logg(`processSlotOutlet| props.length = ${node.props.length}`)
    for (let i = 0; i < node.props.length; i++) {
      const p = node.props[i]
      logg(`processSlotOutlet| props[${i}]`, p)
      if (p.type === NodeTypes.ATTRIBUTE) { // 静态 <slot name="xxx"/>
        if (p.value) {
          if (p.name === 'name') {
            slotName = JSON.stringify(p.value.content)
          } else {
            p.name = camelize(p.name)
            nonNameProps.push(p)
          }
        }
      } else { // 动态 <slot :name="xxx"/>
        // 动态插槽 <slot v-bind:name="slotName"/>
        if (p.name === 'bind' && isStaticArgOf(p.arg, 'name')) {
          if (p.exp) slotName = p.exp
        } else {
          if (p.name === 'bind' && p.arg && isStaticExp(p.arg)) {
            p.arg.content = camelize(p.arg.content)
          }
          nonNameProps.push(p)
        }
      }
    }
  
    logg(`processSlotOutlet| nonNameProps.length=${nonNameProps.length}`)
    if (nonNameProps.length > 0) {
      const { props, directives } = buildProps(node, context, nonNameProps)
      slotProps = props
  
      if (directives.length) {
        logg('[ERROR] X_V_SLOT_UNEXPECTED_DIRECTIVE_ON_SLOT_OUTLET')
      }
    }
  
    return {
      slotName,
      slotProps
    }
  }
  // Merge adjacent text nodes and expressions into a single expression
  // e.g. <div>abc {{ d }} {{ e }}</div> should have a single expression node as child.
  const transformText = (node, context) => {
    if (
      node.type === NodeTypes.ROOT ||
      node.type === NodeTypes.ELEMENT ||
      node.type === NodeTypes.FOR ||
      node.type === NodeTypes.IF_BRANCH
    ) {
      // perform the transform on node exit so that all expressions have already
      // been processed.
      return () => {
        const children = node.children
        let currentContainer = undefined
        let hasText = false
  
        for (let i = 0; i < children.length; i++) {
          const child = children[i]
          if (isText(child)) {
            hasText = true
            for (let j = i + 1; j < children.length; j++) {
              const next = children[j]
              if (isText(next)) {
                if (!currentContainer) {
                  currentContainer = children[i] = {
                    type: NodeTypes.COMPOUND_EXPRESSION,
                    loc: child.loc,
                    children: [child]
                  }
                }
                // merge adjacent text node into current
                currentContainer.children.push(` + `, next)
                children.splice(j, 1)
                j--
              } else {
                currentContainer = undefined
                break
              }
            }
          }
        }
  
        if (
          !hasText ||
          // if this is a plain element with a single text child, leave it
          // as-is since the runtime has dedicated fast path for this by directly
          // setting textContent of the element.
          // for component root it's always normalized anyway.
          (children.length === 1 &&
            (node.type === NodeTypes.ROOT ||
              (node.type === NodeTypes.ELEMENT &&
                node.tagType === ElementTypes.ELEMENT &&
                // #3756
                // custom directives can potentially add DOM elements arbitrarily,
                // we need to avoid setting textContent of the element at runtime
                // to avoid accidentally overwriting the DOM elements added
                // by the user through custom directives.
                !node.props.find(
                  p =>
                    p.type === NodeTypes.DIRECTIVE &&
                    !context.directiveTransforms[p.name]
                ))))
        ) {
          return
        }
  
        // pre-convert text nodes into createTextVNode(text) calls to avoid
        // runtime normalization.
        for (let i = 0; i < children.length; i++) {
          const child = children[i]
          if (isText(child) || child.type === NodeTypes.COMPOUND_EXPRESSION) {
            const callArgs = []
            // createTextVNode defaults to single whitespace, so if it is a
            // single space the code could be an empty call to save bytes.
            if (child.type !== NodeTypes.TEXT || child.content !== ' ') {
              callArgs.push(child)
            }
            // mark dynamic text with flag so it gets patched inside a block
            if (
              !context.ssr &&
              getConstantType(child, context) === ConstantTypes.NOT_CONSTANT
            ) {
              callArgs.push(
                PatchFlags.TEXT +
                  (__DEV__ ? ` /* ${PatchFlagNames[PatchFlags.TEXT]} */` : ``)
              )
            }
            children[i] = {
              type: NodeTypes.TEXT_CALL,
              content: child,
              loc: child.loc,
              codegenNode: createCallExpression(
                context.helper(CREATE_TEXT),
                callArgs
              )
            }
          }
        }
      }
    }
  }
  // v-bind without arg is handled directly in ./transformElements.ts due to it affecting
  // codegen for the entire props object. This transform here is only for v-bind
  // *with* args.
  const transformBind = (dir, _node, context) => {
    const { exp, modifiers, loc } = dir
    const arg = dir.arg
  
    if (arg.type !== NodeTypes.SIMPLE_EXPRESSION) {
      arg.children.unshift(`(`)
      arg.children.push(`) || ""`)
    } else if (!arg.isStatic) {
      arg.content = `${arg.content} || ""`
    }
  
    // .sync is replaced by v-model:arg
    if (modifiers.includes('camel')) {
      if (arg.type === NodeTypes.SIMPLE_EXPRESSION) {
        if (arg.isStatic) {
          arg.content = camelize(arg.content)
        } else {
          arg.content = `${context.helperString(CAMELIZE)}(${arg.content})`
        }
      } else {
        arg.children.unshift(`${context.helperString(CAMELIZE)}(`)
        arg.children.push(`)`)
      }
    }
  
    if (!context.inSSR) {
      if (modifiers.includes('prop')) {
        injectPrefix(arg, '.')
      }
      if (modifiers.includes('attr')) {
        injectPrefix(arg, '^')
      }
    }
  
    if (
      !exp ||
      (exp.type === NodeTypes.SIMPLE_EXPRESSION && !exp.content.trim())
    ) {
      logg(`transformBind v-bind no expression`)
      return {
        props: [createObjectProperty(arg, createSimpleExpression('', true, loc))]
      }
    }
  
    return {
      props: [createObjectProperty(arg, exp)]
    }
  }
  
  const injectPrefix = (arg, prefix) => {
    if (arg.type === NodeTypes.SIMPLE_EXPRESSION) {
      if (arg.isStatic) {
        arg.content = prefix + arg.content
      } else {
        arg.content = `\`${prefix}\${${arg.content}}\``
      }
    } else {
      arg.children.unshift(`'${prefix}' + (`)
      arg.children.push(`)`)
    }
  }
  
  const transformFor = createStructuralDirectiveTransform(
    'for',
    (node, dir, context) => {
      const { helper, removeHelper } = context
      return processFor(node, dir, context, forNode => {
        // create the loop render function expression now, and add the
        // iterator on exit after all children have been traversed
        const renderExp = createCallExpression(helper(RENDER_LIST), [
          forNode.source
        ])
        const isTemplate = isTemplateNode(node)
        const memo = findDir(node, 'memo')
        const keyProp = findProp(node, `key`)
        const keyExp =
          keyProp &&
          (keyProp.type === NodeTypes.ATTRIBUTE
            ? createSimpleExpression(keyProp.value.content, true)
            : keyProp.exp)
        const keyProperty = keyProp ? createObjectProperty(`key`, keyExp) : null
  
        if (!__BROWSER__ && isTemplate) {
          // #2085 / #5288 process :key and v-memo expressions need to be
          // processed on `<template v-for>`. In this case the node is discarded
          // and never traversed so its binding expressions won't be processed
          // by the normal transforms.
          if (memo) {
            memo.exp = processExpression(
              memo.exp ,
              context
            )
          }
          if (keyProperty && keyProp.type !== NodeTypes.ATTRIBUTE) {
            keyProperty.value = processExpression(
              keyProperty.value ,
              context
            )
          }
        }
  
        const isStableFragment =
          forNode.source.type === NodeTypes.SIMPLE_EXPRESSION &&
          forNode.source.constType > ConstantTypes.NOT_CONSTANT
        const fragmentFlag = isStableFragment
          ? PatchFlags.STABLE_FRAGMENT
          : keyProp
          ? PatchFlags.KEYED_FRAGMENT
          : PatchFlags.UNKEYED_FRAGMENT
  
        forNode.codegenNode = createVNodeCall(
          context,
          helper(FRAGMENT),
          undefined,
          renderExp,
          fragmentFlag +
            (__DEV__ ? ` /* ${PatchFlagNames[fragmentFlag]} */` : ``),
          undefined,
          undefined,
          true /* isBlock */,
          !isStableFragment /* disableTracking */,
          false /* isComponent */,
          node.loc
        )
  
        return () => {
          // finish the codegen now that all children have been traversed
          let childBlock
          const { children } = forNode
  
          // check <template v-for> key placement
          if ((__DEV__ || !__BROWSER__) && isTemplate) {
            node.children.some(c => {
              if (c.type === NodeTypes.ELEMENT) {
                const key = findProp(c, 'key')
                if (key) {
                  logg(`transformFor - key on template`)
                  return true
                }
              }
            })
          }
  
          const needFragmentWrapper =
            children.length !== 1 || children[0].type !== NodeTypes.ELEMENT
          const slotOutlet = isSlotOutlet(node)
            ? node
            : isTemplate &&
              node.children.length === 1 &&
              isSlotOutlet(node.children[0])
            ? node.children[0] // api-extractor somehow fails to infer this
            : null
  
          if (slotOutlet) {
            // <slot v-for="..."> or <template v-for="..."><slot/></template>
            childBlock = slotOutlet.codegenNode
            if (isTemplate && keyProperty) {
              // <template v-for="..." :key="..."><slot/></template>
              // we need to inject the key to the renderSlot() call.
              // the props for renderSlot is passed as the 3rd argument.
              injectProp(childBlock, keyProperty, context)
            }
          } else if (needFragmentWrapper) {
            // <template v-for="..."> with text or multi-elements
            // should generate a fragment block for each loop
            childBlock = createVNodeCall(
              context,
              helper(FRAGMENT),
              keyProperty ? createObjectExpression([keyProperty]) : undefined,
              node.children,
              PatchFlags.STABLE_FRAGMENT +
                (__DEV__
                  ? ` /* ${PatchFlagNames[PatchFlags.STABLE_FRAGMENT]} */`
                  : ``),
              undefined,
              undefined,
              true,
              undefined,
              false /* isComponent */
            )
          } else {
            // Normal element v-for. Directly use the child's codegenNode
            // but mark it as a block.
            childBlock = children[0].codegenNode
            if (isTemplate && keyProperty) {
              injectProp(childBlock, keyProperty, context)
            }
            if (childBlock.isBlock !== !isStableFragment) {
              if (childBlock.isBlock) {
                // switch from block to vnode
                removeHelper(OPEN_BLOCK)
                removeHelper(
                  getVNodeBlockHelper(context.inSSR, childBlock.isComponent)
                )
              } else {
                // switch from vnode to block
                removeHelper(
                  getVNodeHelper(context.inSSR, childBlock.isComponent)
                )
              }
            }
            childBlock.isBlock = !isStableFragment
            if (childBlock.isBlock) {
              helper(OPEN_BLOCK)
              helper(getVNodeBlockHelper(context.inSSR, childBlock.isComponent))
            } else {
              helper(getVNodeHelper(context.inSSR, childBlock.isComponent))
            }
          }
  
          if (memo) {
            const loop = createFunctionExpression(
              createForLoopParams(forNode.parseResult, [
                createSimpleExpression(`_cached`)
              ])
            )
            loop.body = createBlockStatement([
              createCompoundExpression([`const _memo = (`, memo.exp, `)`]),
              createCompoundExpression([
                `if (_cached`,
                ...(keyExp ? [` && _cached.key === `, keyExp] : []),
                ` && ${context.helperString(
                  IS_MEMO_SAME
                )}(_cached, _memo)) return _cached`
              ]),
              createCompoundExpression([`const _item = `, childBlock]),
              createSimpleExpression(`_item.memo = _memo`),
              createSimpleExpression(`return _item`)
            ])
            renderExp.arguments.push(
              loop,
              createSimpleExpression(`_cache`),
              createSimpleExpression(String(context.cached++))
            )
          } else {
            renderExp.arguments.push(
              createFunctionExpression(
                createForLoopParams(forNode.parseResult),
                childBlock,
                true /* force newline */
              )
            )
          }
        }
      })
    }
  )
  
  // target-agnostic transform used for both Client and SSR
  function processFor(
    node,
    dir,
    context,
    processCodegen
  ) {
    if (!dir.exp) {
      logg(`processFor - dir.exp is null`)
      return
    }
  
    const parseResult = parseForExpression(
      // can only be simple expression because vFor transform is applied
      // before expression transform.
      dir.exp,
      context
    )
  
    if (!parseResult) {
      logg(`processFor - parseResult is null`)
      return
    }
  
    const { addIdentifiers, removeIdentifiers, scopes } = context
    const { source, value, key, index } = parseResult
  
    const forNode = {
      type: NodeTypes.FOR,
      loc: dir.loc,
      source,
      valueAlias: value,
      keyAlias: key,
      objectIndexAlias: index,
      parseResult,
      children: isTemplateNode(node) ? node.children : [node]
    }
  
    context.replaceNode(forNode)
  
    // bookkeeping
    scopes.vFor++
    if (!__BROWSER__ && context.prefixIdentifiers) {
      // scope management
      // inject identifiers to context
      value && addIdentifiers(value)
      key && addIdentifiers(key)
      index && addIdentifiers(index)
    }
  
    const onExit = processCodegen && processCodegen(forNode)
  
    return () => {
      scopes.vFor--
      if (!__BROWSER__ && context.prefixIdentifiers) {
        value && removeIdentifiers(value)
        key && removeIdentifiers(key)
        index && removeIdentifiers(index)
      }
      if (onExit) onExit()
    }
  }
  
  const forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/
  // This regex doesn't cover the case if key or index aliases have destructuring,
  // but those do not make sense in the first place, so this works in practice.
  const forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/
  const stripParensRE = /^\(|\)$/g
  
  function parseForExpression(
    input,
    context
  ) {
    const loc = input.loc
    const exp = input.content
    const inMatch = exp.match(forAliasRE)
    if (!inMatch) return
  
    const [, LHS, RHS] = inMatch
  
    const result = {
      source: createAliasExpression(
        loc,
        RHS.trim(),
        exp.indexOf(RHS, LHS.length)
      ),
      value: undefined,
      key: undefined,
      index: undefined
    }
    if (!__BROWSER__ && context.prefixIdentifiers) {
      result.source = processExpression(
        result.source,
        context
      )
    }
  
    let valueContent = LHS.trim().replace(stripParensRE, '').trim()
    const trimmedOffset = LHS.indexOf(valueContent)
  
    const iteratorMatch = valueContent.match(forIteratorRE)
    if (iteratorMatch) {
      valueContent = valueContent.replace(forIteratorRE, '').trim()
  
      const keyContent = iteratorMatch[1].trim()
      let keyOffset
      if (keyContent) {
        keyOffset = exp.indexOf(keyContent, trimmedOffset + valueContent.length)
        result.key = createAliasExpression(loc, keyContent, keyOffset)
        if (!__BROWSER__ && context.prefixIdentifiers) {
          result.key = processExpression(result.key, context, true)
        }
      }
  
      if (iteratorMatch[2]) {
        const indexContent = iteratorMatch[2].trim()
  
        if (indexContent) {
          result.index = createAliasExpression(
            loc,
            indexContent,
            exp.indexOf(
              indexContent,
              result.key
                ? keyOffset + keyContent.length
                : trimmedOffset + valueContent.length
            )
          )
          if (!__BROWSER__ && context.prefixIdentifiers) {
            result.index = processExpression(result.index, context, true)
          }
        }
      }
    }
  
    if (valueContent) {
      result.value = createAliasExpression(loc, valueContent, trimmedOffset)
      if (!__BROWSER__ && context.prefixIdentifiers) {
        result.value = processExpression(result.value, context, true)
      }
    }
  
    return result
  }
  
  function createAliasExpression(
    range,
    content,
    offset
  ) {
    return createSimpleExpression(
      content,
      false,
      getInnerRange(range, offset, content.length)
    )
  }
  
  function createForLoopParams(
    { value, key, index },
    memoArgs = []
  ) {
    return createParamsList([value, key, index, ...memoArgs])
  }
  
  function createParamsList(args) {
    let i = args.length
    while (i--) {
      if (args[i]) break
    }
    return args
      .slice(0, i + 1)
      .map((arg, i) => arg || createSimpleExpression(`_`.repeat(i + 1), false))
  }
  function processIf(node, dir, context, processCodegen) {
    logg('processIf - node - dir', node, dir)
    if (
      dir.name !== 'else' &&
      (!dir.exp || !dir.exp.content.trim())
    ) {
      const loc = dir.exp ? dir.exp.loc : node.loc
      // <div v-if></div> 没有指令值的情况，默认值为 true
      dir.exp = createSimpleExpression(`true`, false, loc)
    }
  
    if (!__BROWSER__ && context.prefixIdentifiers && dir.exp) {
      // dir.exp can only be simple expression because vIf transform is applied
      // before expression transform.
      dir.exp = processExpression(dir.exp, context)
    }
  
    if (dir.name === 'if') { // v-if
      const branch = createIfBranch(node, dir)
      const ifNode = {
        type: NodeTypes.IF,
        loc: node.loc,
        branches: [branch]
      }
      context.replaceNode(ifNode)
      if (processCodegen) {
        return processCodegen(ifNode, branch, true)
      }
    } else {
      // locate the adjacent v-if
      const siblings = context.parent.children
      const comments = []
      let i = siblings.indexOf(node)
      while (i-- >= -1) {
        const sibling = siblings[i]
  
        // 空行，空文本
        if (
          sibling &&
          sibling.type === NodeTypes.TEXT &&
          !sibling.content.trim().length
        ) {
          context.removeNode(sibling)
          continue
        }
  
        if (sibling && sibling.type === NodeTypes.IF) {
          // 这里会将原本的结点删除，而是用新组装的 if 结构(包含else-if, else 分支的结构，node.branches[...])
          context.removeNode()
          const branch = createIfBranch(node, dir)
          sibling.branches.push(branch)
  
          const onExit = processCodegen && processCodegen(sibling, branch, false)
          // 这里需要手动触发一次遍历，因为上面将原本的分支节点从原来的节点树中删除了
          traverseNode(branch, context)
          // 回溯结束后执行收集到的 transformXxx 函数
          if (onExit) onExit()
          // make sure to reset currentNode after traversal to indicate this
          // node has been removed.
          context.currentNode = null
        }
        break
      }
    }
  }
  function createIfBranch(node, dir) {
    return {
      type: NodeTypes.IF_BRANCH,
      loc: node.loc,
      condition: dir.name === 'else' ? undefined : dir.exp,
      children:
        node.tagType === ElementTypes.TEMPLATE && !findDir(node, 'for')
          ? node.children
          : [node],
      userKey: findProp(node, `key`)
    }
  }
  function createCodegenNodeForBranch(branch, keyIndex, context) {
    if (branch.condition) {
      return createConditionalExpression(
        branch.condition,
        createChildrenCodegenNode(branch, keyIndex, context),
        // 这里是考虑到只有 v-if 的情况，因为 v-if 指令最后都会被解析成三目运算符形式
        // 如： <div v-if="foo"/><div v-else/> => foo ? ... : ...
        // 如： <div v-if="foo"/><div v-else-if="bar"/><div v-else/> => foo ? ... : bar ? ... : ...
        // 所以必需得要有一个 v-else，如果没有的话就相当于是 `foo ? ...` 这样的语句是不合法的
        // 因此这里在判断没有 v-else 分支的情况时默认给它创建了个注释节点
        createCallExpression(context.helper(CREATE_COMMENT), [
          __DEV__ ? '"v-if"' : '""',
          'true'
        ])
      )
    } else {
      return createChildrenCodegenNode(branch, keyIndex, context)
    }
  }
  function createChildrenCodegenNode(branch, keyIndex, context) {
    const { helper } = context
    const keyProperty = createObjectProperty(
      `key`,
      createSimpleExpression(
        `${keyIndex}`,
        false,
        locStub,
        ConstantTypes.CAN_HOIST
      )
    )
    const { children } = branch
    const firstChild = children[0]
    const needFragmentWrapper =
      children.length !== 1 || firstChild.type !== NodeTypes.ELEMENT
    if (needFragmentWrapper) {
      if (children.length === 1 && firstChild.type === NodeTypes.FOR) {
        // optimize away nested fragments when child is a ForNode
        const vnodeCall = firstChild.codegenNode
        injectProp(vnodeCall, keyProperty, context)
        return vnodeCall
      } else {
        let patchFlag = PatchFlags.STABLE_FRAGMENT
        let patchFlagText = PatchFlagNames[PatchFlags.STABLE_FRAGMENT]
  
        return createVNodeCall(
          context,
          helper(FRAGMENT),
          createObjectExpression([keyProperty]),
          children,
          patchFlag + (__DEV__ ? ` /* ${patchFlagText} */` : ``),
          undefined,
          undefined,
          true,
          false,
          false /* isComponent */,
          branch.loc
        )
      }
    } else {
      const ret = firstChild.codegenNode
      const vnodeCall = getMemoedVNodeCall(ret)
      // Change createVNode to createBlock.
      if (vnodeCall.type === NodeTypes.VNODE_CALL) {
        makeBlock(vnodeCall, context)
      }
      // inject branch key
      injectProp(vnodeCall, keyProperty, context)
      return ret
    }
  }
  function isSameKey(a, b) {
    if (!a || a.type !== b.type) {
      return false
    }
    if (a.type === NodeTypes.ATTRIBUTE) {
      if (a.value.content !== b.value.content) {
        return false
      }
    } else {
      // directive
      const exp = a.exp
      const branchExp = b.exp
      if (exp.type !== branchExp.type) {
        return false
      }
      if (
        exp.type !== NodeTypes.SIMPLE_EXPRESSION ||
        exp.isStatic !== branchExp.isStatic ||
        exp.content !== branchExp.content
      ) {
        return false
      }
    }
    return true
  }
  function getParentCondition(node) {
    while (true) {
      if (node.type === NodeTypes.JS_CONDITIONAL_EXPRESSION) {
        if (node.alternate.type === NodeTypes.JS_CONDITIONAL_EXPRESSION) {
          node = node.alternate
        } else {
          return node
        }
      } else if (node.type === NodeTypes.JS_CACHE_EXPRESSION) {
        node = node.value
      }
    }
  }
  
  
  const transformIf = createStructuralDirectiveTransform(
    /^(if|else|else-if)$/,
    (node, dir, context) => {
      return processIf(node, dir, context, (ifNode, branch, isRoot) => {
        const siblings = context.parent.children
        // if...else if...else 都处于同级渲染
        let i = siblings.indexOf(ifNode)
        let key = 0
        while (i-- >= 0) {
          const sibling = siblings[i]
          if (sibling && sibling.type === NodeTypes.IF) {
            key += sibling.branches.length
          }
        }
  
        logg('transformIf', ifNode, { isRoot, branch })
        // 退出时的回调，当所有 children 被遍历转换完成时被调用生成 codegenNode
        return () => {
          if (isRoot) { // v-if
            ifNode.codegenNode = createCodegenNodeForBranch(
              branch, key, context
            )
            logg('transformIf - isRoot - v-if', ifNode)
          } else { // v-else, v-else-if
            // 将 v-else-* 分枝挂到 v-if 节点下面
            const parentCondition = getParentCondition(ifNode.codegenNode)
            parentCondition.alternate = createCodegenNodeForBranch(
              branch, key + ifNode.branches.length - 1,
              context
            )
            logg('transformIf - v-else-*', ifNode)
          }
        }
  
      })
    }
  )
  const memoSeen = new WeakSet()
  
  const transformMemo = (node, context) => {
    if (node.type === NodeTypes.ELEMENT) {
      const dir = findDir(node, 'memo')
      if (!dir || memoSeen.has(node)) {
        return
      }
      memoSeen.add(node)
      return () => {
        const codegenNode = node.codegenNode || context.currentNode.codegenNode
        if (codegenNode && codegenNode.type === NodeTypes.VNODE_CALL) {
          // non-component sub tree should be turned into a block
          if (node.tagType !== ElementTypes.COMPONENT) {
            makeBlock(codegenNode, context)
          }
          node.codegenNode = createCallExpression(context.helper(WITH_MEMO), [
            dir.exp,
            createFunctionExpression(undefined, codegenNode),
            `_cache`,
            String(context.cached++)
          ])
        }
      }
    }
  }
  const transformModel = (dir, node, context) => {
    const { exp, arg } = dir
    if (!exp) {
      logg(`transformModel no exp`)
      return createTransformProps()
    }
  
    const rawExp = exp.loc.source
    const expString =
      exp.type === NodeTypes.SIMPLE_EXPRESSION ? exp.content : rawExp
  
    // im SFC <script setup> inline mode, the exp may have been transformed into
    // _unref(exp)
    const bindingType = context.bindingMetadata[rawExp]
    const maybeRef =
      !__BROWSER__ &&
      context.inline &&
      bindingType &&
      bindingType !== BindingTypes.SETUP_CONST
  
    if (
      !expString.trim() ||
      (!isMemberExpression(expString, context) && !maybeRef)
    ) {
      return createTransformProps()
    }
  
    if (
      !__BROWSER__ &&
      context.prefixIdentifiers &&
      isSimpleIdentifier(expString) &&
      context.identifiers[expString]
    ) {
      return createTransformProps()
    }
  
    const propName = arg ? arg : createSimpleExpression('modelValue', true)
    const eventName = arg
      ? isStaticExp(arg)
        ? `onUpdate:${arg.content}`
        : createCompoundExpression(['"onUpdate:" + ', arg])
      : `onUpdate:modelValue`
  
    let assignmentExp
    const eventArg = context.isTS ? `($event: any)` : `$event`
    if (maybeRef) {
      if (bindingType === BindingTypes.SETUP_REF) {
        // v-model used on known ref.
        assignmentExp = createCompoundExpression([
          `${eventArg} => ((`,
          createSimpleExpression(rawExp, false, exp.loc),
          `).value = $event)`
        ])
      } else {
        // v-model used on a potentially ref binding in <script setup> inline mode.
        // the assignment needs to check whether the binding is actually a ref.
        const altAssignment =
          bindingType === BindingTypes.SETUP_LET ? `${rawExp} = $event` : `null`
        assignmentExp = createCompoundExpression([
          `${eventArg} => (${context.helperString(IS_REF)}(${rawExp}) ? (`,
          createSimpleExpression(rawExp, false, exp.loc),
          `).value = $event : ${altAssignment})`
        ])
      }
    } else {
      assignmentExp = createCompoundExpression([
        `${eventArg} => ((`,
        exp,
        `) = $event)`
      ])
    }
  
    const props = [
      // modelValue: foo
      createObjectProperty(propName, dir.exp),
      // "onUpdate:modelValue": $event => (foo = $event)
      createObjectProperty(eventName, assignmentExp)
    ]
  
    // cache v-model handler if applicable (when it doesn't refer any scope vars)
    if (
      !__BROWSER__ &&
      context.prefixIdentifiers &&
      !context.inVOnce &&
      context.cacheHandlers &&
      !hasScopeRef(exp, context.identifiers)
    ) {
      props[1].value = context.cache(props[1].value)
    }
  
    // modelModifiers: { foo: true, "bar-baz": true }
    if (dir.modifiers.length && node.tagType === ElementTypes.COMPONENT) {
      const modifiers = dir.modifiers
        .map(m => (isSimpleIdentifier(m) ? m : JSON.stringify(m)) + `: true`)
        .join(`, `)
      const modifiersKey = arg
        ? isStaticExp(arg)
          ? `${arg.content}Modifiers`
          : createCompoundExpression([arg, ' + "Modifiers"'])
        : `modelModifiers`
      props.push(
        createObjectProperty(
          modifiersKey,
          createSimpleExpression(
            `{ ${modifiers} }`,
            false,
            dir.loc,
            ConstantTypes.CAN_HOIST
          )
        )
      )
    }
  
    return createTransformProps(props)
  }
  
  function createTransformProps(props = []) {
    return { props }
  }
  // 函数表达式正则, @click="fnExp"
  const fnExpRE =
    /^\s*([\w$_]+|(async\s*)?\([^)]*?\))\s*=>|^\s*(async\s+)?function(?:\s+[\w$]+)?\s*\(/
  
  const transformOn = (
    dir,
    node,
    context,
    augmentor
  ) => {
    const { loc, modifiers, arg } = dir
  
    let eventName
    if (arg.type === NodeTypes.SIMPLE_EXPRESSION) {
      if (arg.isStatic) {
        let rawName = arg.content
  
        // 将事件名转成驼峰式
        eventName = createSimpleExpression(
          toHandlerKey(camelize(rawName)),
          true,
          arg.loc
        )
      } else {
        // #2388 toHandlerKey 将事件名转成 onXxx, 如：eventName -> onEventName
        eventName = createCompoundExpression([
          `${context.helperString(TO_HANDLER_KEY)}(`,
          arg,
          `)`
        ])
      }
    } else {
      // already a compound expression.
  
      eventName = arg
      eventName.children.unshift(`${context.helperString(TO_HANDLER_KEY)}(`)
      eventName.children.push(`)`)
    }
  
    // handler processing, 事件表达式内容
    let exp = dir.exp
    if (exp && !exp.content.trim()) {
      exp = undefined
    }
    // 事件处理函数缓存
    let shouldCache = context.cacheHandlers && !exp && !context.inVOnce
    if (exp) {
      const isMemberExp = isMemberExpression(exp.content, context)
      const isInlineStatement = !(isMemberExp || fnExpRE.test(exp.content))
      const hasMultipleStatements = exp.content.includes(`;`)
  
      // process the expression since it's been skipped
      if (!__BROWSER__ && context.prefixIdentifiers) {
        isInlineStatement && context.addIdentifiers(`$event`)
        exp = dir.exp = processExpression(
          exp,
          context,
          false,
          hasMultipleStatements
        )
        isInlineStatement && context.removeIdentifiers(`$event`)
        // with scope analysis, the function is hoistable if it has no reference
        // to scope variables.
        shouldCache =
          context.cacheHandlers &&
          // unnecessary to cache inside v-once
          !context.inVOnce &&
          // runtime constants don't need to be cached
          // (this is analyzed by compileScript in SFC <script setup>)
          !(exp.type === NodeTypes.SIMPLE_EXPRESSION && exp.constType > 0) &&
          // #1541 bail if this is a member exp handler passed to a component -
          // we need to use the original function to preserve arity,
          // e.g. <transition> relies on checking cb.length to determine
          // transition end handling. Inline function is ok since its arity
          // is preserved even when cached.
          !(isMemberExp && node.tagType === ElementTypes.COMPONENT) &&
          // bail if the function references closure variables (v-for, v-slot)
          // it must be passed fresh to avoid stale values.
          !hasScopeRef(exp, context.identifiers)
        // If the expression is optimizable and is a member expression pointing
        // to a function, turn it into invocation (and wrap in an arrow function
        // below) so that it always accesses the latest value when called - thus
        // avoiding the need to be patched.
        if (shouldCache && isMemberExp) {
          if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
            exp.content = `${exp.content} && ${exp.content}(...args)`
          } else {
            exp.children = [...exp.children, ` && `, ...exp.children, `(...args)`]
          }
        }
      }
  
      if (isInlineStatement || (shouldCache && isMemberExp)) {
        // wrap inline statement in a function expression
        // ($event) => statement
        // (...args) => { statement1;statement2 }
        exp = createCompoundExpression([
          `${
            isInlineStatement
              ? `$event`
              : `(...args)`
          } => ${hasMultipleStatements ? `{` : `(`}`,
          exp,
          hasMultipleStatements ? `}` : `)`
        ])
      }
    }
  
    let ret = {
      props: [
        createObjectProperty(
          eventName,
          exp || createSimpleExpression(`() => {}`, false, loc)
        )
      ]
    }
  
    // apply extended compiler augmentor
    if (augmentor) {
      ret = augmentor(ret)
    }
  
    if (shouldCache) {
      // cache handlers so that it's always the same handler being passed down.
      // this avoids unnecessary re-renders when users use inline handlers on
      // components.
      ret.props[0].value = context.cache(ret.props[0].value)
    }
  
    // mark the key as handler for props normalization check
    ret.props.forEach(p => (p.key.isHandlerKey = true))
    return ret
  }
  const seen = new WeakSet()
  
  const transformOnce = (node, context) => {
    if (node.type === NodeTypes.ELEMENT && findDir(node, 'once', true)) {
      if (seen.has(node) || context.inVOnce) {
        logg(`transformOnce node has seen`)
        return
      }
      seen.add(node)
      context.inVOnce = true
      context.helper(SET_BLOCK_TRACKING)
      return () => {
        context.inVOnce = false
        const cur = context.currentNode
        if (cur.codegenNode) {
          cur.codegenNode = context.cache(cur.codegenNode, true /* isVNode */)
        }
      }
    }
  }
  // Important: since this function uses Node.js only dependencies, it should
  // always be used with a leading !__BROWSER__ check so that it can be
  // tree-shaken from the browser build.
  function processExpression(
    node,
    context,
    // some expressions like v-slot props & v-for aliases should be parsed as
    // function params
    asParams = false,
    // v-on handler values may contain multiple statements
    asRawStatements = false,
    localVars = Object.create(context.identifiers)
  ) {
    if (__BROWSER__) {
      return node
    }
  
    if (!context.prefixIdentifiers || !node.content.trim()) {
      return node
    }
  
    const { inline, bindingMetadata } = context
    const rewriteIdentifier = (raw, parent, id) => {
      const type = hasOwn(bindingMetadata, raw) && bindingMetadata[raw]
      if (inline) {
        // x = y
        const isAssignmentLVal =
          parent && parent.type === 'AssignmentExpression' && parent.left === id
        // x++
        const isUpdateArg =
          parent && parent.type === 'UpdateExpression' && parent.argument === id
        // ({ x } = y)
        const isDestructureAssignment =
          parent && isInDestructureAssignment(parent, parentStack)
  
        if (type === BindingTypes.SETUP_CONST || localVars[raw]) {
          return raw
        } else if (type === BindingTypes.SETUP_REF) {
          return `${raw}.value`
        } else if (type === BindingTypes.SETUP_MAYBE_REF) {
          // const binding that may or may not be ref
          // if it's not a ref, then assignments don't make sense -
          // so we ignore the non-ref assignment case and generate code
          // that assumes the value to be a ref for more efficiency
          return isAssignmentLVal || isUpdateArg || isDestructureAssignment
            ? `${raw}.value`
            : `${context.helperString(UNREF)}(${raw})`
        } else if (type === BindingTypes.SETUP_LET) {
          if (isAssignmentLVal) {
            // let binding.
            // this is a bit more tricky as we need to cover the case where
            // let is a local non-ref value, and we need to replicate the
            // right hand side value.
            // x = y --> isRef(x) ? x.value = y : x = y
            const { right: rVal, operator } = parent
            const rExp = rawExp.slice(rVal.start - 1, rVal.end - 1)
            const rExpString = stringifyExpression(
              processExpression(
                createSimpleExpression(rExp, false),
                context,
                false,
                false,
                knownIds
              )
            )
            return `${context.helperString(IS_REF)}(${raw})${``} ? ${raw}.value ${operator} ${rExpString} : ${raw}`
          } else if (isUpdateArg) {
            // make id replace parent in the code range so the raw update operator
            // is removed
            id.start = parent.start
            id.end = parent.end
            const { prefix: isPrefix, operator } = parent
            const prefix = isPrefix ? operator : ``
            const postfix = isPrefix ? `` : operator
            // let binding.
            // x++ --> isRef(a) ? a.value++ : a++
            return `${context.helperString(IS_REF)}(${raw})${``} ? ${prefix}${raw}.value${postfix} : ${prefix}${raw}${postfix}`
          } else if (isDestructureAssignment) {
            // TODO
            // let binding in a destructure assignment - it's very tricky to
            // handle both possible cases here without altering the original
            // structure of the code, so we just assume it's not a ref here
            // for now
            return raw
          } else {
            return `${context.helperString(UNREF)}(${raw})`
          }
        } else if (type === BindingTypes.PROPS) {
          // use __props which is generated by compileScript so in ts mode
          // it gets correct type
          return `__props.${raw}`
        } else if (type === BindingTypes.PROPS_ALIASED) {
          // prop with a different local alias (from defineProps() destructure)
          return `__props.${bindingMetadata.__propsAliases[raw]}`
        }
      } else {
        if (type && type.startsWith('setup')) {
          // setup bindings in non-inline mode
          return `$setup.${raw}`
        } else if (type === BindingTypes.PROPS_ALIASED) {
          return `$props.${bindingMetadata.__propsAliases[raw]}`
        } else if (type) {
          return `$${type}.${raw}`
        }
      }
  
      // fallback to ctx
      return `_ctx.${raw}`
    }
  
    // fast path if expression is a simple identifier.
    const rawExp = node.content
    // bail constant on parens (function invocation) and dot (member access)
    const bailConstant = rawExp.indexOf(`(`) > -1 || rawExp.indexOf('.') > 0
  
    if (isSimpleIdentifier(rawExp)) {
      const isScopeVarReference = context.identifiers[rawExp]
      const isAllowedGlobal = isGloballyWhitelisted(rawExp)
      const isLiteral = isLiteralWhitelisted(rawExp)
      if (!asParams && !isScopeVarReference && !isAllowedGlobal && !isLiteral) {
        // const bindings exposed from setup can be skipped for patching but
        // cannot be hoisted to module scope
        if (bindingMetadata[node.content] === BindingTypes.SETUP_CONST) {
          node.constType = ConstantTypes.CAN_SKIP_PATCH
        }
        node.content = rewriteIdentifier(rawExp)
      } else if (!isScopeVarReference) {
        if (isLiteral) {
          node.constType = ConstantTypes.CAN_STRINGIFY
        } else {
          node.constType = ConstantTypes.CAN_HOIST
        }
      }
      return node
    }
  
    let ast
    // exp needs to be parsed differently:
    // 1. Multiple inline statements (v-on, with presence of `;`): parse as raw
    //    exp, but make sure to pad with spaces for consistent ranges
    // 2. Expressions: wrap with parens (for e.g. object expressions)
    // 3. Function arguments (v-for, v-slot): place in a function argument position
    const source = asRawStatements
      ? ` ${rawExp} `
      : `(${rawExp})${asParams ? `=>{}` : ``}`
    try {
      ast = babelParser.parse(source, {
        plugins: context.expressionPlugins
      }).program
    } catch (e) {
      return node
    }
  
    const ids= []
    const parentStack = []
    const knownIds = Object.create(context.identifiers)
  
    walkIdentifiers(
      ast,
      (node, parent, _, isReferenced, isLocal) => {
        if (isStaticPropertyKey(node, parent)) {
          return
        }
  
        const needPrefix = isReferenced && canPrefix(node)
        if (needPrefix && !isLocal) {
          if (isStaticProperty(parent) && parent.shorthand) {
            // property shorthand like { foo }, we need to add the key since
            // we rewrite the value
            node.prefix = `${node.name}: `
          }
          node.name = rewriteIdentifier(node.name, parent, node)
          ids.push(node)
        } else {
          // The identifier is considered constant unless it's pointing to a
          // local scope variable (a v-for alias, or a v-slot prop)
          if (!(needPrefix && isLocal) && !bailConstant) {
            node.isConstant = true
          }
          // also generate sub-expressions for other identifiers for better
          // source map support. (except for property keys which are static)
          ids.push(node)
        }
      },
      true, // invoke on ALL identifiers
      parentStack,
      knownIds
    )
  
    // We break up the compound expression into an array of strings and sub
    // expressions (for identifiers that have been prefixed). In codegen, if
    // an ExpressionNode has the `.children` property, it will be used instead of
    // `.content`.
    const children = []
    ids.sort((a, b) => a.start - b.start)
    ids.forEach((id, i) => {
      // range is offset by -1 due to the wrapping parens when parsed
      const start = id.start - 1
      const end = id.end - 1
      const last = ids[i - 1]
      const leadingText = rawExp.slice(last ? last.end - 1 : 0, start)
      if (leadingText.length || id.prefix) {
        children.push(leadingText + (id.prefix || ``))
      }
      const source = rawExp.slice(start, end)
      children.push(
        createSimpleExpression(
          id.name,
          false,
          {
            source,
            start: advancePositionWithClone(node.loc.start, source, start),
            end: advancePositionWithClone(node.loc.start, source, end)
          },
          id.isConstant ? ConstantTypes.CAN_STRINGIFY : ConstantTypes.NOT_CONSTANT
        )
      )
      if (i === ids.length - 1 && end < rawExp.length) {
        children.push(rawExp.slice(end))
      }
    })
  
    let ret
    if (children.length) {
      ret = createCompoundExpression(children, node.loc)
    } else {
      ret = node
      ret.constType = bailConstant
        ? ConstantTypes.NOT_CONSTANT
        : ConstantTypes.CAN_STRINGIFY
    }
    ret.identifiers = Object.keys(knownIds)
    return ret
  }
  
  function canPrefix(id) {
    // skip whitelisted globals
    if (isGloballyWhitelisted(id.name)) {
      return false
    }
    // special case for webpack compilation
    if (id.name === 'require') {
      return false
    }
    return true
  }
  
  function stringifyExpression(exp){
    if (isString(exp)) {
      return exp
    } else if (exp.type === NodeTypes.SIMPLE_EXPRESSION) {
      return exp.content
    } else {
      return exp.children.map(stringifyExpression).join('')
    }
  }
  
  function createRoot(children, loc = locStub) {
    return {
      type: NodeTypes.ROOT,
      children,
      helpers: [],
      components: [],
      directives: [],
      hoists: [],
      imports: [],
      cached: 0,
      temps: 0,
      codegenNode: undefined,
      loc
    }
  }
  function createVNodeCall(
    context,
    tag,
    props,
    children,
    patchFlag,
    dynamicProps,
    directives,
    isBlock = false,
    disableTracking = false,
    isComponent = false,
    loc = locStub
  ) {
    if (context) {
      // 单个子节点用 block
      if (isBlock) {
        context.helper(OPEN_BLOCK)
        context.helper(getVNodeBlockHelper(context.inSSR, isComponent))
      } else {
        // 多个节节点用 fragment
        context.helper(getVNodeHelper(context.inSSR, isComponent))
      }
      if (directives) {
        context.helper(WITH_DIRECTIVES)
      }
    }
  
    return {
      type: NodeTypes.VNODE_CALL,
      tag,
      props,
      children,
      patchFlag,
      dynamicProps,
      directives,
      isBlock,
      disableTracking,
      isComponent,
      loc
    }
  }
  function createArrayExpression(elements, loc = locStub) {
    return {
      type: NodeTypes.JS_ARRAY_EXPRESSION,
      loc,
      elements
    }
  }
  function createObjectExpression(properties, loc = locStub) {
    return {
      type: NodeTypes.JS_OBJECT_EXPRESSION,
      loc,
      properties
    }
  }
  function createObjectProperty(key, value) {
    return {
      type: NodeTypes.JS_PROPERTY,
      loc: locStub,
      key: isString(key) ? createSimpleExpression(key, true) : key,
      value
    }
  }
  function createSimpleExpression(
    content,
    isStatic = false,
    loc  = locStub,
    constType = ConstantTypes.NOT_CONSTANT
  ) {
    return {
      type: NodeTypes.SIMPLE_EXPRESSION,
      loc,
      content,
      isStatic,
      constType: isStatic ? ConstantTypes.CAN_STRINGIFY : constType
    }
  }
  function createInterpolation(content, loc) {
    return {
      type: NodeTypes.INTERPOLATION,
      loc,
      content: isString(content)
        ? createSimpleExpression(content, false, loc)
        : content
    }
  }
  function createCompoundExpression(children, loc = locStub) {
    return {
      type: NodeTypes.COMPOUND_EXPRESSION,
      loc,
      children
    }
  }
  function createCallExpression(callee, args = [], loc = locStub) {
    return {
      type: NodeTypes.JS_CALL_EXPRESSION,
      loc,
      callee,
      arguments: args
    }
  }
  function createFunctionExpression(
    params,
    returns = undefined,
    newline = false,
    isSlot = false,
    loc = locStub
  ) {
    return {
      type: NodeTypes.JS_FUNCTION_EXPRESSION,
      params,
      returns,
      newline,
      isSlot,
      loc
    }
  }
  function createConditionalExpression(
    test,
    consequent,
    alternate,
    newline = true
  ) {
    return {
      type: NodeTypes.JS_CONDITIONAL_EXPRESSION,
      test,
      consequent,
      alternate,
      newline,
      loc: locStub
    }
  }
  function createCacheExpression(
    index,
    value,
    isVNode = false
  ) {
    return {
      type: NodeTypes.JS_CACHE_EXPRESSION,
      index,
      value,
      isVNode,
      loc: locStub
    }
  }
  function createBlockStatement(body) {
    return {
      type: NodeTypes.JS_BLOCK_STATEMENT,
      body,
      loc: locStub
    }
  }
  function createTemplateLiteral(elements) {
    return {
      type: NodeTypes.JS_TEMPLATE_LITERAL,
      elements,
      loc: locStub
    }
  }
  function createIfStatement(test, consequent, alternate) {
    return {
      type: NodeTypes.JS_IF_STATEMENT,
      test,
      consequent,
      alternate,
      loc: locStub
    }
  }
  function createAssignmentExpression(left, right) {
    return {
      type: NodeTypes.JS_ASSIGNMENT_EXPRESSION,
      left,
      right,
      loc: locStub
    }
  }
  function createSequenceExpression(expressions) {
    return {
      type: NodeTypes.JS_SEQUENCE_EXPRESSION,
      expressions,
      loc: locStub
    }
  }
  function createReturnStatement(returns) {
    return {
      type: NodeTypes.JS_RETURN_STATEMENT,
      returns,
      loc: locStub
    }
  }
  
  function transform(root, options) {
    // transform 上下文
    const context = createTransformContext(root, options)
  
    // 递归遍历整个 ast root 树，最终为每颗子树生成 codegenNode
    traverseNode(root, context)
  
    // 静态提升处理
    if (options.hoistStatic) {
      hoistStatic(root, context)
    }
  
    // 创建 root codegenNode 代码
    if (!options.ssr) {
      createRootCodegen(root, context)
    }
  
    // finalize meta information
    root.helpers = [...context.helpers.keys()]
    root.components = [...context.components]
    root.directives = [...context.directives]
    root.imports = context.imports
    root.hoists = context.hoists
    root.temps = context.temps
    root.cached = context.cached
  }
  function getBaseTransformPreset(prefixIdentifiers) {
    return [
      [
        transformOnce,
        transformIf,
        transformMemo,
        transformFor,
        ...(!__BROWSER__ && prefixIdentifiers
          ? [
              // order is important
              trackVForSlotScopes,
              transformExpression
            ]
          : __BROWSER__ && __DEV__
          ? [transformExpression]
          : []),
        transformSlotOutlet,
        transformElement,
        trackSlotScopes,
        transformText
      ],
      {
        on: transformOn,
        bind: transformBind,
        model: transformModel
      }
    ]
  }
  function createCodegenContext(
    ast,
    {
      mode = 'function',
      prefixIdentifiers = mode === 'module',
      sourceMap = false,
      filename = `template.vue.html`,
      scopeId = null,
      optimizeImports = false,
      runtimeGlobalName = `Vue`,
      runtimeModuleName = `vue`,
      ssrRuntimeModuleName = 'vue/server-renderer',
      ssr = false,
      isTS = false,
      inSSR = false
    }
  ) {
    const context = {
      mode,
      prefixIdentifiers,
      sourceMap,
      filename,
      scopeId,
      optimizeImports,
      runtimeGlobalName,
      runtimeModuleName,
      ssrRuntimeModuleName,
      ssr,
      isTS,
      inSSR,
      source: ast.loc.source,
      code: ``,
      column: 1,
      line: 1,
      offset: 0,
      indentLevel: 0,
      pure: false,
      map: undefined,
      helper(key) {
        return `_${helperNameMap[key]}`
      },
      push(code, node) {
        context.code += code
        if (!__BROWSER__ && context.map) {
          if (node) {
            let name
            if (node.type === NodeTypes.SIMPLE_EXPRESSION && !node.isStatic) {
              const content = node.content.replace(/^_ctx\./, '')
              if (content !== node.content && isSimpleIdentifier(content)) {
                name = content
              }
            }
            addMapping(node.loc.start, name)
          }
          advancePositionWithMutation(context, code)
          if (node && node.loc !== locStub) {
            addMapping(node.loc.end)
          }
        }
      },
      indent() {
        newline(++context.indentLevel)
      },
      deindent(withoutNewLine = false) {
        if (withoutNewLine) {
          --context.indentLevel
        } else {
          newline(--context.indentLevel)
        }
      },
      newline() {
        newline(context.indentLevel)
      }
    }
  
    function newline(n) {
      context.push('\n' + `  `.repeat(n))
    }
  
    function addMapping(loc, name) {
      context.map.addMapping({
        name,
        source: context.filename,
        original: {
          line: loc.line,
          column: loc.column - 1 // source-map column is 0 based
        },
        generated: {
          line: context.line,
          column: context.column - 1
        }
      })
    }
  
    return context
  }
  
  function genModulePreamble(ast, context, genScopeId, inline) {
    const {
      push,
      newline,
      optimizeImports,
      runtimeModuleName,
      ssrRuntimeModuleName
    } = context
  
    if (genScopeId && ast.hoists.length) {
      ast.helpers.push(PUSH_SCOPE_ID, POP_SCOPE_ID)
    }
  
    // generate import statements for helpers
    if (ast.helpers.length) {
      if (optimizeImports) {
        // when bundled with webpack with code-split, calling an import binding
        // as a function leads to it being wrapped with `Object(a.b)` or `(0,a.b)`,
        // incurring both payload size increase and potential perf overhead.
        // therefore we assign the imports to variables (which is a constant ~50b
        // cost per-component instead of scaling with template size)
        push(
          `import { ${ast.helpers
            .map(s => helperNameMap[s])
            .join(', ')} } from ${JSON.stringify(runtimeModuleName)}\n`
        )
        push(
          `\n// Binding optimization for webpack code-split\nconst ${ast.helpers
            .map(s => `_${helperNameMap[s]} = ${helperNameMap[s]}`)
            .join(', ')}\n`
        )
      } else {
        push(
          `import { ${ast.helpers
            .map(s => `${helperNameMap[s]} as _${helperNameMap[s]}`)
            .join(', ')} } from ${JSON.stringify(runtimeModuleName)}\n`
        )
      }
    }
  
    if (ast.ssrHelpers && ast.ssrHelpers.length) {
      push(
        `import { ${ast.ssrHelpers
          .map(s => `${helperNameMap[s]} as _${helperNameMap[s]}`)
          .join(', ')} } from "${ssrRuntimeModuleName}"\n`
      )
    }
  
    if (ast.imports.length) {
      genImports(ast.imports, context)
      newline()
    }
  
    genHoists(ast.hoists, context)
    newline()
  
    if (!inline) {
      push(`export `)
    }
  }
  function genImports(importsOptions, context) {
    if (!importsOptions.length) {
      return
    }
    importsOptions.forEach(imports => {
      context.push(`import `)
      genNode(imports.exp, context)
      context.push(` from '${imports.path}'`)
      context.newline()
    })
  }
  function genFunctionPreamble(ast, context) {
    const {
      ssr,
      prefixIdentifiers,
      push,
      newline,
      runtimeModuleName,
      runtimeGlobalName,
      ssrRuntimeModuleName
    } = context
    const VueBinding =
      !__BROWSER__ && ssr
        ? `require(${JSON.stringify(runtimeModuleName)})`
        : runtimeGlobalName
    const aliasHelper = (s) => `${helperNameMap[s]}: _${helperNameMap[s]}`
    // Generate const declaration for helpers
    // In prefix mode, we place the const declaration at top so it's done
    // only once; But if we not prefixing, we place the declaration inside the
    // with block so it doesn't incur the `in` check cost for every helper access.
    if (ast.helpers.length > 0) {
      if (!__BROWSER__ && prefixIdentifiers) {
        push(
          `const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinding}\n`
        )
      } else {
        // "with" mode.
        // save Vue in a separate variable to avoid collision
        push(`const _Vue = ${VueBinding}\n`)
        // in "with" mode, helpers are declared inside the with block to avoid
        // has check cost, but hoists are lifted out of the function - we need
        // to provide the helper here.
        if (ast.hoists.length) {
          const staticHelpers = [
            CREATE_VNODE,
            CREATE_ELEMENT_VNODE,
            CREATE_COMMENT,
            CREATE_TEXT,
            CREATE_STATIC
          ]
            .filter(helper => ast.helpers.includes(helper))
            .map(aliasHelper)
            .join(', ')
          push(`const { ${staticHelpers} } = _Vue\n`)
        }
      }
    }
    // generate variables for ssr helpers
    if (!__BROWSER__ && ast.ssrHelpers && ast.ssrHelpers.length) {
      // ssr guarantees prefixIdentifier: true
      push(
        `const { ${ast.ssrHelpers
          .map(aliasHelper)
          .join(', ')} } = require("${ssrRuntimeModuleName}")\n`
      )
    }
    genHoists(ast.hoists, context)
    newline()
    push(`return `)
  }
  function genHoists(hoists, context) {
    if (!hoists.length) {
      return
    }
    context.pure = true
    const { push, newline, helper, scopeId, mode } = context
    const genScopeId = !__BROWSER__ && scopeId != null && mode !== 'function'
    newline()
  
    // generate inlined withScopeId helper
    if (genScopeId) {
      push(
        `const _withScopeId = n => (${helper(
          PUSH_SCOPE_ID
        )}("${scopeId}"),n=n(),${helper(POP_SCOPE_ID)}(),n)`
      )
      newline()
    }
  
    for (let i = 0; i < hoists.length; i++) {
      const exp = hoists[i]
      if (exp) {
        const needScopeIdWrapper = genScopeId && exp.type === NodeTypes.VNODE_CALL
        push(
          `const _hoisted_${i + 1} = ${
            needScopeIdWrapper ? `${PURE_ANNOTATION} _withScopeId(() => ` : ``
          }`
        )
        genNode(exp, context)
        if (needScopeIdWrapper) {
          push(`)`)
        }
        newline()
      }
    }
  
    context.pure = false
  }
  // type = 'component' | 'directive' | 'filter'
  function genAssets(assets, type, { helper, push, newline, isTS }) {
    const resolver = helper(
      type === 'component'
        ? RESOLVE_COMPONENT
        : RESOLVE_DIRECTIVE
    )
    for (let i = 0; i < assets.length; i++) {
      let id = assets[i]
      // potential component implicit self-reference inferred from SFC filename
      const maybeSelfReference = id.endsWith('__self')
      if (maybeSelfReference) {
        id = id.slice(0, -6)
      }
      push(
        `const ${toValidAssetId(id, type)} = ${resolver}(${JSON.stringify(id)}${
          maybeSelfReference ? `, true` : ``
        })${isTS ? `!` : ``}`
      )
      if (i < assets.length - 1) {
        newline()
      }
    }
  }
  function genText(node, context) {
    context.push(JSON.stringify(node.content), node)
  }
  function genExpression(node, context) {
    const { content, isStatic } = node
    context.push(isStatic ? JSON.stringify(content) : content, node)
  }
  function genInterpolation(node, context) {
    const { push, helper, pure } = context
    if (pure) push(PURE_ANNOTATION)
    push(`${helper(TO_DISPLAY_STRING)}(`)
    genNode(node.content, context)
    push(`)`)
  }
  function genCompoundExpression(node, context) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      if (isString(child)) {
        context.push(child)
      } else {
        genNode(child, context)
      }
    }
  }
  function genComment(node, context) {
    const { push, helper, pure } = context
    if (pure) {
      push(PURE_ANNOTATION)
    }
    push(`${helper(CREATE_COMMENT)}(${JSON.stringify(node.content)})`, node)
  }
  function genVNodeCall(node, context) {
    const { push, helper, pure } = context
    const {
      tag,
      props,
      children,
      patchFlag,
      dynamicProps,
      directives,
      isBlock,
      disableTracking,
      isComponent
    } = node
    if (directives) {
      push(helper(WITH_DIRECTIVES) + `(`)
    }
    if (isBlock) {
      push(`(${helper(OPEN_BLOCK)}(${disableTracking ? `true` : ``}), `)
    }
    if (pure) {
      push(PURE_ANNOTATION)
    }
    const callHelper = isBlock
      ? getVNodeBlockHelper(context.inSSR, isComponent)
      : getVNodeHelper(context.inSSR, isComponent)
    push(helper(callHelper) + `(`, node)
    genNodeList(
      genNullableArgs([tag, props, children, patchFlag, dynamicProps]),
      context
    )
    push(`)`)
    if (isBlock) {
      push(`)`)
    }
    if (directives) {
      push(`, `)
      genNode(directives, context)
      push(`)`)
    }
  }
  // JavaScript
  function genCallExpression(node, context) {
    const { push, helper, pure } = context
    const callee = isString(node.callee) ? node.callee : helper(node.callee)
    if (pure) {
      push(PURE_ANNOTATION)
    }
    push(callee + `(`, node)
    genNodeList(node.arguments, context)
    push(`)`)
  }
  function genObjectExpression(node, context) {
    const { push, indent, deindent, newline } = context
    const { properties } = node
    if (!properties.length) {
      push(`{}`, node)
      return
    }
    const multilines =
      properties.length > 1 ||
      ((!__BROWSER__ || __DEV__) &&
        properties.some(p => p.value.type !== NodeTypes.SIMPLE_EXPRESSION))
    push(multilines ? `{` : `{ `)
    multilines && indent()
    for (let i = 0; i < properties.length; i++) {
      const { key, value } = properties[i]
      // key
      genExpressionAsPropertyKey(key, context)
      push(`: `)
      // value
      genNode(value, context)
      if (i < properties.length - 1) {
        // will only reach this if it's multilines
        push(`,`)
        newline()
      }
    }
    multilines && deindent()
    push(multilines ? `}` : ` }`)
  }
  function genArrayExpression(node, context) {
    genNodeListAsArray(node.elements, context)
  }
  function genFunctionExpression(node, context) {
    const { push, indent, deindent } = context
    const { params, returns, body, newline, isSlot } = node
    if (isSlot) {
      // wrap slot functions with owner context
      push(`_${helperNameMap[WITH_CTX]}(`)
    }
    push(`(`, node)
    if (isArray(params)) {
      genNodeList(params, context)
    } else if (params) {
      genNode(params, context)
    }
    push(`) => `)
    if (newline || body) {
      push(`{`)
      indent()
    }
    if (returns) {
      if (newline) {
        push(`return `)
      }
      if (isArray(returns)) {
        genNodeListAsArray(returns, context)
      } else {
        genNode(returns, context)
      }
    } else if (body) {
      genNode(body, context)
    }
    if (newline || body) {
      deindent()
      push(`}`)
    }
    if (isSlot) {
      push(`)`)
    }
  }
  function genConditionalExpression(node, context) {
    const { test, consequent, alternate, newline: needNewline } = node
    const { push, indent, deindent, newline } = context
    if (test.type === NodeTypes.SIMPLE_EXPRESSION) {
      const needsParens = !isSimpleIdentifier(test.content)
      needsParens && push(`(`)
      genExpression(test, context)
      needsParens && push(`)`)
    } else {
      push(`(`)
      genNode(test, context)
      push(`)`)
    }
    needNewline && indent()
    context.indentLevel++
    needNewline || push(` `)
    push(`? `)
    genNode(consequent, context)
    context.indentLevel--
    needNewline && newline()
    needNewline || push(` `)
    push(`: `)
    const isNested = alternate.type === NodeTypes.JS_CONDITIONAL_EXPRESSION
    if (!isNested) {
      context.indentLevel++
    }
    genNode(alternate, context)
    if (!isNested) {
      context.indentLevel--
    }
    needNewline && deindent(true /* without newline */)
  }
  function genCacheExpression(node, context) {
    const { push, helper, indent, deindent, newline } = context
    push(`_cache[${node.index}] || (`)
    if (node.isVNode) {
      indent()
      push(`${helper(SET_BLOCK_TRACKING)}(-1),`)
      newline()
    }
    push(`_cache[${node.index}] = `)
    genNode(node.value, context)
    if (node.isVNode) {
      push(`,`)
      newline()
      push(`${helper(SET_BLOCK_TRACKING)}(1),`)
      newline()
      push(`_cache[${node.index}]`)
      deindent()
    }
    push(`)`)
  }
  function genNodeList(nodes, context, multilines = false, comma = true) {
    const { push, newline } = context
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      if (isString(node)) {
        push(node)
      } else if (isArray(node)) {
        genNodeListAsArray(node, context)
      } else {
        genNode(node, context)
      }
      if (i < nodes.length - 1) {
        if (multilines) {
          comma && push(',')
          newline()
        } else {
          comma && push(', ')
        }
      }
    }
  }
  function genTemplateLiteral(node, context) {
    const { push, indent, deindent } = context
    push('`')
    const l = node.elements.length
    const multilines = l > 3
    for (let i = 0; i < l; i++) {
      const e = node.elements[i]
      if (isString(e)) {
        push(e.replace(/(`|\$|\\)/g, '\\$1'))
      } else {
        push('${')
        if (multilines) indent()
        genNode(e, context)
        if (multilines) deindent()
        push('}')
      }
    }
    push('`')
  }
  function genIfStatement(node, context) {
    const { push, indent, deindent } = context
    const { test, consequent, alternate } = node
    push(`if (`)
    genNode(test, context)
    push(`) {`)
    indent()
    genNode(consequent, context)
    deindent()
    push(`}`)
    if (alternate) {
      push(` else `)
      if (alternate.type === NodeTypes.JS_IF_STATEMENT) {
        genIfStatement(alternate, context)
      } else {
        push(`{`)
        indent()
        genNode(alternate, context)
        deindent()
        push(`}`)
      }
    }
  }
  function genAssignmentExpression(node, context) {
    genNode(node.left, context)
    context.push(` = `)
    genNode(node.right, context)
  }
  function genSequenceExpression(node, context) {
    context.push(`(`)
    genNodeList(node.expressions, context)
    context.push(`)`)
  }
  function genReturnStatement({ returns }, context) {
    context.push(`return `)
    if (isArray(returns)) {
      genNodeListAsArray(returns, context)
    } else {
      genNode(returns, context)
    }
  }
  
  function genNode(node, context) {
    if (isString(node)) {
      context.push(node)
      return
    }
    if (isSymbol(node)) {
      context.push(context.helper(node))
      return
    }
    switch (node.type) {
      case NodeTypes.ELEMENT:
      case NodeTypes.IF:
      case NodeTypes.FOR:
        genNode(node.codegenNode, context)
        break
      case NodeTypes.TEXT:
        genText(node, context)
        break
      case NodeTypes.SIMPLE_EXPRESSION:
        genExpression(node, context)
        break
      case NodeTypes.INTERPOLATION:
        genInterpolation(node, context)
        break
      case NodeTypes.TEXT_CALL:
        genNode(node.codegenNode, context)
        break
      case NodeTypes.COMPOUND_EXPRESSION:
        genCompoundExpression(node, context)
        break
      case NodeTypes.COMMENT:
        genComment(node, context)
        break
      case NodeTypes.VNODE_CALL:
        genVNodeCall(node, context)
        break
  
      case NodeTypes.JS_CALL_EXPRESSION:
        genCallExpression(node, context)
        break
      case NodeTypes.JS_OBJECT_EXPRESSION:
        genObjectExpression(node, context)
        break
      case NodeTypes.JS_ARRAY_EXPRESSION:
        genArrayExpression(node, context)
        break
      case NodeTypes.JS_FUNCTION_EXPRESSION:
        genFunctionExpression(node, context)
        break
      case NodeTypes.JS_CONDITIONAL_EXPRESSION:
        genConditionalExpression(node, context)
        break
      case NodeTypes.JS_CACHE_EXPRESSION:
        genCacheExpression(node, context)
        break
      case NodeTypes.JS_BLOCK_STATEMENT:
        genNodeList(node.body, context, true, false)
        break
  
      // SSR only types
      case NodeTypes.JS_TEMPLATE_LITERAL:
        !__BROWSER__ && genTemplateLiteral(node, context)
        break
      case NodeTypes.JS_IF_STATEMENT:
        !__BROWSER__ && genIfStatement(node, context)
        break
      case NodeTypes.JS_ASSIGNMENT_EXPRESSION:
        !__BROWSER__ && genAssignmentExpression(node, context)
        break
      case NodeTypes.JS_SEQUENCE_EXPRESSION:
        !__BROWSER__ && genSequenceExpression(node, context)
        break
      case NodeTypes.JS_RETURN_STATEMENT:
        !__BROWSER__ && genReturnStatement(node, context)
        break
  
      /* istanbul ignore next */
      case NodeTypes.IF_BRANCH:
        // noop
        break
      default:
        logg(`unhandled codegen node type: ${node.type}`)
    }
  }
  function genNodeListAsArray(nodes, context) {
    const multilines =
      nodes.length > 3 ||
      ((!__BROWSER__ || __DEV__) && nodes.some(n => isArray(n) || !isText(n)))
    context.push(`[`)
    multilines && context.indent()
    genNodeList(nodes, context, multilines)
    multilines && context.deindent()
    context.push(`]`)
  }
  
  function generate(ast, options = {}) {
    const context = createCodegenContext(ast, options)
    if (options.onContextCreated) options.onContextCreated(context)
    const {
      mode,
      push,
      prefixIdentifiers,
      indent,
      deindent,
      newline,
      scopeId,
      ssr
    } = context
  
    const hasHelpers = ast.helpers.length > 0
    const useWithBlock = !prefixIdentifiers && mode !== 'module'
    const genScopeId = !__BROWSER__ && scopeId != null && mode === 'module'
    const isSetupInlined = !__BROWSER__ && !!options.inline
  
    // preambles
    // in setup() inline mode, the preamble is generated in a sub context
    // and returned separately.
    const preambleContext = isSetupInlined
      ? createCodegenContext(ast, options)
      : context
    if (!__BROWSER__ && mode === 'module') {
      genModulePreamble(ast, preambleContext, genScopeId, isSetupInlined)
    } else {
      genFunctionPreamble(ast, preambleContext)
    }
    // enter render function
    const functionName = ssr ? `ssrRender` : `render`
    const args = ssr ? ['_ctx', '_push', '_parent', '_attrs'] : ['_ctx', '_cache']
    if (!__BROWSER__ && options.bindingMetadata && !options.inline) {
      // binding optimization args
      args.push('$props', '$setup', '$data', '$options')
    }
    const signature =
      !__BROWSER__ && options.isTS
        ? args.map(arg => `${arg}: any`).join(',')
        : args.join(', ')
  
    if (isSetupInlined) {
      push(`(${signature}) => {`)
    } else {
      push(`function ${functionName}(${signature}) {`)
    }
    indent()
  
    if (useWithBlock) {
      push(`with (_ctx) {`)
      indent()
      // function mode const declarations should be inside with block
      // also they should be renamed to avoid collision with user properties
      if (hasHelpers) {
        push(
          `const { ${ast.helpers
            .map(s => `${helperNameMap[s]}: _${helperNameMap[s]}`)
            .join(', ')} } = _Vue`
        )
        push(`\n`)
        newline()
      }
    }
  
    // generate asset resolution statements
    if (ast.components.length) {
      genAssets(ast.components, 'component', context)
      if (ast.directives.length || ast.temps > 0) {
        newline()
      }
    }
    if (ast.directives.length) {
      genAssets(ast.directives, 'directive', context)
      if (ast.temps > 0) {
        newline()
      }
    }
  
    // 临时变量
    if (ast.temps > 0) {
      push(`let `)
      for (let i = 0; i < ast.temps; i++) {
        push(`${i > 0 ? `, ` : ``}_temp${i}`)
      }
    }
    if (ast.components.length || ast.directives.length || ast.temps) {
      push(`\n`)
      newline()
    }
  
    // generate the VNode tree expression
    if (!ssr) {
      push(`return `)
    }
    if (ast.codegenNode) {
      genNode(ast.codegenNode, context)
    } else {
      push(`null`)
    }
  
    if (useWithBlock) {
      deindent()
      push(`}`)
    }
  
    deindent()
    push(`}`)
  
    return {
      ast,
      code: context.code,
      preamble: isSetupInlined ? preambleContext.code : ``,
      // SourceMapGenerator does have toJSON() method but it's not in the types
      map: context.map ? context.map.toJSON() : undefined
    }
  }

  function baseCompile(template, options = {}) {
    const isModuleMode = options.mode === 'module'

    const prefixIdentifiers =
        !__BROWSER__ && (options.prefixIdentifiers === true || isModuleMode)

    const ast = isString(template) ? baseParse(template, options) : template
    const [nodeTransforms, directiveTransforms] = getBaseTransformPreset(prefixIdentifiers)

    // 转换出每个节点的 codegenNode
    transform(
        ast,
        extend({}, options, {
        prefixIdentifiers,
        nodeTransforms: [
            ...nodeTransforms,
            ...(options.nodeTransforms || []) // user transforms
        ],
        directiveTransforms: extend(
            {},
            directiveTransforms,
            options.directiveTransforms || {} // user transforms
        )
        })
    )

    // 生成 codegen
    return generate(ast, extend({}, options, { prefixIdentifiers }))
  }
