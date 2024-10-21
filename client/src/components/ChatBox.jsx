// components/ChatBox.js
import React, { useEffect, useState } from 'react';
import { TextField, PrimaryButton, Stack, MessageBar, MessageBarType } from "@fluentui/react";
import { useAuth } from "../context/AuthContext";

const ChatBox = ({ projectId }) => {
  const { user, fetchAllMessages, sendMessage } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch messages on component mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchAllMessages(projectId);
        console.log("Fetched Messages: ", fetchedMessages);
        setMessages(fetchedMessages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [projectId, fetchAllMessages]);

  const handleSendMessage = async () => {
    if (!messageText) return;
    if(messageText && projectId){
      console.log("Message: ", messageText , "ProjectId: ", projectId);
    }
    try {
      const newMessage = { userId: user._id, message: messageText }; // Create a new message object
      await sendMessage({ projectId, message: messageText });
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update local state immutably
      setMessageText(""); // Clear input
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Stack styles={{ root: { width: "300px", height: "100%", padding: "16px", border: "1px solid #ccc", backgroundColor: "#f9f9f9", position: "absolute", right: 0, top: 0 } }}>
      <h3>Chat</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Stack styles={{ root: { maxHeight: "400px", overflowY: "auto", marginBottom: "16px" } }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ margin: "4px 0" }}>
              <strong>{msg.userId.username}: </strong>{msg.message}
            </div>
          ))}
        </Stack>
      )}
      <TextField
        placeholder="Type a message..."
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        styles={{ root: { marginBottom: "8px" } }}
      />
      <PrimaryButton text="Send" onClick={handleSendMessage} />
    </Stack>
  );
};

export default ChatBox;
