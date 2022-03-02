/** jsx?|tsx? file header */

export function addValine() {
  // valine ///////////////////////////////////////////////////////////////////
  $('#content').append(`
    <button id="toggle-valine" type="button" class="btn btn-success">
      显示 <a target="_blank" href="https://valine.js.org/">Valine</a> 评论系统
    </button>
    <div id="vcomments" style="display:none"></div>
    <script>
      new Valine({
          el: '#vcomments',
          appId: 'dwjufJhAgWQzU3evb1th5SrC-gzGzoHsz',
          appKey: 'z7BITHKt5oI9zuxdfp8X9tUN'
      })
    </script>`)
  // 监听事件
  $('#toggle-valine').click(function () {
    $('#vcomments').toggle()
  })

  $('#toggle-valine').click(() => $('#vcomments').toggle())
}
