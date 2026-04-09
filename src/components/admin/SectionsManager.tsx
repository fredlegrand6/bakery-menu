import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { useSections } from '@/hooks/useAdminData';

export default function SectionsManager() {
  const { sections, addSection, updateSection, deleteSection } = useSections();
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await addSection(newName.trim());
    setNewName('');
    setAdding(false);
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    await updateSection(id, editName.trim());
    setEditingId(null);
  };

  return (
    <div className="bg-[#1a1f14] border border-sage/[0.08] rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-sage/40 uppercase tracking-widest font-medium">Sections</span>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-sage/20 text-sage text-sm font-medium hover:bg-white/10 hover:border-sage/30 hover:text-cream transition-all duration-200"
        >
          <Plus size={12} /> Add Section
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <div key={section.id} className="flex items-center gap-1.5 bg-white/[0.04] border border-sage/[0.08] rounded-full px-4 py-2 hover:border-sage/20 transition-colors">
            {editingId === section.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit(section.id)}
                  className="bg-transparent text-cream text-sm outline-none w-24"
                  autoFocus
                />
                <button onClick={() => handleEdit(section.id)} className="text-sage hover:text-cream">
                  <Check size={12} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-sage/40 hover:text-cream">
                  <X size={12} />
                </button>
              </>
            ) : (
              <>
                <span className="text-cream text-sm font-medium">{section.name}</span>
                <button
                  onClick={() => { setEditingId(section.id); setEditName(section.name); }}
                  className="text-sage/30 hover:text-sage transition-colors"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="text-sage/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={11} />
                </button>
              </>
            )}
          </div>
        ))}

        {adding && (
          <div className="flex items-center gap-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full px-4 py-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Section name..."
              className="bg-transparent text-cream text-sm outline-none w-28 placeholder:text-sage/30"
              autoFocus
            />
            <button onClick={handleAdd} className="text-terracotta hover:text-cream">
              <Check size={12} />
            </button>
            <button onClick={() => setAdding(false)} className="text-sage/40 hover:text-cream">
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
