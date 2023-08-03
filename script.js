const button = document.querySelector("button");
const message = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbot .chatbox");
const API_TOKEN = ""; //get the token from https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill

const createChatList = (message, className) =>{
    const chat = document.createElement("li");
    chat.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<p></p>`;
    chat.innerHTML = chatContent;
    chat.querySelector("p").textContent = message;
    return chat;
}

// Blender API
const query = async (data) =>{
    const response = await fetch(
		"https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
		{
			headers: { Authorization: `Bearer ${API_TOKEN}` },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}


// send and respond of the chatbot
button.addEventListener("click", ()=>{
    const userMessage = message.value.trim();
    if (!userMessage) return;
    message.value = "";

    chatbox.appendChild(createChatList(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    setTimeout(() => {
        const incomingMessage = createChatList("Thinking...", "incoming");
        chatbox.appendChild(incomingMessage);
        query(
            {"inputs": {
                "past_user_inputs": [userMessage],
                "generated_responses": ["It's Die Hard for sure."],
                "text": "Can you explain why ?"
            }}).then((response) => {
            const messageElement = incomingMessage.querySelector("p");
            const responsed = JSON.stringify(response);
            const conversion = JSON.parse(responsed);
            messageElement.textContent =  conversion["generated_text"];  
            }
        ).catch((error) =>{
            messageElement.textContent = "Oops, Something went wrong Please try again";
        });
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);
});