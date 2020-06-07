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
        } else if (/^add.*/i.test(text)) {
            // Add a category
        } else if (/^remove.*/i.test(text)) {
            // Remove a category
        } else if (/^clear categories/i.test(text)) {
            // Clear all categories
        } else {
            // Do nothing
        }
    }
}

module.exports.MyBot = MyBot;
