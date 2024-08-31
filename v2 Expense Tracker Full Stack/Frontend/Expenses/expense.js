
document.addEventListener("DOMContentLoaded", fetchExpenses);

const premiumBtn = document.getElementById("rzp-button1");
const leaderboardBtn = document.getElementById("show-leaderboard");
const leaderboardContainer=document.querySelector("#leaderboard-container");



const auth = localStorage.getItem("auth");

if (auth) {
  const decoded = jwt_decode(auth);
  const isPremiumUser = decoded.isPremiumUser;
  if (isPremiumUser === true) {
  premiumBtn.outerHTML = `<button id="premiumBtn" class="premium-badge" disabled>You're a Premium User</button>`
  leaderboardBtn.outerHTML = ` <button id="show-leaderboard" onclick="showLeaderboard()">Show Leaderboard</button>`;
  leaderboardContainer.style.display = 'block';
  }
}


var c_id = null;

async function handleFormSubmit(event) {
  event.preventDefault();
  let path = event.target; 

  try {
  const token= localStorage.getItem("auth");

  let obj = {
    amount: path.amount.value,
    description: path.description.value,
    category: path.category.value,
    token: token,
  };

 
    // Post data
    if (c_id != null) {
      await axios.put(`http://localhost:4000/user/expenses/${c_id}`, obj);
      c_id = null;
      setTimeout(fetchExpenses, 100);
    } else {
      const res= await axios.post("http://localhost:4000/expenses", obj);
      setTimeout(fetchExpenses, 100);
      
      //clean up the form
      path.amount.value = "";
      path.description.value = "";
      path.category.value = "";

      if(res.data.isPremiumUser){
      setTimeout(showLeaderboard,500);
      }
    }
  } catch (error) {
    console.error("Error handling form submit:", error);
  }
}

async function fetchExpenses() {

  const expenseList = document.getElementById("list-group"); 
 
     
  try {
    const token = localStorage.getItem("auth");  
    const res = await axios.get(`http://localhost:4000/user/expenses/${token}`);
    const expenses = res.data.expenses;

    expenseList.innerHTML = "";

    if (expenses.length != 0) {
      expenses.forEach((expense) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${expense.description}</td>
          <td>${expense.category}</td>
          <td>${expense.amount}</td>
          <td>
            <button class="btn-action edit-btn">Edit</button>
            <button class="btn-action del-btn">Delete</button>
          </td>
        `;

        const delbtn = tr.querySelector(".del-btn");
        delbtn.addEventListener("click", async () => {
          try {
           const res= await axios.delete(`http://localhost:4000/user/expenses/${expense.id}`,{
              headers: {  
                Authorization: `Bearer ${token}`
              }
            });
            await fetchExpenses();
            if(res.data.isPremiumUser){
            await showLeaderboard();
            }

          } catch (error) {
            console.error("Error deleting expense:", error);
          }
        });

        // const editbtn = tr.querySelector(".edit-btn");
        // editbtn.addEventListener("click", () => {
        //   document.getElementById("amount").value = expense.amount;
        //   document.getElementById("description").value = expense.description;
        //   document.getElementById("category").value = expense.category;
        //   c_id = expense.id;
        //   fetchExpenses();
        // });

        expenseList.appendChild(tr);
      });
    } else {
      expenseList.innerHTML = "No expenses found";
    }
  if (!token) {
    window.location.href = "../login.html";
  }else{
   const loginBtn = document.getElementById("login-button");
   loginBtn.innerText = "Logout";
  }
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

function handleLogOut(){
  localStorage.clear();
  window.location.href = "../login.html";

}

async function handlePayment(e) {
  e.preventDefault(); 

    try {
      const token = localStorage.getItem('auth');


      const response = await axios.get('http://localhost:4000/user/purchasePremium', {
          headers: {
              'Authorization': `Bearer ${token}` 
          }
      });


      const { key_id, order } = response.data;
      const order_id = order.orderId; 
      if (!order_id) {
          throw new Error('Order ID is missing from response');
      }

      const options = {
          "key": key_id,
          "order_id": order_id, 
          "handler": async function (response) {
              try { 
                 const res= await axios.post('http://localhost:4000/user/updatePaymentStatus', {
                      order_id: order_id, 
                      payment_id: response.razorpay_payment_id
                  }, {
                      headers: {
                          'Authorization': `Bearer ${token}`
                      }
                  });

                  alert('Payment Successful, You are now a premium user');
                  localStorage.setItem('auth', res.data.token);
                  window.location.reload();
              } catch (error) {
                  console.error('Error updating payment status:', error);
                  alert('Payment failed, please try again');
              }
          },
          "modal": {
              "ondismiss": function () {
                  alert('Payment Cancelled');
              }
          }
      };

      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response) {
          console.log(response.error);
          alert('Payment Failed, Please try again');
      });

  } catch (error) {
      console.error('Error fetching payment details:', error);
      alert('Failed to initialize payment, Please Login or try again');
  }
}


let isLeaderboardVisible = false;

async function showLeaderboard() {
  const response= await axios.get("http://localhost:4000/premium/leaderboard",{
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth')}`
    } 
  });
 
  const leaderboard = response.data.leaderboard;
  const tableBody = document.getElementById('leaderboard-body');
    
  tableBody.innerHTML = ''; 
 
  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${index==0?"🥇":" "}${entry.userName==response.data.user?'<b>You ('+entry.userName+')</b>':entry.userName}</td>
      <td>₹${entry.totalExpenses}</td>
    `;

    tableBody.appendChild(row);
  });
   isLeaderboardVisible = !isLeaderboardVisible;
  document.getElementById('leaderboard-container').style.display = isLeaderboardVisible ? 'block' : 'none';


}