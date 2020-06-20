const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()

var Publishable_Key = 'Your_Publishable_Key';
var Secret_Key = 'Your_Secret_Key';

const stripe = require('stripe')(Secret_Key)

const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

// View Engine Setup 
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('Home', {
        key: Publishable_Key
    })
})

app.post('/charges', function (req, res) {
    stripe.charges.create({ 
        amount: 2500,     // Charing Rs 25 
        description: 'Web Development Product', 
        currency: 'INR', 
        customer: 'customer_key' 
    })
    .then((charge) => {
        console.log(charge)
        res.status(200).send(charge) // If no error occurs 
    })
    .catch((err) => {
        res.status(400).send("Error" + err)	 // If some error occurs 
    }); 
});

app.post('/checkout', function (req, res) {
    const session = stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
            quantity: 10,
            currency: "inr",
            amount: 2500,
            name: "Kanan Mahudhia"
        }],
        mode: "payment",
        success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://example.com/cancel',
    }, {
        stripeAccount: 'your_account_key',
    })
        .then((charge) => {
            console.log(charge)
            res.status(200).send(charge) // If no error occurs 
        })
        .catch((err) => {
            res.status(400).send("Error" + err)	 // If some error occurs 
        });
});

app.post('/payout', function (req, res) {
    stripe.payouts.create(
        { 
            amount: 1, 
            currency: 'inr',
            source_type: 'card'
        },
        function (err, payout) {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send(payout)
            }
        }
    );
});

app.listen(port, function (error) {
    if (error) throw error
    console.log("Server created Successfully")
}) 
