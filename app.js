import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, setDoc, doc,updateDoc,getDoc  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyC-6n7Pewic3VBpVPfcrpyHmnQL4N_ln94",
    authDomain: "hackathon-blogapp.firebaseapp.com",
    projectId: "hackathon-blogapp",
    storageBucket: "hackathon-blogapp.appspot.com",
    messagingSenderId: "1074500492533",
    appId: "1:1074500492533:web:4dd397a30b96096144f9bc"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage();

const userProfile = document.getElementById("profile-picture");



// const uploadFile = (file) => {
//     return new Promise((resolve, reject) => {
//         const mountainsRef = ref(storage, `images/${file.name}`);
//         const uploadTask = uploadBytesResumable(mountainsRef, file);
//         uploadTask.on('state_changed',
//             (snapshot) => {
//                 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//                 console.log('Upload is ' + progress + '% done');
//                 switch (snapshot.state) {
//                     case 'paused':
//                         console.log('Upload is paused');
//                         break;
//                     case 'running':
//                         console.log('Upload is running');
//                         break;
//                 }
//             },
//             (error) => {
//                 reject(error)
//             },
//             () => {
//                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//                     resolve(downloadURL);
//                 });
//             }
//         );
//     })
// }   



let registerBtn = document.getElementById("reg-Btn");

registerBtn && registerBtn.addEventListener("click", (e) => {
    e.preventDefault()
    let userEmail = document.getElementById("reg-email").value;
    let userPassward = document.getElementById("reg-password").value;
    let userFullname = document.getElementById("reg-fullname").value;

    createUserWithEmailAndPassword(auth, userEmail, userPassward)
        .then(async (userCredential) => {
            try {
                const user = userCredential.user;
                await setDoc(doc(db, "users", user.uid), {
                    Fullname: userFullname,
                    Email: userEmail,
                    Password: userPassward
                });

                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Register Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                localStorage.setItem("user-id", user.uid);
                location.replace("profile.html")
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message,
                })
            }
        })
        .catch((error) => {
            const errorMessage = error.message;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            })
        });


})

const getUserData = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        let fullName = document.getElementById("fullName")
        let email = document.getElementById("email")
        console.log("Document data:", docSnap.data());
        fullName.value = docSnap.data().fullName;
        email.value = docSnap.data().email;
        // userProfile.src = docSnap.data().picture
    } else {
        // console.log("No such document!");
    }
}

onAuthStateChanged(auth, (user) => {
    const uid = localStorage.getItem("user-id")
    if (user && uid) {
        getUserData(user.uid)
        if (location.pathname !== '/profile.html') {
            location.href = "profile.html"
        }
    } else {
        if (location.pathname !== '/index.html' && location.pathname !== "/register.html") {
            location.href = "index.html"
        }
    }
});


let loginBtn = document.getElementById("login-btn");
loginBtn && loginBtn.addEventListener("click", (e) => {
    e.preventDefault()
    let loginEmail = document.getElementById("email-login").value;
    let loginPasssword = document.getElementById("login-password").value;
    signInWithEmailAndPassword(auth, loginEmail, loginPasssword)
        .then(async (userCredential) => {
            try {
                const user = userCredential.user;
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Login Successfully!',
                    showConfirmButton: false,
                    timer: 1500
                })
                localStorage.setItem("user-id", user.uid);
                location.replace("profile.html");
            } catch(error){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message,
                })
            }

        })
        .catch((error) => {
            const errorMessage = error.message;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            })
        });


})


let logoutBtn = document.getElementById("logout-btn");
logoutBtn && logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Logout Successfully!',
            showConfirmButton: false,
            timer: 1500
        })
        localStorage.clear();
        location.replace("index.html");
    }).catch((error) => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        })
    });
})


// let updatePro = document.getElementById("update-btn");
// updatePro && updatePro.addEventListener("click", async (e) => {
//     e.preventDefault();
//     try {
//         let newUserName = document.getElementById("firstname").value;
//         let newLastName = document.getElementById("lastname").value;
//         let uid = localStorage.getItem("user-id");
        
//         const fileInput = document.getElementById("FileInput");
//         // const imageUrl = await uploadFile(fileInput.files[0]);
        
//         const washingtonRef = doc(db, "users", uid);
//         await updateDoc(washingtonRef, {
//             fullName: newUserName,
//             lastName: newLastName,
//             // picture: imageUrl
//         });

//         Swal.fire({
//             icon: 'success',
//             title: 'User updated successfully',
//         }).then(() => {
//             window.location.assign('dashboard.html');
//         });
//     } catch (error) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Oops...',
//             text: error.message,
//         });
//     }
// });


let updatePro = document.getElementById("update-btn");
updatePro && updatePro.addEventListener("click", async (e) => {
    e.preventDefault()
    try {
        let newUserName = document.getElementById("firstname").value;
        let newLastName = document.getElementById("lastname").value;
        let uid = localStorage.getItem("user-id"); // Fixed: Changed "uid" to "user-id"
        
        const fileInput = document.getElementById("FileInput"); // Moved the declaration to this scope
        
        const imageUrl = await uploadFile(fileInput.files[0]); // Fixed: Used "fileInput" instead of "FileInput"
        
        const washingtonRef = doc(db, "users", uid);
        await updateDoc(washingtonRef, {
            fullName: newUserName, // Fixed: Used "newUserName" instead of "fullName.value"
            lastName: newLastName, // Added: Updating last name
            picture: imageUrl
        });


        Swal.fire({
            icon: 'success',
            title: 'User updated successfully',
           
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        });
        window.location.assign('dashBoard.html')
    }
});


const fileInput = document.getElementById("FileInput");
fileInput.addEventListener("change", () => {
    const profilePicture = document.getElementById("profile-picture");
    profilePicture.src = URL.createObjectURL(fileInput.files[0]);
});
