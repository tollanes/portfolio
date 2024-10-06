import { ChatMessageType } from "@lib/Constants/types";

const ChatMessage = ({ message }: { message: ChatMessageType }) => {
  return (
    <div key={message.id}>
      <div>
        <span>{message.user.username}</span>
        <span>: </span>
        <span>{message.message}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
