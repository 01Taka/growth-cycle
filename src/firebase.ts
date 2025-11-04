// Import the functions you need from the SDKs you need
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBn2bPNdxdyTYadzvCZzE44Thy3esiZMac',
  authDomain: 'growth-cycle.firebaseapp.com',
  projectId: 'growth-cycle',
  storageBucket: 'growth-cycle.firebasestorage.app',
  messagingSenderId: '845615501334',
  appId: '1:845615501334:web:8aeb03530ccfc3768ce537',
  measurementId: 'G-HRGVMGKVL9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
