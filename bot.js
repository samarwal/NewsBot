// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

class MyBot extends ActivityHandler {
    constructor() {
        super();
    }
    
    async onTurn(turnContext){
        const text = turnContext.activity.text;
        // Get News
        if (/^get news.*/i.test(text)) {
            // Retrieve the news
            await turnContext.sendActivity("I'll get the news for you");
        } else if (/^add.*/i.test(text)) {
            // Add a category
            await turnContext.sendActivity("Thanks I've added that to your list of approved categories");
        } else if (/^remove.*/i.test(text)) {
            // Remove a category
            await turnContext.sendActivity("Thanks I've removed that from your list of approved categories");
        } else if (/^clear categories/i.test(text)) {
            // Clear all categories
            await turnContext.sendActivity("I've cleared all the categories for you");
        } else {
            // Do nothing
        }
    }
}

module.exports.MyBot = MyBot;
