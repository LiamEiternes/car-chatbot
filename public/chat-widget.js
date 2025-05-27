const BASE = "https://car-chatbot-2j8sp49v0-liam-eiternesnos-projects.vercel.app";

(() => {
  const bubble = Object.assign(document.createElement('div'), {
    id: 'chat-bubble',
    textContent: '💬',
    style: 'position:fixed;bottom:1rem;right:1rem;font-size:2.4rem;' +
           'cursor:pointer;z-index:9999;'
  });
  document.body.appendChild(bubble);

  let open = false, pane;
  bubble.onclick = () => {
    if (open) { pane.remove(); open = false; return; }
    pane = Object.assign(document.createElement('iframe'), {
      /* 3.  ABSOLUTE  URL — uses BASE  */
      src: `${BASE}/chat-ui.html`,
      style: 'position:fixed;bottom:4rem;right:1rem;width:320px;height:480px;border:none;'
    });
    document.body.appendChild(pane);
    open = true;
  };
})();
