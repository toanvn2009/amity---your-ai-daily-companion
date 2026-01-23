import React from "react";

interface QuickActionsProps {
  onAction: (text: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      label: "Ghi lại tâm trạng ☁️",
      prompt: "Mình muốn ghi lại tâm trạng lúc này",
    },
    {
      label: "Thiết lập mục tiêu 🎯",
      prompt: "Mình muốn đặt một mục tiêu mới, giúp mình chia nhỏ nó nhé",
    },
    {
      label: "Theo dõi thói quen ✅",
      prompt: "Hãy kiểm tra tiến độ các thói quen của mình",
    },
    {
      label: "Thư giãn 30s 🧘",
      prompt: "Mình đang thấy hơi căng thẳng, hãy giúp mình thư giãn nhanh",
    },
    {
      label: "Tâm sự sâu 💡",
      prompt: "Mình muốn tâm sự chuyện thầm kín, hãy lắng nghe nhé",
    },
    {
      label: "Lời khuyên tình cảm 💘",
      prompt: "Mình cần lời khuyên về chuyện tình cảm",
    },
    {
      label: "Động lực 🚀",
      prompt: "Hãy truyền động lực cho mình làm việc nào",
    },
    {
      label: "Chăm sóc bản thân 💆",
      prompt: "Gợi ý cho mình cách chăm sóc bản thân hôm nay đi",
    },
    {
      label: "Kiến thức thú vị 🧠",
      prompt: "Kể cho mình nghe một sự thật thú vị ngẫu nhiên đi",
    },
    {
      label: "Kể chuyện vui 😂",
      prompt: "Kể cho mình nghe một câu chuyện cười để giải trí nhé",
    },
  ];

  return (
    <div className="flex gap-2 px-2 md:gap-2.5 md:px-4 py-3 overflow-x-auto no-scrollbar snap-x touch-pan-x w-full">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onAction(action.prompt)}
          className="snap-center bg-white/80 backdrop-blur-sm border border-indigo-100 text-indigo-600 px-3 py-1.5 md:px-3.5 md:py-2 rounded-xl shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition-all active:scale-95 flex-shrink-0 text-xs font-medium whitespace-nowrap first:ml-2 last:mr-4"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
