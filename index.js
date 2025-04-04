const express = require('express');
const { resolve } = require('path');

const app = express();
app.use(express.json());
app.use(express.static('static'));

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

require('dotenv').config();

const port = process.env.PORT || 3010;


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("Connected to database..!");
})
.catch((err)=>{
  console.log(err);
})


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);


app.get('/user', async(req,res)=>{
  try{
    const data = await User.find();
    res.send(data);
  }
  catch(err){
    res.send(err);
  }
})

app.post('/user', async(req,res)=>{
  try{
    const {name,email,password}= req.body;
    
    if(!name || !email || !password){
      return res.send("Enter all the details");
    }
    
    const pas = await bcrypt.hash(password,10);
    const data = new User({name, email, password: pas});
    await data.save();
    res.send(data);
  }
  catch(err){
    res.send(err);
  }
})


app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
