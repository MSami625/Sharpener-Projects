async function handleLogin(e) {
  try {
    e.preventDefault();
    localStorage.clear();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await axios.post("http://localhost:4000/api/user/login", {
      email: email,
      password: password,
    });
    console.log(response.data.token);
    let token = `Bearer ${response.data.token}`;
    localStorage.setItem("token", token);
    alert(response.data.message);
  } catch (err) {
    alert(err.response.data.error);
  }
}
