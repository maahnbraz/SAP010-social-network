export default (text, onClickOk) => {
  const editDialog = document.createElement('div');
  editDialog.classList.add('dialog-background');

  const body = document.querySelector('html');

  const content = `
    <div class='edit-dialog'>
      <textarea id='input-message'>${text}</textarea>
      <div class='div-btn-dialog'>
        <button id='btn-cancel'>Cancelar</button>
        <button id='btn-ok'>OK</button>
      </div>
    </div>
  `;
  editDialog.innerHTML = content;

  const inputMessage = editDialog.querySelector('#input-message');
  const btnCancel = editDialog.querySelector('#btn-cancel');
  const btnOk = editDialog.querySelector('#btn-ok');

  btnCancel.addEventListener('click', () => {
    body.removeChild(editDialog);
  });

  btnOk.addEventListener('click', () => {
    const newText = inputMessage.value;
    onClickOk(newText);
    body.removeChild(editDialog);
  });

  body.appendChild(editDialog);
};
