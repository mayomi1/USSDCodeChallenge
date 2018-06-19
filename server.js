/**
 * Created by mayomi on 6/19/18 by 5:36 PM.
 */
const app = require('express')()
const bodyParser = require('body-parser')
const logger = require('morgan')

const port = process.env.PORT || 3030


const options = {
    apiKey: 'f93105949cbe77dec95ffeeae5e1fd77a6604b53d22bf75a5c9c6946b53c6b91', // use your sandbox app API key for development in the test environment
    username: 'sandbox',      // use 'sandbox' for development in the test environment
};

const AfricasTalking = require('africastalking')(options);

const payments = AfricasTalking.PAYMENTS;

const bankPayments = (amount) => {
    const opts = {
        "productName": "Wazobia Loans",
        "bankAccount": {
            "accountName"   : "Test Bank Account",
            "accountNumber" : "1234567890",
            "bankCode"      : 234001,
            "dateOfBirth"   : "2017-11-22"
        },
        "currencyCode": "NGN",
        "amount": Number(amount),
        "narration": "Make Deposit to Wazobia Loans",
        "metadata" : {
            "requestId" : "1234568",
            "applicationId" : "AppId123"
        }
    };
    return payments.bankCheckout(opts)
        .then((success) => console.log(success))
        .catch((error) => console.log(error));
};

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('*', (req, res) => {
    res.send('This is tutorial App on creating your first USSD app in 5 minutes or less by Ajala Abdulsamii <kgasta@gmail.com>')
})

app.post('*', (req, res) => {
    let {sessionId, serviceCode, phoneNumber, text} = req.body;
    if (text === '') {
        // This is the first request. Note how we start the response with CON
        let response = `CON Welcome to Wazobia Loans
    1. My Cooperative
    2. Wazobia Loans
    3. Join Agbetuntu
    4. Request a Call`;
        res.send(response)
    } else if (text == '1') {
        // Business logic for first level response
        let response = `CON Choose account information you want to view
        1. Check Balance
        2. Request Loan
        3. Make Deposit`;
        res.send(response)
    } else if (text == '2') {
        let response = `CON 
        1. Repay Loan
        2. Make Deposit
        3. Request Loan
        4. Request a call
        `;
        res.send(response)
    }
    else if (text == '3') {
        let response = `END Thank you for joining Agbetuntu`;
        res.send(response)
    }

    else if (text == '4') {
        const voice = AfricasTalking.VOICE;
        voice.call({
            callFrom: phoneNumber,
            callTo: '+2347062592846'
        })
            .then(function(s) {
                // persist call Info
                console.log(s);
            })
            .catch(function(error) {
                console.log(error);
            });
        res.send('END your call request has been sent');
    }

    else if (text == '1*1') {
        let response = `END Your balance is N1200`;
        res.send(response);
    }

    else if (text == '1*2') {
        let response = `CON Enter the amount of Loan you want to request
        `;
        res.send(response);
    }

    else if (text == '1*3') {
        let response = `CON Enter the amount of Loan you want to deposit`;
        bankPayments(text);
     res.send(response);
    }

    else if (text == '2*1') {
        let response = `CON register`;
        res.send(response);
    }

    else if (text == '2*2') {
        let response = `CON repay loan`;
        res.send(response);
    }

    else if (text == '2*3') {
        let response = `CON Enter the amount of Loan you want to deposit`;
        res.send(response);
    }

    else if (text == '2*4') {
        let response = `CON Request call`;
        res.send(response);
    }

    else {
        res.status(400).send('Bad request!')
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});