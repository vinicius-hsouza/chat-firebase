import { useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

import Input from './components/Input';
import { IoIosLogOut, IoMdSend } from 'react-icons/io';

import { initializeApp } from 'firebase/app';
import { collection, getFirestore, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAeAIXIS2QguWT5y68D0C_t6KdPEcwDYrU",
  authDomain: "chat-b0b8a.firebaseapp.com",
  projectId: "chat-b0b8a",
  storageBucket: "chat-b0b8a.appspot.com",
  messagingSenderId: "715813577725",
  appId: "1:715813577725:web:219f4915fa35dd6343ef94",
  measurementId: "G-YSF3LRCL8T"
};

const appFirebase = initializeApp(firebaseConfig);

const auth = getAuth(appFirebase);

import GlobalStyles from './styles/global';
import { Container, Content, Header, EditorContent, MessagesContent, MessageItem } from './styles/chat';
import { format, parseISO } from 'date-fns';

function App() {
  const formRef = useRef<FormHandles>(null);
  const [user] = useAuthState(auth);


  const messagesCollection = collection(getFirestore(appFirebase), 'messages');
  const queryMessages = query(messagesCollection, orderBy('created_at'));

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

  useEffect(() => {
    var objDiv = document.getElementById("message_content");
    if (objDiv) {
      objDiv.scrollTop = objDiv.scrollHeight;
    }
  }, [messages])

  if (!user) {

    return (
      <>
        <GlobalStyles />
        <Container>
          <button type='button' onClick={singInGoogle}>logar</button>
        </Container>
      </>
    )
  }

  return (
    <>
      <GlobalStyles />
      <Container>
        <Content>
          <Header>
            <img src={user?.photoURL || undefined} alt="userAvatar" />
            <div>
              <p>{user?.displayName}</p>
              <p>{user?.email}</p>
            </div>
            <span>
              <div onClick={() => signOut(auth)}>
                <IoIosLogOut />
              </div>
            </span>
          </Header>
          <MessagesContent id="message_content">
            {messages?.map(message => (
              <MessageItem isUserLogged={message.uid === user?.uid}>
                {message.uid !== user?.uid && <img src={message.photoURL} alt="userAvatar" />}
                {<div >
                  {message.uid !== user?.uid ? <p>{message.username}</p> : <p></p>}
                  <p>{message.text}</p>
                  {message.created_at?.seconds && <span>
                    <p>{format(new Date(message.created_at.seconds * 1000), 'HH:mm')}</p>
                  </span>}
                </div>}

              </MessageItem>
            ))}
          </MessagesContent>
          <EditorContent>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Input name="text" placeholder="digite aqui" />
              <div onClick={() => formRef.current?.submitForm()}>
                <IoMdSend />
              </div>
            </Form>
          </EditorContent>
          {/* 
          {!user ? (
            <button type='button' onClick={singInGoogle}>logar</button>
          ) : (
            <>

              <Form ref={formRef} onSubmit={handleSubmit}>
                <Input name="text" />
                <button type="submit">enviar</button>
              </Form>
              <button type='button' onClick={() => signOut(auth)}>deslogar</button>
            </>
          )} */}
        </Content>
      </Container>
    </>

  )
}

export default App
