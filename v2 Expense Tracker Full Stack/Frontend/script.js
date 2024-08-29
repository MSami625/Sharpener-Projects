async function handleFormSubmit(e){
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
    console.error(err.response.data);

}
}