async function handleSignUp(e) {
  e.preventDefault();

  try {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let name = document.getElementById("name").value;
    let phoneNumber = document.getElementById("phone").value;

    const response = await axios.post("http://localhost:4000/api/user/signup", {
      email: email,
      password: password,
      name: name,
      phoneNumber: phoneNumber,
    });

    alert(response.data.message);

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("name").value = "";

    window.location.href = "./login.html";
  } catch (err) {
    alert(err.response.data.error);
  }
}
