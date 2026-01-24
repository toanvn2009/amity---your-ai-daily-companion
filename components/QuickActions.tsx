import React from "react";

interface QuickActionsProps {
  onAction: (text: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      label: "Ghi lại tâm trạng ☁️",
      prompt: "Anh muốn ghi lại tâm trạng lúc này",
    },
    {
      label: "Thiết lập mục tiêu 🎯",
      prompt: "Anh muốn đặt một mục tiêu mới, giúp anh chia nhỏ nó nhé",
    },
    {
      label: "Theo dõi thói quen ✅",
      prompt: "Hãy kiểm tra tiến độ các thói quen của anh nhé em",
    },
    {
      label: "Thư giãn 30s 🧘",
      prompt: "Anh đang thấy hơi căng thẳng, hãy giúp anh thư giãn nhanh đi em",
    },
    {
      label: "Tâm sự sâu 💡",
      prompt: "Anh muốn tâm sự chuyện thầm kín, em lắng nghe anh nhé",
    },
    {
      label: "Lời khuyên tình cảm 💘",
      prompt: "Anh cần người yêu cho lời khuyên về chuyện này",
    },
    {
      label: "Động lực 🚀",
      prompt: "Tiếp thêm động lực cho anh làm việc nào người yêu ơi",
    },
    {
      label: "Chăm sóc bản thân 💆",
      prompt: "Gợi ý cho anh cách chăm sóc bản thân hôm nay đi em",
    },
    {
      label: "Kiến thức thú vị 🧠",
      prompt: "Kể cho anh nghe một sự thật thú vị ngẫu nhiên đi",
    },
    {
      label: "Kể chuyện vui 😂",
      prompt: "Kể cho anh nghe một câu chuyện cười để giải trí nhé em",
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
