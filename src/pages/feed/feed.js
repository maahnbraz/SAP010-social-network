import { logOut } from '../../fireBase/firebaseAuth.js';
import { auth } from '../../fireBase/firebaseConfig.js';
import {
  fetchPosts,
  createPost,
  likeCounter,
  deslikeCounter,
  deletePost,
  editPost,
} from '../../fireBase/firebaseStore.js';
import customAlert from '../../components/customAlert.js';
import customEditDialog from '../../components/customEditDialog.js';
import customDialog from '../../components/customDialog.js';
import baloon from '../../img/balão1.png';

function createPostElement(post, feedElement) {
  const postElement = document.createElement('div');
  postElement.classList.add('post');
  postElement.setAttribute('data-post-id', post.id);

  const { seconds, nanoseconds } = post.date;

  const dataEmMilissegundos = seconds * 1000 + nanoseconds / 1000000;

  const data = new Date(dataEmMilissegundos);

  const ano = data.getFullYear();
  const mes = (`0${data.getMonth() + 1}`).slice(-2);
  const dia = (`0${data.getDate()}`).slice(-2);
  const hora = (`0${data.getHours()}`).slice(-2);
  const minuto = (`0${data.getMinutes()}`).slice(-2);

  const btnEdit = post.uid === auth.currentUser.uid
    ? '<p class="button-edit"><svg xmlns="http://www.w3.org/2000/svg" class="icons-post" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></p>' : '';

  const btnDelete = post.uid === auth.currentUser.uid
    ? '<p class="button-delete"id="button-delete"><svg xmlns="http://www.w3.org/2000/svg" class="icons-post" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/></svg></p>' : '';

  const content = `
    <div class='informations'>
      <p class='name'>${post.username}</p>
      <p class='date'>${dia}/${mes}/${ano} ${hora}:${minuto}</p>
    </div>
    <div class='text'>${post.text}</div>
    <div class='container-btn'>
      <div class='container-like'>
        <p id='button-like'><svg xmlns="http://www.w3.org/2000/svg" class='icons-post' width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
        </svg></p>
        <p class='like' id='text-like-count'>${post.likes.length}</p>
      </div>
      <div class='container-edit'>
        ${btnEdit}
        ${btnDelete}
      </div>
    </div>
  `;

  postElement.innerHTML = content;

  const textLikeCount = postElement.querySelector('#text-like-count');

  let processingClick = false;
  const buttonLike = postElement.querySelector('#button-like');
  buttonLike.addEventListener('click', async () => {
    const currentUser = auth.currentUser.displayName;
    const likesArray = post.likes;

    if (!processingClick) {
      processingClick = true;
      // Caso o usuario já esteja no array de likes, quer dizer que ele já deu like
      // então vamos tirar ele do array de likes
      if (likesArray.includes(currentUser)) {
        await deslikeCounter(post.id, currentUser);
        // foi removido do array de likes dessa publicação lá no Firebase
        // mas ainda precisamos tirar o usuario do array que esta na variavel local
        const index = likesArray.indexOf(currentUser);
        if (index !== -1) {
          likesArray.splice(index, 1);
        }
        // depois vamos atualizar o campo com o numero de likes
        textLikeCount.innerHTML = likesArray.length;
        processingClick = false;
      } else {
        await likeCounter(post.id, currentUser);
        // foi adicionado do array de likes dessa publicação lá no Firebase
        // mas ainda precisamos adicionar o usuario no array que esta na variavel local
        likesArray.push(currentUser);
        textLikeCount.innerHTML = likesArray.length;
        processingClick = false;
      }
    }
  });

  const buttonDelete = postElement.querySelector('#button-delete');
  if (buttonDelete) {
    buttonDelete.addEventListener('click', async () => {
      customDialog('Deseja realmente exluir o post?', async () => {
        await deletePost(post.id);

        feedElement.removeChild(postElement);
      });
    });
  }

  // Inside the createPostElement function
  const buttonEdit = postElement.querySelector('.button-edit');
  if (buttonEdit) {
    buttonEdit.addEventListener('click', () => {
      // const newText = prompt('Digite o novo texto:');
      customEditDialog(post.text, (newText) => {
        const postId = postElement.getAttribute('data-post-id');
        if (newText) {
          editPost(postId, newText)
            .then(() => {
              const textElement = postElement.querySelector('.text');
              textElement.textContent = newText;
              // atualiza a variável post localmente
              post.text = newText;
              customAlert('Post atualizado com sucesso!');
            })
            .catch(() => {
              customAlert(
                'Ocorreu um erro ao editar o post. Por favor, tente novamente mais tarde.',
              );
            });
        } else {
          customDialog('Você não pode publicar um post vazio.');
        }
      });
    });
  }

  return postElement;
}

async function showFeed() {
  const posts = await fetchPosts();
  const feedElement = document.getElementById('feed');

  feedElement.innerHTML = '';

  posts.forEach((post) => {
    const postElement = createPostElement(post, feedElement);
    feedElement.appendChild(postElement);
  });
}

export default () => {
  const feedContainer = document.createElement('div');
  feedContainer.classList.add('feed-container');

  const content = `
  <section class='container-logo'>
    <div class='logo-nome'>
      <img src='${baloon}' alt='balão'></img>
      <h2>TravellersBook</h2>
    </div>
  </section>

  <section class='container-metade'>
    <section class='header'>
      <h1 class='titleHeader'>TravellersBook<img class='logoHeader' src='${baloon}' alt='balão'></h1>

      <nav class='menu'>
        <a id='button-logout'>Sair</a>
      </nav>
    </section>

    <div class='div-line'></div>

    <section class='publish'>
      <span class ='welcome'>Olá, ${auth.currentUser.displayName}!</span>
      <textarea id='input-text' class='input-text' type='text' placeholder='Compartilhe suas aventuras...'></textarea>
      <button id='button-publish' class='button-publish'>Publicar</button>
    </section>

    <div class='div-line'></div>

    <section id='feed'></section>
  </section>
  `;

  feedContainer.innerHTML = content;

  const inputText = feedContainer.querySelector('#input-text');
  const buttonPublish = feedContainer.querySelector('#button-publish');
  buttonPublish.addEventListener('click', () => {
    if (inputText.value !== '') {
      createPost(
        new Date(),
        auth.currentUser.displayName,
        inputText.value,
        auth.currentUser.uid,
      )
        .then(() => {
          customAlert('Seu post foi publicado com sucesso');
          inputText.value = '';
          showFeed();
        })
        .catch(() => {
          customAlert('Erro ao publicar post');
        });
    } else {
      customDialog('Você não pode publicar um post vazio.');
    }
  });

  const buttonLogOut = feedContainer.querySelector('#button-logout');
  buttonLogOut.addEventListener('click', () => {
    customDialog('Deseja realmente sair?', () => {
      logOut()
        .then(() => {
          window.location.hash = '#login';
        })
        .catch(() => {
          customAlert('Erro ao sair. Tente novamente.');
        });
    });
  });

  showFeed();

  return feedContainer;
};
