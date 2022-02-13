const { jsPDF } = require("jspdf");

exports.createPDF = function (
    sName, sAddr1, sAddr2, sCity, sState, sZip, sCountry,
    rName, rAddr1, rAddr2, rCity, rState, rZip, rCountry,
    fileName) {

	const doc = new jsPDF({
		orientation: "landscape",
		unit: "in",
		format: [6, 4]
	  });

	doc.setFontSize(10)
	senderX = 0.25
	senderY = 0.3
	ySenderInt = 0.16
	doc.text(sName, senderX, senderY);
	doc.text(sAddr1, senderX, senderY + 1*ySenderInt);
	doc.text(sAddr2, senderX, senderY + 2*ySenderInt);
	doc.text(sCity + ', ' + sState + ', ' + sZip, senderX, senderY + 3*ySenderInt);
	doc.text(sCountry, senderX, senderY + 4*ySenderInt);

	receiverX = 2
	receiverY = 1.5
	yReceiverInt = 0.2

	doc.setFontSize(12)
	doc.text(rName, receiverX, receiverY);
	doc.text(rAddr1, receiverX, receiverY + 1*yReceiverInt);
	doc.text(rAddr2, receiverX, receiverY + 2*yReceiverInt);
	doc.text(rCity + ', ' + rState + ', ' + rZip, receiverX, receiverY + 3*yReceiverInt);
	doc.text(rCountry, receiverX, receiverY + 4*yReceiverInt);

	doc.save(fileName + ".pdf");
}
