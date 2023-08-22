
import Customer from "../../entity/customer";
import EventInterface from "../@shared/event.interface";

export default class CustomerChangeAddressEvent implements EventInterface {
    dateTimeOccurred: Date;
    eventData: any;

    constructor(eventData: any) {
        this.dateTimeOccurred = new Date();
        this.eventData = eventData;
    }
}