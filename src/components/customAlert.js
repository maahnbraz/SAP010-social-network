export default (message) => {
  const customAlert = document.createElement('div');
  customAlert.classList.add('customAlert');
  customAlert.innerText = message;

  const body = document.querySelector('body');
  body.appendChild(customAlert);

  setTimeout(() => {
    body.removeChild(customAlert);
  }, 3000); // 3000 milissegundos = 3 segundos
};

// Essa é a função de criar o alert no body, ela irá durar 3 segundos