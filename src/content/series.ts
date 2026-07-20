import type { DimensionKey } from "../../contracts/series-definition";
import rawQuestionnaire from "./nbti-mvp.v1.json";
import { parseQuestionnaireDocument } from "./questionnaire";

const parsedQuestionnaire = parseQuestionnaireDocument(rawQuestionnaire);

export const nbtiQuestionnaire = parsedQuestionnaire.document;
export const nbtiSeries = parsedQuestionnaire.series;

export const dimensionLabels = Object.fromEntries(
  nbtiQuestionnaire.dimensions.map((dimension) => [
    dimension.id,
    {
      left: dimension.left.label,
      right: dimension.right.label,
    },
  ]),
) as Record<DimensionKey, { left: string; right: string }>;

export const dimensionExplanations = Object.fromEntries(
  nbtiQuestionnaire.dimensions.map((dimension) => [
    dimension.id,
    dimension.explanation,
  ]),
) as Record<DimensionKey, string>;

export type Series = typeof nbtiSeries;
