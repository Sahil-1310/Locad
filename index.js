const express  = require('express');
const mongoose = require('mongoose');
const model    = require('./model');
const app      = express();
const PORT     = 3000;
app.use(express.json());

let url = `mongodb+srv://locad:locad@cluster0.xpe48nu.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url, (err, res) => {
    if (err) {
        console.log("mongoose error", err);
    } else {
        console.log(`connected to the database.....`)
    }
});


app.get('/health', (req, res) => {
    res.send('ok').status(200)
})
/**
 * @desc { create, update, get, delete }
 */
app.get('/get', async (req, res) => {
    let response = { success: true, message: "successfull", data: {} }
    try {
    const dbResponse = await model.product.find({ isDeleted : 0 });
        if (dbResponse.length == 0) {
            response.message = "No Data Found."
        } else {
            response.data = dbResponse;
        }
        res.send(response).status(200)
    } catch (error) {
        response.success = false;
        response.message = 'Internal Server Error.';
        res.send(response).status(500)
    }
})
/**
 * @desc { create }
*/
app.post('/create', async (req, res) => {
    let response = { success: true, message: "successfull", data: {} }
    try {
        let requestBody = req.body;
        let myProduct  = await model.product.create(requestBody);
        // let dbResponse = await myProduct.save();
        response.data = myProduct
        res.send(response).status(201)
    } catch (error) {
        console.log("error", error);
        response.success = false;
        response.message = 'Internal Server Error.';
        res.send(response).status(500)
    }
})

app.patch('/update', async (req, res) => {
    let response = { success: true, message: "successfull", data: { } }
    try {
        let requestBody  = req.body
        let _id          = requestBody._id;
        let dbResponse = await model.product.findOne({ isDeleted: 0, _id });
        if (dbResponse == null) {
            response.message = "No Data Found."
        }
        delete requestBody._id;
        dbResponse = await model.product.findOneAndUpdate({ _id }, { requestBody }, { new: true });
        console.log("dbResponse", dbResponse);
        if (!dbResponse) {
            response.success = false;
            response.message = 'Update Failed.';
            res.send(response).status(400)
        }
        response.data = dbResponse;
        res.send(response).status(200)
    } catch (error) {
        response.success = false;
        response.message = 'Internal Server Error.';
        res.send(response).status(500)
    }
});

app.delete('/delete/:id', async (req, res) => {
    let response = { success: true, message: "successfull", data: { } }
    try {
        let requestBody  = req.body
        let _id          = requestBody._id;
        let dbResponse = await model.product.findOne({ isDeleted: 0, _id });
        if (dbResponse == null) {
            response.message = "No Data Found."
        }
        dbResponse = await model.product.findOneAndDelete({ _id });
        if (!dbResponse) {
            response.success = false;
            response.message = 'Delete Failed.';
            res.send(response).status(400)
        }
        response.data = dbResponse;
        res.send(response).status(200)
    } catch (error) {
        response.success = false;
        response.message = 'Internal Server Error.';
        res.send(response).status(500)
    }
});

app.listen(PORT, () => {
    console.log("server is listen on port :", PORT);
})