const keyResponses = [
    { keys: ["THANK YOU", "THANKS"], response: "You're welcome! Is there anything else you need?" },
    { keys: ["BYE", "GOODBYE", "SEE YOU"], response: "Goodbye! Take care!" },
    { keys: ["HELP", "ASSISTANCE", "SUPPORT"], response: "Of course! What do you need help with?" },
    { keys: ["SORRY", "APOLOGIES"], response: "No worries! Everyone makes mistakes. What's on your mind?" },
    { keys: ["DO YOU THINK", "OPINION"], response: "Yes! I completely agree!." },
    { keys: ["HI", "HEY", "HELLO"], response: "Hey! How are you feeling?" } 
];

const patternResponses = [
    { patterns: /I AM (.*)/i, response: "Why are you feeling {0}?" },
    { patterns: /I DON'T LIKE (.*)/i, response: "What bothers you most about {0}?" },
];

const wordReflections = {
    "I" : "you"
};

function submitMessage() {
    var userMessage = document.getElementById("user-input").value;
    if (!userMessage) return;

    var conversation = document.getElementById("conversation");
    conversation.innerHTML += `<div class="user-message">${userMessage}</div>`;

    var botResponse = generateResponse(userMessage);

    conversation.innerHTML += `<div class="bot-response">${botResponse}</div>`;

    document.getElementById("user-input").value = "";
}

function generateResponse(userMessage) {
    var defaultResponse = "Nevermind that, who got Caesar?";

    for (var i = 0; i < keyResponses.length; i++) {
        const selectedKeyResponse = keyResponses[i];    
        if (containsAnyKeys(userMessage, keyResponses[i].keys)) {
            return selectedKeyResponse.response;
        }
    }

    for (var i = 0; i < patternResponses.length; i++) {
        const selectedPatternResponse = patternResponses[i];
        const contextualResponseWord = containsAnyPatterns(userMessage, patternResponses[i].patterns);
        if (contextualResponseWord) {

            contextualResponse = selectedPatternResponse.response.replace("{0}", contextualResponseWord);
            return contextualResponse;
        }
    }

    if (userMessage.includes("I")) {
        return reflectWords("Interesting, " + userMessage + "? Tell me more.");
    }

    return defaultResponse;

 };



function containsAnyKeys(userMessage, keys) {
    if (!keys || keys.length === 0) return false;

    const message = userMessage.toUpperCase();
    return keys.some(key => message.includes(key));
}

function containsAnyPatterns(userMessage, patterns) {
    const message = userMessage.toUpperCase();  

    //check if the pattern matches
    const matches = message.match(patterns);
    
    //captured word
    if (matches) {
        return matches[1]; 
    }
    
    return null;
}

function reflectWords(userMessage) {
    const words = userMessage.split(" ");
    const reflectedWords = words.map(word => wordReflections[word] || word);
    return reflectedWords.join(" ");
}

