document.addEventListener("DOMContentLoaded", fetchExpenses);

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
    await axios.post("http://localhost:3001/", obj);

    fetchExpenses();
  } catch (error) {
    console.error("Error handling form submit:", error);
  }
}

async function fetchExpenses() {
  const expenseList = document.getElementById("list-group");

  try {
    const res = await axios.get("http://localhost:3001/expenses");
    console.log("Expenses data:", res.data);

    const expenses = res.data;
    // Update UI
    expenseList.innerHTML = "";

    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.className = "list-group-item";
      li.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;

      // Create and add Delete button
      const delbtn = document.createElement("button");
      delbtn.className = "del-btn";
      delbtn.textContent = "Delete";
      delbtn.addEventListener("click", async () => {
        if (li) {
          li.remove();
        }
        try {
          // Remove from server
          await axios.delete(`http://localhost:3001/expenses/${expense.id}`);
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

