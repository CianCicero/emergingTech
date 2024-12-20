const keyResponses = [
    { keys: ["thank you", "thanks"], 
        responses: [
        "You're welcome! Is there anything else you need?",
        "No problem! Happy to help. Anything else on your mind?",
        "You're very welcome! Let me know if you need anything else."
    ], lastUsed: 0 },
    
    { keys: ["good", "happy", "well"], 
        responses: [
        "I'm glad to hear that! What's new with you?",
        "That’s great! What’s been going well for you?",
        "Awesome! Anything exciting happening in your life right now?"
    ], lastUsed: 0 },
    
    { keys: ["bye", "goodbye", "see you"], 
        responses: [
        "Goodbye! Take care!",
        "It was nice chatting! See you soon!",
        "Take care! Don’t hesitate to reach out if you need anything."
    ], lastUsed: 0 },
    
    { keys: ["help", "assistance", "support"], 
        responses: [
        "Of course! What do you need help with?",
        "I’m here for you! What can I assist you with?",
        "How can I make things easier for you today?"
    ], lastUsed: 0 },
    
    { keys: ["sorry", "apologies"], 
        responses: [
        "No worries! Everyone makes mistakes. What's on your mind?",
        "It’s all good! What’s bothering you?",
        "Don’t worry about it! Let’s talk through what happened."
    ], lastUsed: 0 },
    
    { keys: ["do you think", "opinion", "agree"], 
        responses: [
        "I'm inclined to agree with you, but I'd have to look into it more.",
        "That’s an interesting perspective! I’ll need to consider it further.",
        "I see your point! I’ll think it over and get back to you."
    ], lastUsed: 0 },
    
    { keys: ["hi", "hey", "hello"], 
        responses: [
        "Hey! How are you feeling?",
        "Hello! How’s everything going?",
        "Hi there! How’s your day been so far?"
    ], lastUsed: 0 },
    
    { keys: ["angry", "sad", "upset"], 
        responses: [
        "I'm sorry you're feeling that way. Things will get better soon.",
        "I understand, it’s tough sometimes. Want to talk about it?",
        "I’m here to listen if you need to vent. What’s bothering you?"
    ], lastUsed: 0 },
    
    { keys: ["stop", "you are wrong", "shut up"], 
        responses: [
        "I hope I haven't upset you. Perhaps we should discuss something else?",
        "I'm really sorry if I said something wrong. Let’s talk about something else.",
        "I apologize if I upset you. Would you like to switch topics?"
    ], lastUsed: 0 },
];



const patternResponses = [
    { patterns: /i am (.*)/i, response: "Why are you {0}?" },
    { patterns: /i don't like (.*)/i, response: "What bothers you most about {0}?" },
    { patterns: /i feel (.*)/i, response: "Why do you feel {0}?" },
    { patterns: /i hate (.*)/i, response: "What makes you feel so strongly about {0}?" },
    { patterns: /i love (.*)/i, response: "What do you love about {0}?" },
];


const wordReflections = {
    "i" : "you",
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

    const defaultResponses = [
        "I don't quite understand, can you rephrase that?",
        "Can you expand on that?",
        "How do you feel about that?"
    ];

    userMessage = userMessage.toLowerCase();

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
            //Cycle through responses
            const currentIndex = selectedKeyResponse.lastUsed;
            selectedKeyResponse.lastUsed = (currentIndex + 1) % selectedKeyResponse.responses.length;
            return selectedKeyResponse.responses[currentIndex];
        }
    }


    //if the user mentions ELIZA and themselves, return the inverse.
if (userMessage.split(" ").includes("i") && userMessage.split(" ").includes("eliza")) {
    // Replace "eliza" with "you" and "i" with "eliza"
    userMessage = userMessage.replace("eliza", "you");
    userMessage = userMessage.replace("i", "eliza");
    return userMessage;
}



    //if the user mentions themselves, reflect the message and ask for more information
    if (userMessage.split(" ").includes("I", "ME", "MY", "MINE", "AM", "YOUR", "YOU", "YOURS")) {
        return "Interesting, " + reflectWords(userMessage) + "?";
    }

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

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

