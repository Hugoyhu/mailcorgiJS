const encoding = require("../imb/encoding/encoding.js");
const PDFDocument = require('pdfkit');
const fs = require('fs');

class AddressPDFDomestic {
    constructor (
        name, addr1, addr2, city, state, zip,
        id, svc, mid, serial, imb_zip, plus4, del_pt) {

        // addr2, imb_zip, plus4, del_pt are optional. pass in "" if not wanted

        this.name = name;
        this.addr1 = addr1;
        this.addr2 = addr2;
        this.addr3 = city + " " + state + " " + zip;
        
        // will directly encode into the IMB string
        this.IMB = encoding.encodeIMB(id, svc, mid, serial, imb_zip, plus4, del_pt);
        // combination of these form the number used to identify mailpiece
        this.tracking = id + svc + mid + serial + imb_zip + plus4 + del_pt;

    }

    generateAddressLineTwo() {
        // generate 1x3 PDF with Address Line Two
        this.doc = new PDFDocument({size: [216,72], margins : {top: 0, bottom: 0, left: 0, right: 0}});

        // stores under api/files/ with name: recipient name_tracking.pdf
        this.doc.pipe(fs.createWriteStream("api/files/"+ this.name + "_" + this.tracking + '.pdf'));

        this.doc
            .font('api/imb/font/USPSIMBCompact.ttf')
            .fontSize(14)
            .text(this.IMB, 10, 8);

        this.doc
            .font('api/imb/font/PhantomSans0.8-Regular.ttf')
            .fontSize(12)
            .text(this.name, 10, 20)
            .text(this.addr1, 10, 32)
            .text(this.addr2, 10, 44)
            .text(this.addr3, 10, 56);

        this.doc.end();
    }

    generateNoAddressLineTwo() {
        // generate 1x3 PDF without Address Line Two
        this.doc = new PDFDocument({size: [216,72], margins : {top: 0, bottom: 0, left: 0, right: 0}});

        // stores under api/files/ with name: recipient name_tracking.pdf
        this.doc.pipe(fs.createWriteStream("api/files/"+ this.name + "_" + this.tracking + '.pdf'));

        this.doc
            .font('api/imb/font/USPSIMBCompact.ttf')
            .fontSize(14)
            .text(this.IMB, 10, 10);

        this.doc
            .font('api/imb/font/PhantomSans0.8-Regular.ttf')
            .fontSize(13)
            .text(this.name, 10, 24)
            .text(this.addr1, 10, 38)
            .text(this.addr3, 10, 52);

        this.doc.end();
    }
}

class AddressPDFInternational {
    constructor (
        name, addr1, addr2, city, state, zip, country) {

        // similar concept to AddressPDFDomestic, without IMB information

        this.name = name;
        this.addr1 = addr1;
        this.addr2 = addr2;
        this.addr3 = city + " " + state + " " + zip;
        this.country = country;
    }

    generateAddressLineTwo() {
        // generate 1x3 PDF with Address Line Two
        this.doc = new PDFDocument({size: [216,72], margins : {top: 0, bottom: 0, left: 0, right: 0}});

        // stores under api/files/ with name: recipient name_tracking.pdf
        this.doc.pipe(fs.createWriteStream("api/files/"+ this.name + "_" + this.country + '.pdf'));

        this.doc
            .font('api/imb/font/PhantomSans0.8-Regular.ttf')
            .fontSize(13)
            .text(this.name, 10, 8)
            .text(this.addr1, 10, 20)
            .text(this.addr2, 10, 32)
            .text(this.addr3, 10, 44)
            .text(this.country, 10, 56);

        this.doc.end();
    }

    generateNoAddressLineTwo() {
        // generate 1x3 PDF without Address Line Two
        this.doc = new PDFDocument({size: [216,72], margins : {top: 0, bottom: 0, left: 0, right: 0}});

        // stores under api/files/ with name: recipient name_tracking.pdf
        this.doc.pipe(fs.createWriteStream("api/files/"+ this.name + "_" + this.country + '.pdf'));

        this.doc
            .font('api/imb/font/PhantomSans0.8-Regular.ttf')
            .fontSize(13)
            .text(this.name, 10, 8)
            .text(this.addr1, 10, 23)
            .text(this.addr3, 10, 38)
            .text(this.country, 10, 53);

        this.doc.end();
    }
}
