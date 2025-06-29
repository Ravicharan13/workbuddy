const mongoose=require('mongoose')
const uri="mongodb+srv://charan:CHARAN1201@workbuddy.m8yscot.mongodb.net/?retryWrites=true&w=majority&appName=WORKBUDDY"
mongoose.connect(uri)
.then(()=>
{
    console.log("Connection successful..!")
})
.catch((e)=>
{
    console.log(e.message)
})