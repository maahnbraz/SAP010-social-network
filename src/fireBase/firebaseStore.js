import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from 'firebase/firestore';

import { db } from './firebaseConfig';

export const userData = (
  nameElement,
  lastnameElement,
  emailElement,
  userElement,
) => addDoc(collection(db, 'infos-add'), {
  name: nameElement,
  lastname: lastnameElement,
  email: emailElement,
  username: userElement,
});

// aqui virá as funções de postagem, para ficarem guardadas

export const createPost = (
  date,
  username,
  text,
  uid,
) => addDoc(collection(db, 'posts'), {
  date,
  username,
  // array de likes vai guardar os displayName de todos os usuarios que curtiram uma publicação
  likes: [],
  text,
  uid,
});

export const fetchPosts = async () => {
  // pega a coleção de posts do firebase
  const postsCollection = collection(db, 'posts');
  // pega todos os documentos dentro da coleção de posts
  const snapshot = await getDocs(postsCollection);
  const posts = [];

  snapshot.forEach((firePost) => {
    // cria um objeto post para cada dado dentro do documento (ultima aba da direita)
    const post = firePost.data();
    // o post vai ter todos os campos da coleção (date, likes, text, uid, username)
    // mas tb vamos precisar do id do doc para editar ou deletar
    // pois o id é a unica referencia que é unica de cada doc
    // vamos salvar em um campo do post para, no feed, poder saber qual documento queremos alterar
    post.id = firePost.id;
    posts.push(post);
  });

  posts.sort((post1, post2) => {
    if (post1.date > post2.date) {
      return -1;
    }
    if (post1.date < post2.date) {
      return 1;
    }
    return 0;
  });

  return posts;
};

export const likeCounter = async (postId, username) => updateDoc(doc(db, 'posts', postId), {
  likes: arrayUnion(username),
});

export const deslikeCounter = async (postId, username) => updateDoc(doc(db, 'posts', postId), {
  likes: arrayRemove(username),
});

export const editPost = async (postId, newText) => {
  await updateDoc(doc(db, 'posts', postId), {
    text: newText,
  });
};

export const deletePost = async (postId) => {
  await deleteDoc(doc(db, 'posts', postId));
};
