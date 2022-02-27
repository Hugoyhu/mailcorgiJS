const PDFDocument = require('pdfkit');
const fs = require('fs');
const QRCode = require("qrcode")

exports.createPDF = async function (senderAddress, receiverAddress, order, fileName, app, thread_ts) {


    let doc = new PDFDocument(
        {
            size: [152, 101],
            margins: {
                top: 3,
                bottom:3,
                left: 3,
                right: 3
            }
        }
    );

	stream = fs.createWriteStream(fileName);

	// subscribe to close

	stream.on('close', () => {
		app.client.files.upload({
			// channels can be a list of one to many strings
			channels: process.env.mail_channel,
			initial_comment: "Envelope PDF",
			file: fs.createReadStream(fileName),
			thread_ts: thread_ts
		});

	});

	console.log(fileName);
    doc.pipe(stream);

    doc.fontSize(4);
	senderX = 3;
	senderY = 3;
	ySenderInt = 5;
	doc.text(senderAddress.name, senderX, senderY);
	doc.text(senderAddress.addr1, senderX, senderY + 1*ySenderInt);
	doc.text(senderAddress.addr2, senderX, senderY + 2*ySenderInt);
	doc.text(senderAddress.city + ', ' + senderAddress.state + ', ' + senderAddress.zip, senderX, senderY + 3*ySenderInt);
	doc.text(senderAddress.country, senderX, senderY + 4*ySenderInt);

    doc.fontSize(6);
	receiverX = 30;
	receiverY = 35;
	yReceiverInt = 7;

	doc.text(receiverAddress.name, receiverX, receiverY);
	doc.text(receiverAddress.addr1, receiverX, receiverY + 1*yReceiverInt);
	doc.text(receiverAddress.addr2, receiverX, receiverY + 2*yReceiverInt);
	doc.text(receiverAddress.city + ', ' + receiverAddress.state + ', ' + receiverAddress.zip, receiverX, receiverY + 3*yReceiverInt);
	doc.text(receiverAddress.country, receiverX, receiverY + 4*yReceiverInt);

	//await qr.makeQR("wikipedia.org" + orderCode, fileName)

	/*
	QRCode.toDataURL('apple.com')
		.then(url => {
			console.log(url)
			doc.image(url, 0, 86, {width: 15})
		})
		.catch(err => {
			console.error(err)
		})
		*/


	results = await QRCode.toDataURL("scanSite" + order.orderCode);
	console.log(results);

	doc.image(results, 0, 86, {width: 15});


	doc.text("<---- Scan this with your phone camera", 20, 90);

	doc.end();


	console.log("pdf side done");

}
