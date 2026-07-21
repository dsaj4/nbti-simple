import type { DimensionKey } from "../../contracts/score-result";
import type { ReportRole } from "../../contracts/report-view-model";

export const reportRoleIds = [
  "wall-breaker",
  "watchdog",
  "stress-tester",
  "cyber-adjudicator",
  "iteration-engine",
  "fixed-bearing",
  "signal-clarifier",
  "specialist",
  "imprint-system",
  "rooted-systems-reader",
  "probability-navigator",
  "noise-sweeper",
  "multi-path",
] as const;

export type ReportRoleId = (typeof reportRoleIds)[number];

type ReportRoleDefinition = ReportRole & {
  primaryDimension: DimensionKey;
  primarySign: -1 | 1;
};

export const reportRoleMap: Record<ReportRoleId, ReportRoleDefinition> = {
  "wall-breaker": {
    id: "wall-breaker",
    label: "破壁人",
    englishLabel: "FRAME BREAKER",
    subtitle: "先检查问题的边界",
    headline: "你常先问：问题真的是这样定义的吗？",
    scene: "在这组复杂情境里，你更常先识别默认前提和问题边界；当框架本身限制判断时，再尝试换一个入口。",
    actions: [
      { title: "找出默认前提", description: "先标出当前问题把哪些条件当成了理所当然。" },
      { title: "重写问题边界", description: "检查有没有另一种更贴近现场的提问方式。" },
      { title: "换入口验证", description: "从新的切口做一个可回退的小验证。" },
    ],
    assetSrc: "/assets/report-roles/wall-breaker.webp",
    primaryDimension: "organization",
    primarySign: 1,
  },
  watchdog: {
    id: "watchdog",
    label: "看门狗",
    englishLabel: "WATCHDOG",
    subtitle: "先验入口",
    headline: "你常先检查：这条信息从哪里来，哪里可能失真？",
    scene: "在这组复杂情境里，你更常先核对来源、条件与异常点，再决定哪些信息值得进入判断。这里借用的是守住信息入口，不表示多疑或监视他人。",
    actions: [
      { title: "核对来源", description: "确认信息来自哪里、经过了哪些转述或处理。" },
      { title: "标出异常", description: "先找时间范围、样本条件和口径里的可疑点。" },
      { title: "再放行判断", description: "通过基本核验后，再把信息用于下一步决定。" },
    ],
    assetSrc: "/assets/report-roles/watchdog.webp",
    primaryDimension: "calibration",
    primarySign: -1,
  },
  "stress-tester": {
    id: "stress-tester",
    label: "杠精",
    englishLabel: "STRESS TESTER",
    subtitle: "先找反例",
    headline: "你常先问：如果反过来，这个说法还成立吗？",
    scene: "在这组复杂情境里，你更常用反例、边界条件和追问给观点做压力测试。这里取的是先挑薄弱处验证的动作，不表示为了反对而反对。",
    actions: [
      { title: "找一个反例", description: "先寻找足以动摇当前结论的例外情况。" },
      { title: "追问边界", description: "确认这个说法在什么条件下成立、何时不成立。" },
      { title: "补上论证", description: "把经不起追问的连接补齐，而不是停在反驳。" },
    ],
    assetSrc: "/assets/report-roles/stress-tester.webp",
    primaryDimension: "organization",
    primarySign: -1,
  },
  "cyber-adjudicator": {
    id: "cyber-adjudicator",
    label: "赛博判官",
    englishLabel: "CYBER ADJUDICATOR",
    subtitle: "同尺裁量",
    headline: "你常先把双方材料放到同一把尺子上。",
    scene: "在这组复杂情境里，你更常先拆开事实、规则和条件，再用一致标准作判断。这个称呼借用网络大众评审的意象，不表示你有权审判别人。",
    actions: [
      { title: "摆全材料", description: "先区分双方主张、事实与尚未确认的信息。" },
      { title: "对齐规则", description: "让不同方案接受同一组判断标准。" },
      { title: "暂缓裁决", description: "关键条件缺失时，先保留结论并继续核验。" },
    ],
    assetSrc: "/assets/report-roles/cyber-adjudicator.webp",
    primaryDimension: "calibration",
    primarySign: -1,
  },
  "iteration-engine": {
    id: "iteration-engine",
    label: "卷王",
    englishLabel: "ITERATION ENGINE",
    subtitle: "高频迭代",
    headline: "你常先把目标拆成一轮又一轮可推进的动作。",
    scene: "在这组复杂情境里，你更常用高频投入、反馈和修订推动结果。这个称呼只描述推进节奏，不赞美过劳，也不代表表现优于他人。",
    actions: [
      { title: "快速起步", description: "先做出可以获得反馈的第一版。" },
      { title: "连续修订", description: "根据现场反馈持续缩小方案与目标的距离。" },
      { title: "检查投入产出", description: "在每一轮之间确认继续加码是否仍然值得。" },
    ],
    assetSrc: "/assets/report-roles/iteration-engine.webp",
    primaryDimension: "momentum",
    primarySign: 1,
  },
  "fixed-bearing": {
    id: "fixed-bearing",
    label: "头铁",
    englishLabel: "FIXED BEARING",
    subtitle: "持续定向",
    headline: "选定方向后，你通常会先顶住噪声，再看是否需要校正。",
    scene: "在这组复杂情境里，你更常在阻力出现时维持已选方向，不会因一次波动立刻改道。这里描述的是持续性，不表示拒绝证据或一意孤行。",
    actions: [
      { title: "守住方向", description: "短期阻力出现时，先维持已经建立的行动基线。" },
      { title: "区分噪声", description: "判断变化是暂时波动，还是足以改变方向的新证据。" },
      { title: "到节点复盘", description: "在预先约定的节点重新检查方向是否仍然成立。" },
    ],
    assetSrc: "/assets/report-roles/fixed-bearing.webp",
    primaryDimension: "momentum",
    primarySign: -1,
  },
  "signal-clarifier": {
    id: "signal-clarifier",
    label: "人间清醒",
    englishLabel: "SIGNAL CLARIFIER",
    subtitle: "先降噪",
    headline: "你常先把事实、气氛和期待分开看。",
    scene: "在这组复杂情境里，你更常先过滤情绪与群体气氛，再回到事实、限制和自己的位置。这个称呼不表示你更理性或总能看透真相。",
    actions: [
      { title: "分开事实与气氛", description: "把已经发生的事与现场情绪分别记录。" },
      { title: "找到现实限制", description: "确认时间、资源和责任边界到底在哪里。" },
      { title: "保留修正空间", description: "形成当前判断，同时允许新信息改变它。" },
    ],
    assetSrc: "/assets/report-roles/signal-clarifier.webp",
    primaryDimension: "scope",
    primarySign: 1,
  },
  specialist: {
    id: "specialist",
    label: "绝活哥",
    englishLabel: "SPECIALIST",
    subtitle: "先调用熟练手法",
    headline: "你常先从自己反复验证过的处理手法切入。",
    scene: "在这组复杂情境里，你有时会先调用一套熟悉、具体的方法处理关键部分；它只描述起手动作，不表示全能或更专业。",
    actions: [
      { title: "调用熟练手法", description: "先用一套反复实践过的方法处理关键部分。" },
      { title: "缩小适用范围", description: "确认这套手法真正擅长解决的是哪类问题。" },
      { title: "检查是否失配", description: "现场条件变化时，不让熟练变成机械套用。" },
    ],
    assetSrc: "/assets/report-roles/specialist.webp",
    primaryDimension: "organization",
    primarySign: -1,
  },
  "imprint-system": {
    id: "imprint-system",
    label: "思想钢印",
    englishLabel: "IMPRINT SYSTEM",
    subtitle: "先套用稳定模板",
    headline: "你常先用一套稳定框架处理新的输入。",
    scene: "在这组复杂情境里，你有时会先调用反复使用的判断模板，并检查它是否仍适配当前现场。",
    actions: [
      { title: "调用判断模板", description: "先用稳定框架整理当前输入。" },
      { title: "检查适用条件", description: "确认这套模板的前提在现场仍然成立。" },
      { title: "允许重新制版", description: "新信息不再适配时，及时修改原有框架。" },
    ],
    assetSrc: "/assets/report-roles/imprint-system.webp",
    primaryDimension: "momentum",
    primarySign: -1,
  },
  "rooted-systems-reader": {
    id: "rooted-systems-reader",
    label: "树人",
    englishLabel: "ROOTED SYSTEMS READER",
    subtitle: "先看长期根系",
    headline: "你常先把眼前选择放进更长的时间尺度。",
    scene: "这是 NBTI 的原创隐喻：在这组复杂情境里，你有时会先观察短期动作如何影响更大的系统和长期路径。",
    actions: [
      { title: "查看根因", description: "先追溯眼前问题与长期结构之间的连接。" },
      { title: "观察分支", description: "比较当前动作会把后续路径带向哪里。" },
      { title: "保留生长空间", description: "避免为了短期整齐锁死未来调整的可能。" },
    ],
    assetSrc: "/assets/report-roles/rooted-systems-reader.webp",
    primaryDimension: "scope",
    primarySign: -1,
  },
  "probability-navigator": {
    id: "probability-navigator",
    label: "赌神",
    englishLabel: "PROBABILITY NAVIGATOR",
    subtitle: "先算风险与退出条件",
    headline: "你常先比较可能性、损失边界和可撤回路线。",
    scene: "在这组复杂情境里，你有时会在信息不完整时比较概率与退出条件。这个称呼不鼓励赌博，也不表示总能押中。",
    actions: [
      { title: "估计可能性", description: "先比较不同结果发生的相对可能性。" },
      { title: "划出损失边界", description: "确认最坏结果是否仍在可承受范围。" },
      { title: "保留退出路线", description: "优先选择可以止损、撤回或调整的动作。" },
    ],
    assetSrc: "/assets/report-roles/probability-navigator.webp",
    primaryDimension: "momentum",
    primarySign: 1,
  },
  "noise-sweeper": {
    id: "noise-sweeper",
    label: "扫地僧",
    englishLabel: "NOISE SWEEPER",
    subtitle: "先移除无效噪声",
    headline: "你常先清掉重复信息，让关键结构显现。",
    scene: "在这组复杂情境里，你有时会先移除重复、无效和干扰性的内容。这个称呼不表示深藏不露的高手。",
    actions: [
      { title: "移除重复", description: "先清掉没有增加新信息的内容。" },
      { title: "降低噪声", description: "把情绪、口号和关键事实分开。" },
      { title: "露出主线", description: "让真正影响判断的结构重新可见。" },
    ],
    assetSrc: "/assets/report-roles/noise-sweeper.webp",
    primaryDimension: "calibration",
    primarySign: -1,
  },
  "multi-path": {
    id: "multi-path",
    label: "多路者",
    englishLabel: "MULTI-PATH",
    subtitle: "这组现场里没有单一路径占主导",
    headline: "这组题里，你没有反复使用同一种起手方式。",
    scene: "这只描述本组情境中的答案分布：不同题目的约束触发了不同处理方式，不代表更均衡、更优秀或更稳定。",
    actions: [
      { title: "起手分散", description: "不同场景触发了不同的处理方式。" },
      { title: "按题变化", description: "你会随着现场约束切换判断入口。" },
      { title: "仅限本组", description: "换一组情境，结果可能会不同。" },
    ],
    primaryDimension: "organization",
    primarySign: 1,
  },
};

type RoleSelector =
  | ReportRoleId
  | {
      dimension: DimensionKey;
      negative: ReportRoleId;
      zero: ReportRoleId;
      positive: ReportRoleId;
    };

// Presentation roles refine, but never replace, the canonical v1 scoring ID.
// Each directional result uses one secondary dimension to choose a visible role.
const roleSelectorByIdentity: Record<string, RoleSelector> = {
  deconstructor: {
    dimension: "momentum",
    negative: "stress-tester",
    zero: "stress-tester",
    positive: "stress-tester",
  },
  connector: {
    dimension: "calibration",
    negative: "cyber-adjudicator",
    zero: "cyber-adjudicator",
    positive: "cyber-adjudicator",
  },
  calibrator: {
    dimension: "scope",
    negative: "watchdog",
    zero: "watchdog",
    positive: "noise-sweeper",
  },
  "context-reader": {
    dimension: "organization",
    negative: "wall-breaker",
    zero: "signal-clarifier",
    positive: "signal-clarifier",
  },
  anchor: {
    dimension: "calibration",
    negative: "imprint-system",
    zero: "fixed-bearing",
    positive: "fixed-bearing",
  },
  explorer: {
    dimension: "scope",
    negative: "probability-navigator",
    zero: "iteration-engine",
    positive: "iteration-engine",
  },
  overlooker: "rooted-systems-reader",
  present: {
    dimension: "organization",
    negative: "specialist",
    zero: "specialist",
    positive: "specialist",
  },
  "multi-path": "multi-path",
};

export function reportRoleForIdentity(
  identityId: string,
  positions: Record<DimensionKey, number>,
): ReportRoleDefinition {
  const selector = roleSelectorByIdentity[identityId] ?? "multi-path";
  if (typeof selector === "string") {
    return reportRoleMap[selector];
  }

  const value = positions[selector.dimension];
  const roleId =
    value < 0
      ? selector.negative
      : value > 0
        ? selector.positive
        : selector.zero;
  return reportRoleMap[roleId];
}
