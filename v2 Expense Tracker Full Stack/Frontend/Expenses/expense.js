
document.addEventListener("DOMContentLoaded", fetchExpenses);

const premiumBtn = document.getElementById("rzp-button1");
const isPremiumUser = localStorage.getItem("isPremiumUser");

if (isPremiumUser === "true") {
  premiumBtn.outerHTML = `<button id="premiumBtn" class="premium-badge" disabled>Premium User</button>`

 
}


var c_id = null;

async function handleFormSubmit(event) {
  event.preventDefault();
  let path = event.target;
  const token= localStorage.getItem("token");

  let obj = {
    amount: path.amount.value,
    description: path.description.value,
    category: path.category.value,
    token: token,
  };

  try {
    // Post data
    if (c_id != null) {
      await axios.put(`http://localhost:4000/user/expenses/${c_id}`, obj);
      c_id = null;
      setTimeout(fetchExpenses, 100);
    } else {
      await axios.post("http://localhost:4000/expenses", obj);
      setTimeout(fetchExpenses, 100);
    }
  } catch (error) {
    console.error("Error handling form submit:", error);
  }
}

async function fetchExpenses() {

  const expenseList = document.getElementById("list-group"); 
     const token = localStorage.getItem("token");  
  try {
  
    const res = await axios.get(`http://localhost:4000/user/expenses/${token}`);
    const expenses = res.data;

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
            await axios.delete(`http://localhost:4000/user/expenses/${expense.id}`);
            await fetchExpenses();
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
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}

async function handlePayment(e) {
  e.preventDefault(); // Prevent the default form submit action

  const token = localStorage.getItem('token');

  try {
      const response = await axios.get('http://localhost:4000/user/purchasePremium', {
          headers: {
              'Authorization': `Bearer ${token}` // Include token in the Authorization header
          }
      });

      console.log("Response from purchasePremium:", response.data);

      const { key_id, order } = response.data;
      const order_id = order.orderId; // Access orderId from the response
      if (!order_id) {
          throw new Error('Order ID is missing from response');
      }

      const options = {
          "key": key_id,
          "order_id": order_id, // Use the correct order ID
          "handler": async function (response) {
              try { 
                  await axios.post('http://localhost:4000/user/updatePaymentStatus', {
                      order_id: order_id, // Ensure correct order ID
                      payment_id: response.razorpay_payment_id
                  }, {
                      headers: {
                          'Authorization': `Bearer ${token}`
                      }
                  });

                  alert('Payment Successful, You are now a premium user');
              } catch (error) {
                  console.error('Error updating payment status:', error);
                  alert('Payment failed, please try again');
              }
          },
          "modal": {
              "ondismiss": function () {
                  console.log('Payment modal dismissed');
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
      alert('Failed to initialize payment');
  }
}
