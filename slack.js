// Require the Bolt package (github.com/slackapi/bolt)
const { App, LogLevel} = require("@slack/bolt");
// Require webclient
const { WebClient } = require("@slack/web-api");

const supabase = require("./supabase.js");

const pdf = require("./pdf.js")

const app = new App({
		token: process.env.SLACK_BOT_TOKEN,
		signingSecret: process.env.SLACK_SIGNING_SECRET,
		socketMode: true,
		appToken: process.env.SLACK_APP_TOKEN,
		logLevel: LogLevel.DEBUG
});

console.log(app);

const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
	// LogLevel can be imported and used to make debugging simpler
	logLevel: LogLevel.DEBUG
});

app

app.command('/send', async ({ command, ack, respond }) => {
	// Acknowledge command request

	await ack();

	console.log(command);

	// check if uid is potentially valid
	let receiver = command.text.split("|")[0].split("<@")[1];

	if (receiver != undefined) {
		// use slack search function to see if uid is valid
		try {
	// Call the users.info method using the WebClient
			const result = await app.client.users.info({
				user: receiver
			});

			//console.log(result);
		}
		catch (error) {
			console.error(error);
		}
	} else {
		// if there is no message at all, respond add tag
		await respond('Enter recipient\'s slack tag')
	}

    // split the input to determine package code
	let packageInfo = command.text.split("|")[1].split("> ")[1];

	if (packageInfo == undefined) {
		// use slack search function to see if uid is valid
		await respond('Enter package code')
		return
	}

	console.log(command.text, receiver)

	userAddress = await supabase.queryAddress(receiver);
	pkgInfo = await supabase.queryPackage(packageInfo);

	const postResult = await app.client.chat.postMessage({
		channel: process.env.mail_channel,
		text: `
:rotating_light: MISSION ALERT :rotating_light:
Requested by <@${command.user_id}>
Stickers for <@${userAddress.uid}>
Here's what's in a ${pkgInfo.displayName}:
- 10 Assorted Stickers
And here's our address data:
\`\`\`
Name: ${userAddress.name}
Street (First Line): ${userAddress.addr1}
Street (Second Line): ${userAddress.addr2}
City: ${userAddress.city}
State/Province: ${userAddress.state}
Postal Code: ${userAddress.zip}
Country: ${userAddress.country}\`\`\`
		`
	});

	supabase.addOrder(postResult.ts, command.user_id, userAddress.uid, pkgInfo.name)
});

app.command('/update', async ({ command, ack, payload }) => {
	await ack();

	console.log(command);

	updateUID = command.user_id

	// if there is potentially a UID specified, see if person is a nodemaster
	if (command.text != undefined) {
		nodemasterStatus = await supabase.queryNodemaster(command.user_id);

		if (nodemasterStatus = true) {
			// if they are a nodemaster, see if the UID is there
			let receiver = command.text.split("|")[0].split("<@")[1];

			if (receiver != undefined) {
				// use slack search function to see if uid is valid
				try {
			// Call the users.info method using the WebClient
					const result = await app.client.users.info({
						user: receiver
					});

					//console.log(result);
				}
				catch (error) {
					console.error(error);
				}

				// if so, and no error from user search, the to-be-updated is actuall the uid specified behind tag

				updateUID = receiver;
			}

		}
	}

	// look up updateUID's address
	let userAddress = await supabase.queryAddress(updateUID);

	try {
		// Call the views.open method using the WebClient passed to listeners
		const result = await app.client.views.open({
			trigger_id: payload.trigger_id,
			view: {
					"type":
					"modal",
					"callback_id": "address-modal",
					"title": {
							"type": "plain_text",
							"text": "My App",
							"emoji": true
					},
					"submit": {
							"type": "plain_text",
							"text": "Submit",
							"emoji": true
					},
					"close": {
							"type": "plain_text",
							"text": "Cancel",
							"emoji": true
					},
					"blocks": [
							{
									"type": "section",
									"text": {
											"type":
											"mrkdwn",
											"text":
											"Hello! PLease use this form to update the Address you have with Hack Club and MailCorgi."
									}
							},
							{
									"type": "section",
									"text": {
											"type":
											"mrkdwn",
											"text":
											updateUID
									}
							},
							{
									"type": "divider"
							},
							{
									"type": "input",
									"block_id": "name",
									"element": {
											"type": "plain_text_input",
											"action_id": "plain_text_input-action",
											"initial_value": userAddress.name
									},
									"label": {
											"type": "plain_text",
											"text": "Name",
											"emoji": true
									}
							},
							{
									"type": "input",
									"block_id": "addr1",
									"element": {
											"type": "plain_text_input",
											"initial_value": userAddress.addr1,
											"action_id": "plain_text_input-action"
									},
									"label": {
											"type": "plain_text",
											"text": "Address Line 1",
											"emoji": true
									}
							},
							{
									"type": "input",
									"block_id": "addr2",
									"optional": true,
									"element": {
											"type": "plain_text_input",
											"initial_value": userAddress.addr2,
											"action_id": "plain_text_input-action"
									},
									"label": {
											"type": "plain_text",
											"text": "Address Line 2",
											"emoji": true
									}
							},
							{
									"type": "input",
									"block_id": "city",
									"element": {
											"type": "plain_text_input",
											"initial_value": userAddress.city,
											"action_id": "plain_text_input-action"
									},
									"label": {
											"type": "plain_text",
											"text": "City",
											"emoji": true
									}
							},
							{
									"type": "input",
									"block_id": "state",
									"element": {
											"type": "plain_text_input",
											"initial_value": userAddress.state,
											"action_id": "plain_text_input-action"
									},
									"label": {
											"type": "plain_text",
											"text": "State/Province",
											"emoji": true
									}
							},
							{
									"type": "input",
									"block_id": "zip",
									"element": {
											"type": "plain_text_input",
											"initial_value": userAddress.zip,
											"action_id": "plain_text_input-action"
									},
									"label": {
											"type": "plain_text",
											"text": "Zip/Pincode",
											"emoji": true
									}
							},
							{
									"type": "input",
									"block_id": "country",
									"element": {
											"type": "plain_text_input",
											"initial_value": userAddress.country,
											"action_id": "plain_text_input-action"
									},
									"label": {
											"type": "plain_text",
											"text": "Country",
											"emoji": true
									}
							},
					]
			}
		});

		console.log(result);
	}
	catch (error) {
		console.error(error);
	}

});

app.view("address-modal", async ({ ack, payload }) => {
	ack()
	const addressSet = payload.state.values;
	const uid = payload.blocks[1].text.text;
	console.log(addressSet, uid, ack);

	let name = addressSet.name['plain_text_input-action'].value;
	let addr1 = addressSet.addr1['plain_text_input-action'].value;
	let addr2 = addressSet.addr2['plain_text_input-action'].value;
	let city = addressSet.city['plain_text_input-action'].value;
	let state = addressSet.state['plain_text_input-action'].value;
	let zip = addressSet.zip['plain_text_input-action'].value;
	let country = addressSet.country['plain_text_input-action'].value;

	if (addr2 == null) {
		addr2 = "";
	}


	// update address by UID

	await supabase.updateAddress(uid, name, addr1, addr2, city, state, zip, country);

	// create array of thread ts values

	let tsList = await supabase.queryOrdersByUID(uid);

    if (tsList == undefined) {
        return
    }

	console.log(tsList);

	for (let msg = 0; msg<tsList.length; msg++) {
		const postResult = await app.client.chat.postMessage({
				channel: process.env.mail_channel,
				thread_ts: tsList[msg],
				text: `
Hey there! The address for this order has just been updated. Here's what we got:
\`\`\`
Name: ${name}
Address Line 1: ${addr1}
Address Line 2: ${addr2}
City: ${city}
State: ${state}
Zip Code: ${zip}
Country: ${country}
\`\`\`
			`
		});
	}
});

app.event('app_mention', async ({ event, context, client }) => {
	// check if the mention was in the mail channel
	if (event.channel != process.env.mail_channel) {
		await say("bjork bjork bjork bjork")
		return
	}

	thread_ts = event.thread_ts

	// check if it was in thread
	if (thread_ts == undefined) {
		// return with error message
		await say("reply under a mission, you silly goose!")
		return
	}

	let reqCmd = event.text.split(" ")[1]

	if (reqCmd == undefined) {
		const postResult = await app.client.chat.postMessage({
				channel: process.env.mail_channel,
				thread_ts: thread_ts,
				text: "bjork!"
		})
	}

	switch (reqCmd) {
		case "accept": {
			// send message to receiver
		}
		case "purchase": {

			// sort by envelope

			// is the package an envelope

			let senderAddress = supabase.queryAddress(event.user);
			let receiverAddress = supabase.queryUIDbyTS(thread_ts);

			let order = await supabase.queryOrderInfoByUID(receiverAddress.uid);


			let pkgInfo = await supabase.queryPackage(order.packageName);

			console.log(order);

			console.log(pkgInfo);

			if (pkgInfo.isEnvelope == true) {
				// generate + upload a PDF of the envelope's label

				pdf.createPDF(senderAddress.name, senderAddress.addr1, senderAddress.addr2, senderAddress.city, senderAddress.state, senderAddress.zip, senderAddress.country,
							  receiverAddress.name, receiverAddress.addr1, receiverAddress.addr2, receiverAddress.city, receiverAddress.state, receiverAddress.zip, receiverAddress.country, receiverAddress.name);

				fileFull = "C:\\Users\\Hugoy\\Workspace\\mailcorgiJS\\" + receiverAddress.name + ".pdf"
				console.log(fileFull)

				const result = await app.client.files.upload({
					// channels can be a list of one to many strings
					channels: process.env.mail_channel,
					initial_comment: "Envelope PDF",
					file: fs.createReadStream(fileFull),
					thread_ts: thread_ts
				});
			}
		}
		case "request": {
			// send message to receiver
		}

	}


});

exports.app = app;