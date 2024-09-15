async function handleMsgSubmit(e) {
  e.preventDefault();
  const message = document.getElementById("message-input").value;
  const token = localStorage.getItem("token");

  try {
    const response = await axios.post(
      "http://localhost:4000/api/user/message",
      {
        message,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    alert(response.data.message);
  } catch (err) {
    console.log(err);
  }
}
