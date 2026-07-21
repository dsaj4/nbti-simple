import type { ResultIdentity } from "../../contracts/report-view-model";

export type IdentityDefinition = ResultIdentity & {
  headline: string;
  scene: string;
  actions: { title: string; description: string }[];
};

const definitions = [
  ["wall-breaker", "DLRP", "破壁人", "Wall Breaker"],
  ["watchdog", "DLAP", "看门狗", "Watchdog"],
  ["stress-tester", "DLRH", "杠精", "Stress Tester"],
  ["cyber-adjudicator", "DLAH", "赛博判官", "Cyber Adjudicator"],
  ["iteration-engine", "DNRP", "卷王", "Iteration Engine"],
  ["fixed-bearing", "DNAP", "头铁", "Fixed Bearing"],
  ["signal-clarifier", "DNRH", "人间清醒", "Signal Clarifier"],
  ["specialist", "DNAH", "绝活哥", "Specialist"],
  ["imprint-system", "CLRH", "思想钢印", "Imprint System"],
  ["rooted-systems-reader", "CNRP", "树人", "Rooted Systems Reader"],
  ["probability-navigator", "CNAP", "赌神", "Probability Navigator"],
  ["noise-sweeper", "CNRH", "扫地僧", "Noise Sweeper"],
] as const;

export const identityMap: Record<string, IdentityDefinition> = Object.fromEntries(
  definitions.map(([id, code, label, englishLabel]) => [
    id,
    {
      code,
      label,
      englishLabel,
      subtitle: "这组复杂情境中的思维风格",
      headline: "你的四个判断偏好共同形成了这一组思维风格。",
      scene: "结果只描述你在本组情境中通常怎样处理信息和作出判断。",
      actions: [],
    },
  ]),
);

export const identityIdByTypeCode = Object.fromEntries(
  definitions.map(([id, code]) => [code, id]),
) as Record<string, string>;

export const validTypeCodes = definitions.map(([, code]) => code);
