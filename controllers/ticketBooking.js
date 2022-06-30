const ticketSchema = require('../models/ticketBooking');
const paymentSchema = require('../models/paymentData');
const paypal = require('paypal-rest-sdk');

const bookingTicket = async (req, res) => {
    try {
        const createTicket = new ticketSchema(req.body, req.body.totalAmount = req.body.kids * 50 + req.body.adult * 100 + req.body.srCitizen * 50);
        const save = await createTicket.save();
        res.status(201).send(save);
    }
    catch (error) {
        res.status(401).send(error);
    }
}

const bookingTicketEdit = async (req, res) => {
    try {
        const ticket = await ticketSchema.findById(req.params.id);
        const _id = req.params.id;
        ticket.totalAmount = req.body.kids * 50 + req.body.adult * 100 + req.body.srCitizen * 50;
        let a = { totalAmount: ticket.totalAmount, kids: req.body.kids, adult: req.body.adult, srCitizen: req.body.srCitizen, name: req.body.name, email: req.body.email, mobile: req.body.mobile };
        const profileUpdate = await ticketSchema.findByIdAndUpdate(_id, a, {
            new: true,
            runValidators: true
        })
        res.send(profileUpdate);
    } catch (error) {
        res.status(500).send(error);
    }
}

const bookingTicketGetAll = async (req, res) => {
    try {
        const getTicket = await ticketSchema.find();
        res.status(201).send(getTicket);
    } catch (error) {
        res.status(401).send(error);
    }
}

const bookingTicketDelete = async (req, res) => {
    try {
        const del = await ticketSchema.findByIdAndDelete(req.params.id);
        res.send(del);
    } catch (error) {
        res.status(500).send(error);
    }
}

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAY_PAL_CLIENT_ID,
    'client_secret': process.env.PAY_PAL_CLIENT_SECRET
});

const bookingTicketPay = async (req, res) => {
    try {
        const ticket = await ticketSchema.findById(req.body.ticketId);
        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "/success",
                "cancel_url": "/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": req.body.name,
                        "sku": "001",
                        "price": ticket.totalAmount,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": ticket.totalAmount
                },
                "description": "Hat for the best team ever"
            }]
        };
        paypal.payment.create(create_payment_json, async (error, payment) => {
            if (error) {
                res.send(error);
            } else {
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                        res.send(payment.links[i].href);
                    }
                }
            }
        });
    }
    catch (error) {
        res.send(error)
    }
}

const success = async (req, res) => {
    const ticket = await ticketSchema.findOne(req.body.ticketId);
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
    };
    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
        if (error) {
            throw error;
        } else {
            const createPaymentData = new paymentSchema({
                name: ticket.name,
                userid: req.body.userid,
                paymentId: payment.id,
                totalAmount: ticket.totalAmount,
                paymentMethod: payment.payer.payment_method,
            })
            const save = await createPaymentData.save();
            res.status(201).render('home')
        }
    });
};

const bookingTicketPayGetAll = async (req, res) => {
    try {
        const getPayment = await paymentSchema.find();
        res.status(201).send(getPayment);
    } catch (error) {
        res.status(401).send(error);
    }
}

module.exports = {
    bookingTicket,
    bookingTicketPay,
    bookingTicketGetAll,
    bookingTicketPayGetAll,
    bookingTicketEdit,
    bookingTicketDelete,
    success
}