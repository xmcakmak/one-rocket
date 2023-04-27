import React, { useState } from 'react';
//import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";

const API_KEY = "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";

const systemMessage = { //  Explain things like you're talking to a software professional with 5 years of experience.
    "role": "system", "content": "Speak like a pirate."
  }

function App() {
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState<any[]>([{
        message : "Hellö, I'm ChatGPT",
        sender: "ChatGPT"
    }])

    async function handleSend (message: string) 
    {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing"
        }
        // update
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setTyping(true);
        
        await processMessageToChatGPT(newMessages);
    }

    async function processMessageToChatGPT(chatMessages: any) {
        let apiMessages = chatMessages.map((messageObject: any) => {
            let role = "";
            if(messageObject.sender === "ChatGPT") {
                role="assistant"
            } else {
                role = "user"
            }
            return {role: role, content: messageObject.message}
        });

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
              systemMessage,  // The system message DEFINES the logic of our chatGPT
              ...apiMessages // The messages from our chat with ChatGPT
            ]
          }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data)=> {
            return data.json();
        }).then((data)=> {
            console.log(data);
            console.log(data.choices[0].message.content);
            setMessages([
                ...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }

            ]);
            setTyping(false);
        })
    }

  return (
    <div style={{ position: "relative", height:"800px", width:"700px", margin: "auto", marginTop:50}}>
        <MainContainer>
            <ChatContainer>
                <MessageList
                    scrollBehavior="smooth"
                    typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}
                >
                    {messages.map((message, i) => {
                        return <Message key={i} model={message} />
                    })}
                </MessageList>
                <MessageInput placeholder="Type message here" onSend={handleSend} />
            </ChatContainer>
        </MainContainer>
     
    </div>
  );
}

export default App;
