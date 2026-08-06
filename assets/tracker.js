import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

async function trackVisit() {
  const pathParts = window.location.pathname.split('/').filter(p => p);
  
  // Check if URL matches pattern /[user]/[company]
  // We avoid matching simple paths like /assets or /favicon.ico just in case
  if (pathParts.length === 2 && pathParts[0] !== 'assets') {
    const user = decodeURIComponent(pathParts[0]);
    const company = decodeURIComponent(pathParts[1]);
    
    try {
      // 1. Get Location and IP
      const ipResponse = await fetch('https://ipapi.co/json/');
      const ipData = await ipResponse.json();
      
      // 2. Initialize Firebase
      // (Only initializes if config is filled out to prevent errors before setup)
      if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // 3. Save to Firestore
        await addDoc(collection(db, "portfolio_visits"), {
          user: user,
          company: company,
          ip: ipData.ip || 'Unknown',
          location: `${ipData.city || ''}, ${ipData.region || ''}, ${ipData.country_name || ''}`.trim(),
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
      } else {
        console.warn("Firebase not configured. Visit not logged to Firestore.");
      }
      
      // 4. Update UI Greeting
      updateGreeting(user, company);
      
    } catch (error) {
      console.error("Error tracking visit:", error);
    }
  }
}

function updateGreeting(user, company) {
  // Find a suitable place to inject the greeting.
  const titleEl = document.querySelector('h1.display-3');
  if (titleEl) {
    const greeting = document.createElement('h2');
    greeting.className = 'display-6 text-primary mb-3 fw-bold';
    // Capitalize first letters
    const formatName = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    greeting.innerText = `Welcome ${formatName(user)} from ${formatName(company)}!`;
    titleEl.parentNode.insertBefore(greeting, titleEl);
  }
}

// Run tracking
trackVisit();
