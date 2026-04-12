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
    <div className="glass-soft border border-gold/10 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gold/70 uppercase tracking-widest font-medium">Sections</span>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-gold/25 text-gold/85 text-[11px] uppercase tracking-[0.18em] font-medium hover:bg-white/10 hover:border-gold/45 hover:text-cream transition-all duration-200"
        >
          <Plus size={12} /> Add Section
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <div key={section.id} className="flex items-center gap-1.5 bg-white/[0.04] border border-gold/10 rounded-full px-4 py-2 hover:border-gold/25 transition-colors">
            {editingId === section.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit(section.id)}
                  className="bg-transparent text-cream text-sm outline-none w-24"
                  autoFocus
                />
                <button onClick={() => handleEdit(section.id)} className="text-gold/85 hover:text-gold">
                  <Check size={12} />
                </button>
                <button onClick={() => setEditingId(null)} className="text-gold/70 hover:text-cream">
                  <X size={12} />
                </button>
              </>
            ) : (
              <>
                <span className="text-cream text-sm font-medium">{section.name}</span>
                <button
                  onClick={() => { setEditingId(section.id); setEditName(section.name); }}
                  className="text-gold/45 hover:text-sage transition-colors"
                >
                  <Pencil size={11} />
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="text-gold/45 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={11} />
                </button>
              </>
            )}
          </div>
        ))}

        {adding && (
          <div className="flex items-center gap-1.5 bg-gold/[0.08] border border-gold/35 rounded-full px-4 py-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Section name..."
              className="bg-transparent text-cream text-sm outline-none w-28 placeholder:text-gold/45"
              autoFocus
            />
            <button onClick={handleAdd} className="text-gold hover:text-cream">
              <Check size={12} />
            </button>
            <button onClick={() => setAdding(false)} className="text-gold/70 hover:text-cream">
              <X size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
