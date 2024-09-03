document.addEventListener("DOMContentLoaded", fetchExpenses);

const premiumBtn = document.getElementById("rzp-button1");
const leaderboardBtn = document.getElementById("show-leaderboard");
const leaderboardContainer = document.querySelector("#leaderboard-container");
const downloadBtn = document.getElementById("download");
const downloadHistoryButton = document.getElementById("downloadhistory");
const timeBtn = document.getElementById("time");

const auth = localStorage.getItem("auth");

if (auth) {
  const decoded = jwt_decode(auth);
  const isPremiumUser = decoded.isPremiumUser;

  if (isPremiumUser === true) {
    premiumBtn.outerHTML = `<button id="premiumBtn" class="premium-badge" disabled>You're a Premium User</button>`;
    leaderboardBtn.outerHTML = `  <button id="show-leaderboard"  class="btn btn-secondary" onclick="showLeaderboard()">Show Leaderboard</button>`;

    leaderboardContainer.style.display = "block";
    downloadBtn.style.display = "block";
    downloadHistoryButton.style.display = "block";
    timeBtn.style.display = "block";
  }
} else {
  window.location.href = "../login.html";
}

var c_id = null;

async function handleFormSubmit(event) {
  event.preventDefault();
  let path = event.target;

  try {
    const token = localStorage.getItem("auth");

    if (!token) {
      window.location.href = "../login.html";
    }

    let obj = {
      amount: path.amount.value,
      description: path.description.value,
      category: path.category.value,
      token: token,
    };

    // Put data
    if (c_id != null) {
      await axios.put(`http://localhost:4000/user/expenses/${c_id}`, obj);
      c_id = null;
      setTimeout(fetchExpenses, 100);
    } else {
      //post data
      const res = await axios.post("http://localhost:4000/expenses", obj);
      setTimeout(fetchExpenses, 100);

      //clean up the form
      path.amount.value = "";
      path.description.value = "";
      path.category.value = "";

      if (res.data.isPremiumUser) {
        setTimeout(showLeaderboard, 500);
      }
    }
  } catch (error) {
    console.error("Error handling form submit:", error);
  }
}

async function fetchExpenses() {
  const expenseList = document.getElementById("list-group");
  const pbtn_3 = document.getElementById("pbtn-3");
  const pbtn_2 = document.getElementById("pbtn-2");
  const pbtn_1 = document.getElementById("pbtn-1");
  const pages_size=document.getElementById("pages-size");

  try {
    const token = localStorage.getItem("auth");
    if (!token) {
      window.location.href = "../login.html";
      return;
    }

  

    const res = await axios.get(
      `http://localhost:4000/user/expenses/1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
   
    console.log(res.data);
    pages_size.innerHTML=`  Rows per page: <input  style="width:22px" value=${res.data.totalExpenses}></input> of ${res.data.totalExpenses}`;

    if (res.data.hasNextPage==true) {
      pbtn_3.style.display = "block"; 
      pbtn_3.innerText = res.data.nextPage;    
    } else {
      pbtn_3.style.display = "none";
    }
    

    if (res.data.hasPreviousPage) {
      pbtn_1.style.display = "block"; 
      pbtn_1.innerText = res.data.previousPage;
    
    } else {
      pbtn_1.style.display = "none"; 
    }
    
   
    pbtn_2.style.display = "block"; 
    pbtn_2.innerText = res.data.currentPage;

    const expenses = res.data.expenses;

    expenseList.innerHTML = "";

    if (expenses.length != 0) {
      expenses.forEach((expense) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${expense.createdAt}</td>
          <td>${expense.description}</td>
          <td>${expense.category}</td>
          <td>${expense.amount}</td>
          <td>₹ ${expense.amount}</td>
          <td>
            <button class="btn btn-success edit-btn">Edit</button>
            <button class=" btn btn-danger del-btn">Delete</button>
          </td>
        `;

        const delbtn = tr.querySelector(".del-btn");
        delbtn.addEventListener("click", async () => {
          try {
            const res = await axios.delete(
              `http://localhost:4000/user/expenses/${expense.id}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("auth")}`,
                },
              }
            );

            await fetchExpenses();
            if (res.data.isPremiumUser==true) {
              await showLeaderboard();
            }
          } catch (error) {
            alert("Error deleting expense, Login again or try again:", error);
            window.location.href = "../login.html";
          }
        });

        // const editbtn = tr.querySelector(".edit-btn");
        // editbtn.addEventListener("click", () => {
        //   document.getElementById("amount").value = expense.amount;
        //   document.getElementById("description").value = expense.description;
        //   document.getElementById("category").value = expense.category;
        //   c_id = expense.id;
        // });

        expenseList.appendChild(tr);
      });
    } else {
      expenseList.innerHTML = "No expenses found";
    }
    if (!token) {
      window.location.href = "../login.html";
    } else {
      const loginBtn = document.getElementById("login-button");
      loginBtn.innerText = "Logout";
    }
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

function handleLogOut() {
  localStorage.clear();
  window.location.href = "../login.html";
}

async function handlePayment(e) {
  e.preventDefault();

  try {
    const token = localStorage.getItem("auth");
    if (!token) {
      window.location.href = "../login.html";
    }

    const response = await axios.get(
      "http://localhost:4000/user/purchasePremium",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { key_id, order } = response.data;
    const order_id = order.orderId;
    if (!order_id) {
      throw new Error("Order ID is missing from response");
    }

    const options = {
      key: key_id,
      order_id: order_id,
      handler: async function (response) {
        try {
          const res = await axios.post(
            "http://localhost:4000/user/updatePaymentStatus",
            {
              order_id: order_id,
              payment_id: response.razorpay_payment_id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("Payment Successful, You are now a premium user");
          localStorage.setItem("auth", res.data.token);
          window.location.reload();
        } catch (error) {
          console.error("Error updating payment status:", error);
          alert("Payment failed, please try again");
        }
      },
      modal: {
        ondismiss: function () {
          alert("Payment Cancelled");
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      console.log(response.error);
      alert("Payment Failed, Please try again");
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    alert("Failed to initialize payment, Please Login or try again");
  }
}

let isLeaderboardVisible = false;

async function showLeaderboard() {
  try {
    const token = localStorage.getItem("auth");
    if (!token) {
      window.location.href = "../login.html";
    }
  
    const decoded = jwt_decode(auth);
    if(decoded.isPremiumUser==true){
    const response = await axios.get(
      "http://localhost:4000/premium/leaderboard",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      }
    );

    const leaderboard = response.data.leaderboard;
    const tableBody = document.getElementById("leaderboard-body");

    tableBody.innerHTML = "";

    leaderboard.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${index + 1}</td>
      <td>${index == 0 ? "🥇" : " "}${
        entry.userName == response.data.user
          ? "<b>You (" + entry.userName + ")</b>"
          : entry.userName
      }</td>
      <td>₹${entry.totalExpenses}</td>
    `;

      tableBody.appendChild(row);
    });
    isLeaderboardVisible = !isLeaderboardVisible;
    document.getElementById("leaderboard-container").style.display =
      isLeaderboardVisible ? "block" : "none";
  }else{
    alert("You are not a premium user. Please upgrade to premium to access this feature.");
  }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
}

 async function handleTime() {
  const selectElement = document.getElementById("time");

 const res=await getExpensesonCondition(selectElement.value,null);
 console.log(res);

}



//handler function independent of the event
async function getExpensesonCondition(conditionTime,conditionPage){

  const token = localStorage.getItem("auth");
  if (!token) {
    window.location.href = "../login.html";
    let urlpart="";
  }

  if(conditionPage==null){
    urlpart=`premium/expenses/${conditionTime}`;
  }else if(conditionTime==null){
    urlpart=`user/expenses/${conditionPage}`;
  }
  
  const response = await axios.get(
    `http://localhost:4000/${urlpart}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth")}`,
      },
    }
  );
  const expenses = response.data.expenses;
  const expenseList = document.getElementById("list-group");
  expenseList.innerHTML = "";
  // console.log(response.data.msg);
  if (expenses) {
    expenses.forEach((expense) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${expense.createdAt}</td>
          <td>${expense.description}</td>
          <td>${expense.category}</td>
          <td>${expense.amount}</td>
          <td>${expense.amount}</td>
          <td>
            <button class="btn-action edit-btn">Edit</button>
            <button class="btn-action
}
  del-btn">Delete</button>
          </td>
        `;

      const delbtn = tr.querySelector(".del-btn");
      delbtn.addEventListener("click", async () => {
        try {
          const res = await axios.delete(
            `http://localhost:4000/user/expenses/${expense.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth")}`,
              },
            }
          );

          await fetchExpenses();
        } catch (error) {
          alert("Error deleting expense, Login again or try again:", error);
          window.location.href = "../login.html";
        }
      });

      // const editbtn = tr.querySelector(".edit-btn");
      // editbtn.addEventListener("click", () => {
      //   document.getElementById("amount").value = expense.amount;
      //   document.getElementById("description").value = expense.description;
      //   document.getElementById("category").value = expense.category;
      //   c_id = expense.id;
      // });

      expenseList.appendChild(tr);
    });
  }

  return response.data;
}


async function handleDownload() {
  try {
    const token = localStorage.getItem("auth");
    if (!token) {
      window.location.href = "../login.html";
    }
    const decoded = jwt_decode(auth);
     if(decoded.isPremiumUser==true){
    const response = await axios.get(
      `http://localhost:4000/premium/expenses/download`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth")}`,
        },
      }
    );

    if (response.data.success) {
      window.open(response.data.fileUrl);
    } else {
      alert(response.data.message);
    }
  }else{
    alert("You are not a Premium User. Please buy premium to access this feature.")
  }
  } catch (err) {
    alert("Error downloading expenses, Please try again", err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const downloadHistoryButton = document.getElementById("downloadhistory");
  const historyModal = document.getElementById("historyModal");
  const closeButton = document.querySelector("#historyModal .close");
  const historyList = document.getElementById("history-list");

  async function fetchAndShowHistory() {
    try {
      const token=localStorage.getItem("auth");
  
      const decoded = jwt_decode(auth);
 
      if(decoded.isPremiumUser==true){
      $(historyModal).modal("show");

      // Fetch history data from the server
      const response = await axios.get(
        "http://localhost:4000/premium/expenses/downhistory",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth")}`,
          },
        }
      );

      historyList.innerHTML = "";

      if (response && response.data.files.length > 0) {
        response.data.files.forEach((item) => {
          const listItem = document.createElement("li");

          listItem.className =
            "list-group-item d-flex justify-content-between align-items-center";

          const truncatedUrl =
            item.url.length > 50
              ? item.url.substring(51, item.url.length / 2.1) + "..."
              : item.url;

          listItem.innerHTML = `
        
            <b">${item.id}. ${truncatedUrl}</b> |
            <a href="${item.url}" download class="btn btn-primary btn-sm">Download</a>
          `;

          historyList.appendChild(listItem);
        });
      } else {
        historyList.innerHTML =
          '<li class="list-group-item">No history available.</li>';
      }
    }else{
      alert("You are not a Premium User. Buy Premium to access this feature")
    }
    } catch (error) {
      console.error("Error fetching history: Login Again", error);
      historyList.innerHTML =
        '<li class="list-group-item">Error fetching history. Login Again </li>';
    }
  }

  downloadHistoryButton.addEventListener("click", fetchAndShowHistory);

  closeButton.addEventListener("click", () => {
    $(historyModal).modal("hide");
  });

  window.addEventListener("click", (event) => {
    if (event.target === historyModal) {
      $(historyModal).modal("hide");
    }
  });
});


//********************pagination logic**********************



const pbtn_1 = document.getElementById("pbtn-1");
const pbtn_2 = document.getElementById("pbtn-2");
const pbtn_3 = document.getElementById("pbtn-3");

pbtn_1.addEventListener("click", (e) => {

  paginate(e.target.innerText);

})

pbtn_2.addEventListener("click", (e) => {
   
  
  paginate(e.target.innerText);
})

pbtn_3.addEventListener("click", (e) => 
  {
    paginate(e.target.innerText);
  })

async function paginate(page) {

  const token = localStorage.getItem("auth");
  if (!token) {
    window.location.href = "../login.html";
  } 
  
const res= await getExpensesonCondition(null,page);
 
console.log(res);
if (res.hasNextPage==true) {
  pbtn_3.style.display = "block"; // Show the "next" page button
  pbtn_3.innerText = res.nextPage;    
} else {
  pbtn_3.style.display = "none"; // Hide the "next" page button
}

// Check if there is a previous page
if (res.hasPreviousPage) {
  pbtn_1.style.display = "block"; // Show the "previous" page button
  pbtn_1.innerText = res.previousPage;

} else {
  pbtn_1.style.display = "none"; // Hide the "previous" page button
}

// Check if the current page is the first page
pbtn_2.style.display = "block"; // Hide the "current page" button or similar
pbtn_2.innerText = res.currentPage;











}
