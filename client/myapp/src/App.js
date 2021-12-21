import logo from './logo.svg';
import {StreamChat} from 'stream-chat'
import React, { useState } from 'react';

import {Chat} from 'stream-chat-react'
import Cookies from 'universal-cookie'
import { ChannelListContainer, ChannelContainer, Auth } from './components';
import './App.css';
import 'stream-chat-react/dist/css/index.css';


const cookies = new Cookies();
const apiKey = '3y6ygva667g6';
//get token from cookies
const authTocken = cookies.get("token")
console.log(authTocken)
const client = StreamChat.getInstance(apiKey)

if(authTocken) {
  client.connectUser({
      id: cookies.get('userId'),
      name: cookies.get('username'),
      fullName: cookies.get('fullName'),
      image: cookies.get('avatarURL'),
      hashedPassword: cookies.get('hashedPassword'),
      phoneNumber: cookies.get('phoneNumber'),
  }, authTocken)
}

function App() {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  if(!authTocken) return <Auth />
  return (

    <div className='app__wrapper'>
      <Chat client={client} theme="team-light">
        <ChannelListContainer 
                 isCreating={isCreating}
                 setIsCreating={setIsCreating}
                 setCreateType={setCreateType}
                 setIsEditing={setIsEditing} />
        <ChannelContainer  
                  isCreating={isCreating}
                  setIsCreating={setIsCreating}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  createType={createType} /> 
      </Chat>
    </div>
  );
}

export default App;
