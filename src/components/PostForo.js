import React, { useState, useEffect } from 'react';
import Comment from './Comment';
import {auth} from '../firebase';
import {useAuth} from '../context/authContext';
import { deleteDoc, onSnapshot, getDocs, doc, setDoc, addDoc, collection, query, where, collectionGroup } from "firebase/firestore";
import { db } from "../firebase";
import Loader from './Loader';


const PostForo = ({ question, deletePost, id, autorEmail, autorName, imageProfile, PostId, Hour, Datte, uid }) => {
    const [loading, setLoading] = useState(false);
    const {user} = useAuth()
    
    const [showComments, setShowComments] = useState(false);
    
    const handleShowComments = () => {
        setShowComments(!showComments)
    }
    
    // createcomments
    
    
    const [message, setMessage] = useState("");
    
    const [messageList, setMessageList] = useState([]);
    


    const messageDocumentRef = collection(db, `posts`, `${PostId}`, `messages`);

    const createMessage = async () => {
        await addDoc(messageDocumentRef,{message, author: { name: auth.currentUser.displayName, uid: auth.currentUser.uid, email: auth.currentUser.email, image: auth.currentUser.photoURL }}
         );
         setMessage("")
      };

      const deleteCmt = async (id) =>{
        setLoading(true);
        
        const commentDoc = doc(db, `posts/${PostId}/messages`, id);
        
        await deleteDoc(commentDoc);
        setLoading(false);
        
        
      };
    
    useEffect(() => {

        const getMessage = async () => {

            const data = await getDocs(messageDocumentRef);

            setMessageList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))

        }

        
            getMessage()
            .catch(console.error);;
        

    }, [deleteCmt, createMessage]);
    
      const handleChange = (e) => {
        // (e)=>{setMessage(e.target.value)}
        let target = e.target.value;
        setMessage(target)        
      }


    return (
        <div className="post-box" >
            <div className="header-stripe">
            {autorName && autorName === "Vittorio Guidano" ? <i className="fa-solid fa-star"></i> : <i className="fa-solid fa-user-astronaut"></i>}
            <p className='post-time-register'>{Hour}</p>
            <p className='post-time-register'>{Datte}</p>
            {user && uid === auth.currentUser.uid &&
            <button className='trash-post' > <i onClick={() => { deletePost(PostId) }} className="fa-solid fa-trash-can"></i> </button>}
            </div>
            <div className="header-box">
                <div className="title-and-message">
                </div>
            </div>
            <div className="description-box">
                <div className="user-pic">
                {/* {imageProfile || "https://www.nicepng.com/png/detail/202-2022264_usuario-annimo-usuario-annimo-user-icon-png-transparent.png"} */}
                    <img src={autorName ? imageProfile : "https://www.nicepng.com/png/detail/202-2022264_usuario-annimo-usuario-annimo-user-icon-png-transparent.png"}
                     alt="profile-image" />
                </div>
                <div className='comments-message-post'>
                <p>{question}</p>
                </div>
                
            </div>
            <p className='autor-user'>{autorName ? ("@"+ autorName) : autorEmail}</p>
            <div className="arrow-box">
                
           {!showComments ? <i onClick={handleShowComments} className="fa-solid fa-angles-down"></i> : <i onClick={handleShowComments} className="fa-solid fa-angles-up"></i>}
            </div>
            {/* comments box */}
            <div className={!showComments ? 'hidden-comments' : ' send-comments-bar'}>
                
                <div className="comments-box">
                    <div className="user-pic">
                        <img className='comment-image-profil' src={user && auth.currentUser.photoURL ? auth.currentUser.photoURL : "https://www.nicepng.com/png/detail/202-2022264_usuario-annimo-usuario-annimo-user-icon-png-transparent.png"} alt="profile-image" />
                    </div>
                    <textarea id='textarea-post2' onChange={handleChange} maxLength="300" className='comments-bottom-box' type="text" placeholder='Escribe un comentario' value={message} />
                    <button onClick={createMessage} className='btn-send-comments'><i className="fa-solid fa-paper-plane"></i></button>
                </div>
                <div className="all-comments-box">
                
                <div className="Loader-box-center">
                {loading && <Loader/>}
                </div>

                { messageList.map((msg)=>{
                    
                    return (
                        <Comment 
                        key={msg.id}
                        id={msg.id}
                        cmt={msg.message}
                        email={msg.author.email}
                        name={msg.author.name}
                        photo={msg.author.image}
                        uid={msg.author.uid}
                        deleteCmt={deleteCmt}
                        />                        
                    )
                    
                }) }

                </div>
            </div>
            
        </div>
    )
}

export default PostForo