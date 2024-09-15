window.onload = fetchMessages();

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

    document.getElementById("message-input").value = "";

    fetchMessages();
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
}

async function fetchMessages() {
  try {
    let token = localStorage.getItem("token");

    const response = await axios.get(
      "http://localhost:4000/api/users/messages",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const messages = response.data.messages;

    renderMessages(messages);
  } catch (err) {
    console.log(err);
    alert("Please login to view messages");
  }
}

function renderMessages(messages) {
  const chatBox = document.getElementById("chat-messages");
  chatBox.innerHTML = "";
  const token = localStorage.getItem("token");
  const decoded = jwt_decode(token);
  const currentUserId = decoded.userId;

  messages.forEach((msg) => {
    if (msg.userId === currentUserId) {
      var message = document.createElement("div");
      message.className = "message sender";
      message.innerHTML = `
         <div class="message-content">
              <div class="message-info">
                <span class="username">~You</span>
                <span class="timestamp">12:34 PM</span>
              </div>
              <p>${msg.message}</p>
            </div>
        `;
    } else {
      var message = document.createElement("div");
      message.className = "message receiver";
      message.innerHTML = `
             <div class="message-content">
                <div class="message-info">
                    <span class="username">~someone</span>
                    <span class="timestamp">12:34 PM</span>
                </div>
                <p>${msg.message}</p>
                </div>
            `;
    }

    chatBox.appendChild(message);
    scrollToBottom();
  });
}

function scrollToBottom() {
  const chatContainer = document.getElementById("chat-messages");
  if (chatContainer.scrollHeight)
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
