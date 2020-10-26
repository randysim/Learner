const Discord = require("discord.js");
const Fs = require("fs");

module.exports = {
    names: ["stats", "stat", "s"],
    execute(Env) {
        const message = Env.message;
        var Data = JSON.parse(Fs.readFileSync("./Convo/Stats.json"));
        var StatString = "";
        for (let [key, value] of Object.entries(Data.users)) {
            StatString += `<@${key}> - ${value}\n`;
        }

        const StatEmbed = new Discord.MessageEmbed()
            .setTitle("**DATASET CONTRIBUTIONS**")
            .setDescription(StatString);
        message.channel.send(StatEmbed);
    },
};
