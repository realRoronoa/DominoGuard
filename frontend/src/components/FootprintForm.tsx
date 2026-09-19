import { ServiceId } from "../types";

const services: { id: ServiceId; label: string; detail: string }[] = [
  { id: "email", label: "Primary Email", detail: "Recovery hub" },
  { id: "instagram", label: "Instagram", detail: "Social" },
  { id: "whatsapp", label: "WhatsApp", detail: "Messaging" },
  { id: "bank", label: "Banking", detail: "High impact" },
  { id: "google", label: "Drive / Photos", detail: "Cloud data" },
  { id: "amazon", label: "Amazon", detail: "Shopping" }
];

export function FootprintForm({ selected, setSelected }: { selected: ServiceId[]; setSelected: (next: ServiceId[]) => void }) {
  function toggle(id: ServiceId) {
    if (selected.includes(id)) {
      if (selected.length === 1) return;
      setSelected(selected.filter((x) => x !== id));
    } else setSelected([...selected, id]);
  }

  return <div className="space-y-3">
    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">01 · Digital footprint</div>
    <div className="space-y-2">
      {services.map((s) => <button key={s.id} onClick={() => toggle(s.id)} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${selected.includes(s.id) ? "border-white/20 bg-white/[0.07]" : "border-white/5 bg-black/10 hover:border-white/10"}`}>
        <div><div className="text-sm font-medium">{s.label}</div><div className="text-xs text-zinc-500">{s.detail}</div></div>
        <div className={`h-4 w-4 rounded-full border ${selected.includes(s.id) ? "border-white bg-white" : "border-zinc-600"}`} />
      </button>)}
    </div>
  </div>;
}
