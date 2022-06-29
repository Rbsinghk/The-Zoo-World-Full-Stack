const express = require('express');
const router = new express.Router();

router.get('/register', (req, res) => {
    res.render('register/register')
})
router.get('/login', (req, res) => {
    res.render('register/login')
})
router.get('/userData', async (req, res) => {
    try {
        res.render('userGet')
    } catch (error) {
        res.send('error')
    }
})
router.get('/profile', async (req, res) => {
    res.render('userById')
})
router.get('/', (req, res) => {
    res.render('home')
})
router.get('/home', (req, res) => {
    res.render('home')
})
router.get('/feedback', (req, res) => {
    res.render('feedback/feedbackCreate')
})
router.get('/feedbackUpload', (req, res) => {
    res.render('feedback/feedbackUpload')
})
router.get('/feedbackGet', (req, res) => {
    res.render('feedback/feedbackGet')
})
router.get('/animalcreate', (req, res) => {
    res.render('animal/animalCreate')
})
router.get('/animalget', (req, res) => {
    res.render('animal/animalGet')
})
router.get('/bookingTicket', (req, res) => {
    res.render('bookingTicket/bookingTicket')
})
router.get('/bookingTicketGet', (req, res) => {
    res.render('bookingTicket/bookingTicketGet')
})

module.exports = router;