"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/icon";

type AlienPower = {
  AlienPowerId: number;
  AlienPowerGuid: string;
  AlienPowerName: string;
  Description: string;
  PowerType: string;
  PowerLevel: number;
  IsActive: boolean;
  SortOrder: number;
  IsMainPower: boolean;
};

type Alien = {
  AlienId: number;
  AlienGuid: string;
  AlienName: string;
  Species: string;
  HomePlanet: string;
  Description: string;
  AlienLevel: number;
  Unlocked: boolean;
  PowerList: AlienPower[];
};

type StatusFilter = "all" | "unlocked" | "locked";
type LevelFilter = "all" | "1-3" | "4-6" | "7-10";

const aliensApiUrl = "/api/aliens";

const imageNameOverrides: Record<string, string> = {
  heatblast: "HeatBlast",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAlienPower(value: unknown): value is AlienPower {
  return (
    isRecord(value) &&
    typeof value.AlienPowerId === "number" &&
    typeof value.AlienPowerGuid === "string" &&
    typeof value.AlienPowerName === "string" &&
    typeof value.Description === "string" &&
    typeof value.PowerType === "string" &&
    typeof value.PowerLevel === "number" &&
    typeof value.IsActive === "boolean" &&
    typeof value.SortOrder === "number" &&
    typeof value.IsMainPower === "boolean"
  );
}

function isAlien(value: unknown): value is Alien {
  return (
    isRecord(value) &&
    typeof value.AlienId === "number" &&
    typeof value.AlienGuid === "string" &&
    typeof value.AlienName === "string" &&
    typeof value.Species === "string" &&
    typeof value.HomePlanet === "string" &&
    typeof value.Description === "string" &&
    typeof value.AlienLevel === "number" &&
    typeof value.Unlocked === "boolean" &&
    Array.isArray(value.PowerList) &&
    value.PowerList.every(isAlienPower)
  );
}

function getImagePath(name: string) {
  const imageName =
    imageNameOverrides[name.toLowerCase()] ??
    name
      .trim()
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join("");

  return `/aliens/${imageName}.png`;
}

function AlienPortrait({
  alien,
  large = false,
}: {
  alien: Alien;
  large?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      className={`alien-portrait${large ? " alien-portrait-large" : ""}`}
      aria-hidden="true"
    >
      {!imageFailed ? (
        <Image
          src={getImagePath(alien.AlienName)}
          alt=""
          fill
          unoptimized
          sizes={large ? "(max-width: 1100px) 45vw, 300px" : "220px"}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="alien-portrait-fallback">
          <Icon name="alien" />
          <span>{alien.AlienName.slice(0, 2).toUpperCase()}</span>
        </div>
      )}
    </div>
  );
}

function levelMatches(level: number, filter: LevelFilter) {
  if (filter === "all") return true;
  const [minimum, maximum] = filter.split("-").map(Number);
  return level >= minimum && level <= maximum;
}

export default function AliensDirectory() {
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedAlienId, setSelectedAlienId] = useState<number | null>(null);
  const [transformedAlienId, setTransformedAlienId] = useState<number | null>(
    null,
  );
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAliens() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(aliensApiUrl, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `The aliens service returned ${response.status} ${response.statusText}.`,
          );
        }

        const payload: unknown = await response.json();
        const records = Array.isArray(payload) ? payload : [payload];

        if (!records.every(isAlien)) {
          throw new Error("The aliens service returned data in an unexpected format.");
        }

        setAliens(records);
      } catch (loadError) {
        if (controller.signal.aborted) return;

        setError(
          loadError instanceof Error
            ? loadError.message
            : "An unexpected error occurred while loading aliens.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadAliens();

    return () => controller.abort();
  }, [retryCount]);

  const speciesOptions = useMemo(
    () =>
      Array.from(
        new Set(aliens.map((alien) => alien.Species).filter(Boolean)),
      ).sort((first, second) => first.localeCompare(second)),
    [aliens],
  );

  const filteredAliens = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();

    return aliens.filter((alien) => {
      const matchesSearch =
        query.length === 0 ||
        [
          alien.AlienName,
          alien.Species,
          alien.HomePlanet,
          ...alien.PowerList.map((power) => power.AlienPowerName),
        ].some((value) => value.toLocaleLowerCase().includes(query));
      const matchesSpecies =
        speciesFilter === "all" || alien.Species === speciesFilter;
      const matchesLevel = levelMatches(alien.AlienLevel, levelFilter);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "unlocked" ? alien.Unlocked : !alien.Unlocked);

      return matchesSearch && matchesSpecies && matchesLevel && matchesStatus;
    });
  }, [aliens, levelFilter, search, speciesFilter, statusFilter]);

  const featuredAlien =
    filteredAliens.find((alien) => alien.AlienId === selectedAlienId) ??
    filteredAliens.find((alien) => alien.Unlocked) ??
    filteredAliens[0];
  const rosterAliens = filteredAliens.filter(
    (alien) => alien.AlienId !== featuredAlien?.AlienId,
  );
  const unlockedCount = aliens.filter((alien) => alien.Unlocked).length;
  const featuredPowers = [...(featuredAlien?.PowerList ?? [])].sort(
    (first, second) => first.SortOrder - second.SortOrder,
  );

  return (
    <section className="aliens-directory" aria-labelledby="aliens-title">
      <div className="aliens-toolbar">
        <div className="aliens-title-group">
          <div className="aliens-title-line">
            <span className="aliens-title-mark">
              <Icon name="alien" />
            </span>
            <h1 id="aliens-title">Aliens Directory</h1>
            <span className="aliens-total">
              <strong>{aliens.length}</strong> total aliens
            </span>
          </div>
          <p>Explore your roster and discover what every alien can do.</p>
        </div>

        <div className="aliens-filters" aria-label="Filter aliens">
          <label className="alien-filter">
            <span>Class</span>
            <select
              aria-label="Filter by species"
              value={speciesFilter}
              onChange={(event) => setSpeciesFilter(event.target.value)}
            >
              <option value="all">All species</option>
              {speciesOptions.map((species) => (
                <option key={species} value={species}>
                  {species}
                </option>
              ))}
            </select>
          </label>
          <label className="alien-filter">
            <span>Level</span>
            <select
              aria-label="Filter by alien level"
              value={levelFilter}
              onChange={(event) =>
                setLevelFilter(event.target.value as LevelFilter)
              }
            >
              <option value="all">All levels</option>
              <option value="1-3">Level 1–3</option>
              <option value="4-6">Level 4–6</option>
              <option value="7-10">Level 7–10</option>
            </select>
          </label>
          <label className="alien-filter">
            <span>Status</span>
            <select
              aria-label="Filter by unlock status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            >
              <option value="all">All aliens</option>
              <option value="unlocked">Unlocked</option>
              <option value="locked">Locked</option>
            </select>
          </label>
          <label className="alien-search">
            <Icon name="search" />
            <input
              aria-label="Find an alien"
              placeholder="Find an alien..."
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="aliens-summary" aria-label="Roster summary">
        <span>
          <i className="summary-dot summary-dot-green" />
          {unlockedCount} unlocked
        </span>
        <span>
          <i className="summary-dot summary-dot-muted" />
          {aliens.length - unlockedCount} locked
        </span>
        <span>{speciesOptions.length} species</span>
      </div>

      {error ? (
        <div className="aliens-state aliens-error" role="alert">
          <span className="aliens-state-icon">!</span>
          <h2>Couldn’t load the alien roster</h2>
          <p>{error}</p>
          <p className="aliens-error-hint">
            Check that the backend service is running, then try again.
          </p>
          <button
            className="alien-retry-button"
            onClick={() => setRetryCount((count) => count + 1)}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="aliens-state" role="status" aria-live="polite">
          <span className="alien-loading-spinner" />
          <h2>Scanning the Omnitrix...</h2>
          <p>Loading your alien roster.</p>
        </div>
      ) : aliens.length === 0 ? (
        <div className="aliens-state">
          <span className="aliens-state-icon">
            <Icon name="alien" />
          </span>
          <h2>No aliens in the directory yet</h2>
          <p>When aliens are added to your roster, they’ll appear here.</p>
        </div>
      ) : filteredAliens.length === 0 ? (
        <div className="aliens-state">
          <span className="aliens-state-icon">
            <Icon name="search" />
          </span>
          <h2>No aliens match these filters</h2>
          <p>Try another name, species, level, or unlock status.</p>
          <button
            className="alien-retry-button"
            onClick={() => {
              setSearch("");
              setSpeciesFilter("all");
              setLevelFilter("all");
              setStatusFilter("all");
            }}
            type="button"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="aliens-showcase">
          {featuredAlien && (
            <aside className="featured-alien">
              <div className="featured-heading">
                <div>
                  <h2>Featured Alien</h2>
                  <p>
                    {transformedAlienId === featuredAlien.AlienId
                      ? "Currently transformed"
                      : `Currently ${featuredAlien.Unlocked ? "unlocked" : "locked"}`}
                  </p>
                </div>
              </div>

              <div className="featured-overview">
                <div className="featured-art">
                  <div className="featured-art-glow" />
                  <AlienPortrait alien={featuredAlien} large />
                  <span className="featured-level">
                    LVL {featuredAlien.AlienLevel}
                  </span>
                </div>
                <div className="featured-copy">
                  <h3>{featuredAlien.AlienName}</h3>
                  <dl className="featured-facts">
                    <div>
                      <dt>Species</dt>
                      <dd>{featuredAlien.Species}</dd>
                    </div>
                    <div>
                      <dt>Home Planet</dt>
                      <dd>{featuredAlien.HomePlanet}</dd>
                    </div>
                    <div>
                      <dt>Alien Level</dt>
                      <dd>{featuredAlien.AlienLevel}/10</dd>
                    </div>
                    <div>
                      <dt>Powers</dt>
                      <dd>
                        {featuredPowers.length > 0
                          ? featuredPowers
                              .map((power) => power.AlienPowerName)
                              .join(", ")
                          : "None listed"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <button
                aria-pressed={transformedAlienId === featuredAlien.AlienId}
                className="transform-button"
                disabled={!featuredAlien.Unlocked}
                onClick={() =>
                  setTransformedAlienId((currentId) =>
                    currentId === featuredAlien.AlienId
                      ? null
                      : featuredAlien.AlienId,
                  )
                }
                type="button"
              >
                <Icon name="omnitrix" />
                {transformedAlienId === featuredAlien.AlienId
                  ? "REVERT"
                  : "TRANSFORM"}
              </button>

              <div className="featured-powers">
                <div className="featured-powers-heading">
                  <span>Power levels</span>
                  <span>{featuredPowers.length} abilities</span>
                </div>
                {featuredPowers.length > 0 ? (
                  <ul>
                    {featuredPowers.slice(0, 5).map((power, index) => (
                      <li
                        className={`power-stat power-stat-${index % 5}`}
                        key={power.AlienPowerId}
                      >
                        <span className="power-stat-icon">
                          <Icon name="omnitrix" />
                        </span>
                        <span className="power-stat-content">
                          <span className="power-stat-label">
                            {power.AlienPowerName}
                            {power.IsMainPower && (
                              <span className="main-power-label">MAIN</span>
                            )}
                          </span>
                          <span
                            className="power-stat-track"
                            role="progressbar"
                            aria-label={`${power.AlienPowerName} power level`}
                            aria-valuemin={0}
                            aria-valuemax={10}
                            aria-valuenow={Math.min(
                              Math.max(power.PowerLevel, 0),
                              10,
                            )}
                          >
                            <span
                              style={{
                                width: `${Math.min(Math.max(power.PowerLevel, 0), 10) * 10}%`,
                              }}
                            />
                          </span>
                        </span>
                        <span className="power-level">
                          {power.PowerLevel}/10
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-powers">No powers listed for this alien.</p>
                )}
              </div>
            </aside>
          )}

          <section className="alien-roster" aria-labelledby="roster-title">
            <div className="roster-heading">
              <div>
                <span className="aliens-section-kicker">The collection</span>
                <h2 id="roster-title">
                  {statusFilter === "unlocked"
                    ? "Unlocked Aliens"
                    : statusFilter === "locked"
                      ? "Locked Aliens"
                      : "All Aliens"}
                </h2>
                <p>
                  {rosterAliens.length}{" "}
                  {rosterAliens.length === 1 ? "alien" : "aliens"} in this view
                </p>
              </div>
              <span className="roster-count">
                {rosterAliens.length.toString().padStart(2, "0")}
              </span>
            </div>

            {rosterAliens.length === 0 ? (
              <div className="roster-empty">
                <Icon name="alien" />
                <p>
                  {featuredAlien
                    ? "That’s the only alien matching your filters."
                    : "No aliens match your filters."}
                </p>
              </div>
            ) : (
              <div className="alien-card-grid">
                {rosterAliens.map((alien, index) => (
                  <button
                    aria-label={`${alien.AlienName}${alien.Unlocked ? "" : ", locked"}`}
                    aria-pressed={featuredAlien?.AlienId === alien.AlienId}
                    className={`alien-card alien-tone-${index % 6}${alien.Unlocked ? "" : " is-locked"}`}
                    key={alien.AlienGuid}
                    onClick={() => {
                      setSelectedAlienId(alien.AlienId);
                      setTransformedAlienId(null);
                    }}
                    type="button"
                  >
                    <div className="alien-card-art" aria-hidden="true">
                      <AlienPortrait alien={alien} />
                      {!alien.Unlocked && (
                        <span className="alien-lock-mark">
                          <svg fill="none" viewBox="0 0 24 24">
                            <rect
                              height="10"
                              rx="2"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              width="14"
                              x="5"
                              y="11"
                            />
                            <path
                              d="M8 11V8a4 4 0 0 1 8 0v3"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeWidth="1.7"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                    <span className="alien-card-name">{alien.AlienName}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
      <p className="aliens-footer-note">
        <Icon name="omnitrix" />
        <span>Every alien has a story. Find out what yours can do.</span>
      </p>
    </section>
  );
}
