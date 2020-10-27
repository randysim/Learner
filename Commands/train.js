const Discord = require("discord.js");
const Session = require("../Training/Session.js");
const Fs = require("fs");

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
                .setTitle("**ERROR**")
                .setDescription("Not a valid category. Valid categories are\n(greeting, goodbye, insult, compliment)")
            return message.channel.send(ErrorEmbed);
        }

        let TrainEmbed;
        var Meta = JSON.parse(Fs.readFileSync("./Training/Meta.json"));

        if (Meta.blacklisted.includes(message.author.id)) {
            const ErrorEmbed = new Discord.MessageEmbed()
                .setTitle("**ERRORR**")
                .setDescription("You are blacklisted.")
            return message.channel.send(ErrorEmbed);
        }

        if (Meta.type == "pattern") {
            TrainEmbed = new Discord.MessageEmbed()
                .setTitle("**TRAIN**")
                .setDescription("Type endsess to stop training. As of now, type messages that pertain to " + args[1]);
            Session.add(message.author.id, args[1]);
        } else {
            var Dataset = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"))[args[1]];
            var Response = Dataset.patterns[Math.floor(Math.random() * Dataset.patterns.length)];
            TrainEmbed = new Discord.MessageEmbed()
                .setTitle("**TRAIN**")
                .setDescription(`**Respond to:**\n${Response}`)
            Session.addResponse(message.author.id, args[1], Dataset, Response);
        }

        message.channel.send(TrainEmbed);

    }
}