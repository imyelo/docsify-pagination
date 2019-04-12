# docsify-pagination
> Pagination for docsify

[![npm](https://img.shields.io/npm/v/docsify-pagination.svg?style=flat-square)](https://www.npmjs.com/package/docsify-pagination)
[![license](https://img.shields.io/github/license/imyelo/docsify-pagination.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## How does it look like?
![screenshot](./_medias/screenshot.png)

## Install
1. insert script into document

  ```html
  <script src="//unpkg.com/docsify-pagination/dist/docsify-pagination.min.js"></script>
  ```

2. specify the label text (optional)

  ```javascript
  window.$docsify = {
    // ...
    pagination: {
      previousText: '上一章节',
      nextText: '下一章节',
      crossChapter: true
    },
  }
  ```

## Options
### pagination.previousText
* **Default:** ``'PREVIOUS'``
* **Type:** ``String``
* **Description:** The text of previous label.

### pagination.nextText
* **Default:** ``'NEXT'``
* **Type:** ``String``
* **Description:** The text of next label.

### pagination.crossChapter
* **Default:** `false`
* **Type:** ``Boolean``
* **Description:** Allow navigation to previous/next chapter.

## Example
- [example/index.html](example/index.html)
- [Tina.js](https://tina.js.org/)

## Related
- [docsify](https://github.com/QingWei-Li/docsify/)

## License
MIT &copy; [yelo](https://github.com/imyelo)
