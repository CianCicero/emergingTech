function submitMessage() {
    var userMessage = document.getElementById("user-input").value;
    if (!userMessage) return;

    var conversation = document.getElementById("conversation");
    conversation.innerHTML += userMessage

    var botResponse = getBotResponse(userMessage);

    conversation.innerHTML += botResponse

    document.getElementById("user-input").value = "";
}

function getBotResponse(userMessage) {
    return "OK";
}
