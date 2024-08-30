// SingUp Functionality
async function handleFormSubmitSignUp(e){
    try{
    e.preventDefault();


    const name=document.getElementById('name').value;
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;   

    const userDetails={
        name,
        email,
        password,
    }

    const res= await axios.post("http://localhost:4000/signup",userDetails);
    alert(res.data.message);
    window.location.href = "./login.html";

}catch(err){
    if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
    } else {
        alert("An error occurred. Please try again.");
    }

}
}


//Login Functionality
async function handleFormSubmitLogin(e){
    try{
    e.preventDefault();

    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;   

    const userDetails={
        email,
        password,
    }
    

    const res=await axios.post("http://localhost:4000/login",userDetails);  
    alert(res.data.message);
    // window.location.href = "./Expenses/expenses.html"; 


}catch(err){
    if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
    } else {
        alert("An error occurred. Please try again.");
    }
}
}