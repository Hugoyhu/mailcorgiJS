const imb = require('imb');


function encodeIMB(id, service_type, mid, serial_num, zip, plus4, delivery_pt) {
    // USPS does not require the zip, +4, or delivery-point for basic tracking, and can be left blank as ""
    // delivery-point is required for automation discounts
    // id: use Barcode ID ref. table on RIBBS
    // service_type: use USPS STID table
    // mid: mailer ID, found on USPS BCG
    // serial_num: serial number for mailpiece

    return imb.encode({
        delivery_pt:    delivery_pt,
        zip:            zip,
        plus4:          plus4,
        barcode_id:     id,
        service_type:   service_type,
        mailer_id:      mid,
        serial_num:     serial_num
    })
}

exports.encodeIMB = encodeIMB
