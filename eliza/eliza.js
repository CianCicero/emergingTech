const keyResponses = [
    { keys: ["CASSIUS", "LONGIUS"], response: "I knew it!" },
    { keys: ["BRUTUS"], response: "Et tu, Brute?" },
];

const patternResponses = [
    { pattern: [/I AM ([A-Z]+)/, /I'M ([A-Z]+)/ ], response: "Why are you $1?" },
    { pattern: [/I DON'T LIKE ([A-Z]+)/, /I HATE ([A-Z]+)/], response: "What bothers you most about $1?" },
];

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

    return defaultResponse;
}

function containsAnyKeys(userMessage, keys) {
    if (!keys || keys.length === 0) return false;

    const message = userMessage.toUpperCase();
    return keys.some(key => message.includes(key));
}
