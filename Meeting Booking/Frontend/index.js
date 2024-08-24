async function fetchSlots() {
  const response = await axios.get("http://localhost:4000/slots");
  return response.data;
}

async function displaySlots() {
  const slotsList = document.querySelector(".slots");
  slotsList.innerHTML = "";
  const slots = await fetchSlots();
  slots.forEach((slot) => {
    const slotElement = document.createElement("div");
    slotElement.innerHTML = `
      <div onclick="displayModalForm('${slot.time}', '${slot.id}')" class="slot">
        <b>${slot.time}</b> &nbsp;
        <span >Available Slots: <b id="slot-${slot.id}">${slot.count}</b></span>
      </div>
    `;
    slotsList.appendChild(slotElement);
  });
}

function displayModalForm(time, id) {
  const name = document.querySelector("#name");
  const email = document.querySelector("#email");

  name.value = "";
  email.value = "";

  const confirmation = document.querySelector(".confirmation");
  confirmation.style.display = "none";

  const modal = document.querySelector(".modal");
  modal.style.display = "flex";

  const timePara = document.querySelector("#slotTime");
  timePara.textContent = time;

  const idPara = document.querySelector("#slotId");
  idPara.textContent = id;
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const time = document.querySelector("#slotTime").textContent;
  const slotId = document.querySelector("#slotId").textContent;
  
   

  const modal = document.querySelector(".modal");
  if (modal.style.display === "flex") {
    modal.style.display = "none";
  } else {
    modal.style.display = "flex";
  }

let resMsg;

  const res = axios.post("http://localhost:4000/bookmeet", {
    slotId,
    name,
    email,
    time,
  }).then((res) => {
    resMsg=res.data;  
    if(resMsg!=="Meet booked successfully")
    {
      alert(resMsg);
    }else{
  const ConfSlotTime = document.querySelector("#ConfSlotTime");
  ConfSlotTime.textContent = time;
  const confirmation = document.querySelector(".confirmation");
  confirmation.style.display = "block";
  const confMsg=document.querySelector("#resMsg");
  confMsg.textContent=resMsg;
    }
  })





  //artificial delay 
 setTimeout(() => {
  displayMeets();
  displaySlots();
 }, 60);

}

async function fetchMeets() {
  const response = await axios.get("http://localhost:4000/meets");
  return response.data;
}

async function displayMeets() {
  const meetsList = document.querySelector(".scheduled-meetings");
  meetsList.innerHTML = "";
  const meets = await fetchMeets();
  meets.forEach((meet) => {
    const meetElement = document.createElement("div");
    meetElement.innerHTML = `
      <form onsubmit="handleCancelMeet(${meet.id}, ${meet.slotId})">
        <div class="meeting">
          <b>${meet.slot.time}</b> - ${meet.userName} <br />
          <a href="https://meet.google.com/syj-cvrt-njo" target="_blank">Google Meet Link</a>
          <button type="submit" class="cancel-btn">Cancel</button>
        </div>
      </form>
    `;
    meetsList.appendChild(meetElement);
  });
}

async function handleCancelMeet(id, slotId) {
  try {
    const response = await axios.delete(
      `http://localhost:4000/${id}/${slotId}`
    );

    displaySlots();
    displayMeets();
  } catch (error) {
    console.error("Error cancelling meet:", error);
  }
}

displayMeets();
displaySlots();
