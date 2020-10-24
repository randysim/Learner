const Discord = require("discord.js");
const MI = require("../Training/Interface.js");

module.exports = {
    names: ["flush", "f"],
    execute(Env) {
        const message = Env.message;

        if (message.author.id != "325447731676184576") {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**Insufficient Permission**")
                .setDescription("No");
            return message.channel.send(ErrorEmbed);
        }

        MI.flush();
        const Embed = new Discord.MessageEmbed()
            .setTitle("**SUCCESS**")
            .setDescription("Memory wiped, data saved");
        message.channel.send(Embed);
    },
};
