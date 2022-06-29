const express = require("express");
const auth = require('../middleware/auth');
const ticketBooking = require('../controllers/ticketBooking');
const validator = require('../middleware/validator');
const router = express.Router();

router.post('/booking/bookinTicket', [auth, validator.ticket], ticketBooking.bookingTicket);
router.patch('/booking/bookinTicket/:id', validator.ticket, ticketBooking.bookingTicketEdit);
router.get('/booking/bookinTicket/getAll', auth, ticketBooking.bookingTicketGetAll);
router.delete('/booking/bookinTicket/delete/:id', auth, ticketBooking.bookingTicketDelete);
router.post('/booking/bookinTicket/pay', validator.pay, ticketBooking.bookingTicketPay);
router.get('/success', ticketBooking.success);
router.get('/booking/bookinTicket/pay/getAll', auth, ticketBooking.bookingTicketPayGetAll);

module.exports = router;