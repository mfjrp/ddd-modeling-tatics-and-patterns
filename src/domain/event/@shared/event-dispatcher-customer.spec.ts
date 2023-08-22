import EventDispatcher from "./event-dispatcher";
import SendEmailWhenCustomerIsChangedAddressdHandler from "../customer/handler/send-email-when-customer-is-change-address.handler";
import SendEmailWhenCustomerIsCreatedHandler from "../customer/handler/send-email-when-customer-is-created.handler";
import CustomerChangeAddressEvent from "../customer/customer-change-address.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import Address from "../../entity/address";
import Customer from "../../entity/customer";

describe("Domain products events tests", () => {

    it("should register an customer event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    });

    it("should register an customer changed address event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenCustomerIsChangedAddressdHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);

        const customer = new Customer("1", "Customer 1 description");
        const address = new Address("Address 1", 123, "Zip Code 1", "City 1");
        customer.changeAddress(address);
        const customerChangedAddress = new CustomerChangeAddressEvent({
            id: customer.id,
            nome: customer.name,
            endereco: customer.Address
        });
        console.log(`customer ` + customerChangedAddress.eventData.id);
        eventHandler.handle(customerChangedAddress);
        
        eventDispatcher.notify(customerChangedAddress);
        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should unregister an customer created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);
    });

    it("should unregister an customer change address created event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenCustomerIsChangedAddressdHandler;

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("CustomerChangedAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(0);
    });

    it("should unregister all customers event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
    });

    it("should notify all customers event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenCustomerIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "Customer 1 description",
            address: {
                street: "Address 1", 
                number: 123, 
                zip: "Zip Code 1", 
                city: "City 1"
            },
        });

        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});