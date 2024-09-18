let currentPage = 1;
let loadingMessages = false;
var adminUsers = [];

const token = localStorage.getItem("token");

// setInterval(() => fetchMessages(1), 3000);

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
    localStorage.clear();
    window.location.href = "./login.html";
  }
}

async function handleMsgSubmit(e, groupId) {
  e.preventDefault();
  const message = document.getElementById("message-input").value;

  try {
    await axios.post(
      "http://localhost:4000/api/user/message",
      {
        message,
        groupId,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    document.getElementById("message-input").value = "";

    fetchMessages(1, groupId);
    currentPage = 1;
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
}

function renderMessages(messages, prepend = false, groupId) {
  const chatBox = document.getElementById("chat-messages");

  if (messages.length === 0 && !prepend) {
    chatBox.innerHTML = "<p>No messages found</p>";
  }

  if (prepend) {
    const prevScrollHeight = chatBox.scrollHeight;

    messages.forEach((msg) => {
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
          required
        />
        <button type="submit" id="send-button">Send</button>
      </div>
    `;
    if (!document.querySelector("#chat-area form")) {
      document.getElementById("chat-area").appendChild(sendForm);
    }

    // Adjust scroll position
    chatBox.scrollTop = chatBox.scrollHeight - prevScrollHeight - 300;
  } else {
    chatBox.innerHTML = "";

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
          required
        />
        <button type="submit" id="send-button">Send</button>
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
      "http://localhost:4000/api/user/addMember",
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

    updateDropdown(response.data.usersInGroup);

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

    renderAddedMembers(response.data);
  } catch (err) {
    console.log(err);
    alert(err.response.data.message);
  }
}

function renderAddedMembers(users) {
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
      <button class="btn btn-danger btn-sm" onclick="handleRemoveMemberClick(${member.id})">Remove</button>
    `;

    addedMembersContainer.appendChild(memberCard);
  });
}
