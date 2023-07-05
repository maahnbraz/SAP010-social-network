export default (text, onClickOk) => {
  const dialog = document.createElement('div');
  dialog.classList.add('dialog-background');

  const body = document.querySelector('html');

  const content = `
    <div class='dialog'>
      <span id='input-message'>${text}</span>
      <div class='div-btn-dialog'>
        <button id='btn-cancel'>Cancelar</button>
        <button id='btn-ok'>OK</button>
      </div>
    </div>
  `;
  dialog.innerHTML = content;

  const inputMessage = dialog.querySelector('#input-message');
  const btnCancel = dialog.querySelector('#btn-cancel');
  const btnOk = dialog.querySelector('#btn-ok');

  btnCancel.addEventListener('click', () => {
    body.removeChild(dialog);
  });

  btnOk.addEventListener('click', () => {
    const newText = inputMessage.value;
    onClickOk(newText);
    body.removeChild(dialog);
  });

  body.appendChild(dialog);
};
