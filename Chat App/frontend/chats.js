let currentPage = 1;
let loadingMessages = false;
var adminUsers = [];
const socket = io("http://localhost:4000");

const token = localStorage.getItem("token");

// setInterval(() => fetchMessages(1), 3000); now using websockets hahahaha bye bye...

window.onload = () => fetchGroups();

const decoded = jwt_decode(token);
const currentUserId = decoded.userId;

async function fetchMessages(page, groupId) {
  try {
    if (loadingMessages) return;

    loadingMessages = true;

    const response = await axios.get(
      `http://localhost:4000/api/users/messages?page=${page}&groupId=${groupId}`,

      {
        headers: {
          Authorization: token,
        },
      }
    );

    const messages = response.data.messages;

    if (page > 1) {
      renderMessages(messages, true, groupId);
    } else {
      renderMessages(messages, false, groupId);
    }

    if (messages.length > 0) {
      currentPage += 1;
    }

    loadingMessages = false;
  } catch (err) {
    console.log(err);
    alert("Please login to view messages");
    console.log(err);
    localStorage.clear();
    window.location.href = "./login.html";
  }
}

async function handleMsgSubmit(event) {
  event.preventDefault();

  const messageInput = document.getElementById("message-input");
  const fileInput = document.getElementById("file-input");
  const message = messageInput.value.trim();

  let fileUrl = null;

  if (fileInput.files.length > 0) {
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
        }
      );
      fileUrl = response.data.fileUrl;

      document.getElementById("file-preview-container").style.display = "none";
    } catch (error) {
      alert("Error uploading file, please try again");
      return;
    }
  }

  socket.emit("sendMessage", {
    message: message.length > 0 ? message : "file sent",
    groupId: currentGroupId,
    fileUrl: fileUrl || null,
    token,
  });

  // Clear inputs
  messageInput.value = "";
  fileInput.value = "";
  currentPage = 1;
}

socket.on("receiveMessage", (msg) => {
  if (msg.groupId === currentGroupId) {
    renderSentMessage([msg]);
  }
});

function renderSentMessage(messages) {
  const chatBox = document.getElementById("chat-messages");
  messages.forEach((msg) => {
    const message = document.createElement("div");
    message.className =
      msg.userId === currentUserId ? "message sender" : "message receiver";

    const content = msg.fileUrl
      ? `<img src="${msg.fileUrl}" alt="Sent image" class="message-file" />`
      : `<p>${msg.message}</p>`;

    message.innerHTML = `
      <div class="message-content">
        <div class="message-info">
          <span class="username">${
            msg.userId === currentUserId ? "~You" : `~${msg.senderName}`
          }</span>
          ${
            msg.userId != currentUserId
              ? `<span class="message-timestamp">new</span>`
              : `<span class="timestamp">${new Date(
                  msg.createdAt
                ).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</span>`
          }
        </div>
        ${content}
      </div>
    `;

    chatBox.appendChild(message);

    if (msg.userId === currentUserId) {
      scrollToBottom();
    }
  });
}

function renderMessages(messages, prepend = false, groupId) {
  const chatBox = document.getElementById("chat-messages");

  if (messages.length === 0 && !prepend) {
    chatBox.innerHTML = "<p>No messages found</p>";
    return;
  }

  if (prepend) {
    const prevScrollHeight = chatBox.scrollHeight;

    messages.forEach((msg) => {
      const message = document.createElement("div");
      message.className =
        msg.userId === currentUserId ? "message sender" : "message receiver";

      const content = msg.fileUrl
        ? `<img src="${msg.fileUrl}" alt="Sent image" class="message-file" />`
        : `<p>${msg.message}</p>`;

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
          ${content}
        </div>
      `;

      chatBox.insertBefore(message, chatBox.firstChild);
    });

    const sendForm =
      document.querySelector("#chat-area form") ||
      document.createElement("form");
    sendForm.onsubmit = (event) => handleMsgSubmit(event, groupId);
    sendForm.innerHTML = `
      <div class="chat-input">
        <input
          type="text"
          id="message-input"
          placeholder="Type a message..."
          min="1"
        
        />
   

 <input
    type="file"
    id="file-input"
    accept="image/*,video/*"
    onchange="showFilePreview()"
  />
 
        <button type="submit" id="send-button">Send</button>
      
      </div>
 <div id="file-preview-container" class="file-preview">
  <img id="file-preview" src="" alt="File Preview" style="display: none;" />
  <video id="video-preview" controls style="display: none;"></video>
</div>
    `;
    if (!document.querySelector("#chat-area form")) {
      document.getElementById("chat-area").appendChild(sendForm);
    }

    chatBox.scrollTop = chatBox.scrollHeight - prevScrollHeight - 300;
  } else {
    chatBox.innerHTML = "";

    messages.reverse().forEach((msg) => {
      const message = document.createElement("div");
      message.className =
        msg.userId === currentUserId ? "message sender" : "message receiver";

      const content = msg.fileUrl
        ? `<img src="${msg.fileUrl}" alt="Sent image" class="message-file" />`
        : `<p>${msg.message}</p>`;

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
          ${content}
        </div>
      `;

      chatBox.appendChild(message);
    });

    const sendForm =
      document.querySelector("#chat-area form") ||
      document.createElement("form");
    sendForm.onsubmit = (event) => handleMsgSubmit(event, groupId);
    sendForm.innerHTML = `
      <div class="chat-input">
        <input
          type="text"
          id="message-input"
          placeholder="Type a message..."
          min="1"
         
        />
    <input
    type="file"
    id="file-input"
    accept="image/*,video/*"
    onchange="showFilePreview()"
  />

        <button type="submit" id="send-button">Send</button>
      </div>
      <div id="file-preview-container" class="file-preview">
  <img id="file-preview" src="" alt="File Preview" style="display: none;" />
  <video id="video-preview" controls style="display: none;"></video>
</div>
    `;
    if (!document.querySelector("#chat-area form")) {
      document.getElementById("chat-area").appendChild(sendForm);
    }

    if (!prepend) {
      scrollToBottom();
    }
  }
}

function scrollToBottom() {
  const chatBox = document.getElementById("chat-messages");
  chatBox.scrollTop = chatBox.scrollHeight;
}

let currentGroupId = null;

function setCurrentGroupId(groupId) {
  currentGroupId = groupId;
}

document.getElementById("chat-messages").addEventListener("scroll", () => {
  const container = document.getElementById("chat-messages");
  if (container.scrollTop === 0 && !loadingMessages) {
    fetchMessages(currentPage, currentGroupId);
    prepend = true;
  }
});

//groups logic****************************************************************************************

async function fetchGroups() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get("http://localhost:4000/api/getGroups", {
      headers: {
        Authorization: token,
      },
    });

    console.log(response.data);
    const groups = response.data.groups;

    renderGroups(groups);
  } catch (err) {
    console.log(err);
    alert("Please Login, Session Expired");
    localStorage.clear();
    window.location.href = "./login.html";
  }
}

function renderGroups(groups) {
  const groupsList = document.getElementById("group-list");
  groupsList.innerHTML = "";

  groups.forEach((group) => {
    const groupItem = document.createElement("div");
    const truncated =
      group.groupDescription.length > 20
        ? group.groupDescription.slice(0, 20) + "..."
        : group.groupDescription;

    groupItem.className = "group-item";
    groupItem.innerHTML = `
            <button data-group-id="${group.id}" onclick="handleGroupClick(this) ">
              <div class="group-info">
                <p style="font-weight:700; font-size:1.2rem;" class="group-name">${group.groupName}</p>
                <span class="group-last-message">${truncated}</span>
              </div>
            </button>
    `;
    groupsList.appendChild(groupItem);
  });
}

async function handleGroupClick(buttonElement) {
  const groupId = buttonElement.getAttribute("data-group-id");
  if (groupId) {
    try {
      setCurrentGroupId(groupId);

      const groupDetails = await fetchGroupDetails(groupId);
      const adminId = groupDetails.group.groupAdmin;

      console.log(groupDetails);

      adminUsers = groupDetails.usersInGroup.filter(
        (user) => user.role === "admin" && user.id === adminId
      );

      document.getElementById("group-name").textContent =
        groupDetails.group.groupName;

      const maxLength = 80;
      let truncated = groupDetails.group.groupDescription;
      if (truncated.length > maxLength) {
        truncated = truncated.substring(0, maxLength) + "...";
      }

      document.getElementById("group-details").innerHTML = `${truncated}`;

      currentPage = 1;
      fetchMessages(1, groupId);
      fetchCurrentGroupMembers(groupDetails.usersInGroup);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  } else {
    console.error("Group id not found, Please Login again");
    window.location.href = "./login.html";
  }
}

// Function to fetch group details from the server
async function fetchGroupDetails(groupId) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `http://localhost:4000/api/groups/${groupId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
}

async function handleGroupSubmit(e) {
  e.preventDefault();
  const groupName = document.getElementById("add-group-name").value;
  const groupDescription = document.getElementById("group-description").value;

  console.log(groupName, groupDescription);

  try {
    await axios.post(
      "http://localhost:4000/api/user/createGroup",
      {
        groupName,
        groupDescription,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    document.getElementById("add-group-name").value = "";
    document.getElementById("group-description").value = "";

    fetchGroups();
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
}

let timeoutId;

async function searchUsers(value) {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  //debounced search

  timeoutId = setTimeout(async () => {
    if (!value) {
      console.log([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/search?name=${encodeURIComponent(
          value
        )}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const users = response.data.users;
      renderUsers(users);
      console.log(users);
    } catch (err) {
      console.log(err);
    }
  }, 300);
}

function renderUsers(users) {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = "";

  users.forEach((user) => {
    const userItem = document.createElement("div");
    userItem.className = "search-item";
    userItem.innerHTML = `
   <div class="user-card card">
  <div class="p-2 d-flex justify-content-between align-items-center">
  <div style="display:flex; justify-content:center; align-items:center; gap:15px;">
      <h5 class="user-name mb-1">${user.name}</h5>
      <p class="user-phone mb-0 text-muted">Phone: ${user.phoneNumber}</p> 
      </div>
      <button class="btn btn-primary btn-sm" onclick="handleAddMemberClick(${user.id})">Add</button>
   
  </div>
</div>

    `;
    searchResults.appendChild(userItem);
  });
}

async function handleAddMemberClick(id) {
  if (currentGroupId === null) {
    alert("Please select a group first");
    return;
  }

  const groupId = currentGroupId;

  try {
    const response = await axios.post(
      "http://localhost:4000/api/group/addMember",
      {
        id,
        groupId,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    document.getElementById("search-results").innerHTML = "";
    document.getElementById("search-user").value = "";

    alert(response.data.message);

    renderAddedMembers(response.data.users);

    fetchGroups();
  } catch (err) {
    console.log(err);
    document.getElementById("search-results").innerHTML = "";
    document.getElementById("search-user").value = "";
    alert(err.response.data.message);
  }
}

async function fetchCurrentGroupMembers() {
  if (currentGroupId === null) {
    alert("Please select a group first");
    return;
  }

  const groupId = currentGroupId;

  try {
    const response = await axios.get(
      `http://localhost:4000/api/groupmembers/${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    console.log(response.data.members);

    renderAddedMembers(response.data.members);
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
}

function renderAddedMembers(members) {
  const addedMembersContainer = document.getElementById("added-members");
  addedMembersContainer.innerHTML = "";

  if (members.length === 0) {
    addedMembersContainer.innerHTML = "<p>No members added yet.</p>";
    return;
  }

  members.forEach((member) => {
    const memberCard = document.createElement("div");
    memberCard.className =
      "added-member d-flex justify-content-between align-items-center my-2 p-2 border rounded";

    memberCard.innerHTML = `
      <span class="member-name">${member.name}</span>
      <span class="member-role">${
        adminUsers[0].id == member.id ? "admin" : "member"
      }</span>
      <span class="member-phone">Phone: ${member.phoneNumber}</span>  
      <button class="btn btn-danger btn-sm" onclick="handleRemoveMemberClick(${
        member.id
      })">Remove</button>
    `;

    addedMembersContainer.appendChild(memberCard);
  });
}

async function handleRemoveMemberClick(id) {
  if (currentGroupId === null) {
    alert("Please select a group first");
    return;
  }

  const groupId = currentGroupId;

  try {
    const response = await axios.delete(
      `http://localhost:4000/api/group/removeMember?id=${id}&groupId=${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    alert(response.data.message);

    renderAddedMembers(response.data.users);
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
}

function showFilePreview() {
  const fileInput = document.getElementById("file-input");
  const filePreview = document.getElementById("file-preview");
  const videoPreview = document.getElementById("video-preview");
  const filePreviewContainer = document.getElementById(
    "file-preview-container"
  );

  const file = fileInput.files[0];

  if (file) {
    const fileURL = URL.createObjectURL(file);
    filePreviewContainer.style.display = "block";

    if (file.type.startsWith("image/")) {
      filePreview.src = fileURL;
      filePreview.style.display = "block";
      videoPreview.style.display = "none";
    } else if (file.type.startsWith("video/")) {
      videoPreview.src = fileURL;
      videoPreview.style.display = "block";
      filePreview.style.display = "none";
    }
  } else {
    filePreviewContainer.style.display = "none";
  }

  const text_input = document.getElementById("message-input");

  text_input.setAttribute("disabled", "true");
}
