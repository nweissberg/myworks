import React, { useContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { auth, readRealtimeData } from "./firebase";

const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}){
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true)

    function signup(email,password){
        return createUserWithEmailAndPassword(auth, email, password)
    }
    function login(email,password){
        return signInWithEmailAndPassword(auth, email, password)
    }
    function resetPassword(email){
        return sendPasswordResetEmail(auth,email)
    }
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async user => {
            // console.log(user)
            if(!user){
                setUser(user)
                setLoading(false)
                return
            }
            var _user = {}
            await readRealtimeData("users/"+user.uid).then((user_data)=>{
                // console.log(user_data)
                _user = user_data
            })
            _user.uid = user.uid
            setUser(_user)
            setLoading(false)
        })
        return unsubscribe
    }, [])

    const value ={
        user,
        login,
        signup,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}