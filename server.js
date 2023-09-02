import express from "express";
import { errorHandler } from "./middlewares/error.js";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import "colors";
import bodyParser from "body-parser"
import { startApplication } from "./config/db.js";

//? access the env variables
dotenv.config();

// ? Start the server
const app = express();

// ? Start the database
startApplication();

// ? cors origin
app.use(cors());

// ? Serve the static files
app.use("/public", express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ? let express access the body
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ? the logger on the terminal
app.use(morgan("dev"));

// ? import the routes
import { userRouter } from "./routes/user.routes.js";
import { translationRouter } from "./routes/translation.routes.js";

// ? mount routes
app.use("/api/users", userRouter);
app.use("/api/translations", translationRouter);


app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
	next()
})

// ! CATCH THE ERRORS USING THE CUSTOM ERROR
app.use(errorHandler);

// ? Make the server listen on the port
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
	console.log(`the app is listening  on port ${PORT}`.white.bold);
});