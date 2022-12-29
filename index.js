const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Products = require("./module/Products");
const Users = require("./module/Users");
const bcrypt = require("bcrypt");
const Orders = require("./module/Orders");
const Category = require("./module/Category");
const path = require('path');
const app = express();
const stripe = require("stripe")(
  "sk_test_51MHt1ASFBIyqZbMVwq2HiyJyocgRzgJbBYAdq5K6ntvpS9FyfaqKoig0vGjsOJ5ZDfzQs4hDHmr2rBsk1rTPgCO100F9rtc9QC"
);



app.use(express.json());
app.use(cors());

const MONGO_URL =
  "mongodb+srv://blogadmin:admin1234@cluster0.vztbzci.mongodb.net/ecommerece?retryWrites=true&w=majority";

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req,res)=>{
   res.send('hello');
})


app.post("/api/products/add", (req, res) => {
  const productDetail = req.body;

  Products.create(productDetail, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
      console.log(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/api/products/get", (req, res) => {
  Products.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/api/category/get", (req, res) => {
  Category.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/api/category/add", (req, res) => {
  const categoryDetail = req.body;

  Category.create(categoryDetail, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
      console.log(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//api for signup

app.post("/api/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;
  const encry_password = await bcrypt.hash(password, 10);

  const userDetail = {
    email: email,
    password: encry_password,
    fullName: fullName,
  };
  const user_exist = await Users.findOne({ email: email });

  if (user_exist) {
    res.send({ message : "The Email is already in use!"})
  } else {
    Users.create(userDetail, (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(result);
      }
    });
  }
});

//api for login

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const userDetail = await Users.findOne({ email: email });
  if (userDetail) {
    if (await bcrypt.compare(password, userDetail.password)) {
      res.send(userDetail);
    } else {
      res.send({ error: "invaild password" });
    }  
  } else {
    res.send({ error: "user is not exist" });
  }
}); 

//api for payment

app.post("/api/payment/create", async (req, res) => {
  const total = req.body.amount;
  console.log("payment Request recieved for this rupess", total);

  const payment = await stripe.paymentIntents.create({
    amount: total * 100,
    currency: "inr",
  });
  res.status(201).send({
    clientSecret: payment.client_secret,
  });
});

app.post("/api/orders/add", (req, res) => {
  const products = req.body.basket;
  const price = req.body.price;
  const email = req.body.email;
  const address = req.body.address;

  const orderDetail = {
    products: products,
    price: price,
    address: address,
    email: email,
  };

  Orders.create(orderDetail, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("order added to database", result);
    }
  });
});

app.post("/api/orders/get", (req, res) => {
  const email = req.body.email;
  Orders.find((err, result) => {
    if (err) {
      console.log(err);
    } else {
      const userOrders = result.filter((order) => order.email === email);
      res.send(userOrders);
    }
  });
});

// app.use(express.static(path.join(__dirname, "./frontend/build")));

// app.get("*", function (_, res) {
//   res.sendFile(
//     path.join(__dirname, "./frontend/build/index.html"),
//     function (err) {
//       if (err) {
//         res.status(500).send(err);
//       }
//     }
//   );
// });



app.listen(8000, () => {
  console.log(`backend running.... `);
});
