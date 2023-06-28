import { getApp } from "firebase/app";
import {
    ref,
    getStorage,
    getMetadata,
    uploadBytesResumable,
    getDownloadURL,
    listAll,
    deleteObject
} from "firebase/storage";
import { get_uid } from "./firebase";

const fb_app = getApp()
// Create a root reference
const fb_store = getStorage(fb_app);


const upload_file = async (file,folder='uploads',onUpdate=(progress)=>{console.log('Upload is ' + progress + '% done')}) => {
    return new Promise((res,rej)=>{
        const uid = get_uid()
        if(!uid) rej(null)

        console.log("Upload file = "+file.name)
        // Upload file and metadata to the object 'images/mountains.jpg'
        const metadata = {
            customMetadata:{
                'isPublic':file.isPublic,
                'user_uid':uid,
                'model':file?.model
            }
        }
        const storageRef = ref(fb_store, `${folder}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onUpdate(progress)
            
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            }
        }, 
        (error) => {
            switch (error.code) {
            case 'storage/unauthorized':
                // User doesn't have permission to access the object
                break;
            case 'storage/canceled':
                // User canceled the upload
                break;
            case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                break;
            }
        }, 
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                res(downloadURL)
                console.log('File available at', downloadURL);
                
            });
        }
        );
    })
}

export default upload_file