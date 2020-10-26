const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    names: ["dataset", "data"],
    async execute(Env) {
        const message = Env.message;
        var Data = JSON.parse(Fs.readFileSync("./Convo/Stats.json"));
        var DataStr = `Greetings - ${Data.greeting}\nGoodbyes - ${Data.goodbye}\nInsults - ${Data.insult}\nCompliments - ${Data.compliment}`;
        var Embed = new Discord.MessageEmbed()
            .setTitle("**DATASET**")
            .setDescription(DataStr);
        message.channel.send(Embed);
    }
}