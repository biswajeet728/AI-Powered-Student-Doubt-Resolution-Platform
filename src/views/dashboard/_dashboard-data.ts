export interface Doubt {
  id: string;
  title: string;
  body: string;
  subject: string;
  tags: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  createdAt: string;
  createdAtDate: Date;
  aiResponseId: string | null;
  aiAnswer: string | null;
  aiApproved: boolean;
  studentName: string;
}

export interface Tag {
  label: string;
  count: number;
}

export interface Subject {
  name: string;
  count: number;
  pending: number;
}

export const DUMMY_DOUBTS: Doubt[] = [
  {
    id: "1",
    title: "Why does water expand when it freezes?",
    body: "I understand that most liquids contract when cooled, but water seems to do the opposite. Can someone explain the molecular reason behind this?",
    subject: "Physics",
    tags: ["thermodynamics", "molecules"],
    difficulty: "EASY",
    status: "RESOLVED",
    createdAt: "2 days ago",
    createdAtDate: new Date(),
    aiResponseId: "resp-1",
    aiAnswer:
      "Water molecules form a hexagonal lattice structure in ice due to hydrogen bonding, which actually takes up more space than the disordered arrangement in liquid water...",
    aiApproved: true,
    studentName: "Rohan Mehta",
  },
  {
    id: "2",
    title: "Explain dynamic programming with memoization",
    body: "I keep confusing top-down and bottom-up approaches. When should I use memoization vs tabulation?",
    subject: "Computer Science",
    tags: ["algorithms", "dp"],
    difficulty: "HARD",
    status: "UNDER_REVIEW",
    createdAt: "1 day ago",
    createdAtDate: new Date(),
    aiResponseId: "resp-2",
    aiAnswer:
      "Memoization is a top-down approach where you cache results of expensive recursive calls. In contrast, tabulation builds the solution from smaller sub-problems...",
    aiApproved: false,
    studentName: "Ananya Shah",
  },
  {
    id: "3",
    title: "Difference between mitosis and meiosis?",
    body: "Both involve cell division but I keep mixing them up in exams. What are the key differences?",
    subject: "Biology",
    tags: ["cell-division", "genetics"],
    difficulty: "MEDIUM",
    status: "OPEN",
    createdAt: "3 hours ago",
    createdAtDate: new Date(),
    aiResponseId: null,
    aiAnswer: null,
    aiApproved: false,
    studentName: "Preet Kapoor",
  },
  {
    id: "4",
    title: "What is Rayleigh scattering and why is the sky blue?",
    body: "My teacher mentioned this but did not explain it clearly. How does light scattering make the sky appear blue?",
    subject: "Physics",
    tags: ["optics", "light"],
    difficulty: "MEDIUM",
    status: "OPEN",
    createdAt: "5 hours ago",
    createdAtDate: new Date(),
    aiResponseId: null,
    aiAnswer: null,
    aiApproved: false,
    studentName: "Rohan Mehta",
  },
];

export const DUMMY_TAGS: Tag[] = [
  { label: "algorithms", count: 8 },
  { label: "thermodynamics", count: 5 },
  { label: "cell-division", count: 4 },
  { label: "optics", count: 6 },
  { label: "genetics", count: 3 },
  { label: "dp", count: 7 },
  { label: "molecules", count: 4 },
  { label: "light", count: 5 },
];

export const DUMMY_SUBJECTS: Subject[] = [
  { name: "Physics", count: 11, pending: 3 },
  { name: "Computer Science", count: 9, pending: 2 },
  { name: "Chemistry", count: 7, pending: 1 },
  { name: "Biology", count: 5, pending: 1 },
  { name: "Mathematics", count: 4, pending: 0 },
];
