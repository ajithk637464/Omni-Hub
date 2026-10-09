"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import Icon from "@/components/ui/icon";

type AlienPower = {
  AlienPowerId: number;
  AlienPowerGuid: string;
  AlienPowerName: string;
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
  IsActive?: boolean;
  PowerList: AlienPower[];
};

type PowerOption = Pick<AlienPower, "AlienPowerId" | "AlienPowerName">;

type AlienFormValues = {
  AlienName: string;
  Species: string;
  HomePlanet: string;
  Description: string;
  EnergyConsumption: string;
  Strength: string;
  Speed: string;
  Intelligence: string;
  Accuracy: string;
  AlienLevel: string;
  Unlocked: boolean;
  IsActive: boolean;
  SortOrder: string;
};

const initialFormValues: AlienFormValues = {
  AlienName: "",
  Species: "",
  HomePlanet: "",
  Description: "",
  EnergyConsumption: "0",
  Strength: "0",
  Speed: "0",
  Intelligence: "0",
  Accuracy: "0",
  AlienLevel: "1",
  Unlocked: false,
  IsActive: true,
  SortOrder: "0",
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
    (!("IsActive" in value) || typeof value.IsActive === "boolean") &&
    Array.isArray(value.PowerList) &&
    value.PowerList.every(isAlienPower)
  );
}

function getResponseError(body: string, status: number) {
  if (body) {
    try {
      const parsed: unknown = JSON.parse(body);
      if (
        isRecord(parsed) &&
        typeof parsed.error === "string" &&
        parsed.error.trim()
      ) {
        return parsed.error;
      }
    } catch {
      return body;
    }

    return body;
  }

  return `The request failed with status ${status}.`;
}

async function fetchAliens(): Promise<Alien[]> {
  const response = await fetch("/api/aliens", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(getResponseError(await response.text(), response.status));
  }

  const payload: unknown = await response.json();
  const records = Array.isArray(payload) ? payload : [payload];

  if (!records.every(isAlien)) {
    throw new Error("The aliens service returned data in an unexpected format.");
  }

  return records;
}

function AlienStatus({ active }: { active: boolean | undefined }) {
  return (
    <span
      className={`alien-admin-status${active === true ? " is-active" : ""}${active === undefined ? " is-unknown" : ""}`}
    >
      <span />
      {active === undefined ? "Not provided" : active ? "Active" : "Inactive"}
    </span>
  );
}

function AddAlienModal({
  powers,
  onClose,
  onCreated,
}: {
  powers: PowerOption[];
  onClose: () => void;
  onCreated: () => Promise<void>;
}) {
  const [values, setValues] = useState(initialFormValues);
  const [selectedPowers, setSelectedPowers] = useState<number[]>([]);
  const [mainPowerId, setMainPowerId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, submitting]);

  function setField<K extends keyof AlienFormValues>(
    field: K,
    value: AlienFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function togglePower(powerId: number) {
    if (selectedPowers.includes(powerId)) {
      setSelectedPowers((current) => current.filter((id) => id !== powerId));
      if (mainPowerId === powerId) setMainPowerId(null);
      return;
    }

    setSelectedPowers((current) => [...current, powerId]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const payload = {
      AlienName: values.AlienName.trim(),
      Species: values.Species.trim(),
      HomePlanet: values.HomePlanet.trim(),
      Description: values.Description.trim(),
      EnergyConsumption: Number(values.EnergyConsumption),
      Strength: Number(values.Strength),
      Speed: Number(values.Speed),
      Intelligence: Number(values.Intelligence),
      Accuracy: Number(values.Accuracy),
      AlienLevel: Number(values.AlienLevel),
      Unlocked: values.Unlocked,
      IsActive: values.IsActive,
      SortOrder: Number(values.SortOrder),
      PowerList: selectedPowers.map((AlienPowerId) => ({
        AlienPowerId,
        IsMainPower: AlienPowerId === mainPowerId,
      })),
    };

    try {
      const response = await fetch("/api/aliens", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setSubmitError(
          getResponseError(await response.text(), response.status),
        );
        return;
      }

      await onCreated();
      onClose();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the alien.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="alien-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <section
        aria-labelledby="add-alien-title"
        aria-modal="true"
        className="alien-modal"
        role="dialog"
      >
        <header className="alien-modal-header">
          <div>
            <span className="alien-admin-eyebrow">Alien catalog</span>
            <h2 id="add-alien-title">Add a new alien</h2>
            <p>Enter the alien details and assign its powers.</p>
          </div>
          <button
            aria-label="Close dialog"
            className="alien-modal-close"
            disabled={submitting}
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </header>

        <form className="alien-modal-form" onSubmit={handleSubmit}>
          <div className="alien-form-grid">
            <label className="alien-form-field">
              <span>Alien name</span>
              <input
                autoFocus
                maxLength={80}
                onChange={(event) => setField("AlienName", event.target.value)}
                required
                value={values.AlienName}
              />
            </label>
            <label className="alien-form-field">
              <span>Species</span>
              <input
                maxLength={80}
                onChange={(event) => setField("Species", event.target.value)}
                required
                value={values.Species}
              />
            </label>
            <label className="alien-form-field">
              <span>Home planet</span>
              <input
                maxLength={80}
                onChange={(event) => setField("HomePlanet", event.target.value)}
                required
                value={values.HomePlanet}
              />
            </label>
            <label className="alien-form-field">
              <span>Alien level</span>
              <input
                max={10}
                min={1}
                onChange={(event) => setField("AlienLevel", event.target.value)}
                required
                type="number"
                value={values.AlienLevel}
              />
            </label>
          </div>

          <label className="alien-form-field">
            <span>Description</span>
            <textarea
              maxLength={500}
              onChange={(event) => setField("Description", event.target.value)}
              required
              rows={3}
              value={values.Description}
            />
          </label>

          <fieldset className="alien-form-section">
            <legend>Stats</legend>
            <div className="alien-form-grid alien-form-grid-stats">
              <label className="alien-form-field">
                <span>Energy consumption</span>
                <input
                  min={0}
                  onChange={(event) =>
                    setField("EnergyConsumption", event.target.value)
                  }
                  required
                  type="number"
                  value={values.EnergyConsumption}
                />
              </label>
              {(
                [
                  ["Strength", "Strength"],
                  ["Speed", "Speed"],
                  ["Intelligence", "Intelligence"],
                  ["Accuracy", "Accuracy"],
                ] as const
              ).map(([field, label]) => (
                <label className="alien-form-field" key={field}>
                  <span>{label} / 10</span>
                  <input
                    max={10}
                    min={0}
                    onChange={(event) => setField(field, event.target.value)}
                    required
                    type="number"
                    value={values[field]}
                  />
                </label>
              ))}
              <label className="alien-form-field">
                <span>Sort order</span>
                <input
                  min={0}
                  onChange={(event) => setField("SortOrder", event.target.value)}
                  required
                  type="number"
                  value={values.SortOrder}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="alien-form-section">
            <legend>Available powers</legend>
            {powers.length > 0 ? (
              <div className="alien-power-options">
                {powers.map((power) => {
                  const selected = selectedPowers.includes(power.AlienPowerId);

                  return (
                    <div className="alien-power-option" key={power.AlienPowerId}>
                      <label>
                        <input
                          checked={selected}
                          onChange={() => togglePower(power.AlienPowerId)}
                          type="checkbox"
                        />
                        <span>{power.AlienPowerName}</span>
                      </label>
                      <label className="alien-main-power-option">
                        <input
                          checked={mainPowerId === power.AlienPowerId}
                          disabled={!selected}
                          name="mainPower"
                          onChange={() => setMainPowerId(power.AlienPowerId)}
                          type="radio"
                        />
                        Main
                      </label>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="alien-form-hint">
                No powers are available yet. You can add the alien without
                assigning a power.
              </p>
            )}
          </fieldset>

          <div className="alien-form-toggles">
            <label>
              <input
                checked={values.Unlocked}
                onChange={(event) => setField("Unlocked", event.target.checked)}
                type="checkbox"
              />
              Unlocked
            </label>
            <label>
              <input
                checked={values.IsActive}
                onChange={(event) => setField("IsActive", event.target.checked)}
                type="checkbox"
              />
              Active
            </label>
          </div>

          {submitError && (
            <p className="alien-form-error" role="alert">
              {submitError}
            </p>
          )}

          <footer className="alien-modal-footer">
            <button
              className="alien-admin-button alien-admin-button-secondary"
              disabled={submitting}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="alien-admin-button alien-admin-button-primary"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Adding alien…" : "Add alien"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default function AliensManager() {
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    void fetchAliens()
      .then((records) => {
        if (isCurrent) setAliens(records);
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "An unexpected error occurred while loading aliens.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const refreshAliens = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      setAliens(await fetchAliens());
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while loading aliens.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const powers = useMemo(() => {
    const uniquePowers = new Map<number, PowerOption>();

    for (const alien of aliens) {
      for (const power of alien.PowerList) {
        uniquePowers.set(power.AlienPowerId, {
          AlienPowerId: power.AlienPowerId,
          AlienPowerName: power.AlienPowerName,
        });
      }
    }

    return [...uniquePowers.values()].sort((first, second) =>
      first.AlienPowerName.localeCompare(second.AlienPowerName),
    );
  }, [aliens]);

  const filteredAliens = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return aliens;

    return aliens.filter((alien) =>
      [alien.AlienName, alien.Species, alien.HomePlanet].some((value) =>
        value.toLocaleLowerCase().includes(query),
      ),
    );
  }, [aliens, search]);
  const aliensWithKnownActiveState = aliens.filter(
    (alien) => alien.IsActive !== undefined,
  );

  return (
    <section className="alien-admin" aria-labelledby="alien-admin-title">
      <header className="alien-admin-heading">
        <div>
          <span className="alien-admin-eyebrow">Workspace management</span>
          <h1 id="alien-admin-title">Alien settings</h1>
          <p>Manage the alien roster available across your workspace.</p>
        </div>
        <button
          className="alien-admin-button alien-admin-button-primary"
          onClick={() => setIsAddModalOpen(true)}
          type="button"
        >
          <Icon name="plus" />
          Add alien
        </button>
      </header>

      <div className="alien-admin-summary">
        <div>
          <span>Total aliens</span>
          <strong>{aliens.length}</strong>
        </div>
        <div>
          <span>Active</span>
          <strong>
            {aliensWithKnownActiveState.length > 0
              ? aliensWithKnownActiveState.filter((alien) => alien.IsActive)
                  .length
              : "—"}
          </strong>
        </div>
        <div>
          <span>Unlocked</span>
          <strong>{aliens.filter((alien) => alien.Unlocked).length}</strong>
        </div>
      </div>

      <section className="alien-admin-panel" aria-label="Alien roster">
        <div className="alien-admin-toolbar">
          <div>
            <h2>All aliens</h2>
            <p>Review the current alien catalog.</p>
          </div>
          <label className="alien-admin-search">
            <Icon name="search" />
            <input
              aria-label="Search aliens"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search aliens..."
              type="search"
              value={search}
            />
          </label>
        </div>

        {loadError ? (
          <div className="alien-admin-state" role="alert">
            <p>{loadError}</p>
            <button
              className="alien-admin-button alien-admin-button-secondary"
              onClick={() => void refreshAliens()}
              type="button"
            >
              Try again
            </button>
          </div>
        ) : loading ? (
          <div className="alien-admin-state" role="status">
            Loading alien roster…
          </div>
        ) : filteredAliens.length === 0 ? (
          <div className="alien-admin-state">
            {aliens.length === 0
              ? "No aliens have been added yet."
              : "No aliens match your search."}
          </div>
        ) : (
          <div className="alien-admin-table-wrap">
            <table className="alien-admin-table">
              <thead>
                <tr>
                  <th scope="col">Alien</th>
                  <th scope="col">Species</th>
                  <th scope="col">Home planet</th>
                  <th scope="col">Level</th>
                  <th scope="col">Powers</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAliens.map((alien) => (
                  <tr key={alien.AlienGuid}>
                    <td>
                      <div className="alien-admin-name">
                        <span>{alien.AlienName.slice(0, 2).toUpperCase()}</span>
                        <strong>{alien.AlienName}</strong>
                      </div>
                    </td>
                    <td>{alien.Species}</td>
                    <td>{alien.HomePlanet}</td>
                    <td>
                      <span className="alien-admin-level">
                        {alien.AlienLevel}
                      </span>
                    </td>
                    <td>
                      {alien.PowerList.length > 0
                        ? alien.PowerList.map((power) => power.AlienPowerName).join(", ")
                        : "—"}
                    </td>
                    <td>
                      <div className="alien-admin-statuses">
                        <AlienStatus active={alien.IsActive} />
                        {alien.Unlocked && (
                          <span className="alien-admin-unlocked">Unlocked</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !loadError && filteredAliens.length > 0 && (
          <div className="alien-admin-table-footer">
            Showing {filteredAliens.length} of {aliens.length} aliens
          </div>
        )}
      </section>

      {isAddModalOpen && (
        <AddAlienModal
          onClose={() => setIsAddModalOpen(false)}
          onCreated={refreshAliens}
          powers={powers}
        />
      )}
    </section>
  );
}
