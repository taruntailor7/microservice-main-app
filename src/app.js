"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var typeorm_1 = require("typeorm");
var amqp = require("amqplib/callback_api");
(0, typeorm_1.createConnection)().then(function (db) {
    // amqp://ybbxuunk:Pmp2KpIcWnLPIt5VPqviv34pJDvyXWOy@rabbitmq-rpeg.onrender.com:5672
    amqp.connect('amqps://ybbxuunk:Pmp2KpIcWnLPIt5VPqviv34pJDvyXWOy@puffin.rmq2.cloudamqp.com/ybbxuunk', function (error0, connection) {
        if (error0) {
            console.log("Error0: ", error0);
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                console.log("Error1: ", error1);
                throw error1;
            }
            var app = express();
            app.use(cors({
                origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"]
            }));
            app.use(express.json());
            console.log("Listening on port: 8001");
            app.listen(8001);
        });
    });
});
