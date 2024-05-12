import * as express from "express";
import { Request, Response} from "express";
import * as cors from "cors";
import { createConnection } from "typeorm";
import * as amqp from 'amqplib/callback_api';
import { Product } from "./entity/product";

createConnection().then(db => {
    const productRepository = db.getMongoRepository(Product);

    amqp.connect('amqps://ybbxuunk:Pmp2KpIcWnLPIt5VPqviv34pJDvyXWOy@puffin.rmq2.cloudamqp.com/ybbxuunk', (error0, connection) => {
        if(error0) {
            console.log("Error0: ", error0); 
            throw error0;
        }

        connection.createChannel((error1, channel) => {
            if(error1) {
                console.log("Error1: ", error1); 
                throw error1;
            }

            channel.assertQueue("product_created", {durable: false});
            channel.assertQueue("product_updated",  {durable: false});
            channel.assertQueue("product_deleted", {durable: false});
 
            const app = express();
            
            app.use(cors({
                origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:4200"]
            }));
            
            app.use(express.json());

            channel.consume("product_created", async (msg) => {
                const eventProduct = JSON.parse(msg.content.toString());
                
                const product = new Product();
                product.admin_id = eventProduct.id;
                product.title = eventProduct.title;
                product.image = eventProduct.image;
                product.likes = eventProduct.likes;

                await productRepository.save(product);
                console.log("Product created"); 
            }, {noAck: true});
            
            console.log("Listening on port: 8001"); 
            app.listen(8001);
            process.on('beforeExit', () => {
                console.log("Closing connection");
                connection.close(); 
            });
        });
    });
});