# Web Components

## 前言

现在的前端开发都是组件化开发，而我们常用的就是 React、Vue 这两个框架。

| 框架 | 方式 |
| -- | -- |
| React | JSX 语法 |
| Vue | 单文件模板的语法 |

两者的目标都是想提供一种组件的封装方法，和我们刚开始接触的 Web 基础的 HTML、CSS、JS 的方式还是有些出入的。
今天介绍的就是，通过 HTML、CSS、JS 的方式来实现自定义的组件，也是目前浏览器原生提供的方案：Web Components。

## 什么是 Web Components ?

Web Components 是一套不同的技术，允许您创建可重用的定制元素（它们的功能封装在您的代码之外）并且在您的web应用中使用它们。

作为开发者，我们都知道尽可能多的重用代码是一个好主意。这对于自定义标记结构来说通常不是那么容易 — 想想复杂的HTML（以及相关的样式和脚本），有时您不得不写代码来呈现自定义UI控件，并且如果您不小心的话，多次使用它们会使您的页面变得一团糟。

Web Components 旨在解决这些问题 — 它由三项主要技术组成，它们可以一起使用来创建封装功能的定制元素，可以在你喜欢的任何地方重用，不必担心代码冲突。

- ` Custom elements `（自定义元素）：一组 JavaScript API，允许您定义 custom elements 及其行为，然后可以在您的用户界面中按照需要使用它们。
- ` Shadow DOM `（影子DOM）：一组JavaScript API，用于将封装的“影子”DOM树附加到元素（与主文档DOM分开呈现）并控制其关联的功能。通过这种方式，您可以保持元素的功能私有，这样它们就可以被脚本化和样式化，而不用担心与文档的其他部分发生冲突。
- ` HTML templates `（HTML模板）： [` <template> `](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/template) 和 [` <slot> `](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/slot) 元素使您可以编写不在呈现页面中显示的标记模板。然后它们可以作为自定义元素结构的基础被多次重用。

### Custom elements（自定义元素）

CustomElementRegistry.define() 方法用来注册一个 custom element，
- 语法：

``` js
customElements.define(name, constructor, options);
```
该方法接受以下参数：
- name
自定义元素名. 一个 DOMString 标准的字符串，为了防止自定义元素的冲突，必须是一个带短横线连接的名称（eg. custom-Dialog）。
- constructor
自定义元素构造器. 用于定义元素行为的 类 。
- options 可选
控制元素如何定义. 目前有一个选项支持:
extends. 指定继承的已创建的元素. 被用于创建自定义元素.
用于指定创建的元素继承自哪一个内置元素（eg. { extends: 'p' }）。

[CustomElementRegistry 接口](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry)

## 创建一个 Dialog

``` js
// custom-dialog.js
class CustomDialog extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'});
    const title = this.getAttribute('title')
    const content = this.getAttribute('content')
    const btnText = this.getAttribute('btnText')
    const domStr = `
      <link rel="stylesheet" href="./style.css">
      <button class="btn" type="button">click me</button>
      <div class="custom-dialog-box">
        <h2 class="title">${title}</h2>
        <p class="content">${content}</p>
        <button class="button">${btnText}</button>
      </div>`
    shadow.innerHTML = domStr
    this.showBtn = shadow.querySelector('.btn')
    this.hideBtn = shadow.querySelector('.button')
    this.events()
  }
  show() {
    const dialogDom = this.getDialogDom()
    dialogDom.style.display = 'block'
  }
  hide() {
    const dialogDom = this.getDialogDom()
    dialogDom.style.display = 'none'
  }
  getDialogDom() {
    return this.shadowRoot.querySelector('.custom-dialog-box')
  }
  events() {
    this.showBtn.addEventListener('click', (e) => {
      this.show()
    })
    this.hideBtn.addEventListener('click', (e) => {
      this.hide()
    })
  }
}
window.customElements.define('custom-dialog', CustomDialog);
```
在页面中使用
```html
<custom-dialog
    title="标题"
    content="内容"
    btnText="确认"
  ></custom-dialog>
<script src="./custom-dialog.js"></script>
```
- 自主定制元素：独立元素; 它们不会从内置HTML元素继承。
- 自定义内置元素：这些元素继承自 - 并扩展 - 内置HTML元素

这是一个自主定制元素，自定义内置元素参考：[自定义内置元素](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry/define#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%86%85%E7%BD%AE%E5%85%83%E7%B4%A0)


## 生命周期
自定义元素的生命周期比较简单，一共只提供了四个回调方法：


- connectedCallback：当 custom element首次被插入文档DOM时，被调用。

- disconnectedCallback：当 custom element从文档DOM中删除时，被调用。

- adoptedCallback：当 custom element被移动到新的文档时，被调用。

- attributeChangedCallback: 当 custom element增加、删除、修改自身属性时，被调用。

## shadow DOM

Web components 的一个重要属性是封装——可以将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。其中，Shadow DOM 接口是关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。本篇文章将会介绍 Shadow DOM 的基础使用。

- 可以使用 [Element.attachShadow()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attachShadow) 方法来将一个 shadow root 附加到任何一个元素上。它接受一个配置对象作为参数，该对象有一个 mode 属性，值可以是 open 或者 closed：
``` js
let shadow = elementRef.attachShadow({mode: 'open'});
let shadow = elementRef.attachShadow({mode: 'closed'});
```
- open 表示可以通过页面内的 JavaScript 方法来获取 Shadow DOM，例如使用 Element.shadowRoot 属性：

```js
let myShadowDom = myCustomElem.shadowRoot;
```
- closed，表示不可以从外部获取 ` Shadow DOM ` 了——` myCustomElem.shadowRoot ` 将会返回 null。浏览器中的某些内置元素就是如此，例如 ` <video> `，包含了不可访问的 Shadow DOM。