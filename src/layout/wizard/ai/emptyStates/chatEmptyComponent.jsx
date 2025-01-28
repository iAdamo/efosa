import AIChatPurple from "@/assets/icons/ai-chat-purple.svg?react";

export default function ChatEmptyComponent({ handleSend, listRef, ...props }) {
  return (
    <div className="flex flex-col items-center justify-center  gap-[10px] grow">
      <AIChatPurple className="purple-gradient" />
      <div class="text-center text-white text-base font-semibold font-['Inter'] leading-[14px] tracking-tight ">
        Chat
      </div>
      <div class="text-center text-white text-xs font-normal font-['Inter'] leading-[15px] mb-[10px]">
        Ask questions about specc or the API of your choice. Here are some
        suggestions
      </div>
      <div
        onClick={() => {
          handleSend("What is Specc?");
        }}
        onKeyDown={() => {
          handleSend("What is Specc?");
        }}
        className="w-full py-2 px-[10px] bg-grey-1 rounded-[5px] border border-transparent  cursor-pointer ai-btn"
      >
        <div class="text-center text-white text-[10px] leading-4 font-light font-['Inter']">
          What is Specc?
        </div>
      </div>
      <div
        onClick={() => {
          handleSend("What is an API?");
        }}
        onKeyDown={() => {
          handleSend("What is an API?");
        }}
        className="w-full py-2 px-[10px] bg-grey-1 rounded-[5px] border border-transparent  cursor-pointer ai-btn"
      >
        <div class="text-center text-white text-[10px] leading-4 font-light font-['Inter'] ">
          What is an API?
        </div>
      </div>
      <div
        onClick={() => {
          handleSend("How do I upload an API?");
        }}
        onKeyDown={() => {
          handleSend("How do I upload an API?");
        }}
        className="w-full py-2 px-[10px] bg-grey-1 rounded-[5px] border border-transparent  cursor-pointer ai-btn"
      >
        <div class="text-center text-white text-[10px] leading-4 font-light font-['Inter']">
          How do I upload an API?
        </div>
      </div>
      <div class="text-center text-white text-xs font-normal font-['Inter'] leading-[15px] mt-[10px] ">
        Or you can start by asking any question you want by typing in the chat
        box below.
      </div>
    </div>
  );
}
