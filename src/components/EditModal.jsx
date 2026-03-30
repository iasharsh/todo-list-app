import { ImCross } from "react-icons/im";
import { useEffect } from "react";

const EditModal = ({ isModalOpen, editText, setEditText, setIsModalOpen, handleModalUpdate }) => {

  useEffect(() => {
    if (isModalOpen) {
      document.querySelector("input[placeholder='Update your task...']")?.focus();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setIsModalOpen(false)}
    >
      <div
        className="w-[92%] max-w-md rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--text)]">✏️ Edit Todo</h2>
          <button onClick={() => setIsModalOpen(false)} className="text-[var(--muted)] hover:text-red-400 transition cursor-pointer">
            <ImCross size={12} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleModalUpdate}
            onKeyDown={(e) => { if (e.key === "Enter") handleModalUpdate(); }}
            className="w-full bg-[var(--bg)] border border-[var(--border)] p-3 rounded-xl text-[var(--text)] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
            placeholder="Update your task..."
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-[var(--bg)] hover:opacity-80 text-[var(--text)] transition cursor-pointer border border-[var(--border)]"
          >
            Cancel
          </button>
          <button
            onClick={handleModalUpdate}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md hover:shadow-blue-500/30 transition cursor-pointer"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;