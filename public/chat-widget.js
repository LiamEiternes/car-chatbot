<script>
(() => {
  const bubble = Object.assign(document.createElement('div'), {
    id:'chat-bubble', innerText:'💬', style:'...fixed styles...'
  });
  document.body.appendChild(bubble);

  let open = false, pane;
  bubble.onclick = () => {
    if (open) { pane.remove(); open = false; return;}
    pane = document.body.appendChild(Object.assign(
      document.createElement('iframe'),
      {src:'/chat-ui.html', style:'...iframe styles...'}
    ));
    open = true;
  };
})();
</script>
