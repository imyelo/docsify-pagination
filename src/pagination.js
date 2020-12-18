import query from 'component-query'
import closest from 'component-closest'
import matches from 'component-matches-selector'
import './stylesheet.css'

/**
 * constants
 */
const ROUTER_MODE = {
  HASH: 'hash',
  HISTORY: 'history',
}
const DEFAULT_OPTIONS = (config) => ({
  previousText: 'PREVIOUS',
  nextText: 'NEXT',
  crossChapter: false,
  crossChapterText: false,
  routerMode: config.routerMode || ROUTER_MODE.HASH,
})
const CONTAINER_CLASSNAME = 'docsify-pagination-container'

/**
 * basic utilities
 */
function toArray (elements) {
  return Array.prototype.slice.call(elements)
}
function findChapter (element) {
  const container = closest(element, 'div > ul > li')
  return query('p', container)
}
function findHyperlink (element) {
  return element.href ? element : query('a', element)
}
function isALinkTo (path, element) {
  if (arguments.length === 1) {
    return (element) => isALinkTo(path, element)
  }
  return decodeURIComponent(element.getAttribute('href').split('?')[0]) === decodeURIComponent(path)
}


/**
 * core renderer
 */
class Link {
  constructor (element) {
    if (!element) {
      return
    }
    this.chapter = findChapter(element)
    this.hyperlink = findHyperlink(element)
  }
  toJSON () {
    if (!this.hyperlink) {
      return
    }
    return {
      name: this.hyperlink.innerText,
      href: this.hyperlink.getAttribute('href'),
      chapterName: this.chapter && this.chapter.innerText || ''
    }
  }
}

function pagination (vm, { crossChapter, routerMode }) {
  try {
    const path = routerMode === ROUTER_MODE.HISTORY ?
      vm.route.path :
      `#${vm.route.path}`
    const all = toArray(query.all('.sidebar li a')).filter((element) => !matches(element, '.section-link'))
    const active = all.find(isALinkTo(path))
    const group = toArray((closest(active, 'ul') || {}).children)
      .filter((element) => element.tagName.toUpperCase() === 'LI')
    const index = crossChapter
      ? all.findIndex(isALinkTo(path))
      : group.findIndex((item) => {
        const hyperlink = findHyperlink(item)
        return hyperlink && isALinkTo(path, hyperlink)
      })

    const links = crossChapter ? all : group

    return {
      prev: new Link(links[index - 1]).toJSON(),
      next: new Link(links[index + 1]).toJSON(),
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
      data.prev && `
        <div class="pagination-item pagination-item--previous">
          <a href="${data.prev.href}">
            <div class="pagination-item-label">
              <svg width="10" height="16" viewBox="0 0 10 16" xmlns="http://www.w3.org/2000/svg">
                <polyline fill="none" vector-effect="non-scaling-stroke" points="8,2 2,8 8,14"/>
              </svg>
              <span>${options.previousText}</span>
            </div>
            <div class="pagination-item-title">${data.prev.name}</div>
      `,
      data.prev && options.crossChapterText && `<div class="pagination-item-subtitle">${data.prev.chapterName}</div>`,
      data.prev && `</a>
        </div>
      `,
      data.next && `
        <div class="pagination-item pagination-item--next">
          <a href="${data.next.href}">
            <div class="pagination-item-label">
              <span>${options.nextText}</span>
              <svg width="10" height="16" viewBox="0 0 10 16" xmlns="http://www.w3.org/2000/svg">
                <polyline fill="none" vector-effect="non-scaling-stroke" points="2,2 8,8 2,14"/>
              </svg>
            </div>
            <div class="pagination-item-title">${data.next.name}</div>
      `,
      data.next && options.crossChapterText && `<div class="pagination-item-subtitle">${data.next.chapterName}</div>`,
      data.next && `</a>
        </div>
      `
    ].filter(Boolean).join('')
  },
}

/**
 * installation
 */
export function install (hook, vm) {
  let options = Object.assign(
    {},
    DEFAULT_OPTIONS(vm.config),
    vm.config.pagination || {}
  )

  function render () {
    const container = query(`.${CONTAINER_CLASSNAME}`)
    if (!container) {
      return
    }
    container.innerHTML = template.inner(pagination(vm, options), options)
  }

  hook.afterEach((html) => html + template.container())
  hook.doneEach(() => render())
}
