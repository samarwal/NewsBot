
const { ActivityTypes, ActivityHandler } = require('botbuilder');
const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const NewsSearchAPIClient = require('azure-cognitiveservices-newssearch');

let credentials = new CognitiveServicesCredentials('41ee2cba1aca46f5aab8e8b74165d556');
let client = new NewsSearchAPIClient(credentials);

// Non-exhaustie list of valid en-CA categories
const availableCategories = ['Business', 'Canada', 'Entertainment', 'LifeStyle', 'Politics', 'ScienceAndTechnology', 'Sports', 'World'];


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

      async getNews() {
        const replies = ['Here are some of the latest headlines!'];
        let articles = [];
        const count = this.categories.length > 2 ? 2 : 5;
    
        try {
          for (const category of this.categories) {
            await client.newsOperations
              .category({
                market: 'en-CA',
                category,
                count,
              })
              .then(newsItems => articles = [...articles, ...newsItems.value])
              .catch(console.error);
          }
          return articles.reduce((acc, cur) => {
            const reply = { type: ActivityTypes.Message };
            reply.attachments = this.getInternetAttachment(cur.image.thumbnail.contentUrl) ? [this.getInternetAttachment(cur.image.thumbnail.contentUrl)] : [];
            reply.text = `From ${ cur.provider[0].name }\n\n${ cur.description }\n\n${ cur.url }`;
            return [...acc, reply];
          }, replies);
        } catch (err) {
          console.error(err);
          return "Oh no! An error occured!"
        }
    }
    
    getInternetAttachment(url) {
      if (!/.*\/(\w*).(\w*)$/i.test(url)) {
        return;
      }
    
      const [, name, extension] = /.*\/(\w*).(\w*)$/i.exec(url);
    
      if (!['jpg', 'png'].includes(extension)) {
    
      } else if (extension === 'jpg' || extension === 'jpeg') {
        return {
          name: `${ name }.${ extension }`,
          contentType: 'image/jpg',
          contentUrl: url
        };
      } else if (extension === 'png') {
        return {
          name: `${ name }.${ extension }`,
          contentType: 'image/png',
          contentUrl: url
        };
      }
    }
    
    async onTurn(turnContext) {
        const text = turnContext.activity.text;
        // Get News
        if (/^get news.*/i.test(text)) {
          // Retrieve the news
          const messages = await this.getNews();
      
          for (const message of messages) {
            await turnContext.sendActivity(message);
          }
        } else if (/^add(.*)/i.test(text)) {
          // Add a category
          const [, category] = /^add (.*)/i.exec(text);
      
          await turnContext.sendActivity(this.addCategory(category));
        } else if (/^remove.*/i.test(text)) {
          // Remove a category
          const [, category] = /^remove (.*)/i.exec(text);
      
          await turnContext.sendActivity(this.removeCategory(category));
        } else if (/^clear categories$/i.test(text)) {
          // Clear all categories
          await turnContext.sendActivity(this.clearCategories());
        } else if (/^help$/i.test(text)) {
          // Help text
          await turnContext.sendActivity('You can ask me for the news with `get news`\n\nAdd and remove categories with `add [category]` and remove [category]`\n\nClear categories with `clear categories`');
        } else {
          // Do nothing
        }
      }
      
}

module.exports.MyBot = MyBot;
