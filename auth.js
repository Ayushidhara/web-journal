// Simple SHA-256 hash for password security
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// SIGN UP
async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("authMessage");

  if (!email || !password) {
    message.innerText = "Please fill all fields";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(user => user.email === email)) {
    message.innerText = "User already exists!";
    return;
  }

  const hashedPassword = await hashPassword(password);

  users.push({
    email: email,
    password: hashedPassword
  });

  localStorage.setItem("users", JSON.stringify(users));
  message.innerText = "Signup successful! Please login.";
}

// LOGIN
async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("authMessage");

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const hashedPassword = await hashPassword(password);

  const user = users.find(
    user => user.email === email && user.password === hashedPassword
  );

  if (!user) {
    message.innerText = "Invalid credentials!";
    return;
  }

  localStorage.setItem("currentUser", email);
  window.location.href = "index.html";
}