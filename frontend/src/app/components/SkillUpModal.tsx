import React, { useEffect, useState } from "react";
import { apiFetch } from '../../services/api';

type Props = {
  careerId: string | null;
  visible: boolean;
  onClose: () => void;
};

type ExplanationResponse = {
  parsed?: any;
  explanation?: string;
  roadmap?: any;
  [k: string]: any;
};

type SkillDetail = {
  name?: string;
  dailyTasks?: { resources?: Array<any> };
  weeklyModules?: Array<{ resources?: Array<any> }>;
  resources?: Array<any>;
  [k: string]: any;
};

export default function SkillUpModal({ careerId, visible, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [missingSkillsDetails, setMissingSkillsDetails] = useState<
    { name: string; resources: string[] }[]
  >([]);
  const [roadmapWeeks, setRoadmapWeeks] = useState<
    { title: string; items: string[] }[]
  >([]);
  const [fallbackExplanation, setFallbackExplanation] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;

    async function load() {
      if (!careerId) {
        setError("No career selected.");
        return;
      }

      setLoading(true);
      setError(null);
      setMissingSkills([]);
      setMissingSkillsDetails([]);
      setRoadmapWeeks([]);
      setFallbackExplanation(null);

      try {
        // Fetch explanation and user profile in parallel
        const [explainRes, meRes] = await Promise.all([
          apiFetch(`/api/recommendations/explain/${encodeURIComponent(careerId)}`, undefined, { auth: true }),
          apiFetch('/api/auth/me', undefined, { auth: true }),
        ]);

        if (cancelled) return;

        const explanationPayload = (explainRes && typeof explainRes === 'object' ? explainRes : {}) as any;
        const mePayload = (meRes && typeof meRes === 'object' ? meRes : {}) as any;

        // API wrapper may return payload under `data`
        const explanation: ExplanationResponse = explanationPayload?.data ?? explanationPayload;
        const me = mePayload?.data ?? mePayload;

        const profileSkills: string[] = Array.isArray(me.skills)
          ? me.skills.map(String)
          : [];

        setUserSkills(profileSkills);

        // Attempt to extract skill gaps from parsed
        const parsed = explanation.parsed ?? null;
        let parsedSkillGaps: string[] = [];

        if (parsed) {
          // Try common shapes: array, comma-separated string, nested property
          if (Array.isArray(parsed.skillGaps)) {
            parsedSkillGaps = parsed.skillGaps.map(String);
          } else if (typeof parsed.skillGaps === "string") {
            parsedSkillGaps = parsed.skillGaps
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean);
          } else {
            // search for properties that might contain gaps
            const maybe = parsed.gaps ?? parsed.missingSkills ?? parsed.missing ?? undefined;
            if (Array.isArray(maybe)) parsedSkillGaps = maybe.map(String);
            else if (typeof maybe === "string")
              parsedSkillGaps = maybe
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean);
          }
        }

        // case-insensitive filter against profileSkills
        const userLower = profileSkills.map((s) => s.toLowerCase());
        const filteredMissing = parsedSkillGaps.filter((gap) => {
          const g = String(gap).toLowerCase();
          return !userLower.some((us) => us === g);
        });

        if (filteredMissing.length > 0) {
          setMissingSkills(filteredMissing);
        } else {
          // If no parsed missing or none remain, fallback to explanation text
          const textFallback =
            explanation.explanation ||
            explanation.text ||
            (typeof explanation === "string" ? String(explanation) : null);
          setFallbackExplanation(
            textFallback || "No missing-skill details available."
          );
        }

        // Build roadmap weeks from likely places: explanation.roadmap or parsed.roadmap
        const rawRoadmap =
          explanation.roadmap ?? parsed?.roadmap ?? explanation?.parsed?.roadmap;
        let weeks: { title: string; items: string[] }[] = [];

        if (rawRoadmap) {
          // try common shapes: array of weeks with items, or object with weeks property
          const candidateWeeks =
            Array.isArray(rawRoadmap)
              ? rawRoadmap
              : Array.isArray(rawRoadmap.weeks)
              ? rawRoadmap.weeks
              : rawRoadmap.weekly ?? rawRoadmap.weeks ?? null;

          if (candidateWeeks && Array.isArray(candidateWeeks)) {
            weeks = candidateWeeks.map((w: any, i: number) => {
              const title =
                (typeof w.title === "string" && w.title) || `Week ${i + 1}`;
              const itemsRaw = Array.isArray(w.items)
                ? w.items
                : Array.isArray(w.topics)
                ? w.topics
                : Array.isArray(w.contents)
                ? w.contents
                : typeof w === "string"
                ? [w]
                : [];
              const items = itemsRaw.map(String).filter(Boolean);
              return { title, items };
            });
          }
        }

        // as final fallback, look for parsed.weeklyPlan or explanation.weeklyPlan
        if (weeks.length === 0) {
          const maybeWeekly =
            parsed?.weeklyPlan ??
            explanation?.weeklyPlan ??
            parsed?.weekly ??
            explanation?.weekly;
          if (Array.isArray(maybeWeekly)) {
            weeks = maybeWeekly.map((w: any, i: number) => {
              const title = `Week ${i + 1}`;
              const items = Array.isArray(w) ? w.map(String) : [];
              return { title, items };
            });
          }
        }

        // Filter roadmap items by removing any that match user skills (case-insensitive substring)
        const filteredWeeks = (weeks || [])
          .map((w) => {
            const items = (w.items || []).filter((it) => {
              const itLower = it.toLowerCase();
              return !userLower.some((us) => itLower.includes(us));
            });
            return { title: w.title, items };
          })
          .filter((w) => w.items && w.items.length > 0)
          .slice(0, 6);

        setRoadmapWeeks(filteredWeeks);

        // If we have missing skills, fetch details for each (sequential or parallel)
        if (filteredMissing.length > 0) {
          const details: { name: string; resources: string[] }[] = [];

          await Promise.all(
            filteredMissing.map(async (nameRaw) => {
              const name = String(nameRaw).trim();
              if (!name) return;
              try {
                const resp: any = await apiFetch(
                  `/api/skills/name/${encodeURIComponent(name)}`,
                  undefined,
                  { auth: false }
                );
                const skillPayload = resp && typeof resp === 'object' ? resp : {};
                const skill: SkillDetail = skillPayload?.data ?? skillPayload;
                const resourcesSet = new Set<string>();

                if (skill.dailyTasks && Array.isArray(skill.dailyTasks.resources)) {
                  skill.dailyTasks.resources.forEach((r: any) =>
                    resourcesSet.add(String(r).trim())
                  );
                }
                if (Array.isArray(skill.weeklyModules)) {
                  skill.weeklyModules.forEach((m) => {
                    if (Array.isArray(m.resources)) {
                      m.resources.forEach((r: any) =>
                        resourcesSet.add(String(r).trim())
                      );
                    }
                  });
                }
                if (Array.isArray(skill.resources)) {
                  skill.resources.forEach((r: any) =>
                    resourcesSet.add(String(r).trim())
                  );
                }

                details.push({
                  name,
                  resources: Array.from(resourcesSet).filter(Boolean),
                });
              } catch (err: any) {
                details.push({ name, resources: [] });
              }
            })
          );

          if (!cancelled) setMissingSkillsDetails(details);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Failed to load recommendations and profile. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, careerId]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-auto bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-lg font-medium">Skill Up Recommendations</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column: missing skills & resources */}
              <div>
                <h4 className="mb-3 text-sm font-semibold">Missing Skills</h4>

                {missingSkills.length === 0 && fallbackExplanation ? (
                  <div className="prose text-sm text-gray-700 whitespace-pre-wrap">
                    {fallbackExplanation}
                  </div>
                ) : missingSkills.length === 0 ? (
                  <div className="text-sm text-gray-600">
                    No missing skills detected.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {missingSkills.map((ms) => {
                      const det =
                        missingSkillsDetails.find(
                          (d) => d.name.toLowerCase() === ms.toLowerCase()
                        ) || { name: ms, resources: [] };
                      return (
                        <div
                          key={ms}
                          className="border rounded p-3 bg-slate-50"
                        >
                          <div className="font-medium">{det.name}</div>
                          <div className="mt-2 text-sm">
                            {det.resources && det.resources.length > 0 ? (
                              <ul className="list-disc list-inside space-y-1">
                                {det.resources.map((r, i) => (
                                  <li key={i}>
                                    <a
                                      href={r}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-600 hover:underline break-words"
                                    >
                                      {r}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-gray-500">
                                No resources found.
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right column: roadmap weeks */}
              <div>
                <h4 className="mb-3 text-sm font-semibold">Roadmap (Weeks)</h4>

                {roadmapWeeks.length === 0 ? (
                  <div className="text-sm text-gray-600">
                    No roadmap weeks available.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {roadmapWeeks.map((w, idx) => (
                      <div key={idx} className="border rounded p-3">
                        <div className="font-medium">{w.title}</div>
                        <ul className="mt-2 list-decimal list-inside text-sm space-y-1">
                          {w.items.map((it, i) => (
                            <li key={i} className="text-gray-700">
                              {it}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t">
          <button
            onClick={onClose}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
