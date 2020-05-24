const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require("./modules/data-service.js");
//load environment file
require('dotenv').config({path:"./keys.env"});
const myData = dataService(process.env.MONGODB_URL);



const app = express();

app.use(cors());

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)

app.post("/api/sales", (req,res)=>{
    
    myData.addNewSale(req.body).then(newSale=>{
        res.json(newSale);
    }).catch(err=>{
        console.log(`ERR ADD NEW SALE ${err}`);
        res.status(404).json({msg:err});
    })
})

// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
app.get("/api/sales", (req,res)=>{
myData.getAllSales(req.query.page,req.query.perPage).then(allSales=>{
    res.json(allSales);
    console.log(allSales);
}).catch(err=>{
    console.log(`ERR GET ALL SALE ${err}`);
        res.status(404).json({msg:err});
})
})


// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)

app.get("/api/sales/:id", (req,res)=>{
    myData.getSaleById(req.params.id).then(oneSale=>{
        res.json(oneSale);
        console.log(oneSale);
    }).catch(err=>{
        console.log(`ERR GET ONE SALE ${err}`);
        res.status(404).json({msg:err});
    })
})

// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)

app.put("/api/sales/:id", (req,res)=>{
    myData.updateSaleById(req.body, req.params.id).then(message=>{
        res.json({msg:message});
    }).catch(err=>{
        console.log(`ERR UPDATE SALE ${err}`);
        res.status(404).json({msg:err});
    })
})

// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete("/api/sales/:id", (req,res)=>{
    myData.deleteSaleById(req.params.id).then(message=>{
        res.json({msg:message});
    }).catch(err=>{
        console.log(`ERR DELETE SALE ${err}`);
        res.status(404).json({msg:err});
    })
})


// ************* Initialize the Service & Start the Server

myData.initialize().then(()=>{
    app.listen(HTTP_PORT,()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

