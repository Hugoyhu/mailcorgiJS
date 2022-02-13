const slack = require("./slack.js");

(async () => {
	// Start your app
	await slack.app.start(process.env.PORT || 3000);

	console.log('Bolt app is running!');
})();
