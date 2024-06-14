

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const mongoose = require('mongoose')
const app = express()
const port = 8000

const SITE_SECRET = process.env.SITE_SECRET

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection
db.once('open', () => {
    console.log('Connected to MongoDB Database')
})

app.use(cors())
app.use(express.json())

const surveySchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    gender: String,
    month: String,
    day: String,
    year: String,
    state: String,
    maritalStatus: String,
    race: String,
    religion: String,
    surveyEnjoyment: String,
    referralSource: String,
})

const Survey = mongoose.model('Survey', surveySchema)

app.post('/verify', async (request, response) => {
    const { captchaValue, formData } = request.body

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

        const newSurvey = new Survey(formData)
        await newSurvey.save()

        return response.json({ success: true, message: 'Captcha verification and form submission succeeded' })
    } catch (error) {
        console.error('Error verifying captcha or saving form data:', error)
        return response.status(500).json({ success: false, message: 'Internal server error' })
    }
})

app.listen(port, () => {
    console.log(`Server listening at ${port}`)
})
