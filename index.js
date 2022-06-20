const express = require('express');
const app = express();
const alert = require("alert");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

let flag = 0;

mongoose.connect("mongodb://localhost:27017/tsfDB", {useNewUrlParser: true});

const usersSchema = {
    name : String,
    email : String,
    balance : { type: Number},
    accountNo : { type: Number}
}

const User = mongoose.model('User', usersSchema);

const user1 = new User({
    name: "Rashi Agarwal",
    email: "rashi@gmail.com",
    balance: 100000,
    accountNo: 12015951
})

const user2 = new User({
    name: "Rohini Singh",
    email: "amro05@gmail.com",
    balance: 100000,
    accountNo: 12015952
})

const user3 = new User({
    name: "Shekhar Suman",
    email: "shekhar@gmail.com",
    balance: 100000,
    accountNo: 12015953
})

const user4 = new User({
    name: "Suman Ghosh",
    email: "ghosh.suman@gmail.com",
    balance: 100000,
    accountNo: 12015954
})

const user5 = new User({
    name: "Chandini",
    email: "cchandini@gmail.com",
    balance: 100000,
    accountNo: 12015955
})

const user6 = new User({
    name: "Surya Singh",
    email: "ssurya@gmail.com",
    balance: 100000,
    accountNo: 12015956
})

const userArray = [user1, user2, user3, user4, user5, user6];

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var today  = new Date();
let day = today.toLocaleDateString("en-US", options);

const history = [];
let amount = 0;

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.get('/get-started', function(req, res) {
    User.find({},function(err, foundUsers){
        if(foundUsers.length === 0) {
            User.insertMany(userArray, function(err){
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully saved default items to DB.");
              }
            });
            res.redirect("/get-started")
        } else {
            res.render('get-started', {
                balance : foundUsers[0].balance
            });
        }
    } );

});

app.post('/get-started', function(req, res) {
    User.find({}, function(err, foundUsers) {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully savevd default items to DB.");
              }
            });
        } else {

            if(Number(req.body.amount) > foundUsers[0].balance) {
                alert('failed');
                res.redirect('/transaction');
            }
            else {
                foundUsers[0].balance -= Number(req.body.amount);

                foundUsers[0].save();

            User.findById(req.body.select, function(err, found){
                found.balance += Number(req.body.amount);
                found.save();
                console.log(found.balance)
                history.push({
                    sender : foundUsers[0].name,
                    receiver : found.name,
                    amount : req.body.amount,
                    date : day
                })
            })
            alert('successful');
            res.render('get-started', {
                balance : foundUsers[0].balance
            })
            }
        }
    } );
})

app.get('/add', function(req, res){
    User.find({}, function(err, foundUsers) {
        res.render('add', {
            balance: foundUsers[0].balance
        });
    });
});



app.get('/transaction', function(req, res){

    User.find({}, function(err, foundUsers){
        if(foundUsers.length === 0) {
            User.insertMany(userArray, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully saved default items to DB.");
              }
            });
            res.redirect("/transaction");
        } else {
            res.render('transaction', {
                users : foundUsers,
                balance : foundUsers[0].balance
            });
        }
    } );

});

app.get('/members', function(req, res) {

    User.find({}, function(err, foundUsers){
        if(foundUsers.length === 0) {
            User.insertMany(userArray, function(err){
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully savevd default items to DB.");
              }
            });

            res.redirect('/members');
        } else {

            res.render('members', {
                users : foundUsers,
                balance : foundUsers[0].balance
            });
        }
    } );

});



app.post('/members', function(req, res) {

    User.find({}, function(err, foundUsers)  {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, function(err)  {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully savevd default items to DB.");
              }
            });
        } else {
           console.log("add-members")
           const newuser = new User({
               name : req.body.name,
               email : req.body.email,
               balance : req.body.balance,
               accountNo : req.body.account
           });
          newuser.save();
          res.redirect('/members');

        }
    } )

});

app.get('/add-money', function(req, res)  {
    User.find({}, function(err, foundUsers)  {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, function(err) {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully saved default items to DB.");
              }
            });
        } else {
            res.render('add-money', {
                balance : foundUsers[0].balance
            });
        }
    } )
})

app.post("/add-money", function(req, res) {
   User.find({}, function(err, foundUsers) {
     foundUsers[0].balance += Number(req.body.money);
     foundUsers[0].save();
  res.redirect("/add-money");
});
});

// app.post('/add-money', function(req, res) {
//     User.find({}, function(err, foundUsers) {
//         if(foundUsers.length === 0) {
//             User.insertMany(userArray, function(err) {
//               if (err) {
//                 console.log(err);
//               } else {
//                 console.log("Successfully savevd default items to DB.");
//               }
//             });
//         } else {
//
//                 console.log(req.body.money)
//                 foundUsers[0].balance += Number(req.body.money);
//
//                 foundUsers[0].save();
//         res.render('add-money', {
//             balance : foundUsers[0].balance
//         });
//       }
//     } );
// })

app.get('/transaction-history', function(req, res)  {

    User.find({}, function(err, foundUsers)  {
        if(foundUsers.length === 0) {
            User.insertMany(userArray, function(err)  {
              if (err) {
                console.log(err);
              } else {
                console.log("Successfully savevd default items to DB.");
              }
            });
        } else {
            res.render('history', {
                history : history,
                balance : foundUsers[0].balance
            })
        }
    } )

});

app.listen(process.env.PORT || 3000, function(){
  console.log("server running ");
})
