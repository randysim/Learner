const Discord = require("discord.js");
const Fs = require("fs");
const Session = require("../Training/Session.js");
const use = require("@tensorflow-models/universal-sentence-encoder");
var lastcommand = 0;

module.exports = {
    names: ["lnr", "learner"],
    async execute(Env) {
        const message = Env.message;

        const args = Env.args;
        var model = Session.getModel();
        if (!model) {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERROR**")
                .setDescription("No model available for testing. Please ask someone to train it");
            return message.channel.send(ErrorEmbed);
        }

        var phrase = args.slice(1).join(" ");
        if (!phrase) {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERROR**")
                .setDescription("Please specify a phrase to test");
            return message.channel.send(ErrorEmbed);
        }

        if (new Date().getTime() - lastcommand < 1000) {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERROR**")
                .setDescription("Please wait a bit before consecutive requests.");
            return message.channel.send(ErrorEmbed);
        }
        lastcommand = new Date().getTime();

        const sentenceEncoder = await use.load();
        var Data = [{ message: phrase }];
        var Sentences = Data.map(t => t.message.toLowerCase());
        const xPredict = await sentenceEncoder.embed(Sentences);
        var prediction = await model.predict(xPredict).data();
        var highest = [0, 0];
        for (let i = 0; i < prediction.length; ++i) {
            if (highest[1] < prediction[i]) {
                highest[0] = i;
                highest[1] = prediction[i];
            }
        }
        var predicted = "";
        switch (highest[0]) {
            case 0:
                predicted = "Greeting";
                break;
            case 1:
                predicted = "Goodbye";
                break;
            case 2:
                predicted = "Insult";
                break;
            case 3:
                predicted = "Compliment";
                break;
        }
        var Str = `**PREDICTED - ${predicted}**\n${phrase}\nGreeting - ${prediction[0]}\nGoodbye - ${prediction[1]}\nInsult - ${prediction[2]}\nCompliment - ${prediction[3]}`;

        let Embed = new Discord.MessageEmbed()
            .setTitle("**AI Predictions**")
            .setDescription(Str);
        message.channel.send(Embed);

        var Meta = JSON.parse(Fs.readFileSync("./Training/Meta.json"));
        if (Meta.selflearning && highest[1] > 0.6) {
            var Dataset = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"));
            if (Dataset[predicted.toLowerCase()].patterns.includes(phrase)) return;
            Dataset[predicted.toLowerCase()].patterns.push(phrase);
            Fs.writeFileSync("./Convo/Dataset.json", JSON.stringify(Dataset));
        }
    }
}