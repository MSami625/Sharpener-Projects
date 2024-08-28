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


  try {
    // Post data
    if (c_id != null) {
      await axios.put(`http://localhost:3001/${c_id}`, obj);
      c_id = null;
      setTimeout(fetchExpenses, 100);
    } else {
      await axios.post("http://localhost:3001/", obj);
      setTimeout(fetchExpenses, 100);
    }
  } catch (error) {
    console.error("Error handling form submit:", error);
  }
}



async function fetchExpenses() {
  const expenseList = document.getElementById("list-group");
  try {
    const res = await axios.get("http://localhost:3001/");

    const expenses = res.data;

    expenseList.innerHTML = "";

    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.innerHTML = `<input value=${expense.id} type="hidden"/>${expense.amount} - ${expense.description} - ${expense.category}`;

      // Create and add Delete button
      const delbtn = document.createElement("button");
      delbtn.className = "del-btn";
      delbtn.textContent = "Delete";
      delbtn.addEventListener("click", async () => {
        if (li) {
          li.remove();
        }
        try {
          await axios.delete(`http://localhost:3001/${expense.id}`);
          // Remove from UI
          li.remove();
          // Remove from localStorage if needed
          localStorage.removeItem(expense.category);
        } catch (error) {
          console.error("Error deleting expense:", error);
        }
      });

      // Create and add Edit button
      const editbtn = document.createElement("button");
      editbtn.className = "edit-btn";
      editbtn.textContent = "Edit";
      editbtn.addEventListener("click", () => {
        document.getElementById("amount").value = expense.amount;
        document.getElementById("description").value = expense.description;
        document.getElementById("category").value = expense.category;
        c_id = expense.id;
        localStorage.removeItem(expense.category);
        li.remove();
      });

      li.appendChild(delbtn);
      li.appendChild(editbtn);
      expenseList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
}
