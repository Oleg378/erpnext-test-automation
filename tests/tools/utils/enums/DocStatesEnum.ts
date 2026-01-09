export enum DocStatesEnum {
    DRAFT = 'Draft', // any created document
    SUBMITTED = 'Submitted', // payment entry
    OPEN = 'Open', // quotation
    TO_DELIVER_AND_BILL = 'To Deliver and Bill', // sales order
    UNPAID = 'Unpaid', // sales invoice
    PAID = 'Paid', // sales invoice
    PENDING = 'Pending', // Material Request
    TO_RECEIVE_AND_BILL = 'To Receive and Bill', // Purchase Order
    TO_BILL = 'To Bill', // Purchase Recept, Delivery Note
}