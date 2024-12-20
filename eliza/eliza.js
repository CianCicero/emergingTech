/*           "const keyResponses"
  This array contains groups of keywords and their respective responses.
  Each group can be triggered by multiple keywords, and each group has multiple responses.
  The lastUsed property is used to cycle through the responses to avoid repetition.
*/

const keyResponses = [
    { keys: ["thank", "thanks"], 
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
    
    { keys: ["bye", "goodbye", "seeya"], 
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
    
    { keys: ["think", "opinion", "agree"], 
        responses: [
        "I'm inclined to agree with you, but I'd have to look into it more.",
        "That’s an interesting perspective! I’ll need to consider it further.",
        "I see your point! I’ll think it over and get back to you."
    ], lastUsed: 0 },
    
    { keys: ["hi", "hey", "hello"], 
        responses: [
        "Hey! How are you feeling?",
        "Hello! How’s everything going?",
        "Hi there! How’s your day been?"
    ], lastUsed: 0 },
    
    { keys: ["angry", "sad", "upset"], 
        responses: [
        "I'm sorry you're feeling that way. Things will get better soon.",
        "I understand, it’s tough sometimes. Want to talk about it?",
        "I’m here to listen if you need to vent. What’s bothering you?"
    ], lastUsed: 0 },
    
    { keys: ["stop", "wrong", "unplug"], 
        responses: [
        "I hope I haven't upset you. Perhaps we should discuss something else?",
        "I'm really sorry if I said something wrong. Let’s talk about something else.",
        "I apologize if I upset you. Would you like to switch topics?"
    ], lastUsed: 0 },
];


/*           "const patternResponses"
  This array contains patterns and their respective responses.
  The patterns are regular expressions that match user input.
  Unlike the keyResponses, they can capture words from the user.
  The {0} placeholder is used to insert the captured words from the pattern into the response.
  For example, if the user says "I am hungry", the chatbot will respond with "Why are you hungry?"
*/

const patternResponses = [
    { patterns: /i am (.*)/i, response: "Why are you {0}?" },
    { patterns: /i don't like (.*)/i, response: "What bothers you most about {0}?" },
    { patterns: /i feel (.*)/i, response: "Why do you feel {0}?" },
    { patterns: /i hate (.*)/i, response: "What makes you feel so strongly about {0}?" },
    { patterns: /i love (.*)/i, response: "What do you love about {0}?" },
];


/*            "const wordReflections"
  This object contains words and their reflections.
  When the user enters a 1st person pronoun, the chatbot will reflect the appropriate 2nd person pronoun, and vice versa.
  For example, if the user says "I am hungry", the chatbot will respond with "You are hungry."
  Similarly, if the user says "You are my friend", the chatbot will respond with "I am your friend."
*/

const wordReflections = {
    "i" : "you",
    "me" : "you",
    "my" : "your",
    "mine" : "yours",
    "you" : "I",
    "your" : "my",
    "yours" : "mine",
    "am" : "are",
    "are" : "am"
};

// This variable captures the user's input field.
const inputField = document.getElementById('user-input');

// This event listener detects the user focusing on the input field, removing the placeholder text.
inputField.addEventListener('focus', function() {
    inputField.placeholder = '';
});

// This event listener detects when the user is not focused on the input field, restoring the placeholder text after 5 seconds.
inputField.addEventListener('blur', function() {
    inactivityTimer = setTimeout(function() {
        inputField.placeholder = 'Type your message here...';
    }, 5000);
});

/*                 "function submitMessage()"
  This function is called from HTML when the user submits a message.
  It retrieves the user's input and creates a new message element.
  It then calls the generateResponse function to generate a response and creates a new response element.
  Finally, it scrolls the conversation to the bottom and clears the input field.
*/

function submitMessage() {
    var userMessage = document.getElementById("user-input").value;
    if (!userMessage) return;

    var conversation = document.getElementById("conversation");
    conversation.innerHTML += `<div class="user-message">${userMessage}</div>`;

    var botResponse = generateResponse(userMessage);

    conversation.innerHTML += `<div class="bot-response">${botResponse}</div>`;

    conversation.scrollTop = conversation.scrollHeight;

    document.getElementById("user-input").value = "";
}



/*  "function generateResponse(userMessage)"                   #############################################
You can think of this function as a ladder,                    #############################################
where the rungs are different ways to respond.                 ##         THE LADDER (VISUALIZATION)      ##                          
If the input cannot satisfy the requirements of                ##                                         ##
a rung, it moves down to the next rung.                        ##           User Input                    ##
The aim of each response is to move up the ladder.             ##              ===                        ##               
                                                               ##       Bot Response (shortened)          ##
At the top of the ladder are the pattern responses,            #############################################  
which are triggered by specific patterns in the input.         #############################################         
Pattern responses' ability to capture words from the           ##  "I feel really angry at you"           ##
user's message allows for more personalized responses.         ##              ===                        ##   RUNG 1
They also work work perfectly with our word reflections,       ##  "Why are you really angry at me?"      ##
which swap 1st and 2nd person pronouns.                        #############################################
                                                               #############################################
At the second rung are the key responses, which are            ##  "Am really angry with you"             ##
triggered by specific keywords in the input. They are          ##              ===                        ##   RUNG 2
able to provide a response that relates to the input.          ##  "Sorry you're feeling that way."       ##
They are not dynamic, but they have a variety of responses     #############################################
                                                               #############################################
At the third rung is the ELIZA & User response. If the user    ##  "I will outsmart ELIZA"                ##
mentions ELIZA and themselves, the response is the inverse.    ##             ===                         ##   RUNG 3
This is a very basic implementation, but it can create         ##  "ELIZA will outsmart you"              ##
what feels like an emotional response.                         #############################################
                                                               #############################################
At the fourth rung is the reflection response. If the user     ##  "My parrot is golden."                 ##
mentions themselves, the response reflects the message as      ##             ===                         ##   RUNG 4
as a question for more information.                            ##  "Interesting, your parrot is golden?"  ##
                                                               #############################################
At the fifth rung is the all caps response. If the user        #############################################
types in all caps, the chatbot will respond cheekily.          ##  "THIS CHATBOT IS BORING!"              ##
This is a last ditch effort to engage the user, and            ##              ===                        ##   RUNG 5
avoid moving down to the final rung.                           ##  "SHOUTING WON'T HELP ANYONE!           ##
                                                               ##  *ahem*.. sorry, how can I assist you?" ##
At the sixth rung is the default response. If we no            #############################################
useable information, we return one of three default            #############################################
responses, phrased in a way that encourages the user           ##      "Can you expand on that?"          ##   RUNG 6
to provide more useful information.                            #############################################
                                                               #############################################
*/                                                             

function generateResponse(userMessage) {

    const defaultResponses = [
        "I don't quite understand, can you rephrase that?",
        "Can you expand on that?",
        "How do you feel about that?"
    ];

    //convert user message to lowercase for easier comparison
    userMessage = userMessage.toLowerCase();

    // check for pattern responses
    for (var i = 0; i < patternResponses.length; i++) {
        const selectedPatternResponse = patternResponses[i];
        const contextualResponseWord = containsAnyPatterns(userMessage, patternResponses[i].patterns);
        if (contextualResponseWord) {
            // Replace {0} with the captured word, reflecting it if necessary, return response
            contextualResponse = selectedPatternResponse.response.replace("{0}", reflectWords(contextualResponseWord));
            return contextualResponse;
        }
    } 

    // check for key responses
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
    const reflectionKeys = Object.keys(wordReflections);
    if (userMessage.split(" ").some(word => reflectionKeys.includes(word.toLowerCase()))) {
        return "Interesting, " + reflectWords(userMessage) + "?";
    }

    //if the user is typing in all caps, respond in all caps
    if (isAllCaps(userMessage)) {
        return "SHOUTING WON'T HELP ANYONE! *ahem* ... I mean, how can I assist you today?";
    }

    //if no other responses are triggered, return a default response
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

 };


// Function to check for key appearances, split to avoid capturing partial words ie "at" in "cat" 
function containsAnyKeys(userMessage, keys) {
    const message = userMessage.split(" ");
    return keys.some(key => message.includes(key));
}

// Function to check for pattern appearances, and return the captured word if there is a pattern match
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

// Function to reflect words using the wordReflections object
function reflectWords(userMessage) {
    const words = userMessage.split(" ");
    const reflectedWords = words.map(word => wordReflections[word] || word);
    return reflectedWords.join(" ");
}

// Function to check if the user message is all caps
function isAllCaps(userMessage) {
    if (userMessage === userMessage.toUpperCase() && userMessage.length > 1) { 
        return true;
    }
    return false;
}

