// Keep the existing copyEmailAction entry point while preserving the visitor's
// scroll position and keyboard focus. Shared by the main portfolio and design review routes.
(() => {
  if (!document.body.classList.contains('portfolio-design')) return;
  const spanish = document.documentElement.lang === 'es';
  const messages = spanish
    ? {success:'Correo copiado al portapapeles.',error:'No se ha podido copiar. Selecciona la dirección de correo.'}
    : {success:'Email copied to clipboard.',error:'Copy unavailable. Please select the email address.'};
  window.copyEmailAction = async () => {
    const email = document.querySelector('.design-contact-email').getAttribute('href').slice(7);
    const focus = document.activeElement;
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch { /* Retain a fallback when clipboard permission is unavailable. */ }
    if (!copied) {
      const field = document.createElement('textarea');
      field.value = email;
      field.readOnly = true;
      field.tabIndex = -1;
      field.className = 'design-copy-buffer';
      document.body.append(field);
      try {
        field.focus({preventScroll:true});
        field.select();
        copied = document.execCommand('copy');
      } catch { copied = false; }
      finally {
        field.remove();
        if (focus?.isConnected) focus.focus({preventScroll:true});
      }
    }
    triggerToast(copied ? messages.success : messages.error);
  };
})();
