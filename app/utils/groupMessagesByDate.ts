// Group messages by date
export const groupMessagesByDate = (messages: MessageType[]) => {
  return messages.reduce((acc: Record<string, MessageType[]>, message) => {
    const date = new Date(message.createdAt).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].unshift(message);
    return acc;
  }, {});
};
