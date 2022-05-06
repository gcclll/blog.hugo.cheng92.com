window.$stats=window.$stats||{};window.$stats['build_your_own_vue_compiler_sfc.html']={"IDLinks":[{"text":"script","tagName":"H2","id":"orgb16333e","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"compileScript()","tagName":"H3","id":"org9e08f84","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"utils","tagName":"H3","id":"orgaf7adeb","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"helper()","tagName":"H4","id":"org61a7e4f","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"parse()","tagName":"H4","id":"orgdf267a1","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"error()","tagName":"H4","id":"org5af1664","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"registerUserImport()","tagName":"H4","id":"orgc1b2631","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processDefineProps()","tagName":"H4","id":"org64a4ac6","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processWithDefaults()","tagName":"H4","id":"orgbd4eeda","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processDefineEmits()","tagName":"H4","id":"orgd1f73f6","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"resolveQualifiedType()","tagName":"H4","id":"org31ea96c","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processDefineExpose()","tagName":"H4","id":"org47f1085","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"checkInvalidScopeReference()","tagName":"H4","id":"org83b943e","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processAwait()","tagName":"H4","id":"orgb896bea","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"hasStaticWithDefaults()","tagName":"H4","id":"org10f3cdd","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"genRuntimeProps()","tagName":"H4","id":"orga09196e","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"genDestructuredDefaultValue()","tagName":"H4","id":"org3c7a018","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"genSetupPropsType()","tagName":"H4","id":"orga72a4ba","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"steps","tagName":"H3","id":"org6eb9e9a","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"process normal script","tagName":"H4","id":"orgea75978","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"process setup script","tagName":"H4","id":"orgf5483af","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"apply reactivity transform","tagName":"H4","id":"orgb9f885d","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"extract runtime props/emits","tagName":"H4","id":"org62f7fec","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"check useOptions dont ref setup scope variables","tagName":"H4","id":"orga90f06f","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"remove non-script content","tagName":"H4","id":"org99e7a3c","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"analyze binding metadata","tagName":"H4","id":"org6e9db3f","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"inject useCssVars calls","tagName":"H4","id":"org39cbfa8","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"finalize setup() argument signature","tagName":"H4","id":"org77847c6","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"generate return statement","tagName":"H4","id":"org550b5ff","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"finalize default export","tagName":"H4","id":"orgff1f6bb","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"finalize Vue helper imports","tagName":"H4","id":"org63b92c6","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"functions","tagName":"H3","id":"org481e506","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"registerBinding()","tagName":"H4","id":"orgc046897","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"walkDeclaration()","tagName":"H4","id":"org322bb9b","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"walkObjectPattern()","tagName":"H4","id":"org02afbfa","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"walkArrayPattern()","tagName":"H4","id":"org22daeec","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"walkPattern()","tagName":"H4","id":"org87fc09f","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"recordType()","tagName":"H4","id":"org3e4443a","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"extractRuntimeProps()","tagName":"H4","id":"orgf54d86e","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"inferRuntimeType()","tagName":"H4","id":"org6f91362","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"toRuntimeTypeString()","tagName":"H4","id":"orge4055f3","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"extractRuntimeEmits()","tagName":"H4","id":"org66178c6","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"extractEventNames()","tagName":"H4","id":"orgba3c704","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"genRuntimeEmits()","tagName":"H4","id":"orge0e757a","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"isCallOf()","tagName":"H4","id":"orgf1e491d","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"canNeverBeRef()","tagName":"H4","id":"org590e220","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"analyzeScriptBindings()","tagName":"H4","id":"orgba5f7a6","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"analyzeBindingsFromOptions()","tagName":"H4","id":"orgb149e7c","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"getObjectExpressionKeys()","tagName":"H4","id":"orgdbd7a26","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"getArrayExpressionKeys()","tagName":"H4","id":"org2b5fab2","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"getObjectOrArrayExpressionKeys()","tagName":"H4","id":"orgc066eae","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"resolveTemplateUsageCheckString()","tagName":"H4","id":"orgbb6e9e4","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"stripStrings()","tagName":"H4","id":"org567106b","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"stripTemplateString()","tagName":"H4","id":"orgedfc530","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"isImportUsed()","tagName":"H4","id":"org1ec964a","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"hmrShouldReload()","tagName":"H4","id":"org4b69b2f","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"rewriteDefault","tagName":"H3","id":"org16cb399","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"cssVars","tagName":"H3","id":"org9134b4f","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"testing","tagName":"H3","id":"orga0ae230","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"template","tagName":"H2","id":"org517f6eb","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"compileTemplate()","tagName":"H3","id":"org937fa8b","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"parse","tagName":"H2","id":"orgef255b2","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"script","tagName":"H3","id":"org5793069","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"mindmaps","tagName":"H2","id":"orgf48259e","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"global variables","tagName":"H2","id":"orga453145","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"reactivity-transform","tagName":"H3","id":"orgdedabb3","filename":"build_your_own_vue_compiler_sfc.html"}],"aLinks":[{"text":"script","url":"#orgb16333e","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"compileScript()","url":"#org9e08f84","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"utils","url":"#orgaf7adeb","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"helper()","url":"#org61a7e4f","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"parse()","url":"#orgdf267a1","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"error()","url":"#org5af1664","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"registerUserImport()","url":"#orgc1b2631","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processDefineProps()","url":"#org64a4ac6","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processWithDefaults()","url":"#orgbd4eeda","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processDefineEmits()","url":"#orgd1f73f6","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"resolveQualifiedType()","url":"#org31ea96c","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processDefineExpose()","url":"#org47f1085","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"checkInvalidScopeReference()","url":"#org83b943e","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"processAwait()","url":"#orgb896bea","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"hasStaticWithDefaults()","url":"#org10f3cdd","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"genRuntimeProps()","url":"#orga09196e","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"genDestructuredDefaultValue()","url":"#org3c7a018","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"genSetupPropsType()","url":"#orga72a4ba","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"steps","url":"#org6eb9e9a","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"process normal script","url":"#orgea75978","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"process setup script","url":"#orgf5483af","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"apply reactivity transform","url":"#orgb9f885d","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"extract runtime props/emits","url":"#org62f7fec","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"check useOptions dont ref setup scope variables","url":"#orga90f06f","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"remove non-script content","url":"#org99e7a3c","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"analyze binding metadata","url":"#org6e9db3f","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"inject useCssVars calls","url":"#org39cbfa8","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"finalize setup() argument signature","url":"#org77847c6","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"generate return statement","url":"#org550b5ff","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"finalize default export","url":"#orgff1f6bb","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"finalize Vue helper imports","url":"#org63b92c6","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"functions","url":"#org481e506","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"registerBinding()","url":"#orgc046897","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"walkDeclaration()","url":"#org322bb9b","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"walkObjectPattern()","url":"#org02afbfa","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"walkArrayPattern()","url":"#org22daeec","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"walkPattern()","url":"#org87fc09f","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"recordType()","url":"#org3e4443a","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"extractRuntimeProps()","url":"#orgf54d86e","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"inferRuntimeType()","url":"#org6f91362","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"toRuntimeTypeString()","url":"#orge4055f3","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"extractRuntimeEmits()","url":"#org66178c6","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"extractEventNames()","url":"#orgba3c704","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"genRuntimeEmits()","url":"#orge0e757a","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"isCallOf()","url":"#orgf1e491d","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"canNeverBeRef()","url":"#org590e220","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"analyzeScriptBindings()","url":"#orgba5f7a6","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"analyzeBindingsFromOptions()","url":"#orgb149e7c","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"getObjectExpressionKeys()","url":"#orgdbd7a26","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"getArrayExpressionKeys()","url":"#org2b5fab2","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"getObjectOrArrayExpressionKeys()","url":"#orgc066eae","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"resolveTemplateUsageCheckString()","url":"#orgbb6e9e4","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"stripStrings()","url":"#org567106b","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"stripTemplateString()","url":"#orgedfc530","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"isImportUsed()","url":"#org1ec964a","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"hmrShouldReload()","url":"#org4b69b2f","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"rewriteDefault","url":"#org16cb399","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"cssVars","url":"#org9134b4f","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"testing","url":"#orga0ae230","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"template","url":"#org517f6eb","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"compileTemplate()","url":"#org937fa8b","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"parse","url":"#orgef255b2","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"script","url":"#org5793069","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"mindmaps","url":"#orgf48259e","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"global variables","url":"#orga453145","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"reactivity-transform","url":"#orgdedabb3","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":" build your own vue compiler-dom","url":"https://blog.cheng92.com/posts/build_your_own_vue_compiler_dom.html","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":"compileScript()","url":"#orgcb78368","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"},{"text":" core/README.md at main · vuejs/core","url":"https://github.com/vuejs/core/blob/main/packages/reactivity-transform/README.md","tag":"A","filename":"build_your_own_vue_compiler_sfc.html"}],"toc":null}