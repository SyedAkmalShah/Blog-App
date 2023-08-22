import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-auth.js";
import { getFirestore, setDoc, query, where, getDocs, collection, doc, addDoc,updateDoc,getDoc  } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-firestore.js";
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



const uploadFile = (file) => {
    console.log('file ', file)
    if(file){
        return new Promise((resolve, reject) => {
            const mountainsRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(mountainsRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
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
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        })
    }
}   



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
                    fullName: userFullname,
                    email: userEmail,
                    password: userPassward,
                    lastName : " ",
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
        let firstName = document.getElementById("firstname")
        let lastName = document.getElementById("lastname")
        let fullName = firstName + lastName;
        fullName = docSnap.data().fullName;
        
        let fullNameSection = document.getElementById("fullNameSection")
        if(fullNameSection) fullNameSection.innerHTML = docSnap.data().fullName + " " + docSnap.data().lastName
        localStorage.setItem('user', docSnap.data())
        localStorage.setItem('email', docSnap.data().email)

        if(firstName) {
            firstName.value = docSnap.data().fullName.split(" ")[0]
            firstName.innerHTML = docSnap.data().fullName.split(" ")[0]
        }
        if(lastName) {
            lastName.value = docSnap.data().lastName || ""
            lastName.innerHTML = docSnap.data().lastName || ""
        }
        console.log('docSnap.data() ', docSnap.data())
        if(userProfile) userProfile.src = docSnap.data().picture
    } else {
        console.log("No such document!");
    }
}

// const getUserData = async (uid) => {
//     const docRef = doc(db, "users", uid);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//         let fullName = document.getElementById("fullName")
//         console.log("fullName ", fullName)
//         let email = document.getElementById("email")
//         fullName.value = docSnap.data().fullName;
//         email.value = docSnap.data().email;
//         userProfile.src = docSnap.data().picture
//     } else {
//         console.log("No such document!");
//     }
// }


onAuthStateChanged(auth, (user) => {
    const uid = localStorage.getItem("user-id")
    if (user && uid) {
        console.log('iffff')
        getUserData(user.uid)
        if(!location.pathname.includes('/profile.html') && (!location.pathname.includes('/dashboard.html'))){
            location.href = "profile.html"
        }
    } else {
        console.log('elseee')
        if (location.pathname.includes('/index.html') && location.pathname.includes("/register.html")) {
            location.href = "index.html"
        }
    }
});


let dashBtn = document.getElementById("dashBtn");
dashBtn && dashBtn.addEventListener("click", (e) => {
    console.log('zee')
    location.href="dashboard.html"
})

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
logoutBtn && logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
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


let updatePro = document.getElementById("update-btn");

if(updatePro){
    updatePro && updatePro.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
            let newUserName = document.getElementById("firstname").value;
            let newLastName = document.getElementById("lastname").value;
            let uid = localStorage.getItem("user-id");

            console.log('newLastName ', newLastName)
            
            const fileInput = document.getElementById("FileInput");
            const imageUrl = await uploadFile(fileInput.files[0]);

            let dataUpdate ={ 
                    fullName: newUserName,
                    lastName: newLastName,
                    picture: imageUrl
            }

            if(!imageUrl) delete dataUpdate.picture
            
            const washingtonRef = doc(db, "users", uid);
            await updateDoc(washingtonRef, dataUpdate);
    
            Swal.fire({
                icon: 'success',
                title: 'User updated successfully',
            }).then(() => {
                // window.location.assign('dashboard.html');
            });
        } catch (error) {
            console.log('error ', error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.message,
            });
        }
    });
    
}


const fileInput = document.getElementById("FileInput");
fileInput && fileInput.addEventListener("change", () => {
    const profilePicture = document.getElementById("profile-picture");
    profilePicture.src = URL.createObjectURL(fileInput.files[0]);
});


let postBlogBtn = document.getElementById("postBlogBtn");

postBlogBtn && postBlogBtn.addEventListener("click", async(e) => {
    e.preventDefault()
    let blogTitle = document.getElementById("blogTitle").value;
    let blogBody = document.getElementById("blogBody").value;
    let email =  localStorage.getItem('email');

    try {
        const docRef = await addDoc(collection(db, "blogs"), {
            blogTitle: blogTitle,
            email : email,
            blogBody: blogBody
          });

        Swal.fire({
            icon: 'success',
            title: 'Blog Added Sucessfully',
        }).then(()=>{
            window.location.reload();
        })
      } catch (e) {
        console.error("Error adding document: ", e);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message,
        });
      }


})

const blogList = document.getElementById('blogList');

if (blogList) {
    async function fetchBlogByEmail(email) {
        const blogsCollection = collection(db, "blogs");
      
        // Perform a query to find the document with the specified email key
        const q = query(blogsCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);
      
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const data = doc.data();
                console.log('data ', data)
          });
        } else {
          console.log("No such document!");
        }
      }
      
      // Call the function with the desired email
      const emailToFetch = "qazi@gmail.com";
      fetchBlogByEmail(emailToFetch);
}
