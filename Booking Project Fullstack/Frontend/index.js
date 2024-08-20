async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await axios.post("http://localhost:4000/", data);
     displayUser();
   
  } catch (err) {
    console.log(err);
  }
   
}


async function displayUser(){
    let userlist = document.getElementById("user-list");
     try{
        const res=await axios.get("http://localhost:4000/");
       userlist.innerHTML = "";
        res.data.forEach((user) => {
          
          const li = document.createElement("li");
          const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteUser(user.id,li));

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
   
            li.textContent = `Name: ${user.Name} Email: ${user.Email} Phone: ${user.phoneNumber} `;
             li.appendChild(deleteButton);
            li.appendChild(editButton);
           
          userlist.appendChild(li);
        }); 

     }catch(err){
        console.log(err);
     }  
}


async function deleteUser(userId,listItem) {
    try { 
         if (listItem) {
        listItem.remove();
       }
      await axios.delete(`http://localhost:4000/${userId}`);
      console.log(`User ${userId} deleted`);
   
  
    } catch (error) {
      console.error('Error deleting user:', error);
    }

   
  }

displayUser();