import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import EventInterface from "../../../@shared/event/event.interface";

export default class SendEmailWhenProductIsCreatedHandler implements EventHandlerInterface {
    
    handle(event: EventInterface): void {
        console.log(`Sending email to ......`); // poderia enviar para qualquer FILA / MENSAGERIA
    }

}