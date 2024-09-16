let currentPage = 1;
let loadingMessages = false;

window.onload = () => fetchMessages(currentPage);

const token = localStorage.getItem("token");

// setInterval(() => fetchMessages(1), 3000);

const decoded = jwt_decode(token);
const currentUserId = decoded.userId;

async function fetchMessages(page) {
  try {
    if (loadingMessages) return;

    loadingMessages = true;

    const response = await axios.get(
      `http://localhost:4000/api/users/messages?page=${page}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const messages = response.data.messages;

    if (page > 1) {
      renderMessages(messages, true);
    } else {
      renderMessages(messages, false);
    }

    if (messages.length > 0) {
      currentPage += 1;
    }

    loadingMessages = false;
  } catch (err) {
    console.log(err);
    alert("Please login to view messages");
    localStorage.clear();
    window.location.href = "./login.html";
  }
}

async function handleMsgSubmit(e) {
  e.preventDefault();
  const message = document.getElementById("message-input").value;

  try {
    await axios.post(
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

    fetchMessages(1);
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
}

function renderMessages(messages, prepend = false) {
  const chatBox = document.getElementById("chat-messages");

  if (prepend) {
    var prevScrollHeight = chatBox.scrollHeight;
    console.log(prevScrollHeight);
    messages.forEach((msg) => {
      const message = document.createElement("div");
      message.className =
        msg.userId === currentUserId ? "message sender" : "message receiver";
      message.innerHTML = `
          <div class="message-content">
            <div class="message-info">
              <span class="username">${
                msg.userId === currentUserId ? "~You" : `~${msg.senderName}`
              }   <span class="timestamp">${new Date(
        msg.createdAt
      ).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}</span>
            </div>
            <p>${msg.message}</p>
          </div>
        `;
      chatBox.insertBefore(message, chatBox.firstChild);
    });
    const newScrollHeight = chatBox.scrollHeight;
    const gap = 500; // Define the gap size as needed
    chatBox.scrollTop = newScrollHeight - prevScrollHeight - gap;
  } else {
    messages.reverse().forEach((msg) => {
      const message = document.createElement("div");
      message.className =
        msg.userId === currentUserId ? "message sender" : "message receiver";
      message.innerHTML = `
          <div class="message-content">
            <div class="message-info">
              <span class="username">${
                msg.userId === currentUserId ? "~You" : `~${msg.senderName}`
              }</span>
             <span class="timestamp">${new Date(
               msg.createdAt
             ).toLocaleTimeString("en-US", {
               hour: "2-digit",
               minute: "2-digit",
             })}</span>

            </div>
            <p>${msg.message}</p>
          </div>
        `;
      chatBox.appendChild(message);
    });

    if (!prepend) {
      scrollToBottom();
    }
  }
}

function scrollToBottom() {
  const chatContainer = document.getElementById("chat-messages");
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.getElementById("chat-messages").addEventListener("scroll", () => {
  const container = document.getElementById("chat-messages");
  if (container.scrollTop === 0 && !loadingMessages) {
    fetchMessages(currentPage);

    prepend = true;
  }
});
