import EventEmitter from 'eventemitter3'
import query from 'component-query'
import closest from 'component-closest'
import matches from 'component-matches-selector'
import stylesheet from './stylesheet.css'

/**
 * constants
 */
const DEFAULT_OPTIONS = {
  previousText: 'PREVIOUS',
  nextText: 'NEXT',
}
const CONTAINER_CLASSNAME = 'docsify-pagination-container'

/**
 * installation
 */
export function install (hook, vm) {
  let options = Object.assign({}, DEFAULT_OPTIONS, vm.config.pagination || {})

  function render () {
    const container = query(`.${CONTAINER_CLASSNAME}`)
    if (!container) {
      return
    }
    container.innerHTML = template.inner(pagination(vm), options)
  }

  hook.afterEach((html) => html + template.container())
  hook.doneEach(() => render())
}

/**
 * basic utilities
 */
function toArray (elements) {
  return Array.prototype.slice.call(elements)
}
function findHyperlink (li) {
  return toArray(li.children).find((child) => child.tagName && child.tagName.toUpperCase() === 'A')
}


/**
 * core renderer
 */
class Link {
  constructor (element) {
    if (!element) {
      return
    }
    this.hyperlink = findHyperlink(element)
  }
  toJSON () {
    if (!this.hyperlink) {
      return
    }
    return {
      name: this.hyperlink.innerText,
      href: this.hyperlink.getAttribute('href'),
    }
  }
}

function pagination (vm) {
  try {
    const path = vm.route.path
    const all = toArray(query.all('.sidebar li a')).filter((element) => !matches(element, '.section-link'))
    const active = all.find((item) => item.getAttribute('href') === `#${path}`)
    const group = toArray((closest(active, 'ul') || {}).children)
      .filter((element) => element.tagName.toUpperCase() === 'LI')
    const index = group.findIndex((item) => {
      const hyperlink = findHyperlink(item)
      return hyperlink && hyperlink.getAttribute('href') === `#${path}`
    })
    return {
      prev: new Link(group[index - 1]).toJSON(),
      next: new Link(group[index + 1]).toJSON(),
    }
  } catch (error) {
    return {}
  }
}

const template = {
  container () {
    return `<div class="${CONTAINER_CLASSNAME}"></div>`
  },

  inner (data, options) {
    return [
      '<div class="pagination-item pagination-item--previous">',
      data.prev && `<a href="${data.prev.href}"><div class="pagination-item-label">${options.previousText}</div><div class="pagination-item-title">${data.prev.name}</div></a>`,
      '</div>',
      '<div class="pagination-item pagination-item--next">',
      data.next && `<a href="${data.next.href}"><div class="pagination-item-label">${options.nextText}</div><div class="pagination-item-title">${data.next.name}</div></a>`,
      '</div>',
    ].filter(Boolean).join('')
  },
}
