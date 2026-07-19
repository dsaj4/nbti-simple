import type { ResultIdentity } from "../../contracts/report-view-model";

export type IdentityDefinition = ResultIdentity & {
  headline: string;
  scene: string;
  actions: { title: string; description: string }[];
};

export const identityMap: Record<string, IdentityDefinition> = {
  deconstructor: {
    code: "DECONSTRUCTOR",
    label: "拆题者",
    englishLabel: "Deconstructor",
    subtitle: "先把混在一起的问题分开",
    headline:
      "在这组复杂情境里，你更常先把纠缠在一起的问题拆成可分别处理的部分。",
    scene:
      "你不急着下结论，而是先把现场拆成更小、更清晰的判断单元，再逐一处理。",
    actions: [
      {
        title: "拆分边界",
        description: "把模糊目标拆成可独立验证的子目标。",
      },
      {
        title: "逐项核对",
        description: "在矛盾信息里找出需要分别核对的部分。",
      },
      {
        title: "建立结构",
        description: "用分类和边界让复杂现场变得可讨论。",
      },
    ],
  },
  connector: {
    code: "CONNECTOR",
    label: "连线者",
    englishLabel: "Connector",
    subtitle: "先寻找分散信息之间的连接",
    headline:
      "在这组复杂情境里，你更常先在看起来无关的信息之间找到联系。",
    scene:
      "你倾向于把碎片拼成一幅更大的图，从关联中读出新的可能性。",
    actions: [
      {
        title: "寻找关联",
        description: "在不同目标或想法之间寻找隐藏关联。",
      },
      {
        title: "编织框架",
        description: "用一个框架把分散线索串起来。",
      },
      {
        title: "迁移类比",
        description: "从一种场景联想到另一种场景的相似结构。",
      },
    ],
  },
  calibrator: {
    code: "CALIBRATOR",
    label: "校准者",
    englishLabel: "Calibrator",
    subtitle: "先确认判断能否被依据支撑",
    headline:
      "在这组复杂情境里，你更常先问：这条判断有没有可靠的依据？",
    scene:
      "你会先检查证据、数据和前提，让结论站得住脚，再推进。",
    actions: [
      {
        title: "寻找证据",
        description: "优先寻找可验证的事实和数据。",
      },
      {
        title: "交叉核对",
        description: "对矛盾证据进行交叉验证。",
      },
      {
        title: "梳理前提",
        description: "把结论和前提之间的关系摆清楚。",
      },
    ],
  },
  "context-reader": {
    code: "CONTEXT-READER",
    label: "读场者",
    englishLabel: "Context Reader",
    subtitle: "先理解规则落入现场后的变化",
    headline:
      "在这组复杂情境里，你更常先理解现场条件、关系和具体处境。",
    scene:
      "你认为同样的规则在不同现场会有不同结果，所以先读清处境再判断。",
    actions: [
      {
        title: "倾听处境",
        description: "先了解当事人的真实处境和顾虑。",
      },
      {
        title: "读取张力",
        description: "关注规则背后的意图和现场张力。",
      },
      {
        title: "识别约束",
        description: "从具体场景里读出隐含的约束条件。",
      },
    ],
  },
  anchor: {
    code: "ANCHOR",
    label: "定锚者",
    englishLabel: "Anchor",
    subtitle: "先形成一个能让事情继续的落点",
    headline:
      "在这组复杂情境里，你更常先建立一个可执行的落点，让团队能继续推进。",
    scene:
      "你倾向于先给出方向或结论，把讨论转成行动，再在实践中修正。",
    actions: [
      {
        title: "设定临时标准",
        description: "先定一个临时标准让讨论落地。",
      },
      {
        title: "做出可逆决定",
        description: "在信息不完整时做出可逆的初步决定。",
      },
      {
        title: "带动推进",
        description: "用明确立场带动团队继续行动。",
      },
    ],
  },
  explorer: {
    code: "EXPLORER",
    label: "探路者",
    englishLabel: "Explorer",
    subtitle: "先用可逆的小步行动换取信息",
    headline:
      "在这组复杂情境里，你更常用可逆的小步行动验证方向，再决定是否加码。",
    scene:
      "你不依赖一次性想清所有问题，而是先用小实验换取下一条线索。",
    actions: [
      {
        title: "最小验证",
        description: "用最小可行动作测试关键假设。",
      },
      {
        title: "小步探路",
        description: "在多个方向中先走一小步。",
      },
      {
        title: "快速调整",
        description: "根据反馈快速调整下一步。",
      },
    ],
  },
  overlooker: {
    code: "OVERLOOKER",
    label: "望塔者",
    englishLabel: "Overlooker",
    subtitle: "先拉远看系统与长期后果",
    headline:
      "在这组复杂情境里，你更常先退后一步，看整体系统和长期影响。",
    scene:
      "你习惯把眼前的事放到更大的图景里，评估它对整体路径的意义。",
    actions: [
      {
        title: "评估长期影响",
        description: "评估决策对整体目标的长期影响。",
      },
      {
        title: "保持系统视角",
        description: "在细节和系统之间保持张力。",
      },
      {
        title: "看清全局后果",
        description: "优先看清不同选择的全局后果。",
      },
    ],
  },
  present: {
    code: "PRESENT",
    label: "在场者",
    englishLabel: "Present",
    subtitle: "先看见眼前具体的人与体验",
    headline:
      "在这组复杂情境里，你更常先关注眼前具体的人、感受和体验。",
    scene:
      "你认为再宏大的判断也要落到具体的人身上，所以先倾听和观察现场。",
    actions: [
      {
        title: "关注具体的人",
        description: "先了解具体的人会受到什么影响。",
      },
      {
        title: "读取现场反馈",
        description: "关注现场情绪和真实反馈。",
      },
      {
        title: "体验先行",
        description: "从近处体验里读取关键信息。",
      },
    ],
  },
  "multi-path": {
    code: "MULTI-PATH",
    label: "多路者",
    englishLabel: "Multi-Path",
    subtitle: "现场不同，起手方式也会切换",
    headline:
      "在这组复杂情境里，没有一种起手方式反复占据主导；你会随约束在不同策略间切换。",
    scene:
      "这不是一种固定类型，只说明在这 12 道题里，你的处理方式比较分散。",
    actions: [
      {
        title: "起手分散",
        description: "在这 12 道题中，没有一种方式反复占据主导。",
      },
      {
        title: "按题变化",
        description: "不同题目的约束，触发了不同的处理方式。",
      },
      {
        title: "仅限本组",
        description: "这只描述本组选择，不代表稳定或更好的特质。",
      },
    ],
  },
};

export const identityByDimension: Record<
  "organization" | "calibration" | "momentum" | "scope",
  { negative: string; positive: string }
> = {
  organization: { negative: "deconstructor", positive: "connector" },
  calibration: { negative: "calibrator", positive: "context-reader" },
  momentum: { negative: "anchor", positive: "explorer" },
  scope: { negative: "overlooker", positive: "present" },
};
