export type Source = { doc: string; page: number; text: string };

export const initialFiles = [
  { name: "Operating Systems Syllabus.pdf", pages: 6 },
  { name: "OS Module 1.pdf", pages: 32 },
  { name: "OS Module 2.pdf", pages: 38 },
  { name: "OS Module 3 - Deadlocks.pdf", pages: 41 },
  { name: "OS Module 4 - Memory Management.pdf", pages: 44 },
  { name: "OS PYQ 2022.pdf", pages: 8 },
  { name: "OS PYQ 2023.pdf", pages: 8 },
  { name: "OS PYQ 2024.pdf", pages: 9 },
  { name: "OS Notes.pdf", pages: 61 },
];

const S = {
  pyq22: { doc: "OS PYQ 2022", page: 4, text: "Q3 (a). State and explain the four necessary conditions for a deadlock to occur. How can deadlock be prevented? [10 marks]" },
  pyq23: { doc: "OS PYQ 2023", page: 6, text: "Q5. What is a deadlock? Explain mutual exclusion, hold and wait, no preemption and circular wait with suitable examples. [10 marks]" },
  pyq24: { doc: "OS PYQ 2024", page: 3, text: "Q2 (b). Explain Banker's algorithm for deadlock avoidance. Also list the necessary conditions for deadlock. [8 marks]" },
  pyq21: { doc: "OS PYQ 2021", page: 5, text: "Q4. Discuss the necessary conditions for deadlock and explain the resource allocation graph. [10 marks]" },
  mod3: { doc: "OS Module 3", page: 18, text: "A deadlock can arise only if four conditions hold simultaneously: mutual exclusion, hold and wait, no preemption, and circular wait. Breaking any one prevents deadlock." },
  cpu23: { doc: "OS PYQ 2023", page: 2, text: "Q1. Compare FCFS, SJF and Round Robin scheduling algorithms. Compute average waiting time for the given processes. [12 marks]" },
  cpu24: { doc: "OS PYQ 2024", page: 5, text: "Q3. Explain CPU scheduling criteria and priority scheduling with a Gantt chart. [10 marks]" },
  cpu22: { doc: "OS PYQ 2022", page: 2, text: "Q2. Explain preemptive and non-preemptive scheduling algorithms with examples. [10 marks]" },
  mem23: { doc: "OS PYQ 2023", page: 7, text: "Q6. Explain contiguous memory allocation. Differentiate internal and external fragmentation. [8 marks]" },
  mem24: { doc: "OS PYQ 2024", page: 7, text: "Q6 (a). Describe memory management techniques with a neat diagram. [8 marks]" },
  pg22: { doc: "OS PYQ 2022", page: 6, text: "Q5. Explain paging with a neat diagram. What is a TLB? [10 marks]" },
  pg24: { doc: "OS PYQ 2024", page: 8, text: "Q7. Explain paging and calculate the effective access time given TLB hit ratio 80%. [10 marks]" },
} satisfies Record<string, Source>;

export const sources = S;

export type Topic = {
  name: string;
  count: number;
  level: "HIGH" | "MEDIUM";
  why: string[];
  sources: Source[];
};

export const topics: Topic[] = [
  { name: "Deadlocks", count: 4, level: "HIGH", why: ["Appears across multiple years", "Covered in the syllabus", "Supported by multiple study materials"], sources: [S.pyq22, S.pyq23, S.pyq24, S.pyq21] },
  { name: "CPU Scheduling", count: 3, level: "HIGH", why: ["Asked every year since 2022", "Numerical problems carry high marks", "Covered in Module 2 and notes"], sources: [S.cpu22, S.cpu23, S.cpu24] },
  { name: "Memory Management", count: 2, level: "MEDIUM", why: ["Appeared in 2023 and 2024", "A full module in the syllabus", "Foundation for paging questions"], sources: [S.mem23, S.mem24] },
  { name: "Paging", count: 2, level: "MEDIUM", why: ["Diagram-based questions repeat", "Often paired with TLB numericals", "Covered in Module 4"], sources: [S.pg22, S.pg24] },
];

export const repeated = [
  { q: "Explain the necessary conditions for deadlock.", count: 4, years: ["2021", "2022", "2023", "2024"], sources: [S.pyq21, S.pyq22, S.pyq23, S.pyq24] },
  { q: "Explain CPU scheduling algorithms.", count: 3, years: ["2022", "2023", "2024"], sources: [S.cpu22, S.cpu23, S.cpu24] },
  { q: "Explain paging.", count: 2, years: ["2022", "2024"], sources: [S.pg22, S.pg24] },
];

export const chatAnswers: Record<string, { text: string; sources: Source[] }> = {
  "What should I study first?": {
    text: "Based on the patterns across your uploaded material, I'd prioritize:\n\n1. **Deadlocks** — HIGH\nAppeared in 4 previous-year papers.\n\n2. **CPU Scheduling** — HIGH\nAppeared in 3 previous-year papers.\n\n3. **Memory Management** — MEDIUM\nAppeared in 2 previous-year papers.\n\nIf your preparation time is limited, start with Deadlocks and CPU Scheduling.",
    sources: [S.pyq22, S.pyq23, S.mod3],
  },
  "What questions repeat most?": {
    text: "Three questions show up again and again:\n\n1. **Necessary conditions for deadlock** — 4 times (2021–2024)\n2. **CPU scheduling algorithms** — 3 times (2022–2024)\n3. **Paging with diagram** — 2 times (2022, 2024)\n\nThe deadlock question has appeared in every paper you uploaded.",
    sources: [S.pyq21, S.cpu23, S.pg24],
  },
  "Why is Deadlocks high priority?": {
    text: "Deadlocks is high priority for three reasons:\n\n• It appears in **4 of 4** previous-year papers\n• It has a dedicated module in the syllabus (Module 3)\n• Your notes and Module 3 both cover it in depth, so it's well supported\n\nThe four necessary conditions and Banker's algorithm are the most-asked parts.",
    sources: [S.pyq24, S.mod3, S.pyq22],
  },
  "I have 3 days. What should I study?": {
    text: "Here's a focused 3-day plan:\n\n**Day 1** — Deadlocks, CPU Scheduling\n**Day 2** — Memory Management, Paging\n**Day 3** — File Systems, Synchronization\n\nSpend Day 1 mornings on the repeated questions; practice one scheduling numerical each evening.",
    sources: [S.pyq23, S.cpu24, S.pg22],
  },
  "Show me the evidence.": {
    text: "Here's where the strongest patterns come from. Click any source to see the exact extracted text from your documents.",
    sources: [S.pyq22, S.pyq23, S.pyq24, S.mod3],
  },
};
