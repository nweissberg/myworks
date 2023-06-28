import { initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, update, onValue, push, child } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, doc, setDoc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { hasUndefined } from "../utils";


// console.log(Timestamp.fromDate(new Date()).seconds)
var uid = null
// Initialize Firebase
const app = initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FB_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FB_AUTH_DOM,
    projectId: process.env.NEXT_PUBLIC_FB_PROJ_ID,
    storageBucket: process.env.NEXT_PUBLIC_FB_STORAGE,
    messagingSenderId: process.env.NEXT_PUBLIC_FB_MESSAGE,
    appId: process.env.NEXT_PUBLIC_FB_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FB_MEASURE
})

// Initialize Cloud Firestore and get a reference to the service
const fb_db = getFirestore(app);
const fb_rtdb = getDatabase(app);

export const get_uid = () => {
    return (uid)
}

export async function add_data(table, data) {
    console.log(data)
    if (!data) return
    data.user_uid = uid
    data.creation = serverTimestamp()
    try {
        const docRef = await addDoc(collection(fb_db, table), data);

        const updateTimestamp = await updateDoc(docRef, {
            uid: docRef.id
        });

        console.log("Document written with ID: ", docRef.id, updateTimestamp);
        return (docRef.id)
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export function get_data(table) {
    const collectionRef = collection(fb_db, table);
    return getDocs(query(collectionRef, where("user_uid", "==", uid)));
}

export function get_all_data(table) {
    const collectionRef = collection(fb_db, table);
    return getDocs(query(collectionRef));
}

export function get_public_data(table) {
    const collectionRef = collection(fb_db, table);
    return getDocs(query(collectionRef, where("isPublic", "==", true)));
}

export function set_data(table, data_uid, data) {
    if (!data_uid) return
    const fileRef = doc(fb_db, table, data_uid.replace(" ", ''));
    return updateDoc(fileRef, data);
}

export function del_data(table, data_uid) {
    if (!data_uid) return
    const fileRef = doc(fb_db, table, data_uid.replace(" ", ''));
    return deleteDoc(fileRef);
}

export function writeRealtimeData(path, data) {
    if (hasUndefined(data)) return null
    var path = path.replace("#", "~")
    return set(ref(fb_rtdb, path), data);
}

export function readRealtimeData(path) {
    var path = path.replace("#", "~")
    return new Promise((res, rej) => {
        onValue(ref(fb_rtdb, path), (snapshot) => {
            var read_data = snapshot.val() || null;
            res(read_data)
        }, {
            onlyOnce: true
        });
    })
}



export const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    // console.log(user)
    if (user) {
        console.log("user uid: " + user.uid)
        // get_fingerprint(user)
        uid = user.uid;
        set(ref(fb_rtdb, 'users/' + uid + '/metadata/lastSeen'), Date.now());

        get(ref(fb_rtdb, '/roles')).then((snapshot) => {
            if (snapshot.exists()) {
                var roles = snapshot.val()
                // roles.map((role, index)=>{
                //     roles_db.setItem(index.toString(),role)
                // })
                console.log(roles);
            } else {
                console.log("No roles available");
            }
        }).catch((error) => {
            console.error(error);
        });

    } else {
        uid = null;
    }
});


export default app