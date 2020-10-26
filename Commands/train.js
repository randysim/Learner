const Discord = require("discord.js");
const Session = require("../Training/Session.js");

module.exports = {
    names: ["train", "teach"],
    async execute(Env) {
        const message = Env.message;
        const args = Env.args;

        if (message.channel.name.toLowerCase() != "training") {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERROR**")
                .setDescription("You may only use this command in the training channel");
            return message.channel.send(ErrorEmbed);
        }

        if (!args[1]) {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERROR**")
                .setDescription("Specify the type of message\n(greeting, goodbye, insult, compliment)")
            return message.channel.send(ErrorEmbed);
        }

        if (!["greeting", "goodbye", "insult", "compliment"].includes(args[1])) {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERRORR**")
                .setDescription("Not a valid category. Valid categories are\n(greeting, goodbye, insult, compliment)")
            return message.channel.send(ErrorEmbed);
        }

        let TrainEmbed = new Discord.MessageEmbed()
            .setTitle("**TRAIN**")
            .setDescription("Type endsess to stop training. As of now, type messages that pertain to " + args[1]);
        message.channel.send(TrainEmbed);
        Session.add(message.author.id, args[1]);
    }
}