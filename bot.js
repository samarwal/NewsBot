
const { ActivityTypes, ActivityHandler } = require('botbuilder');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const NewsSearchAPIClient = require('azure-cognitiveservices-newssearch');

let credentials = new CognitiveServicesCredentials('63d3cc2339944d6ba9150f53e4415870');
let client = new NewsSearchAPIClient(credentials);

// Non-exhaustie list of valid en-gb categories
const availableCategories = ['Business', 'Entertainment', 'Health', 'Politics', 'ScienceAndTechnology', 'Sports', 'UK', 'World'];


class MyBot extends ActivityHandler {
    constructor() {
        super();
        this.categories = [];
    }

    addCategory(category) {
        if (availableCategories.includes(category) && !this.categories.includes(category)) {
          this.categories = [...this.categories, category];
          return "I've added that category for you.";
        } else if (this.categories.includes(category)) {
          return "You're already using that category.";
        } else {
          return availableCategories.reduce((acc, cur) => {
            return acc + '`' + cur + '`\n\n';
          }, "I don't recognise that category, the availables options are:\n\n");
        }
      }
    
      removeCategory(category) {
        if (this.categories.includes(category)) {
          this.categories = this.categories.filter(c => c !== category);
          return "I've removed that category for you.";
        } else {
          return "That category isn't in your categories.";
        }
      }
    
      clearCategories() {
        this.categories = [];
        return "I've cleared the categories for you.";
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
