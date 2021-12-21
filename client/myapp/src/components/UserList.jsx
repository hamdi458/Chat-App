import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets';

//react functional component all react functional components have acces
//to a specific prop call children
const ListContainer = ({children}) =>{
return(
    <div className='user-list__container'>
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
    </div>
)
}
const UserItem = ({user, setSelectedUsers}) =>{
    const [slected, setSelected] = useState(false);
    const handleSelect = () => {
        if(slected){
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        }
        else{
            //create an array where we spread all the previous users finally append our current user id to it 
            setSelectedUsers((prevUsers)=>[... prevUsers, user.id])
        }
        setSelected((prevSelected) => !prevSelected);
    }
    return(                                 
        <div className="user-item__wrapper" onClick={handleSelect}>
        <div className="user-item__name-wrapper">
            <Avatar  image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">{user.fullName || user.id}</p>
            <p className="user-item__name">{user?.user?.fullName || user?.user?.id}</p>
           
        </div>
            {slected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
    </div>
    )
    }








const UserList = ({setSelectedUsers}) => {
    //get the connect client
    const {client} = useChatContext();
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false)
    const [error, setError] = useState(false);
    useEffect(() => {
        const getUsers = async () =>{
            if(loading) return;
            setLoading(true);
            try{
                //find all users withous ourselves
                const response = await client.queryUsers(
                    //ne = not equal
                    {id:{$ne: client.userID}},
                    //sort
                    {id: 1},
                    {limit : 10}

                );
                //set users to be equal to response.users
                if (response.users.length){
                    setUsers(response.users);

                }else {
                    setListEmpty(true)
                }

            }catch(error){
            setError(true);
            }
            setLoading(false);
        }
        //if we're connected
        if(client) getUsers();

    },[])
    if(error){
        return(
            <ListContainer>
            <div className='user-list__message'>
                Error loading, please refresh and try again
            </div>
            </ListContainer>
        )
    }
    if(listEmpty){
        return(
            <ListContainer>
            <div className='user-list__message'>
                No Users Found
            </div>
            </ListContainer>
        )
    }
    return (
        <ListContainer>
            {loading ? <div className="user-list__message">
                Loading users...
            </div> : (
                users?.map((user, i) => (
                  <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers}/>  
                ))
            )}
        </ListContainer>
    )
}

export default UserList
