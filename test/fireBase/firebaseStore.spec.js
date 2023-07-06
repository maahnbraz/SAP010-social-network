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

import {
  createPost,
  fetchPosts,
  likeCounter,
  deslikeCounter,
  deletePost,
  editPost,
  userData,
} from '../../src/fireBase/firebaseStore.js';

jest.mock('firebase/firestore');

beforeEach(() => {
  jest.resetAllMocks();
});

const post1 = {
  date: 1,
  username: 'usuário1',
  text: '1 - mensagem escrita no input',
  uid: 'uid001',
};

const post2 = {
  date: 2,
  username: 'usuário2',
  text: '2 - mensagem escrita no input',
  uid: 'uid002',
};

const post3 = {
  date: 3,
  username: 'usuário3',
  text: '3 - mensagem escrita no input',
  uid: 'uid003',
};

const post4 = {
  date: 3,
  username: 'usuário4',
  text: '4 - mensagem escrita no input',
  uid: 'uid004',
};

const posts = [post4, post3, post2, post1];
describe('Função fetchPosts', () => {
  it('Esperado o retorno de um array de posts ordenados por data e hora decrescente', async () => {
    const docs = [
      { data: () => post1 },
      { data: () => post4 },
      { data: () => post2 },
      { data: () => post3 },
    ];
    const postsCollection = { docs };
    collection.mockReturnValueOnce(postsCollection);
    getDocs.mockResolvedValueOnce(docs);

    const result = await fetchPosts();

    expect(typeof fetchPosts).toBe('function');
    expect(collection).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledWith(undefined, 'posts');
    expect(getDocs).toHaveBeenCalledTimes(1);
    expect(getDocs).toHaveBeenCalledWith(postsCollection);
    expect(result).toEqual(posts);
  });
});

const postTestLike = {
  id: 111,
  likes: ['usuário2', 'usuário1', 'usuário3'],
};

const userTestDeslike = 'usuário1';

describe('Função deslikeCounter', () => {
  it('Esperado que o usuário seja removido do array de likes', async () => {
    const documentReference = {};
    const updatedDeslikes = ['usuário2', 'usuário3'];

    updateDoc.mockResolvedValueOnce();
    arrayRemove.mockReturnValueOnce(updatedDeslikes);
    doc.mockReturnValueOnce(documentReference);

    await deslikeCounter(postTestLike.id, userTestDeslike);

    expect(typeof deslikeCounter).toBe('function');
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', postTestLike.id);
    expect(arrayRemove).toHaveBeenCalledTimes(1);
    expect(arrayRemove).toHaveBeenCalledWith(userTestDeslike);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(documentReference, {
      likes: updatedDeslikes,
    });
  });
});

const userTestlike = 'usuário4';

describe('Função likeCounter', () => {
  it('Esperado que o usuário seja adicionado no array de likes', async () => {
    const documentReference = {};
    const updatedLikes = ['usuário1', 'usuário2', 'usuário3', 'usuário4'];

    updateDoc.mockResolvedValueOnce();
    arrayUnion.mockReturnValueOnce(updatedLikes);
    doc.mockReturnValueOnce(documentReference);

    await likeCounter(postTestLike.id, userTestlike);

    expect(typeof likeCounter).toBe('function');
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', postTestLike.id);
    expect(arrayUnion).toHaveBeenCalledTimes(1);
    expect(arrayUnion).toHaveBeenCalledWith(userTestlike);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(documentReference, {
      likes: updatedLikes,
    });
  });
});

// Testando a função deleteDoc do Firestore
describe('deletePost', () => {
  it('Deveria excluir a postagem com o ID fornecido', async () => {
    const postId = 'post1';

    // Chamar a função deletePost com o ID da postagem
    await deletePost(postId);

    // Verificar se a função deleteDoc foi chamada corretamente
    expect(deleteDoc).toHaveBeenCalledWith(doc(undefined, 'posts', postId));
  });
});

// Testando função de apagar post pagina Feed
describe('Função delete', () => {
  it('Deve deletar uma publicação', async () => {
    const mockDoc = 'doc';
    doc.mockReturnValueOnce(mockDoc);
    deleteDoc.mockResolvedValueOnce();
    const postId = 'id-post';
    await deletePost(postId);
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', postId);
    expect(deleteDoc).toHaveBeenCalledTimes(1);
    expect(deleteDoc).toHaveBeenCalledWith(mockDoc);
  });
});

// Testando função de editar pagina Feed
describe('Função editPost', () => {
  it('Deve editar uma publicação', async () => {
    updateDoc.mockResolvedValue();
    const mockDoc = 'doc';
    doc.mockReturnValueOnce(mockDoc);
    const postId = 'idPost';
    const textArea = 'conteudoPost';
    const updatedPost = {
      text: textArea,
    };
    await editPost(postId, textArea);
    expect(doc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalledWith(undefined, 'posts', postId);
    expect(updateDoc).toHaveBeenCalledTimes(1);
    expect(updateDoc).toHaveBeenCalledWith(mockDoc, updatedPost);
  });
});

describe('teste userData', () => {
  it('deve acessar os dados do usuário e guardar na coleção', async () => {
    addDoc.mockResolvedValueOnce();
    const mockCollection = 'collection';
    collection.mockReturnValueOnce(mockCollection);
    const name = 'nome';
    const lastname = 'sobrenome';
    const email = 'teste@email.com';
    const username = 'displayName';
    const infosAdd = {
      name,
      lastname,
      email,
      username,
    };
    await userData(name, lastname, email, username);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(mockCollection, infosAdd);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledWith(undefined, 'infos-add');
  });
});

describe('Função createPost', () => {
  it('deve criar um post e guardar na coleção', async () => {
    addDoc.mockResolvedValueOnce();
    const mockCollection = 'collection';
    collection.mockReturnValueOnce(mockCollection);

    const dataPostagem = 'xx/xx/xxxx';
    const username = 'usernameTeste';
    const postagem = 'texto';
    const userId = 'usernameteste';
    const newPost = {
      date: dataPostagem,
      username,
      likes: [],
      text: postagem,
      uid: userId,
    };
    await createPost(dataPostagem, username, postagem, userId);

    expect(addDoc).toHaveBeenCalledTimes(1);
    expect(addDoc).toHaveBeenCalledWith(mockCollection, newPost);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledWith(undefined, 'posts');
  });
});
