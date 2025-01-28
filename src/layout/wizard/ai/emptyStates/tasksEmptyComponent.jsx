import AiTasks from "@/assets/icons/ai-tasks.svg?react";

export default function tasksEmptyComponent() {
  return (
    <div className="flex flex-col items-center justify-center  gap-[10px] grow">
      <AiTasks />
      <div class="text-center text-white text-base font-semibold font-['Inter'] leading-[14px] tracking-tight ">
        Tasks
      </div>
      <div class="text-center text-white text-xs font-normal font-['Inter'] leading-[15px] mb-[10px]">
        Explainer about how AI can automate tasks for you and you would just
        need to review
      </div>
      <div className="py-2 px-[10px] bg-grey-1 rounded-[5px]">
        <div class="text-center">
          <span className="text-white text-[10px] font-light font-['Inter'] leading-none">
            Say hello to your personal task ninja!{" "}
          </span>
          <span className="text-white text-xs font-light font-['Inter'] leading-none">
            🪄
          </span>
          <span className="text-white text-[10px] font-light font-['Inter'] leading-none">
            {" "}
            Our AI handles the heavy lifting, automating tasks and keeping
            things running smoothly. Start Speccing and experience the magic
          </span>
        </div>
      </div>
      <div class=" text-center text-[#555555] text-[10px] font-normal font-['Inter'] leading-[15px]">
        You can disable automated tasks from settings
      </div>
    </div>
  );
}
