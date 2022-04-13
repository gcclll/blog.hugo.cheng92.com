window.$stats=window.$stats||{};window.$stats['build_your_own_vue_reactivity.html']={"IDLinks":[{"text":" 1. READY(handlers) ","tagName":"H2","id":"orgdced224","filename":"build_your_own_vue_reactivity.html"},{"text":" 2. Global variables ","tagName":"H2","id":"orgf41c298","filename":"build_your_own_vue_reactivity.html"},{"text":" 3. reactive(target: object) ","tagName":"H2","id":"orgd8fa75d","filename":"build_your_own_vue_reactivity.html"},{"text":" 3.1. reactive with track&trigger ","tagName":"H3","id":"org4dbde4a","filename":"build_your_own_vue_reactivity.html"},{"text":" 4. createReactiveObject ","tagName":"H2","id":"org4fbb8f6","filename":"build_your_own_vue_reactivity.html"},{"text":" 5. mutableHandlers ","tagName":"H2","id":"org87e0632","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.1. createGetter ","tagName":"H3","id":"base-handler-createGetter","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.1.1. createGetter with track ","tagName":"H4","id":"orgf38b190","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.2. createSetter ","tagName":"H3","id":"base-handler-createSetter","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.2.1. set with trigger ","tagName":"H4","id":"orge35f622","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.3. deleteProperty ","tagName":"H3","id":"org3a309d9","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.3.1. delete with trigger ","tagName":"H4","id":"org2b7b4d0","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.4. has ","tagName":"H3","id":"base-handler-has","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.4.1. has with track ","tagName":"H4","id":"org9e54087","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.5. ownKeys ","tagName":"H3","id":"org9cb3bc0","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.5.1. ownKeys with track ","tagName":"H4","id":"org997b6a8","filename":"build_your_own_vue_reactivity.html"},{"text":" 5.6. Testing ","tagName":"H3","id":"org9d8aa43","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.1. createInstrumentationGetter ","tagName":"H3","id":"ref-collection-createInstrumentationGetter","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.2. mutableInstrumentations ","tagName":"H3","id":"collection-mutableInstrumentations","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.2.1. witch track & trigger ","tagName":"H4","id":"org96ba866","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.3. get ","tagName":"H3","id":"ref-collection-get","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.3.1. get with track ","tagName":"H4","id":"org62f21f6","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.4. has ","tagName":"H3","id":"ref-collection-has","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.4.1. has with track ","tagName":"H4","id":"org81b2133","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.5. size ","tagName":"H3","id":"ref-collection-size","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.5.1. size with track ","tagName":"H4","id":"org15ca51b","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.6. add ","tagName":"H3","id":"ref-collection-add","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.6.1. add with trigger ","tagName":"H4","id":"orgc6f9ba6","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.7. set ","tagName":"H3","id":"ref-collection-set","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.7.1. set with trigger ","tagName":"H4","id":"orgc385049","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.8. delete ","tagName":"H3","id":"ref-collection-delete","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.8.1. delete with trigger ","tagName":"H4","id":"org02b7191","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.9. clear ","tagName":"H3","id":"ref-collection-clear","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.9.1. clear with trigger ","tagName":"H4","id":"org3cf46c7","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.10. forEach ","tagName":"H3","id":"ref-collection-forEach","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.10.1. forEach with track ","tagName":"H4","id":"org66f070e","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.11. keys&values&entries ","tagName":"H3","id":"orga9e8354","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.11.1. iterator with track ","tagName":"H4","id":"org1d1ded2","filename":"build_your_own_vue_reactivity.html"},{"text":" 6.12. Testing ","tagName":"H3","id":"org3ed55bf","filename":"build_your_own_vue_reactivity.html"},{"text":" 8. track&trigger&effect ","tagName":"H2","id":"orgf68fa35","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.1. track() ","tagName":"H3","id":"orgb2c0c52","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.1.1. createDep() ","tagName":"H4","id":"org98eb104","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.1.2. wasTracked(dep) ","tagName":"H4","id":"org6fcb42b","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.1.3. newTracked(dep) ","tagName":"H4","id":"orgb354fd7","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.1.4. initDepMarkers() ","tagName":"H4","id":"orgab53f4e","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.1.5. finalizeDepMarkers() ","tagName":"H4","id":"orgbe8b366","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.1.6. trackEffects(dep, debuggerEventExtraInfo) ","tagName":"H4","id":"orge525367","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.2. trigger() ","tagName":"H3","id":"org76b6ae4","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.2.1. triggerEffects() ","tagName":"H4","id":"org5b4d32a","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.3. effect() ","tagName":"H3","id":"orge4c0768","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.4. normal objects ","tagName":"H3","id":"org5c8d1c0","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.5. colletion objects(Map,Set) ","tagName":"H3","id":"org8f38a80","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.6. phase 2 updating ","tagName":"H3","id":"orgac4a804","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.6.1. normal objects ","tagName":"H4","id":"org448f8fa","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.6.2. collection objects(Map,Set) ","tagName":"H4","id":"org4fce431","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.6.3. whole phase code ","tagName":"H4","id":"org4112ae8","filename":"build_your_own_vue_reactivity.html"},{"text":" 8.7. Testing ","tagName":"H3","id":"orge3a3d73","filename":"build_your_own_vue_reactivity.html"},{"text":" 9. effect scope ","tagName":"H2","id":"orgf673df3","filename":"build_your_own_vue_reactivity.html"},{"text":" 9.1. EffectScope ","tagName":"H3","id":"orgd0f0982","filename":"build_your_own_vue_reactivity.html"},{"text":" 9.2. recordEffectScope(effect, scope) ","tagName":"H3","id":"org554802f","filename":"build_your_own_vue_reactivity.html"},{"text":" 9.3. onScopeDispose(fn) ","tagName":"H3","id":"org4b66f6d","filename":"build_your_own_vue_reactivity.html"},{"text":" 9.4. track dep ","tagName":"H3","id":"org1128b32","filename":"build_your_own_vue_reactivity.html"},{"text":" 10. computed ","tagName":"H2","id":"org8993f06","filename":"build_your_own_vue_reactivity.html"},{"text":" 11.2. scheduler(fn) ","tagName":"H3","id":"orgdfad3b4","filename":"build_your_own_vue_reactivity.html"},{"text":" 11.3. flush() ","tagName":"H3","id":"orgb1e976c","filename":"build_your_own_vue_reactivity.html"},{"text":"ref","tagName":"H2","id":"org5fee95f","filename":"build_your_own_vue_reactivity.html"},{"text":" 12.2. RefImpl ","tagName":"H3","id":"org13d219d","filename":"build_your_own_vue_reactivity.html"},{"text":" 12.3. ObjectRefImpl ","tagName":"H3","id":"org14d1d3b","filename":"build_your_own_vue_reactivity.html"},{"text":" 12.4. triggerRef(ref) ","tagName":"H3","id":"orgc7833b8","filename":"build_your_own_vue_reactivity.html"},{"text":" 12.5. unref(ref) ","tagName":"H3","id":"orgd2f4767","filename":"build_your_own_vue_reactivity.html"},{"text":" 12.6. proxyRefs() ","tagName":"H3","id":"orgeb0d984","filename":"build_your_own_vue_reactivity.html"},{"text":" 12.7. toRefs() ","tagName":"H3","id":"orgbea3692","filename":"build_your_own_vue_reactivity.html"},{"text":" 12.8. toRef() ","tagName":"H3","id":"org19659a4","filename":"build_your_own_vue_reactivity.html"},{"text":" 12.9. trackRefValue(ref) ","tagName":"H3","id":"orgb31c412","filename":"build_your_own_vue_reactivity.html"},{"text":" 12.10. triggerRefValue(ref,newVal) ","tagName":"H3","id":"org054bb6d","filename":"build_your_own_vue_reactivity.html"},{"text":" 13. reactivity ","tagName":"H2","id":"orgbe70539","filename":"build_your_own_vue_reactivity.html"}],"aLinks":[{"text":"READY(handlers)","url":"#orgdced224","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"Global variables","url":"#orgf41c298","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"reactive(target: object)","url":"#orgd8fa75d","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"reactive with track&trigger","url":"#org4dbde4a","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createReactiveObject","url":"#org4fbb8f6","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"mutableHandlers","url":"#org87e0632","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createGetter","url":"#base-handler-createGetter","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createGetter with track","url":"#orgf38b190","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createSetter","url":"#base-handler-createSetter","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"set with trigger","url":"#orge35f622","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"deleteProperty","url":"#org3a309d9","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"delete with trigger","url":"#org2b7b4d0","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"has","url":"#base-handler-has","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"has with track","url":"#org9e54087","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ownKeys","url":"#org9cb3bc0","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ownKeys with track","url":"#org997b6a8","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"Testing","url":"#org9d8aa43","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"mutableCollectionHandlers","url":"#org07923dd","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createInstrumentationGetter","url":"#ref-collection-createInstrumentationGetter","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"mutableInstrumentations","url":"#collection-mutableInstrumentations","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"witch track & trigger","url":"#org96ba866","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"get","url":"#ref-collection-get","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"get with track","url":"#org62f21f6","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"has","url":"#ref-collection-has","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"has with track","url":"#org81b2133","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"size","url":"#ref-collection-size","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"size with track","url":"#org15ca51b","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"add","url":"#ref-collection-add","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"add with trigger","url":"#orgc6f9ba6","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"set","url":"#ref-collection-set","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"set with trigger","url":"#orgc385049","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"delete","url":"#ref-collection-delete","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"delete with trigger","url":"#org02b7191","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"clear","url":"#ref-collection-clear","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"clear with trigger","url":"#org3cf46c7","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"forEach","url":"#ref-collection-forEach","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"forEach with track","url":"#org66f070e","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"keys&values&entries","url":"#orga9e8354","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"iterator with track","url":"#org1d1ded2","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"Testing","url":"#org3ed55bf","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"phase one(no track & trigger)","url":"#org915da60","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"track&trigger&effect","url":"#orgf68fa35","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"track()","url":"#orgb2c0c52","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createDep()","url":"#org98eb104","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"wasTracked(dep)","url":"#org6fcb42b","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"newTracked(dep)","url":"#orgb354fd7","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"initDepMarkers()","url":"#orgab53f4e","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"finalizeDepMarkers()","url":"#orgbe8b366","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"trackEffects(dep, debuggerEventExtraInfo)","url":"#orge525367","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"trigger()","url":"#org76b6ae4","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"triggerEffects()","url":"#org5b4d32a","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect()","url":"#orge4c0768","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"normal objects","url":"#org5c8d1c0","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"colletion objects(Map,Set)","url":"#org8f38a80","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"phase 2 updating","url":"#orgac4a804","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"normal objects","url":"#org448f8fa","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection objects(Map,Set)","url":"#org4fce431","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"whole phase code","url":"#org4112ae8","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"Testing","url":"#orge3a3d73","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect scope","url":"#orgf673df3","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"EffectScope","url":"#orgd0f0982","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"recordEffectScope(effect, scope)","url":"#org554802f","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"onScopeDispose(fn)","url":"#org4b66f6d","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"track dep","url":"#org1128b32","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"computed","url":"#org8993f06","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"defferedComputed","url":"#orgc13111b","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"DeferredComputedRefImpl","url":"#orgc40e4e1","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"scheduler(fn)","url":"#orgdfad3b4","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"flush()","url":"#orgb1e976c","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ref","url":"#org5fee95f","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createRef()","url":"#org2a4c39a","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"RefImpl","url":"#org13d219d","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ObjectRefImpl","url":"#org14d1d3b","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"triggerRef(ref)","url":"#orgc7833b8","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"unref(ref)","url":"#orgd2f4767","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"proxyRefs()","url":"#orgeb0d984","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"toRefs()","url":"#orgbea3692","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"toRef()","url":"#org19659a4","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"trackRefValue(ref)","url":"#orgb31c412","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"triggerRefValue(ref,newVal)","url":"#org054bb6d","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"reactivity","url":"#orgbe70539","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"FootNotes","url":"#orge1683bf","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"Vue3 源码头脑风暴之 1 ☞reactivity - 若叶知秋","url":"https://www.cheng92.com/vue/vue-mind-map-reactivity/","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" JavaScript Proxy And Reflect","url":"javascript_proxy_and_reflect.html#ID-cc2b98c6-21d9-488c-9a05-8485a36c1e01","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"Dep","url":"#orgffb769c","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"globalVars","url":"#org3a9fecd","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createReactiveObject","url":"#org753f8c8","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"mutableHandlers","url":"#coderef-mutableHandlers","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" mutableCollectionHandlers","url":"#coderef-mutableCollectionHandlers","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"reactiveMap","url":"#coderef-reactiveMap","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" mutableCollectionHandlers","url":"#coderef-mutableCollectionHandlers","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"mutableHandlers","url":"#coderef-mutableHandlers","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createGetter","url":"#org635eba6","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"reactive","url":"#orgf43b15e","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createInstrumentationGetter","url":"#org0ef6cbd","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"mutableCollectionHandlers","url":"#org70199ac","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"reactive","url":"#orgf43b15e","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection-get","url":"#org6713c0b","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"reactive","url":"#orgf43b15e","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection-forEach","url":"#org430c92e","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection-clear","url":"#orgd924e97","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection-delete","url":"#org50df70b","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection-set","url":"#org016ab6d","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection-add","url":"#org7057584","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" core/effect.ts at main · vuejs/core","url":"https://github.com/vuejs/core/blob/main/packages/reactivity/src/effect.ts","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"track","url":"#org7bc92e4","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"trigger","url":"#org20630c5","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" Scheduler","url":"build_you_own_vue_scheduler.html#ID-4a858df2-f6f8-4d2f-9cda-78c12cbf42b3","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"Vue3 功能拆解② Scheduler 渲染机制 - 若叶知秋","url":"https://www.cheng92.com/vue/vue-teardown-2-sheduler/","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"2","url":"#fn.2","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" TODO:build you own vue scheduler","url":"build_you_own_vue_scheduler.html#ID-4a858df2-f6f8-4d2f-9cda-78c12cbf42b3","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect","url":"#org8981e84","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ReactiveEffect","url":"#org55c5b34","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"mutableHandlers","url":"#coderef-mutableHandlers","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" mutableCollectionHandlers","url":"#coderef-mutableCollectionHandlers","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"mutableHandlers","url":"#coderef-mutableHandlers","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" mutableCollectionHandlers","url":"#coderef-mutableCollectionHandlers","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"track","url":"#org7bc92e4","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"trigger","url":"#org20630c5","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" core/dep.ts at main · vuejs/core","url":"https://github.com/vuejs/core/blob/main/packages/reactivity/src/dep.ts","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" core/effect.ts at main · vuejs/core","url":"https://github.com/vuejs/core/blob/main/packages/reactivity/src/effect.ts#60","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"track","url":"#org7bc92e4","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ReactiveEffect","url":"#org55c5b34","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect.run","url":"#coderef-effect-run","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ReactiveEffect","url":"#org55c5b34","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"object get","url":"#orgf3b0e44","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org9f16a73","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"object has","url":"#orge215f85","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org53b2507","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"object ownKeys","url":"#org8927270","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#orgc2c5033","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"object set","url":"#org92e2c85","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org50b9af5","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"object delete","url":"#org4e38759","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org1bd8c9d","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection get","url":"#org7c441cf","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org2f84c51","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection has","url":"#orgbdc5258","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org2f84c51","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection size","url":"#orgd59fe77","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org2f84c51","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection add","url":"#orgdaf62c6","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org2f84c51","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection set","url":"#org1a7652b","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org2f84c51","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection delete","url":"#org443d0fb","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org2f84c51","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection clear","url":"#orgb94716e","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org2f84c51","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection forEach","url":"#org3fab30e","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org2f84c51","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"collection iterator","url":"#orgab43027","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"go test 🛬","url":"#org2f84c51","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"get with track","url":"#orgf3b0e44","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"reactive","url":"#org7241d5b","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect","url":"#org8981e84","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect-scope-instance","url":"#coderef-effect-scope-instance","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect-in-scope-run","url":"#coderef-effect-in-scope-run","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" nested-effect-scope-instance","url":"#coderef-nested-effect-scope-instance","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" nested-effect-in-scope-run","url":"#coderef-nested-effect-in-scope-run","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" effect-scope-set-value","url":"#coderef-effect-scope-set-value","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect-in-scope-run","url":"#coderef-effect-in-scope-run","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" nested-effect-in-scope-run","url":"#coderef-nested-effect-in-scope-run","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect-scope-stop","url":"#coderef-effect-scope-stop","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ReactiveEffect","url":"#org55c5b34","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" effect-scope-set-value-2","url":"#coderef-effect-scope-set-value-2","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ReactiveEffect","url":"#org55c5b34","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect","url":"#org8981e84","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ReactiveEffect","url":"#org55c5b34","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"recordEffectScope","url":"#orga9d3c33","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"递归层级控制","url":"#org7f325f1","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"reactive","url":"#orgf43b15e","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"effect","url":"#org8981e84","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"track","url":"#org7bc92e4","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"trigger","url":"#org20630c5","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ComputedRefImpl","url":"#orge430793","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"ReactiveEffect","url":"#org55c5b34","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"trigger","url":"#org20630c5","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"triggerEffects","url":"#orgdc3e237","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" get value","url":"#coderef-computed-get","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createGetter","url":"#org635eba6","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"FIX","url":"#org9f8c610","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"trigger","url":"#org20630c5","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":" triggerEffects(createDep(effects))","url":"#coderef-trigger-deps-length-gt-1","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"createDep()","url":"#orgffb769c","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"FIX","url":"#orgda9492d","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"computed","url":"#org315b777","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"toRefs(object)","url":"#orgf332b52","tag":"A","filename":"build_your_own_vue_reactivity.html"},{"text":"toRef(o, key, dv)","url":"#orge192d12","tag":"A","filename":"build_your_own_vue_reactivity.html"}],"toc":null}