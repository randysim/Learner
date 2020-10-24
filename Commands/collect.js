const Discord = require("discord.js");
const MI = require("../Training/Interface.js");

module.exports = {
    names: ["collect", "c"],
    async execute(Env) {
        const message = Env.message;
        if (message.author.id != "325447731676184576") {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**Insufficient Permission**")
                .setDescription("No");
            return message.channel.send(ErrorEmbed);
        }

        if (MI.toggle()) {
            const Embed = new Discord.MessageEmbed().setDescription(
                "AI will now start collecting data."
            );
            message.channel.send(Embed);
        } else {
            const Embed = new Discord.MessageEmbed().setDescription(
                "AI is no longer collecting data"
            );
            message.channel.send(Embed);
        }
    },
};
