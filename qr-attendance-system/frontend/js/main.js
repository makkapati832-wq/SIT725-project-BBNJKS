/* ---------- VALIDATION ---------- */
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPassword(pwd) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(pwd);
}

/* ---------- REGISTER ---------- */
function register() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const pwd = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const msg = document.getElementById("msg");

  if (!name) return msg.textContent = "Name required";
  if (!validEmail(email)) return msg.textContent = "Invalid email";
  if (!validPassword(pwd))
    return msg.textContent =
      "Password: 8+ chars, 1 uppercase, 1 number, 1 special char";
  if (!role) return msg.textContent = "Select role";

  if (localStorage.getItem(email))
    return msg.textContent = "User already exists";

  localStorage.setItem(
    email,
    JSON.stringify({ name, pwd, role })
  );

  alert("Registered successfully!");
  window.location.href = "index.html";
}

/* ---------- LOGIN ---------- */
function login() {
  const email = document.getElementById("email").value.trim();
  const pwd = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const error = document.getElementById("error");

  if (!role) return error.textContent = "Select role";

  const user = JSON.parse(localStorage.getItem(email));

  if (!user || user.pwd !== pwd || user.role !== role)
    return error.textContent = "Invalid credentials";

  sessionStorage.setItem("role", role);
  sessionStorage.setItem("email", email);

  window.location.href =
    role === "student"
      ? "student-dashboard.html"
      : "teacher-dashboard.html";
}

/* ---------- PROTECT ---------- */
function protect(requiredRole) {
  if (sessionStorage.getItem("role") !== requiredRole) {
    window.location.href = "index.html";
  }
}

/* ---------- LOGOUT ---------- */
function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}
