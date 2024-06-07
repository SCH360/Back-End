
// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const app = express();
// const PORT = 5000;

// mongoose.connect("mongodb+srv://React360:50VSCODE50@cluster0.fa99gom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",{
//     useNewUrlParser:true,
//     useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.once("open", ()=>{
//     console.log("Connected to MongoDB Database");
// });
// const surveySchema = new mongoose.Schema({
//     FirstName:String,
//     LastName:String, 
//     EmailAddress: String, 
//     Gender: String, 
//     Month: String,
//     Day: String,
//     Year: String,
//     Address: String,
//     City: String, 
//     State: String,
//     Zipcode: String, 
//     Status: String,
//     Race: String,
//     Religion: String,
//     Enjoyed: String,
//     Recommendation: String,
// });
// const Survey = mongoose.model("survey", surveySchema);
// app.use(bodyParser.json());
// app.post("/api/surveys", async(req,res)=>{
//     try{
//         const surveydata = req.body;
//         const survey = new Survey(surveydata);
//         await survey.save();
//         console.log("Survey data saved", surveydata);
//         res.status(200).json({message:"Survey data has been saved successfully"});

//     }
//     catch(error){
//         console.error("Error saving survey data", error.message);
//         res.status(500).json({error:"Internal Server Error"});
//     }
// }) ;
// app.listen(PORT, ()=>{
//     console.log(`Server is running on PORT ${PORT}`);
// });

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = 8000

const SITE_SECRET = process.env.SITE_SECRET

app.use(cors())
app.use(express.json())

app.post('/verify', async (request, response) => {
  const { captchaValue } = request.body

  if (!captchaValue) {
    return response.status(400).json({ success: false, message: 'No captcha value provided' })
  }

  try {
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SITE_SECRET}&response=${captchaValue}`
    )

    if (!data.success) {
      return response.status(400).json({ success: false, message: 'Captcha verification failed' })
    }

    return response.json({ success: true, message: 'Captcha verification succeeded' })
  } catch (error) {
    console.error('Error verifying captcha:', error)
    return response.status(500).json({ success: false, message: 'Internal server error' })
  }
})

app.listen(port, () => {
  console.log(`Server listening at ${port}`)
})
