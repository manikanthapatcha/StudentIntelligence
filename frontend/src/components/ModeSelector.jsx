import React from "react";
import {
  Lightbulb,
  Terminal,
  GraduationCap,
  Briefcase,
  ListOrdered,
  HelpCircle,
  FileText
} from "lucide-react";

export const MODES = [
  {
    id: "Explain Simply",
    label: "Explain Simply",
    icon: Lightbulb,
    desc: "Intuitive analogies & beginner-friendly breakdown"
  },
  {
    id: "Technical Explanation",
    label: "Technical",
    icon: Terminal,
    desc: "Rigorous CS architecture, tradeoffs & internals"
  },
  {
    id: "Exam Answer",
    label: "Exam Answer",
    icon: GraduationCap,
    desc: "University exam formats calibrated by marks"
  },
  {
    id: "Interview Mode",
    label: "Interview",
    icon: Briefcase,
    desc: "Mock technical interview & critique"
  },
  {
    id: "MCQ Generator",
    label: "MCQ Generator",
    icon: ListOrdered,
    desc: "4-option test questions with hidden explanations"
  },
  {
    id: "Quiz Mode",
    label: "Quiz Mode",
    icon: HelpCircle,
    desc: "Interactive 1-on-1 Q&A knowledge assessment"
  },
  {
    id: "Summarizer",
    label: "Summarize",
    icon: FileText,
    desc: "Synthesize dense topics into revision notes"
  }
];

export function ModeSelector({
  selectedMode,
  onSelectMode,
  examMarks,
  onSelectExamMarks,
  summaryType,
  onSelectSummaryType
}) {
  return (
    <div className="mode-selector-wrapper">
      <div className="mode-selector-tabs">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              className={`mode-btn ${isActive ? "active" : ""}`}
              onClick={() => onSelectMode(mode.id)}
              title={mode.desc}
            >
              <Icon size={16} className="mode-btn-icon" />
              <span className="mode-btn-label">{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-selector for Exam Answer Marks */}
      {selectedMode === "Exam Answer" && (
        <div className="sub-settings-bar">
          <span className="sub-setting-title">Target Question Marks:</span>
          <div className="sub-setting-pills">
            {["2", "5", "10"].map((marks) => (
              <button
                key={marks}
                type="button"
                className={`sub-pill ${examMarks === marks ? "active" : ""}`}
                onClick={() => onSelectExamMarks(marks)}
              >
                {marks} Marks
              </button>
            ))}
          </div>
          <span className="sub-setting-hint">
            {examMarks === "2"
              ? "Short definition + 2 key bullets"
              : examMarks === "5"
              ? "Definition, working, components & example"
              : "Comprehensive structure: architecture, working, advantages, tradeoffs & code"}
          </span>
        </div>
      )}

      {/* Sub-selector for Summarizer Options */}
      {selectedMode === "Summarizer" && (
        <div className="sub-settings-bar">
          <span className="sub-setting-title">Summary Format:</span>
          <div className="sub-setting-pills">
            {["Short summary", "Detailed summary", "Exam revision notes", "Key points"].map((type) => (
              <button
                key={type}
                type="button"
                className={`sub-pill ${summaryType === type ? "active" : ""}`}
                onClick={() => onSelectSummaryType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ModeSelector;
