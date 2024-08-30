document.addEventListener("DOMContentLoaded", fetchExpenses);

var c_id = null;

async function handleFormSubmit(event) {
  event.preventDefault();
  let path = event.target;
  let obj = {
    amount: path.amount.value,
    description: path.description.value,
    category: path.category.value,
  };

  console.log(obj);
  try {
    // Post data
    if (c_id != null) {
      await axios.put(`http://localhost:4000/expenses/${c_id}`, obj);
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
  try {
    const res = await axios.get("http://localhost:4000/expenses");
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
            await axios.delete(`http://localhost:4000/expenses/${expense.id}`);
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
