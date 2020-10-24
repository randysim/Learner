const Fs = require("fs");
var Memory = [];
var training = false;

module.exports = {
    receive(message) {
        if (!training) return;
        if (!message.content || message.content == " ") return;
        Memory.push(message.content);
        if (Memory.length >= 100) {
            this.flush();
        }
    },
    flush() {
        var Saved = JSON.parse(Fs.readFileSync("./Convo/Dataset.json"));
        Fs.writeFileSync(
            "./Convo/Dataset.json",
            JSON.stringify(Saved.concat(Memory))
        );
        Memory = [];
    },
    toggle() {
        Memory = [];
        training = !training;
        return training;
    },
    memory() {
        return Memory;
    },
};
