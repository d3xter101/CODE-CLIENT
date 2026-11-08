// Majors offered at FST Settat, grouped by program (same list as the registration form)
export const MAJOR_GROUPS: { heading: string; majors: string[] }[] = [
  { heading: "TC", majors: ["GI", "GESE", "GC", "GMSI", "GB", "MSD"].map((m) => `TC ${m}`) },
  { heading: "FI", majors: ["GI", "IBIM", "ISESE", "ICP", "PIC"].map((m) => `FI ${m}`) },
  {
    heading: "LST",
    majors: ["GI", "SITD", "GESA", "EEA", "CAE", "GC", "MECAT", "SB", "BGM", "TACQ", "GM"].map((m) => `LST ${m}`),
  },
  {
    heading: "MST",
    majors: ["AGQ", "BI", "ICSM", "IMI", "ATSII", "VMIB", "IRISTI", "PVRM", "RSI", "MECA", "MA"].map((m) => `MST ${m}`),
  },
  { heading: "Other", majors: ["Other"] },
];
