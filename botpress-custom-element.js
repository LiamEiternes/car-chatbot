// botpress-custom-element.js  – ES-module
class BotpressChat extends HTMLElement {
    static observedAttributes = ['bot-id', 'client-id', 'width', 'height'];
  
    constructor () {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback () { this.#mount(); }
  
    attributeChangedCallback () { /* optional live updates */ }
  
    async #mount () {
      // 1. load Botpress webchat once
      if (!window.botpress) {
        await new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.botpress.cloud/webchat/v2.5/webchat.js';
          s.async = true;
          s.onload = res;
          s.onerror = rej;
          document.head.appendChild(s);
        });
      }
  
      // 2. make a container inside shadow DOM
      const root = this.shadowRoot;
      root.innerHTML = '';
      const host = document.createElement('div');
      host.id = 'bp-' + Math.random().toString(36).slice(2);
      host.style.width  = this.getAttribute('width')  || '100%';
      host.style.height = this.getAttribute('height') || '600px';
      root.appendChild(host);
  
      // 3. init web-chat – defaultState:'opened' drops the bubble
      botpress.init({
        botId:    this.getAttribute('bot-id'),
        clientId: this.getAttribute('client-id'),
        selector: `#${host.id}`,
        defaultState: 'opened',            // keep chat visible
        configuration: {                   // extra styling via CSS
          hideWidget: true                 // future-proof – removes FAB
        }
      });
  
      // 4. remove any fallback FAB iframe just in case
      botpress.on('webchat:initialized', () => {
        const fab = document.querySelector('iframe[name="fab"]');
        if (fab) fab.remove();
      });
    }
  }
  customElements.define('botpress-chat', BotpressChat);
  
