import React, { useState } from "react";
import { UserProfile, MemoryItem } from "../types";

interface MemoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
  onUpdateMemories: (newMemories: MemoryItem[]) => void;
}

const MemoryManager: React.FC<MemoryManagerProps> = ({
  isOpen,
  onClose,
  memories,
  onUpdateMemories,
}) => {
  const [newMemory, setNewMemory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemory.trim()) {
      const newItem: MemoryItem = {
        id: Date.now().toString(),
        content: newMemory.trim(),
        timestamp: Date.now(),
        importance: 5,
        type: "semantic",
      };
      onUpdateMemories([newItem, ...memories]);
      setNewMemory("");
    }
  };

  const handleDelete = (id: string) => {
    onUpdateMemories(memories.filter((m) => m.id !== id));
  };

  const startEdit = (id: string, val: string) => {
    setEditingId(id);
    setEditValue(val);
  };

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      const updated = memories.map((m) =>
        m.id === editingId ? { ...m, content: editValue.trim() } : m
      );
      onUpdateMemories(updated);
      setEditingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white/90 glass-panel w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100/50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
          <span className="text-2xl">🧠</span> Quản lý Ký ức
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Những điều Amity ghi nhớ về bạn. Bạn có thể thay đổi chúng.
        </p>

        <form onSubmit={handleAdd} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newMemory}
            onChange={(e) => setNewMemory(e.target.value)}
            placeholder="Thêm ký ức mới (VD: Mình thích ăn pizza...)"
            className="flex-1 glass-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            disabled={!newMemory.trim()}
            className="bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-xl text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Thêm
          </button>
        </form>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
          {memories.length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic bg-white/40 rounded-xl border border-dashed border-slate-300">
              Chưa có ký ức nào. Hãy trò chuyện thêm nhé!
            </div>
          ) : (
            memories.map((mem) => (
              <div
                key={mem.id}
                className="group bg-white/60 border border-white/60 rounded-xl p-3 shadow-sm hover:shadow-md transition-all flex items-start gap-3"
              >
                {editingId === mem.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      autoFocus
                      className="flex-1 bg-white border border-indigo-200 rounded-lg px-2 py-1 text-sm focus:outline-none"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    />
                    <button
                      onClick={saveEdit}
                      className="text-emerald-600 hover:bg-emerald-50 p-1 rounded"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-slate-400 hover:bg-slate-100 p-1 rounded"
                    >
                      ❌
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 text-sm text-slate-700 leading-relaxed">
                      {mem.content}
                      <span className="ml-2 inline-block px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-400 text-[10px] uppercase font-bold tracking-wider opacity-70">
                        {mem.type === 'semantic' ? "Lâu dài" : "Sự kiện"}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(mem.id, mem.content)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(mem.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MemoryManager;
