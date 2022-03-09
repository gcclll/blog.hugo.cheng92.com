/** jsx?|tsx? file header */

export default Vue.defineComponent({
  template: `
<a :href="item.link">
  <div class="hit-container">
    <div class="hit-icon">
      <svg width="20" height="20" viewBox="0 0 20 20"><path d="M13 13h4-4V8H7v5h6v4-4H7V8H3h4V3v5h6V3v5h4-4v5zm-6 0v4-4H3h4z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    </div>
    <div class="hit-content-wrap">
      <span class="hit-title" v-html="item.title"></span>
      <span class="hit-path">{{item.link}}</span>
    </div>
    <div class="hit-action">
      <svg class="DocSearch-Hit-Select-Icon" width="20" height="20" viewBox="0 0 20 20"><g stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><path d="M18 3v4c0 2-2 4-4 4H2"></path><path d="M8 17l-6-6 6-6"></path></g></svg>
    </div>
  </div>
</a>`,
  props: {
    item: Object
  }
})
