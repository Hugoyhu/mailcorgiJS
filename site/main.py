import os, time

from flask import Flask

import supabase_py as sb


app = Flask(__name__)

url = os.environ.get("supabase_url")
key = os.environ.get("supabase_key")
supabase = sb.create_client(url, key)

import logging
import os
# Import WebClient from Python SDK (github.com/slackapi/python-slack-sdk)
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

# WebClient instantiates a client that can call API methods
# When using Bolt, you can use either `app.client` or the `client` passed to listeners.
client = WebClient(token=os.environ.get("slack_bot_token"))
logger = logging.getLogger(__name__)

@app.route('/scan/<code>')
def scan(code):
    # code is the order's code

    data = supabase.table("orders").select("*").execute()
    # Assert we pulled real data.
    assert len(data.get("data", [])) > 0

    order = None

    for i in data['data']:
        if code == i['orderCode']:
            order = i

    if order == None:
        return "Not a valid code"

    try:
    # Call the chat.postMessage method using the WebClient
        result = client.chat_postMessage(
            channel=os.environ.get("mail_channel"), 
            text="<@" + order['toUID'] + "> just received their package!"
        )
        
        logger.info(result)
        
    except SlackApiError as e:
        logger.error(f"Error posting message: {e}")

    return "Thank you for scanning! Enjoy!"

if __name__ == '__main__':
   app.run(host="0.0.0.0", port=8080)
