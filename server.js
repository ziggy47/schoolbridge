const app = require("./app");

const http = require("http").createServer(app);

require("dotenv").config();

const PORT = process.env.PORT || 2000;

http.listen(PORT,(req,res)=>
{
    console.log(`server started with port ${PORT}`);
})