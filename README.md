MailCorgi is a NodeJS slackbot using Slack socket mode and Flask. 

A few features:

- Address, package, and order storage on supabase
- Slack UID verification
- Easypost label purchasing for domestic shipments: USPS ComPriceBase
- 4x6 Thermal Label PDF with Address and delivery conf. QR code
- Fully based on slack
- Flask + Python application for QR code scan site
- Supports a multitude of custom-defined packages

MailCorgi's slack bot and website are both hosted on heroku. You will need individual dynos.

The slackbot dyno will need the following in the Procfile (and configured to worker under Resources):

worker: node index.js

The QR dyno will need the following in the Procfile (and configured to web under Resources):

web: gunicorn wsgi:app

You will also need to have env variables configured for API keys. 

For local deployment: 

VSCode is preferred, and env variables can be set in launch.json.
