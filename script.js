async function getChatResponse(message) {
  const prompt = `${message}\n`;
  const maxTokens = 50;
  const apiKey = "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";
  const apiUrl = "https://api.openai.com/v1/completions";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      throw new Error("Response data is empty");
    }

    const completions = data.choices[0].text;
    const chatResponse = completions.substring(
      completions.indexOf(prompt) + prompt.length,
      completions.lastIndexOf("\n")
    );
    return chatResponse;
  } catch (error) {
    console.error(error);
    return "I'm sorry, I'm having trouble processing your message right now. Please try again later.";
  }
}

const form = document.querySelector("form");
const messageList = document.querySelector("#message-list");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = document.querySelector("#user-message");
  const message = input.value.trim();

  // Add user message to chat window
  const userMessageElement = document.createElement("li");
  userMessageElement.classList.add("user-message");
  userMessageElement.textContent = message;
  messageList.appendChild(userMessageElement);

  // Get response from ChatGPT
  getChatResponse(message)
    .then((response) => {
      // Add ChatGPT response to chat window
      const chatResponseElement = document.createElement("li");
      chatResponseElement.classList.add("chat-response");
      chatResponseElement.textContent = response;
      messageList.appendChild(chatResponseElement);

      // Scroll to bottom of chat window
      messageList.scrollTop = messageList.scrollHeight;

      // Clear input field
      input.value = "";
    })
    .catch((error) => {
      console.error(error);
      alert(
        "I'm sorry, I'm having trouble processing your message right now. Please try again later."
      );
    });
});
