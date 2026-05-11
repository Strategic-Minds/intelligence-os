const phases = [
  { id: '01', title: 'Intake', steps: ['Source read', 'Classify', 'Open intake'] },
  { id: '02', title: 'Discovery', steps: ['Drive scan', 'GitHub scan', 'Vercel scan'] },
  { id: '03', title: 'Benchmark', steps: ['Web research', 'Template compare', 'Score model'] },
  { id: '04', title: 'Reverse', steps: ['Extract UI', 'Offer model', 'Funnel map'] },
  { id: '05', title: 'Model', steps: ['Business logic', 'Data model', 'Approval gates'] },
  { id: '06', title: 'Build', steps: ['Frontend', 'Backend', 'Connector map'] },
  { id: '07', title: 'Media', steps: ['Image queue', 'Video queue', 'Voice queue'] },
  { id: '08', title: 'Social', steps: ['Calendar', 'Engagement', 'Repurpose'] },
  { id: '09', title: 'Lead Gen', steps: ['Scrape queue', 'Qualify', 'Draft email'] },
  { id: '10', title: 'Agent', steps: ['Run workflow', 'Sandbox test', 'Log action'] },
  { id: '11', title: 'QA', steps: ['Firewall', 'Security', 'Regression'] },
  { id: '12', title: 'Release', steps: ['Approval', 'Preview', 'Rollback'] },
];

const tools = ['Gmail', 'Drive', 'Calendar', 'Tasks', 'Keep', 'Vault', 'Docs', 'Sheets', 'Forms', '+ Tool'];
const accounts = ['GPT', 'Google', 'Vercel', 'GitHub', 'Supabase', 'Shopify', 'Groq', 'OpenAI', 'Gemini', '+ Account'];
const socials = ['Facebook', 'Instagram', 'YouTube', 'TikTok', 'Reddit', 'X', 'LinkedIn', 'GBP', 'Queue', '+ Social'];
const calendarItems = ['Drive scan', 'Repo audit', 'Vercel preview', 'Release review'];
const projectFolders = ['Epoxy Changes Lives', 'Proof Loops', 'Bronx Nourish Access', 'Shopify Workflow'];

function Icon({ type = 'dot', className = '' }: { type?: string; className?: string }) {
  const icons: Record<string, string> = {
    bot: '◉', search: '⌕', user: '●', workflow: '▦', wrench: '⚙', shield: '◇', calendar: '▣', folder: '▰', sparkle: '✦', globe: '◌', plus: '+', dot: '•'
  };
  return <span className={`inline-flex select-none items-center justify-center ${className}`} aria-hidden="true">{icons[type] || icons.dot}</span>;
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-slate-300/30 bg-black/80 shadow-[inset_0_1px_0_rgba(255,255,255,.06),0_12px_36px_rgba(0,0,0,.35)] backdrop-blur transition duration-200 hover:border-blue-500 hover:shadow-[0_0_0_1px_rgba(22,119,255,.9),0_0_28px_rgba(22,119,255,.35)] ${className}`}>{children}</div>;
}

function MiniCard({ label }: { label: string }) {
  return (
    <button type="button" className="min-h-[78px] rounded-2xl border border-slate-300/30 bg-[#050505] p-3 text-center text-xs text-white transition duration-200 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(22,119,255,.28)] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
      <Icon type="globe" className="mx-auto mb-2 h-5 w-5 rounded-full border border-white/20 text-slate-200" />
      {label}
    </button>
  );
}

function WorkflowCard({ phase, active }: { phase: { id: string; title: string; steps: string[] }; active: boolean }) {
  return (
    <button type="button" className={`rounded-2xl border ${active ? 'border-blue-500 shadow-[0_0_24px_rgba(22,119,255,.35)]' : 'border-slate-300/30'} bg-[#050505] p-3 text-left transition duration-200 hover:border-blue-500 hover:shadow-[0_0_18px_rgba(22,119,255,.22)] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div><p className="text-[10px] uppercase tracking-widest text-slate-400">Phase {phase.id}</p><h3 className="font-semibold text-white">{phase.title}</h3></div>
        <span className={`h-3 w-3 rounded-full ${active ? 'bg-green-400 shadow-[0_0_14px_rgba(54,209,124,.9)]' : 'bg-red-500 shadow-[0_0_10px_rgba(255,59,79,.7)]'}`} />
      </div>
      {phase.steps.map((step) => <div key={step} className="mt-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-300">{step}</div>)}
    </button>
  );
}

export default function IntelligenceDashboard() {
  const activePhaseId = '06';
  return (
    <main className="min-h-screen bg-black p-4 text-white">
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-300/30 bg-[#050505] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
        <div className="flex gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /><span className="h-3 w-3 rounded-full bg-yellow-400" /><span className="h-3 w-3 rounded-full bg-green-500" /></div>
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-white/10 bg-black px-4 py-2 text-sm text-slate-300"><Icon type="search" className="text-lg" /><span className="truncate">intelligence-os://admin-command/dashboard</span></div>
        <button type="button" className="rounded-full border border-white/20 px-3 py-2 text-xs transition hover:border-blue-500 hover:text-blue-300">+ Tab</button>
        <button type="button" className="grid h-9 w-9 place-items-center rounded-full border border-white/20 transition hover:border-blue-500"><Icon type="user" className="text-xs text-yellow-300" /></button>
      </div>
      <div className="grid gap-4 lg:grid-cols-[300px_1fr_300px]">
        <Card className="flex min-h-[760px] flex-col p-4">
          <div className="mb-4 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl border border-blue-400/60 text-xl text-blue-200"><Icon type="bot" /></div><div><h2 className="font-bold">Intelligence OS</h2><p className="text-xs text-slate-400">Vercel Chatbot + AI Gateway</p></div></div>
          <div className="flex-1 space-y-3 text-sm text-slate-300"><div className="rounded-2xl border border-white/10 bg-white/5 p-3">Ready to scan Drive, GitHub, Vercel, Shopify, and benchmarks.</div><div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3">Production lock ON. All destructive actions blocked.</div><div className="rounded-2xl border border-white/10 bg-white/5 p-3">Current phase: Build. Active step indicator is green.</div></div>
          <input className="mt-4 rounded-2xl border border-slate-300/30 bg-black px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:shadow-[0_0_24px_rgba(22,119,255,.35)]" placeholder="Ask Intelligence OS..." />
        </Card>
        <section className="space-y-4">
          <Card className="p-5"><p className="text-xs uppercase tracking-[.24em] text-slate-400">Strategic Minds Operations System</p><h1 className="text-4xl font-black tracking-tight text-white">Intelligence OS</h1><p className="mt-2 text-sm text-slate-300">GitHub-style Kanban workflow, Vercel-native automation, Supabase intelligence backend, Google Workspace bridge.</p></Card>
          <Card className="p-4"><div className="mb-3 flex items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-bold"><Icon type="workflow" className="text-lg text-blue-200" /> Kanban Workflow Pipeline</h2><span className="text-xs text-slate-400">Rows = phases • Cards = steps</span></div><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">{phases.map((phase) => <WorkflowCard key={phase.id} phase={phase} active={phase.id === activePhaseId} />)}</div></Card>
          <div className="grid gap-4 xl:grid-cols-2"><Card className="p-4"><h2 className="mb-3 flex items-center gap-2 font-bold"><Icon type="wrench" /> Tools</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{tools.map((tool) => <MiniCard key={tool} label={tool} />)}</div></Card><Card className="p-4"><h2 className="mb-3 flex items-center gap-2 font-bold"><Icon type="shield" /> Accounts</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-5">{accounts.map((account) => <MiniCard key={account} label={account} />)}</div></Card></div>
          <Card className="p-4"><h2 className="mb-3 font-bold">Sandbox Drop Zone</h2><button type="button" className="grid min-h-[150px] w-full place-items-center rounded-3xl border border-dashed border-slate-300/50 text-5xl text-slate-300 transition hover:border-blue-500 hover:text-blue-300"><Icon type="plus" /></button></Card>
        </section>
        <aside className="space-y-4"><Card className="p-4"><h2 className="mb-3 flex items-center gap-2 font-bold"><Icon type="calendar" /> Google Calendar</h2>{calendarItems.map((item, index) => <button type="button" key={item} className="mb-2 block w-full rounded-xl border border-white/10 p-3 text-left text-sm transition hover:border-blue-500"><b>{item}</b><p className="text-xs text-slate-400">{index + 1}:00 PM • linked task</p></button>)}</Card><Card className="p-4"><h2 className="mb-3 flex items-center gap-2 font-bold"><Icon type="folder" /> Project Folders</h2>{projectFolders.map((folder) => <button type="button" key={folder} className="mb-2 flex w-full justify-between rounded-xl border border-white/10 p-3 text-sm transition hover:border-blue-500"><span>{folder}</span><span>↗</span></button>)}</Card><Card className="p-4"><h2 className="mb-3 flex items-center gap-2 font-bold"><Icon type="sparkle" /> Social + Lead Gen</h2><div className="grid grid-cols-2 gap-2">{socials.map((social) => <MiniCard key={social} label={social} />)}</div></Card></aside>
      </div>
    </main>
  );
}
