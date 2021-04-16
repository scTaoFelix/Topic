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

  // static get observedAttributes() {
  //   return ['title', 'content', 'btnText'];
  // }
  /* connectedCallback() {
    console.log('Custom square element added to page.');

  }

  disconnectedCallback() {
    console.log('Custom square element removed from page.');
  }

  adoptedCallback() {
    console.log('Custom square element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed. attributeChangedCallback： ',name, oldValue, newValue);
    updateStyle(this);
  } */
}

window.customElements.define('custom-dialog', CustomDialog);