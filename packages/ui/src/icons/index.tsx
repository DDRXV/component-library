import { createIcon } from "./icon-base";

// ── AI Model Icons ────────────────────────────────────────────────────────────

export const IconNeuron = createIcon("IconNeuron", <>
  <circle cx="12" cy="12" r="3" />
  <line x1="12" y1="2" x2="12" y2="9" />
  <line x1="12" y1="15" x2="12" y2="22" />
  <line x1="2" y1="12" x2="9" y2="12" />
  <line x1="15" y1="12" x2="22" y2="12" />
  <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
  <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
  <line x1="19.07" y1="4.93" x2="14.83" y2="9.17" />
  <line x1="9.17" y1="14.83" x2="4.93" y2="19.07" />
</>);

export const IconLayer = createIcon("IconLayer", <>
  <rect x="3" y="4" width="18" height="3" rx="1" />
  <rect x="3" y="10.5" width="18" height="3" rx="1" />
  <rect x="3" y="17" width="18" height="3" rx="1" />
</>);

export const IconTransformer = createIcon("IconTransformer", <>
  <rect x="3" y="13" width="8" height="8" rx="1" />
  <rect x="13" y="13" width="8" height="8" rx="1" />
  <rect x="8" y="3" width="8" height="8" rx="1" />
  <line x1="7" y1="17" x2="13" y2="17" />
  <line x1="12" y1="11" x2="12" y2="13" />
</>);

export const IconAttention = createIcon("IconAttention", <>
  <circle cx="12" cy="12" r="2" />
  <path d="M12 10 L8 6 M12 10 L16 6 M12 14 L8 18 M12 14 L16 18" />
  <path d="M10 12 L6 8 M10 12 L6 16 M14 12 L18 8 M14 12 L18 16" />
</>);

export const IconEmbedding = createIcon("IconEmbedding", <>
  <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2" />
  <line x1="3" y1="10" x2="15" y2="10" />
  <line x1="3" y1="14" x2="18" y2="14" />
  <line x1="3" y1="18" x2="12" y2="18" />
  <polyline points="17 3 21 6 17 9" />
</>);

export const IconToken = createIcon("IconToken", <>
  <rect x="3" y="8" width="5" height="8" rx="1" />
  <rect x="9.5" y="8" width="5" height="8" rx="1" />
  <rect x="16" y="8" width="5" height="8" rx="1" />
</>);

export const IconVocabulary = createIcon("IconVocabulary", <>
  <rect x="3" y="3" width="4" height="4" rx="0.5" />
  <rect x="10" y="3" width="4" height="4" rx="0.5" />
  <rect x="17" y="3" width="4" height="4" rx="0.5" />
  <rect x="3" y="10" width="4" height="4" rx="0.5" />
  <rect x="10" y="10" width="4" height="4" rx="0.5" />
  <rect x="17" y="10" width="4" height="4" rx="0.5" />
  <rect x="3" y="17" width="4" height="4" rx="0.5" />
  <rect x="10" y="17" width="4" height="4" rx="0.5" />
  <rect x="17" y="17" width="4" height="4" rx="0.5" />
</>);

export const IconPositionalEncoding = createIcon("IconPositionalEncoding", <>
  <path d="M3 17 Q6 8 9 12 Q12 16 15 7 Q18 2 21 10" strokeWidth="1.5" fill="none" />
  <line x1="3" y1="20" x2="21" y2="20" strokeWidth="1" />
  <circle cx="6" cy="13" r="1.5" fill="currentColor" />
  <circle cx="12" cy="13" r="1.5" fill="currentColor" />
  <circle cx="18" cy="8" r="1.5" fill="currentColor" />
</>);

export const IconEncoderBlock = createIcon("IconEncoderBlock", <>
  <rect x="3" y="3" width="18" height="18" rx="2" />
  <rect x="6" y="6" width="12" height="4" rx="1" />
  <rect x="6" y="12" width="12" height="4" rx="1" />
  <line x1="12" y1="2" x2="12" y2="3" />
  <line x1="12" y1="21" x2="12" y2="22" />
</>);

export const IconDecoderBlock = createIcon("IconDecoderBlock", <>
  <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
  <rect x="6" y="6" width="12" height="3" rx="1" />
  <rect x="6" y="11" width="12" height="3" rx="1" />
  <rect x="6" y="16" width="12" height="3" rx="1" />
  <line x1="12" y1="2" x2="12" y2="3" />
  <line x1="12" y1="21" x2="12" y2="22" />
</>);

export const IconFeedForward = createIcon("IconFeedForward", <>
  <circle cx="5" cy="8" r="2" />
  <circle cx="5" cy="16" r="2" />
  <circle cx="19" cy="8" r="2" />
  <circle cx="19" cy="16" r="2" />
  <line x1="7" y1="8" x2="17" y2="8" />
  <line x1="7" y1="16" x2="17" y2="16" />
  <line x1="7" y1="8" x2="17" y2="16" />
  <line x1="7" y1="16" x2="17" y2="8" />
</>);

export const IconResidualConnection = createIcon("IconResidualConnection", <>
  <line x1="12" y1="3" x2="12" y2="9" />
  <line x1="12" y1="15" x2="12" y2="21" />
  <path d="M12 9 Q18 9 18 12 Q18 15 12 15" fill="none" />
  <circle cx="12" cy="12" r="2.5" />
  <line x1="10" y1="12" x2="9.5" y2="12" />
</>);

export const IconLayerNorm = createIcon("IconLayerNorm", <>
  <path d="M3 12 Q6 6 9 12 Q12 18 15 12 Q18 6 21 12" fill="none" />
  <line x1="3" y1="18" x2="21" y2="18" strokeWidth="0.5" />
  <line x1="3" y1="6" x2="21" y2="6" strokeWidth="0.5" />
</>);

export const IconSoftmax = createIcon("IconSoftmax", <>
  <rect x="3" y="16" width="3" height="5" rx="0.5" fill="currentColor" strokeWidth="0" />
  <rect x="7" y="10" width="3" height="11" rx="0.5" fill="currentColor" strokeWidth="0" />
  <rect x="11" y="4" width="3" height="17" rx="0.5" fill="currentColor" strokeWidth="0" />
  <rect x="15" y="12" width="3" height="9" rx="0.5" fill="currentColor" strokeWidth="0" />
  <rect x="19" y="18" width="3" height="3" rx="0.5" fill="currentColor" strokeWidth="0" />
</>);

export const IconActivation = createIcon("IconActivation", <>
  <polyline points="3 17 10 17 14 7 21 7" strokeWidth="2" />
  <line x1="3" y1="21" x2="21" y2="21" strokeWidth="0.5" />
  <line x1="3" y1="3" x2="3" y2="21" strokeWidth="0.5" />
</>);

// ── Process Icons ─────────────────────────────────────────────────────────────

export const IconTraining = createIcon("IconTraining", <>
  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  <polyline points="21 3 21 9 15 9" />
  <circle cx="12" cy="12" r="3" />
</>);

export const IconInference = createIcon("IconInference", <>
  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" strokeWidth="0" />
</>);

export const IconFineTuning = createIcon("IconFineTuning", <>
  <rect x="3" y="8" width="18" height="10" rx="2" />
  <path d="M14.7 3.3 L20.7 9.3" />
  <path d="M12 3 L18 3 L18 9" fill="none" />
  <line x1="7" y1="13" x2="11" y2="13" />
  <line x1="13" y1="13" x2="17" y2="13" />
</>);

export const IconRAG = createIcon("IconRAG", <>
  <rect x="2" y="3" width="7" height="9" rx="1" />
  <line x1="4" y1="6" x2="7" y2="6" />
  <line x1="4" y1="9" x2="7" y2="9" />
  <circle cx="17" cy="8" r="4" />
  <circle cx="17" cy="8" r="1.5" />
  <path d="M9 8 L13 8" />
  <line x1="19" y1="16" x2="22" y2="19" />
  <path d="M10 15 Q14 15 17 15" />
  <polyline points="15 13 17 15 15 17" />
</>);

export const IconAgent = createIcon("IconAgent", <>
  <circle cx="12" cy="8" r="4" />
  <line x1="12" y1="12" x2="12" y2="16" />
  <line x1="12" y1="16" x2="8" y2="20" />
  <line x1="12" y1="16" x2="16" y2="20" />
  <line x1="8" y1="11" x2="12" y2="13" />
  <line x1="16" y1="11" x2="12" y2="13" />
  <circle cx="9" cy="7" r="0.5" fill="currentColor" />
  <circle cx="15" cy="7" r="0.5" fill="currentColor" />
</>);

export const IconTool = createIcon("IconTool", <>
  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
</>);

export const IconMemory = createIcon("IconMemory", <>
  <path d="M12 2a8 8 0 0 1 8 8c0 3-1.5 5.5-4 7v3H8v-3c-2.5-1.5-4-4-4-7a8 8 0 0 1 8-8z" />
  <line x1="9" y1="17" x2="15" y2="17" />
  <line x1="9" y1="20" x2="15" y2="20" />
  <line x1="9" y1="9" x2="9" y2="13" />
  <line x1="12" y1="8" x2="12" y2="13" />
  <line x1="15" y1="9" x2="15" y2="13" />
</>);

export const IconPrompt = createIcon("IconPrompt", <>
  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  <line x1="8" y1="9" x2="16" y2="9" />
  <line x1="8" y1="13" x2="12" y2="13" />
</>);

export const IconChain = createIcon("IconChain", <>
  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
</>);

export const IconBackprop = createIcon("IconBackprop", <>
  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  <polyline points="21 3 21 9 15 9" transform="scale(-1,1) translate(-24,0)" />
  <line x1="7" y1="12" x2="17" y2="12" />
  <polyline points="11 8 7 12 11 16" />
</>);

// ── Data Icons ────────────────────────────────────────────────────────────────

export const IconDataset = createIcon("IconDataset", <>
  <rect x="3" y="15" width="18" height="6" rx="1" />
  <rect x="3" y="9" width="18" height="5" rx="1" />
  <rect x="3" y="3" width="18" height="5" rx="1" />
</>);

export const IconBatch = createIcon("IconBatch", <>
  <rect x="3" y="14" width="12" height="7" rx="1" />
  <rect x="5" y="11" width="12" height="7" rx="1" strokeDasharray="3 2" />
  <rect x="7" y="8" width="12" height="7" rx="1" strokeDasharray="3 2" strokeOpacity="0.5" />
</>);

export const IconEpoch = createIcon("IconEpoch", <>
  <circle cx="12" cy="12" r="9" />
  <polyline points="12 6 12 12 16 14" />
  <path d="M16.5 3.5 Q20 8 20 12" strokeDasharray="2 2" />
</>);

export const IconAugmentation = createIcon("IconAugmentation", <>
  <rect x="3" y="3" width="8" height="8" rx="1" />
  <rect x="13" y="3" width="8" height="8" rx="1" strokeDasharray="2 1.5" />
  <rect x="3" y="13" width="8" height="8" rx="1" strokeDasharray="2 1.5" />
  <line x1="11" y1="7" x2="13" y2="7" />
  <line x1="7" y1="11" x2="7" y2="13" />
</>);

export const IconPreprocessing = createIcon("IconPreprocessing", <>
  <path d="M22 3H2l8 9.46V19l4 2V12.46L22 3z" />
</>);

export const IconLabeling = createIcon("IconLabeling", <>
  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
  <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="2" />
</>);

export const IconSplit = createIcon("IconSplit", <>
  <line x1="12" y1="3" x2="12" y2="10" />
  <path d="M12 10 L6 17" />
  <path d="M12 10 L18 17" />
  <rect x="3" y="17" width="6" height="4" rx="1" />
  <rect x="9.5" y="17" width="5" height="4" rx="1" />
  <rect x="16" y="17" width="5" height="4" rx="1" />
</>);

export const IconFeature = createIcon("IconFeature", <>
  <rect x="3" y="3" width="18" height="18" rx="1" />
  <line x1="3" y1="8" x2="21" y2="8" />
  <line x1="8" y1="3" x2="8" y2="21" />
  <rect x="8" y="8" width="5" height="5" fill="currentColor" fillOpacity="0.3" strokeWidth="0" />
  <rect x="8" y="13" width="5" height="5" fill="currentColor" fillOpacity="0.15" strokeWidth="0" />
</>);

// ── Infrastructure Icons ──────────────────────────────────────────────────────

export const IconGPU = createIcon("IconGPU", <>
  <rect x="2" y="6" width="20" height="12" rx="2" />
  <rect x="5" y="9" width="3" height="6" rx="0.5" />
  <rect x="9.5" y="9" width="3" height="6" rx="0.5" />
  <rect x="14" y="9" width="3" height="6" rx="0.5" />
  <line x1="6" y1="3" x2="6" y2="6" />
  <line x1="10" y1="3" x2="10" y2="6" />
  <line x1="14" y1="3" x2="14" y2="6" />
  <line x1="18" y1="3" x2="18" y2="6" />
  <line x1="6" y1="18" x2="6" y2="21" />
  <line x1="10" y1="18" x2="10" y2="21" />
  <line x1="14" y1="18" x2="14" y2="21" />
  <line x1="18" y1="18" x2="18" y2="21" />
</>);

export const IconCPU = createIcon("IconCPU", <>
  <rect x="4" y="4" width="16" height="16" rx="2" />
  <rect x="7" y="7" width="10" height="10" rx="1" />
  <line x1="9" y1="2" x2="9" y2="4" />
  <line x1="12" y1="2" x2="12" y2="4" />
  <line x1="15" y1="2" x2="15" y2="4" />
  <line x1="9" y1="20" x2="9" y2="22" />
  <line x1="12" y1="20" x2="12" y2="22" />
  <line x1="15" y1="20" x2="15" y2="22" />
  <line x1="2" y1="9" x2="4" y2="9" />
  <line x1="2" y1="12" x2="4" y2="12" />
  <line x1="2" y1="15" x2="4" y2="15" />
  <line x1="20" y1="9" x2="22" y2="9" />
  <line x1="20" y1="12" x2="22" y2="12" />
  <line x1="20" y1="15" x2="22" y2="15" />
</>);

export const IconTPU = createIcon("IconTPU", <>
  <rect x="4" y="4" width="16" height="16" rx="2" />
  <path d="M8 8 L16 8 L16 16 L8 16 Z" fill="none" />
  <circle cx="12" cy="12" r="3" />
  <line x1="9" y1="2" x2="9" y2="4" />
  <line x1="15" y1="2" x2="15" y2="4" />
  <line x1="9" y1="20" x2="9" y2="22" />
  <line x1="15" y1="20" x2="15" y2="22" />
</>);

export const IconVRAM = createIcon("IconVRAM", <>
  <rect x="2" y="7" width="20" height="10" rx="1" />
  <rect x="5" y="10" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.4" strokeWidth="0" />
  <rect x="10" y="10" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.6" strokeWidth="0" />
  <rect x="15" y="10" width="2" height="4" rx="0.5" fill="currentColor" fillOpacity="0.2" strokeWidth="0" />
  <line x1="2" y1="17" x2="22" y2="17" />
</>);

export const IconDistributed = createIcon("IconDistributed", <>
  <circle cx="12" cy="5" r="2" />
  <circle cx="5" cy="19" r="2" />
  <circle cx="19" cy="19" r="2" />
  <line x1="12" y1="7" x2="6.5" y2="17" />
  <line x1="12" y1="7" x2="17.5" y2="17" />
  <line x1="7" y1="19" x2="17" y2="19" />
</>);

export const IconCheckpoint = createIcon("IconCheckpoint", <>
  <line x1="12" y1="3" x2="12" y2="21" />
  <circle cx="12" cy="12" r="4" />
  <polyline points="9 12 11 14 15 10" />
  <line x1="3" y1="3" x2="3" y2="10" />
  <path d="M3 3 L8 3 L8 6.5 L3 10 Z" fill="currentColor" fillOpacity="0.5" strokeWidth="0" />
</>);

export const IconAPI = createIcon("IconAPI", <>
  <rect x="3" y="8" width="18" height="8" rx="2" />
  <line x1="7" y1="12" x2="9" y2="12" />
  <line x1="11" y1="12" x2="13" y2="12" />
  <line x1="15" y1="12" x2="17" y2="12" />
  <path d="M7 5 L7 8 M12 4 L12 8 M17 5 L17 8" />
</>);

export const IconCloud = createIcon("IconCloud", <>
  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
</>);

// ── Metric Icons ──────────────────────────────────────────────────────────────

export const IconAccuracy = createIcon("IconAccuracy", <>
  <circle cx="12" cy="12" r="9" />
  <circle cx="12" cy="12" r="5" />
  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  <line x1="12" y1="3" x2="12" y2="5" strokeWidth="2" />
</>);

export const IconLoss = createIcon("IconLoss", <>
  <polyline points="3 6 8 14 13 10 18 16 21 12" strokeWidth="2" />
  <line x1="3" y1="21" x2="21" y2="21" strokeWidth="0.5" />
  <line x1="3" y1="3" x2="3" y2="21" strokeWidth="0.5" />
</>);

export const IconF1Score = createIcon("IconF1Score", <>
  <circle cx="9" cy="12" r="6" />
  <circle cx="15" cy="12" r="6" />
</>);

export const IconPrecision = createIcon("IconPrecision", <>
  <circle cx="12" cy="12" r="9" />
  <line x1="12" y1="3" x2="12" y2="12" strokeWidth="2.5" />
  <circle cx="12" cy="12" r="2" fill="currentColor" />
</>);

export const IconRecall = createIcon("IconRecall", <>
  <circle cx="12" cy="12" r="5" strokeDasharray="2 1.5" />
  <circle cx="12" cy="12" r="9" />
  <circle cx="12" cy="9" r="1" fill="currentColor" />
  <circle cx="15.6" cy="14" r="1" fill="currentColor" />
  <circle cx="8.4" cy="14" r="1" fill="currentColor" />
</>);

export const IconPerplexity = createIcon("IconPerplexity", <>
  <circle cx="12" cy="12" r="9" />
  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
  <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
</>);
