import { useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Input from './components/Input';

import { initializeApp } from 'firebase/app';
import { collection, getFirestore, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCGRBJ_lBuNjbhfJsB4WaPLdnK0hv43UZo",
  authDomain: "chat-react-19046.firebaseapp.com",
  projectId: "chat-react-19046",
  storageBucket: "chat-react-19046.appspot.com",
  messagingSenderId: "635218782443",
  appId: "1:635218782443:web:a8fc6062b52e9ae0c2b6ae",
  measurementId: "G-BE0GZJLY1Q"
};

const appFirebase = initializeApp(firebaseConfig);

const auth = getAuth(appFirebase);

function App() {
  const formRef = useRef<FormHandles>(null);
  const [user] = useAuthState(auth);


  const messagesCollection = collection(getFirestore(appFirebase), 'messages');
  const queryMessages = query(messagesCollection);

  const [messages] = useCollectionData(queryMessages);



  async function singInGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function handleSubmit(data: any): Promise<void> {
    try {
      const response = await addDoc(messagesCollection, {
        uid: user?.uid,
        username: user?.displayName,
        text: data.text,
        photoURL: user?.photoURL,
        created_at: serverTimestamp(),
      })

      console.log(response);
      formRef.current?.reset()
    } catch (err) {
      console.log(err);
    }
  }

  console.log(messages)

  return (
    <div>
      {user && (
        <>
          <p>{user.displayName}</p>
          <p>{user.email}</p>
        </>
      )}
      {!user ? (
        <button type='button' onClick={singInGoogle}>logar</button>
      ) : (
        <>
          {messages?.map(message => (
            <div style={{ display: 'flex', padding: 16, alignItems: 'center' }}>
              <img src={message.photoURL} alt="userAvatar" style={{ height: 32, width: 32, borderRadius: '50%', marginLeft: 8 }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <p>{message.username}</p>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input name="text" />
            <button type="submit">enviar</button>
          </Form>
          <button type='button' onClick={() => signOut(auth)}>deslogar</button>
        </>
      )}
    </div>

  )
}

export default App
