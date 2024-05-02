  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js'
  // If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
  import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js'
  // Add Firebase products that you want to use
  import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js'
  import { getFirestore, doc, runTransaction, collection, where, query, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js'
doc


const firebaseConfig = {
    apiKey: "AIzaSyCBvtzUQnS9Iiichm42uh7L8Q0qygSG_D0",
    authDomain: "photos-clap-app.firebaseapp.com",
    projectId: "photos-clap-app",
    storageBucket: "photos-clap-app.appspot.com",
    messagingSenderId: "631007786022",
    appId: "1:631007786022:web:1ecfeb58c6cf1b822d22e7"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  window.db = getFirestore(app)
  async function fetchClapCountsForPhotos(photoIds) {
  const photosCollectionRef = collection(db, 'photos');
  const photosQuery = query(photosCollectionRef, where('__name__', 'in', photoIds));
  try {
    const querySnapshot = await getDocs(photosQuery);
    querySnapshot.forEach(docSnapshot => {
      const photoId = docSnapshot.id;
      const clapCount = docSnapshot.data().claps || 0;
      imageCounts[photoId] = clapCount;
    });
  } catch (error) {
    console.error("Error fetching clap counts:", error);
  }
  document.getElementById('clapCount').innerHTML = imageCounts[imageGallery[0]];
}

function updateClapCountUI(photoId, clapCount) {
  const clapCountElement = document.getElementById(`clapCount_${photoId}`);
  if (clapCountElement) {
    clapCountElement.textContent = clapCount;
  }
}

fetchClapCountsForPhotos(imageGallery);
  document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clapIcon').addEventListener('click', (event) => {
    const photo_id = event.currentTarget.getAttribute("photo_id")
    ratePhoto(photo_id, db);
  });
  // document.getElementById('clapCount').innerHTML = imageCounts[imageGallery[0]];

});

function ratePhoto(photoId, db) {
  const photoRef = doc(db, 'photos', photoId);
  runTransaction(db, async (transaction) => {
    const docSnapshot = await transaction.get(photoRef);
    if (!docSnapshot.exists()) {
      transaction.set(photoRef, { claps: 1 });
    } else {
      const newClapCount = (docSnapshot.data().claps || 0) + 1;
      transaction.update(photoRef, { claps: newClapCount });
      imageCounts[photoId] += 1;
      next(false, true)
    }
  }).catch(error => {
    console.error("Transaction failed: ", error);
  });
}