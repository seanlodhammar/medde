import { Request, RequestHandler } from "express";
import Customer from "../models/Customer";
import { CustomerInterface } from "../types/api";
import { Types } from "mongoose";

interface Req extends Request {
    customer?: { conversations: any[]; _id: Types.ObjectId }
}

const isCustomer : RequestHandler = async(req: Req, res, next) => {
    const customerId = req.headers['medde-customer-id'];
    if(!customerId) {
        res.sendStatus(500);
    }

    const customer = await Customer.findById(customerId);

    if(!customer) {
        res.sendStatus(500); // add code later to create customer in db and send back id as cookie
        return;
    };

    req.customer = (customer as unknown) as CustomerInterface;

    next();
}

export default isCustomer;