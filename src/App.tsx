import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';

// import Input from './components/Input';
import { IoIosLogOut, IoMdSend, IoMdHappy, IoLogoGoogle } from 'react-icons/io';

import { initializeApp } from 'firebase/app';
import { collection, getFirestore, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import './styles/global.css'

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

import GlobalStyles from './styles/global';
import { Container, Content, Header, EditorContent, MessagesContent, MessageItem } from './styles/chat';
import { format, parseISO } from 'date-fns';
import { Button } from './components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Separator } from './components/ui/separator';
import { Input } from './components/ui/input';
import EmojiPicker from 'emoji-picker-react';
import { PiPProvider, usePiPWindow } from './contextPIP';
import { LogOut, PictureInPicture } from 'lucide-react';
import PiPWindow from './components/PIPWindow';


function App() {
  const formRef = useRef<FormHandles>(null);
  const [user] = useAuthState(auth);
  const [messageText, setMessageText] = useState('')
  const { isSupported, requestPipWindow, pipWindow, closePipWindow } =
    usePiPWindow();


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
        text: messageText,
        photoURL: user?.photoURL,
        created_at: serverTimestamp(),
      })

      setMessageText('')
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
        <div className="flex flex-1 items-center justify-center h-screen">
          {/* <button type='button' onClick={singInGoogle}>logar</button> */}
          <Button onClick={singInGoogle} className="gap-2"><IoLogoGoogle />Acessar com o google</Button>
        </div>
      </>
    )
  }

  const addEmoji = (e: any) => {
    let sym = e.unified.split("-");
    let codesArray: any = [];
    sym.forEach((el: any) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setMessageText(emoji);
  };



  return (
    <>
      {/* <GlobalStyles /> */}
      <div className="flex flex-1 items-center justify-center h-screen">
        <Card className='h-[600px] w-[400px] flex flex-col'>
          <CardHeader>
            <div className="flex flex-row w-full gap-2">
              <Avatar>
                <AvatarImage src={user?.photoURL as string} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className='flex flex-1 flex-col'>
                <p className='text-sm font-bold'>{user?.displayName}</p>
                <p className='text-sm font-medium text-gray-600'>{user?.email}</p>
              </div>
              <span className="gap-2 flex">

                <Button onClick={() => requestPipWindow(400, 600)} size="icon" variant="outline">
                  <PictureInPicture size="14px" />
                </Button>
                <Button onClick={() => signOut(auth)} size="icon" variant="outline">
                  <LogOut size="14px" />
                </Button>
              </span>
            </div>
          </CardHeader>
          <Separator />
          <CardContent id='message_content' className={`flex flex-1 flex-col overflow-auto py-4 gap-2`}>
            {messages?.map(message => (
              <>
                <div className={`flex gap-1 max-w-[60%] ${message.uid === user?.uid && 'self-end'}`}>
                  {message.uid !== user?.uid && (
                    <Avatar>
                      <AvatarImage src={message.photoURL as string} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  )}
                  <div>

                    <div className={`flex flex-col flex-1 p-2 rounded-lg ${message.uid === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <p className="text-xs font-semibold ">{message.uid !== user?.uid ? message.username : 'Você'}</p>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="text-sm font-normal">{message.text}</p>
                      </div>
                    </div>
                    {message.created_at?.seconds && <span className="self-end w-full justify-end flex">
                      <p className='text-[8px] font-medium text-gray-600'>{format(new Date(message.created_at.seconds * 1000), 'dd/MM HH:mm')}</p>
                    </span>}
                  </div>
                </div>

              </>
            ))}
          </CardContent>
          <Separator />
          <CardFooter className='flex w-full items-center gap-2 p-2'>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button size="icon" variant="outline">
                  <IoMdHappy />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <EmojiPicker onEmojiClick={e => addEmoji(e)} />
              </DropdownMenuContent>
            </DropdownMenu>

            <Input className="flex-1" placeholder='Digite sua menssagem aqui' onChange={e => setMessageText(e.target.value)} />
            <Button size="icon" disabled={!messageText} onClick={handleSubmit}>
              <IoMdSend />
            </Button>
          </CardFooter>
        </Card>
      </div>
      {pipWindow && (<PiPWindow pipWindow={pipWindow}>
        <div className="flex flex-1">
          <Card className='h-[600px] w-[400px] flex flex-col'>
            <CardHeader>
              <div className="flex flex-row w-full gap-2">
                <Avatar>
                  <AvatarImage src={user?.photoURL as string} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-1 flex-col'>
                  <p className='text-sm font-bold'>{user?.displayName}</p>
                  <p className='text-sm font-medium text-gray-600'>{user?.email}</p>
                </div>
                <span className="gap-2 flex">

                  <Button onClick={() => closePipWindow()} size="icon" variant="outline">
                    <PictureInPicture size="14px" style={{ 'transform': 'rotate(180deg)' }} />
                  </Button>
                  {/* <Button onClick={() => signOut(auth)} size="icon" variant="outline">
                    <LogOut size="14px" />
                  </Button> */}
                </span>
              </div>
            </CardHeader>
            <Separator />
            <CardContent id='message_content' className={`flex flex-1 flex-col overflow-auto py-4 gap-2`}>
              {messages?.map(message => (
                <>
                  <div className={`flex gap-1 max-w-[60%] ${message.uid === user?.uid && 'self-end'}`}>
                    {message.uid !== user?.uid && (
                      <Avatar>
                        <AvatarImage src={message.photoURL as string} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                    <div>

                      <div className={`flex flex-col flex-1 p-2 rounded-lg ${message.uid === user?.uid ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-xs font-semibold ">{message.uid !== user?.uid ? message.username : 'Você'}</p>
                        <div className="flex justify-between items-baseline gap-2">
                          <p className="text-sm font-normal">{message.text}</p>
                        </div>
                      </div>
                      {message.created_at?.seconds && <span className="self-end w-full justify-end flex">
                        <p className='text-[8px] font-medium text-gray-600'>{format(new Date(message.created_at.seconds * 1000), 'dd/MM HH:mm')}</p>
                      </span>}
                    </div>
                  </div>

                </>
              ))}
            </CardContent>
            <Separator />
            <CardFooter className='flex w-full items-center gap-2 p-2'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button size="icon" variant="outline">
                    <IoMdHappy />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <EmojiPicker onEmojiClick={e => addEmoji(e)} />
                </DropdownMenuContent>
              </DropdownMenu>

              <Input className="flex-1" placeholder='Digite sua menssagem aqui' onChange={e => setMessageText(e.target.value)} value={messageText} />
              <Button size="icon" disabled={!messageText} onClick={handleSubmit}>
                <IoMdSend />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </PiPWindow>)}
    </>

  )
}

export default App
