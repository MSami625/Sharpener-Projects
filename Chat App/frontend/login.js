async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await axios.post("http://localhost:3000/api/user/login", {
    username: username,
    password: password,
  });
  console.log(response);
}
