/** jsx?|tsx? file header */

function changeTheme(name = 'my') {
  $('body').append(`/assets/css/themes/theme.${name}.css`)
}
