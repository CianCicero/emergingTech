const keyResponses = [
    { keys: ["THANK YOU", "THANKS"], response: "You're welcome! Is there anything else you need?" },
    { keys: ["GOOD", "HAPPY", "WELL"], response: "I'm glad to hear that! What's new with you?" },
    { keys: ["BYE", "GOODBYE", "SEE YOU"], response: "Goodbye! Take care!" },
    { keys: ["HELP", "ASSISTANCE", "SUPPORT"], response: "Of course! What do you need help with?" },
    { keys: ["SORRY", "APOLOGIES"], response: "No worries! Everyone makes mistakes. What's on your mind?" },
    { keys: ["DO YOU THINK", "OPINION", "AGREE"], response: "I'm inclined to agree with you, but I'd have to look into it more" },
    { keys: ["HI", "HEY", "HELLO"], response: "Hey! How are you feeling?" },
    { keys: ["ANGRY", "SAD", "UPSET"], response: "I'm sorry you're feeling that way. Things will get better soon." },
    { keys: ["STOP", "YOU ARE WRONG", "SHUT UP"], response: "I hope I haven't upset you. Perhaps we should discuss something else?" }
];

const patternResponses = [
    { patterns: /I AM (.*)/i, response: "Why are you {0}?" },
    { patterns: /I DON'T LIKE (.*)/i, response: "What bothers you most about {0}?" },
    { patterns: /I FEEL (.*)/i, response: "Why do you feel {0}?" },
    { patterns: /I HATE (.*)/i, response: "What makes you feel so strongly about {0}?" },
    { patterns: /I LOVE (.*)/i, response: "What do you love about {0}?" },

];

const wordReflections = {
    "I" : "you",
    "me" : "you",
    "my" : "your",
    "mine" : "yours",
    "you" : "I",
    "your" : "my",
    "yours" : "mine",
    "am" : "are",
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
    var defaultResponse = "Can you expand on that?";

    userMessage = userMessage.toUpperCase();

    for (var i = 0; i < patternResponses.length; i++) {
        const selectedPatternResponse = patternResponses[i];
        const contextualResponseWord = containsAnyPatterns(userMessage, patternResponses[i].patterns);
        if (contextualResponseWord) {

            contextualResponse = selectedPatternResponse.response.replace("{0}", reflectWords(contextualResponseWord));
            return contextualResponse;
        }
    } 
  
    for (var i = 0; i < keyResponses.length; i++) {
        const selectedKeyResponse = keyResponses[i];    
        if (containsAnyKeys(userMessage, keyResponses[i].keys)) {
            return selectedKeyResponse.response;
        }
    }


    //if the user mentions ELIZA and themselves, return the inverse.
    if (userMessage.split(" ").includes("I" && "ELIZA")) {
        userMessage = userMessage.replace("ELIZA", "you");
        userMessage = userMessage.replace("I", "ELIZA");
        return userMessage;
    }

    //if the user mentions themselves, reflect the message and ask for more information
    if (userMessage.split(" ").includes("I", "ME", "MY", "MINE", "AM", "YOUR", "YOU", "YOURS")) {
        return "Interesting, " + reflectWords(userMessage) + "?";
    }

    return defaultResponse;

 };



function containsAnyKeys(userMessage, keys) {
    const message = userMessage.split(" ");
    return keys.some(key => message.includes(key));
}

function containsAnyPatterns(userMessage, patterns) {
    const message = userMessage;  

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

