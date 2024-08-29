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
    console.log(res.data.message);


}catch(err){
    alert(err.response.data.message);

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



}catch(err){
    alert(err.response.data.message);
}
}