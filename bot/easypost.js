const Easypost = require('@easypost/api');
const api = new Easypost(process.env.easypost_api_key);


exports.easypost = class {
    constructor(senderAddress, receiverAddress, packageInfo, app, thread_ts) {
        /*
        this.sname = senderAddress.name;
        this.saddr1 = senderAddress.addr1;
        this.saddr2 = senderAddress.addr2;
        this.scity = senderAddress.city;
        this.sstate = senderAddress.state;
        this.szip = senderAddress.zip;
        this.scountry = senderAddress.country;
        this.rname = receiverAddress.name;
        this.raddr1 = receiverAddress.addr1;
        this.raddr2 = receiverAddress.addr2;
        this.rcity = receiverAddress.city;
        this.rstate = receiverAddress.state;
        this.rzip = receiverAddress.zip;
        this.rcountry = receiverAddress.country;
        this.length = packageInfo.length;
        this.width = packageInfo.width;
        this.height = packageInfo.height;
        this.ounces = packageInfo.weight;
        */

        const fromAddress = new api.Address({
            name: senderAddress.name,
            company: 'Hack Club',
            street1: senderAddress.addr1,
            street2: senderAddress.addr2,
            city: senderAddress.city,
            state: senderAddress.state,
            zip: senderAddress.zip
          });

        fromAddress.save().then(console.log);

        const toAddress = new api.Address({
            name: receiverAddress.name,
            street1: receiverAddress.addr1,
            street2: receiverAddress.addr2,
            city: receiverAddress.city,
            state: receiverAddress.state,
            zip: receiverAddress.zip
        });

        toAddress.save().then(console.log);

        const parcel = new api.Parcel({
            length: packageInfo.length,
            width: packageInfo.width,
            height: packageInfo.height,
            weight: packageInfo.weight,
          });

        parcel.save().then(console.log);

        const shipment = new api.Shipment({
            to_address: toAddress,
            from_address: fromAddress,
            parcel: parcel
        });

        shipment.save().then(s =>
            s.buy(shipment.lowestRate())
                .then(function (transaction) {
                    console.log(transaction.postage_label.label_url);
                    app.client.chat.postMessage({
                        channel: process.env.mail_channel,
                        thread_ts: thread_ts,
                        text: transaction.postage_label.label_url
                    });
                })
        );

    }
};

//client = new easypost(senderAddress, receiverAddress, packageInfo)

