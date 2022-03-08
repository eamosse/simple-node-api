const express = require("express");
const routes = require("./routes");
const dotenv = require('dotenv');
dotenv.config();

// App
const app = express();
app.use(express.json())


// Set port
const port = process.env.PORT || "1337";
app.set("port", port);

app.use('/', routes);

// Server
app.listen(port, () => console.log(`Server running on localhost:${port}`));
