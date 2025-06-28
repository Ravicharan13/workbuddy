const express=require("express")

const port =5000
const app=express()
app.use(express.json())

app.listen(port,()=>{
    console.log("server is running on port ",port)
})

app.get("/",async(req,res)=>
{
    try{
        res.status(200).send("success")
    }catch(e)
    {
        res.status(500).send(e.message)
    }
})
