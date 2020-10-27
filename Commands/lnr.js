const Discord = require("discord.js");
const Fs = require("fs");
const Session = require("../Training/Session.js");
const use = require("@tensorflow-models/universal-sentence-encoder");
const tf = require("@tensorflow/tfjs-node");
const JW = require("../Training/JaroWinkler.js");
var lastcommand = 0;

module.exports = {
    names: ["lnr", "learner"],
    async execute(Env) {
        const message = Env.message;
        const args = Env.args;
        var model = Session.getModel();
        if (!model) {
            model = await tf.loadLayersModel("file:///Users/phone/OneDrive/Desktop/TextAI/model.json");
            Session.addModel(model);
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

        var Dataset = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"));
        var input = [undefined, 0];

        Dataset[predicted.toLowerCase()].patterns.forEach(msg => {
            var weight = JW(phrase, msg);
            if (weight > input[1]) {
                input[0] = msg;
                input[1] = weight;
            }
        });

        var possibleResponses = [];
        if (input[1] > 0.5) {
            Dataset[predicted.toLowerCase()].responses.forEach(res => {
                if (res.question == input[0]) {
                    possibleResponses.push(res.message);
                }
            });
        }
        if (possibleResponses.length == 0) {
            Dataset[predicted.toLowerCase()].responses.forEach(res => {
                if (res.question == "DEFAULT") {
                    possibleResponses.push(res.message);
                }
            })
        }

        message.channel.send(possibleResponses[Math.floor(Math.random() * possibleResponses.length)])

        var Meta = JSON.parse(Fs.readFileSync("./Training/Meta.json"));
        if (Meta.selflearning && highest[1] > 0.6) {
            if (Dataset[predicted.toLowerCase()].patterns.includes(phrase)) return;
            Dataset[predicted.toLowerCase()].patterns.push(phrase);
            Fs.writeFileSync("./Convo/Dataset.json", JSON.stringify(Dataset));
        }
    }
}