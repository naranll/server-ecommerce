const express = require("express");
const cors = require("cors");
// const data = require("./data.json"); doesn't work 'cause whole const array can't be changed
// let data = require("./data.json");
// const { request, response } = require("express");
const app = express();
const port = 2020;
const fs = require("fs");

app.use(cors());

//add json
app.use(express.json());

//muteable immutable

app.get("/products", (request, response) => {
    console.log("get products requesting");
    fs.readFile("./products/dataFile.json", (error, dataFile) => {
        if (error) {
            response.status(500).send({ msg: error });
        } else {
            const products = JSON.parse(dataFile);
            response.status(200).send(products);
        }
    })
})

app.post("/products", (request, response) => {
    // console.log("new request", request.body);
    fs.readFile("./products/dataFile.json", (error, data) => {
        if (error) {
            response.status(500).send({ msg: error });
        } else {
            const products = JSON.parse(data);
            const newProduct = {
                id: Date.now().toString(),
                ...request.body
            };
            products.push(newProduct)
            console.log(products);

            fs.writeFile("./products/dataFile.json", JSON.stringify(products), (err) => {
                if (err) {
                    response.status(500).send({ msg: "couldn't write" });
                } else {
                    response.status(200).send({ msg: `added` })
                }
            })
        }
    }
    )
})

app.delete("/products/:id", (request, response) => {
    console.log("to delete:", request.params.id);
    const id = request.params.id;
    fs.readFile("./products/dataFile.json", (error, dataFile) => {
        if (error) {
            response.status(500).send({ msg: error });
        } else {
            const products = JSON.parse(dataFile);
            const newProducts = products.filter((product) => product.id !== id);
            // console.log(newProducts);
            fs.writeFile("./products/dataFile.json", JSON.stringify(newProducts), (err) => {
                if (err) {
                    response.status(500).send({ msg: "couldn't write" });
                } else {
                    response.status(200).send({ msg: `deleted` })
                }
            })
        }
    })
})

app.patch("/products/:id", (request, response) => {
    const id = request.params.id;
    const edited = request.body;
    console.log("To edit:", id);
    fs.readFile("./products/dataFile.json", (error, dataFile) => {
        if (error) {
            response.status(500).send({ msg: "error loading datafile" });
        } else {
            const products = JSON.parse(dataFile);
            const index = products.indexOf(products.find(product => product.id === edited.id));
            // console.log(index);
            // console.log("current", products[index]);
            products[index] = edited;
            fs.writeFile("./products/dataFile.json", JSON.stringify(products), (err) => {
                if (err) {
                    response.status(500).send({ msg: "couldn't write" });
                } else {
                    response.status(200).send({ msg: `edited` })
                }
            })
        }
    })
})

app.listen(port, () => {
    console.log(`server is starting in ${port} port`);
})


//used previously 

//router    "/products" -- api
// app.get("/products", (request, response) => {
//     console.log("get products requesting");
//     //response.send(prdouctsData)  -- auto 200
//     // response.status(200).send(productsData);  -- preferred
//     //response.status(404).send("not found");
//     response.json([data, categories]);
//     // response.json(data);
// })

// app.post("/products", (request, response) => {
//     const newProduct = {
//         id: data[data.length - 1].id + 1,
//         ...request.body
//     };
//     console.log("reponse from back-end", response);
//     data.push(newProduct);
//     response.json(newProduct);
// })


// app.delete("/products/:id", (request, response) => {
//     console.log("to delete:", request.params.id);
//     // let id = request.params.id;
//     let newData = data.filter((product) => product.id !== request.params.id);
//     console.log(newData[0]);
//     data = newData;
// })

