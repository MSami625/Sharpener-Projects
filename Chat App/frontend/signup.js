async function handleSignUp(e) {
  let backendapi = "";
  e.preventDefault();

  try {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let name = document.getElementById("name").value;
    let phoneNumber = document.getElementById("phone").value;

    const response = await axios.post(`${backendapi}/api/user/signup`, {
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
