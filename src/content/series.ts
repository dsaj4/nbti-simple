import type { SeriesDefinition, Question } from "../../contracts/series-definition";

export const dimensionLabels = {
  organization: { left: "拆解", right: "联想" },
  calibration: { left: "证据", right: "语境" },
  momentum: { left: "定锚", right: "试探" },
  scope: { left: "全局", right: "近身" },
} as const;

export const dimensionExplanations: Record<
  keyof typeof dimensionLabels,
  string
> = {
  organization:
    "拆解倾向先把问题分开处理；联想倾向先寻找事物之间的连接。",
  calibration:
    "证据倾向先检查可验证依据；语境倾向先理解现场条件与关系。",
  momentum:
    "定锚倾向先形成可执行结论；试探倾向先用小步行动换取新信息。",
  scope:
    "全局倾向先看系统和长期影响；近身倾向先看眼前具体的人与体验。",
};

function q(
  id: string,
  tag: string,
  title: string,
  prompt: string,
  options: [
    { label: string; dim: keyof typeof dimensionLabels; sign: -1 | 1; action: string },
    { label: string; dim: keyof typeof dimensionLabels; sign: -1 | 1; action: string },
    { label: string; dim: keyof typeof dimensionLabels; sign: -1 | 1; action: string },
    { label: string; dim: keyof typeof dimensionLabels; sign: -1 | 1; action: string },
  ],
): Question {
  return {
    id,
    tag,
    title,
    prompt,
    options: options.map((option, index) => {
      const weights = {
        organization: 0,
        calibration: 0,
        momentum: 0,
        scope: 0,
      } as const;
      return {
        id: `${id}-${index}`,
        label: option.label,
        action: option.action,
        weights: {
          ...weights,
          [option.dim]: option.sign * 2,
        },
      };
    }),
  };
}

export const nbtiSeries: SeriesDefinition = {
  id: "nbti-mvp",
  version: "1",
  title: "NBTI 思维风格测试",
  questions: [
    q(
      "q01",
      "协作现场",
      "含糊目标分歧",
      "项目启动会上，大家对“成功标准”各执一词。作为负责人，你会先做什么？",
      [
        { label: "把目标拆成可独立验证的几个子目标", dim: "organization", sign: -1, action: "把混在一起的目标拆成可分别讨论的部分" },
        { label: "找出不同目标之间的隐藏关联，重新拼成一个整体", dim: "organization", sign: 1, action: "在看似独立的目标之间寻找联系" },
        { label: "拉起一张全局影响地图，看长期后果", dim: "scope", sign: -1, action: "把眼前的分歧放到长期影响里评估" },
        { label: "分别了解每个人说法背后的真实处境", dim: "scope", sign: 1, action: "先倾听不同人的具体处境" },
      ],
    ),
    q(
      "q02",
      "信息现场",
      "新信息冲突",
      "执行到一半，新数据证明原计划的一个前提不成立。你会先做什么？",
      [
        { label: "定位是哪条证据推翻了原计划", dim: "calibration", sign: -1, action: "先找出推翻计划的关键证据" },
        { label: "重新理解这条数据产生的现场条件", dim: "calibration", sign: 1, action: "先理解数据产生的具体语境" },
        { label: "先做一个最小调整，看现场反应", dim: "momentum", sign: 1, action: "用可逆的小动作测试新方向" },
        { label: "先按原结论执行，把新数据留到会后核实", dim: "momentum", sign: -1, action: "先保留既有结论，再继续推进" },
      ],
    ),
    q(
      "q03",
      "信息现场",
      "证据不完整",
      "截止时间只剩两小时，一条关键数据仍互相矛盾。团队已经开始等待你的决定。你会先做什么？",
      [
        { label: "把矛盾拆成可以分别核对的部分", dim: "organization", sign: -1, action: "把互相矛盾的数据拆成可逐项核对的部分" },
        { label: "找一个能暂时统合两条数据的解释", dim: "organization", sign: 1, action: "把两条矛盾数据放进一个更大的解释里" },
        { label: "先确认哪条证据最可能改变结论", dim: "calibration", sign: -1, action: "优先验证最能影响结论的证据" },
        { label: "先问清不同人会承担什么后果", dim: "calibration", sign: 1, action: "先了解决定落地后各方的真实处境" },
      ],
    ),
    q(
      "q04",
      "协作现场",
      "多方利益冲突",
      "两个部门的需求互相冲突，预算只能满足一方。你会先做什么？",
      [
        { label: "先定一个优先级规则，按规则执行", dim: "momentum", sign: -1, action: "先用规则给出一个明确落点" },
        { label: "先小规模试行一个兼顾方案", dim: "momentum", sign: 1, action: "用一个小试验验证兼顾方案是否可行" },
        { label: "评估对整体业务链路的长期影响", dim: "scope", sign: -1, action: "把冲突放到整体业务里看长期后果" },
        { label: "分别了解两个部门的真实处境", dim: "scope", sign: 1, action: "先了解两个部门各自的真实处境" },
      ],
    ),
    q(
      "q05",
      "信息现场",
      "指标异常",
      "监控面板里一个核心指标突然跳水，原因不明。你会先做什么？",
      [
        { label: "检查最近变更，找可验证的触发点", dim: "calibration", sign: -1, action: "寻找能解释异常的客观触发点" },
        { label: "先打电话问一线同事现场发生了什么", dim: "calibration", sign: 1, action: "先从一线同事那里了解现场情况" },
        { label: "评估如果持续异常，整体目标会受多大影响", dim: "scope", sign: -1, action: "把指标异常放到整体目标里评估" },
        { label: "定位指标异常影响到的具体用户场景", dim: "scope", sign: 1, action: "先找到被影响的具体用户场景" },
      ],
    ),
    q(
      "q06",
      "关系现场",
      "冒险想法",
      "朋友兴奋地向你介绍一个看起来冒险的计划，并想拉你一起做。你会先做什么？",
      [
        { label: "请他列出可能失败的具体环节", dim: "organization", sign: -1, action: "把计划拆成可能出问题的具体环节" },
        { label: "找出这个想法和他过往经历的连接", dim: "organization", sign: 1, action: "把他的新想法和过往经历联系起来" },
        { label: "建议先投入一小段时间试水", dim: "momentum", sign: 1, action: "用一段小时间验证想法是否可行" },
        { label: "先明确表态支持或反对，再慢慢评估", dim: "momentum", sign: -1, action: "先给出一个明确立场再继续讨论" },
      ],
    ),
    q(
      "q07",
      "协作现场",
      "观点对撞",
      "一场重要讨论变成互相反驳，没有人能推进。你会先做什么？",
      [
        { label: "把各方观点整理成可对比的条目", dim: "organization", sign: -1, action: "把互相反驳的观点拆成可对比的条目" },
        { label: "寻找不同观点之间的共同前提", dim: "organization", sign: 1, action: "在分歧背后寻找共同的前提" },
        { label: "把讨论放到整体目标里看优先级", dim: "scope", sign: -1, action: "把争论放到整体目标里看优先级" },
        { label: "停下来，分别听每个人的情绪和立场", dim: "scope", sign: 1, action: "先停下来倾听每个人的情绪和立场" },
      ],
    ),
    q(
      "q08",
      "决策现场",
      "修局部还是重做",
      "老问题反复出现，有人主张彻底重做系统，有人建议先修局部。你会先做什么？",
      [
        { label: "收集历史上同类决策的真实数据", dim: "calibration", sign: -1, action: "用历史数据判断同类决策的结果" },
        { label: "了解当前团队能承受的改动范围", dim: "calibration", sign: 1, action: "先了解团队当下的实际承受范围" },
        { label: "先选一个方向推进，避免无限讨论", dim: "momentum", sign: -1, action: "先选定一个方向让讨论落地" },
        { label: "先找一个最小切口验证重做假设", dim: "momentum", sign: 1, action: "用最小切口验证重做是否值得" },
      ],
    ),
    q(
      "q09",
      "表达现场",
      "公开表达",
      "你要在公开场合说一件复杂的事，担心被断章取义。你会先做什么？",
      [
        { label: "把论点拆成几个不易误解的小命题", dim: "organization", sign: -1, action: "把复杂论点拆成可独立理解的小命题" },
        { label: "先设计一个能统合不同关切的说法", dim: "organization", sign: 1, action: "把不同关切编织成一个统一说法" },
        { label: "评估这次表达在全局叙事中的位置", dim: "scope", sign: -1, action: "把表达放到整体叙事里看影响" },
        { label: "先找几位目标听众试读，收集反应", dim: "scope", sign: 1, action: "先让具体听众试读并收集反应" },
      ],
    ),
    q(
      "q10",
      "决策现场",
      "试验还是投入",
      "团队有两个方案：小范围试验稳妥但慢，一次性投入快但风险高。你会先做什么？",
      [
        { label: "把两种路径的关键假设列出来对比", dim: "calibration", sign: -1, action: "把两个方案的关键假设逐一对比" },
        { label: "判断当前最缺的是信息还是决心", dim: "calibration", sign: 1, action: "先判断现场缺的是信息还是决心" },
        { label: "建议切出一个可回滚的小试验", dim: "momentum", sign: 1, action: "用可回滚的小试验降低不确定性" },
        { label: "直接拍板一个方向，避免消耗士气", dim: "momentum", sign: -1, action: "直接给出明确方向结束犹豫" },
      ],
    ),
    q(
      "q11",
      "规则现场",
      "规则冲突",
      "现场情况明显超出既有规则，但严格按规则会伤害具体的人。你会先做什么？",
      [
        { label: "把规则的适用边界拆成不同情形", dim: "organization", sign: -1, action: "把规则拆成可适用的不同情形" },
        { label: "寻找一个能同时覆盖规则和例外的解释框架", dim: "organization", sign: 1, action: "寻找一个能同时容纳规则和例外的框架" },
        { label: "找出规则原本想保护的目标", dim: "calibration", sign: -1, action: "追溯规则原本想保护的依据" },
        { label: "先和当事人聊清楚实际处境", dim: "calibration", sign: 1, action: "先了解当事人的具体处境" },
      ],
    ),
    q(
      "q12",
      "决策现场",
      "没有把握",
      "几个方案看起来都可行，但没有一个有十足把握。你会先做什么？",
      [
        { label: "先选一个方向推进，边做边看", dim: "momentum", sign: -1, action: "先选定一个方向推进，在实践中调整" },
        { label: "找出能最快验证核心假设的动作", dim: "momentum", sign: 1, action: "用最快动作验证关键假设" },
        { label: "评估每个方案对整体路径的长期影响", dim: "scope", sign: -1, action: "把各方案放到整体路径里看长期影响" },
        { label: "问问现场最受影响的人更怕哪一种结果", dim: "scope", sign: 1, action: "先了解最受影响的人的真实顾虑" },
      ],
    ),
  ],
  resultTypes: [
    { id: "deconstructor", label: "拆题者", shortLabel: "拆解" },
    { id: "connector", label: "连线者", shortLabel: "联想" },
    { id: "calibrator", label: "校准者", shortLabel: "证据" },
    { id: "context-reader", label: "读场者", shortLabel: "语境" },
    { id: "anchor", label: "定锚者", shortLabel: "定锚" },
    { id: "explorer", label: "探路者", shortLabel: "试探" },
    { id: "overlooker", label: "望塔者", shortLabel: "全局" },
    { id: "present", label: "在场者", shortLabel: "近身" },
    { id: "multi-path", label: "多路者", shortLabel: "多路" },
  ],
};

export type Series = typeof nbtiSeries;
