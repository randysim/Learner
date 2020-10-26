const Fs = require("fs");
const Discord = require('discord.js');
var Sessions = {};
var model = undefined;

module.exports = {
    add: function (id, type) {
        Sessions[id] = {
            mode: "pattern",
            type: type,
            messages: [],
            lastmessage: new Date().getTime(),
        };
    },
    addResponse: function (id, type, dataset) {
        Sessions[id] = {
            mode: "response",
            type: type,
            messages: [],
            lastmessage: new Date().getTime(),
            dataset: dataset,
        }
    },
    remove: function (id) {
        delete Sessions[id];
    },
    receive: function (message) {
        if (!Sessions[message.author.id]) return;
        if (message.content.toLowerCase().startsWith("endsess")) {
            this.save(message.author.id);
            this.remove(message.author.id);
            message.channel.send("Your session has ended. Thank you for helping me learn!")
            return;
        }

        Sessions[message.author.id].messages.push(message.content.toLowerCase());
        message.react("✅");

        if (Sessions[message.author.id].mode == "response") {
            let Dataset = Sessions[message.author.id].dataset;
            const Embed = new Discord.MessageEmbed()
                .setTitle("**TRAIN**")
                .setDescription(`**Respond to:**\n${Dataset.patterns[Math.floor(Math.random() * Dataset.patterns.length)]}`);
            message.channel.send(Embed);
        }
    },
    save: function (id) {
        var SessData = Sessions[id];
        if (!SessData.messages.length) return;

        var Dataset = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"));
        var Stats = JSON.parse(Fs.readFileSync("./Convo/Stats.json"));

        SessData.messages.forEach(msg => {
            if (Dataset[SessData.type][SessData.mode + "s"].find(c => c == msg)) return;
            Stats[SessData.type]++;
            Dataset[SessData.type][SessData.mode + "s"].push(msg);

            if (!Stats.users[id]) {
                Stats.users[id] = 1;
            } else {
                Stats.users[id]++;
            }
        });

        Fs.writeFileSync("./Convo/Dataset.json", JSON.stringify(Dataset));
        Fs.writeFileSync("./Convo/Stats.json", JSON.stringify(Stats));
    },
    addModel(trainedModel) {
        model = trainedModel;
    },
    getModel() {
        return model;
    }
}