// Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

let confirmationResult;

function sendOTP() {
  const phone = document.getElementById("phone").value;
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    size: 'normal',
  });

  auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("OTP sent!");
    }).catch((err) => {
      console.error(err);
    });
}

function verifyOTP() {
  const code = document.getElementById("otp").value;
  confirmationResult.confirm(code)
    .then((result) => {
      return result.user.getIdToken();
    })
    .then((idToken) => {
      // Send token to backend
      fetch("/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idToken })
      }).then(res => res.json())
        .then(data => console.log(data));
    })
    .catch((err) => {
      console.error("OTP verification failed", err);
    });
}
