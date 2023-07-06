import { onAuthStateChanged } from 'firebase/auth';
import { getLoginPage } from './pages/login/login.js';
import register from './pages/register/register';
import feed from './pages/feed/feed.js';
import { auth } from './fireBase/firebaseConfig.js';

document.addEventListener('DOMContentLoaded', async () => {
  const main = document.querySelector('#root');
  let logged = false;

  // função render preenche a main que está vazia no html
  const renderPage = () => {
    main.innerHTML = '';
    const hash = window.location.hash;

    switch (hash) {
      case '#register':
        main.appendChild(register());
        break;
      case '#homepage':
        if (logged) {
          main.appendChild(feed());
        } else {
          window.location.hash = '#login';
        }
        break;
      case '#login':
        if (!logged) {
          main.appendChild(getLoginPage());
        } else {
          window.location.hash = '#homepage';
        }
        break;
      default:
        window.location.hash = '#login';
    }
  };

  // hashchange escuta o evento de mudança de hash
  // e chama o renderPage que carrega a página referente a hash
  window.addEventListener('hashchange', renderPage);

  // escuta o evento da primeira vez que carrega a página
  // e executa o renderPage para saber qual página vai carregar
  window.addEventListener('load', renderPage);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      logged = true;
      window.location.hash = '#homepage'; // Redireciona para a página de feed
    } else {
      logged = false;
      window.location.hash = '#login'; // Redireciona para a página de login
    }
  });
});
