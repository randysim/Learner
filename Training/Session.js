const Fs = require("fs");
var Sessions = {};

module.exports = {
    add: function (id, type) {
        Sessions[id] = {
            type: type,
            messages: [],
            lastmessage: new Date().getTime(),
        };
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
    },
    save: function (id) {
        var SessData = Sessions[id];
        if (!SessData.messages.length) return;

        var Dataset = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"));
        var Stats = JSON.parse(Fs.readFileSync("./Convo/Stats.json"));

        SessData.messages.forEach(msg => {
            if (Dataset[SessData.type].patterns.find(c => c == msg)) return;
            Stats[SessData.type]++;
            Dataset[SessData.type].patterns.push(msg);

            if (!Stats.users[id]) {
                Stats.users[id] = 1;
            } else {
                Stats.users[id]++;
            }
        });

        Fs.writeFileSync("./Convo/Dataset.json", JSON.stringify(Dataset));
        Fs.writeFileSync("./Convo/Stats.json", JSON.stringify(Stats));
    }
}