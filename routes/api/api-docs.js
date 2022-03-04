"use strict";

const express = require("express");
const app = express();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const swaggerOptions = {
	swaggerDefinition:{
		info:{
			version: "1.0.0",
			title: "documentation API",
			description: "API documentation: sistema de ayuda - SIA universidad de caldas",
			contact: {
				name: "200 developvers found",
				url: "universidad de caldas"
			},
			servers: ["http://localhost:5000"]
		}
	},
	basePath: "/",
	apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/",swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = app;