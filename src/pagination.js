import insertCss from 'insert-css'
import query from 'component-query'
import matches from 'component-matches-selector'

export function install (hook, vm) {
  let isReady = false

  hook.init(function () {
    css()
  })

  hook.afterEach(function (html, next) {
    if (isReady) {
      return next(render(html, pagination(vm)))
    }
    hook.ready(function () {
      isReady = true
      next(render(html, pagination(vm)))
    })
  })
}

function pagination (vm) {
  const path = vm.route.path
  const items = Array.prototype.slice.call(query.all('.sidebar li a')).filter((element) => !matches(element, '.section-link'))
  const active = items.findIndex((link) => link.getAttribute('href') === `#${path}`)
  return {
    prev: link(items[active - 1]),
    next: link(items[active + 1]),
  }
}

function link (element) {
  if (!element) {
    return
  }
  return {
    name: element.innerText,
    href: element.getAttribute('href'),
    _element: element,
  }
}

function render (html, data) {
  const template = [
    '<div class="pagination">',
    data.prev && `<div>&larr; <a href="${data.prev.href}">${data.prev.name}</a></div>`,
    data.next && `<div><a href="${data.next.href}">${data.next.name}</a> &rarr;</div>`,
    '</div>',
  ].filter(Boolean).join('')
  return html + template
}

function css () {
  const template = [
    '.pagination {',
    'padding: 1em 0;',
    'display: flex;',
    'justify-content: space-between;',
    '}',
  ].join('')

  return insertCss(template)
}
