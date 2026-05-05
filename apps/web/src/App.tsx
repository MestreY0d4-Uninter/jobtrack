import { useCallback, useEffect, useState } from 'react';

import { jobTrackApi, type JobTrackApi } from './api';
import { ApplicationForm } from './features/applications/ApplicationForm';
import { ApplicationList } from './features/applications/ApplicationList';
import {
  emptyApplicationFilters,
  hasActiveApplicationFilters,
  type ApplicationFilterState,
} from './features/applications/applicationFilters';
import {
  applicationStatuses,
  type CreateApplicationPayload,
  type JobApplication,
  statusLabels,
  workModeLabels,
  workModes,
} from './features/applications/application.types';
import { Dashboard } from './features/dashboard/Dashboard';
import type { DashboardSummary } from './features/dashboard/dashboard.types';

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Não foi possível completar a operação.';

type AppProps = {
  api?: JobTrackApi;
};

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export function App({ api = jobTrackApi }: AppProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [filters, setFilters] = useState<ApplicationFilterState>(emptyApplicationFilters);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);

    try {
      const [nextApplications, nextDashboardSummary] = await Promise.all([
        api.listApplications(filters),
        api.getDashboardSummary(),
      ]);

      setApplications(nextApplications);
      setDashboardSummary(nextDashboardSummary);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [api, filters]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const updateFilter = (field: keyof ApplicationFilterState, value: string) => {
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (payload: CreateApplicationPayload) => {
    setIsSaving(true);

    try {
      if (editingApplication === null) {
        await api.createApplication(payload);
      } else {
        await api.updateApplication(editingApplication.id, payload);
      }

      setEditingApplication(null);
      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (application: JobApplication) => {
    if (!window.confirm(`Excluir a candidatura de ${application.company}?`)) {
      return;
    }

    try {
      await api.deleteApplication(application.id);
      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Portfólio ADS • MVP funcional</p>
          <h1>JobTrack ADS</h1>
          <p>
            Tracker de candidaturas para organizar oportunidades de estágio e vagas júnior por status,
            stack, modalidade e próximas ações.
          </p>
        </div>
        <div className="header-card">
          <strong>{isDemoMode ? 'Demo estática' : 'Fluxo validado'}</strong>
          <span>
            {isDemoMode
              ? 'Dados fictícios no navegador, sem backend'
              : 'React + Fastify + PostgreSQL + testes'}
          </span>
        </div>
      </header>

      {errorMessage !== null ? <p className="app-error">{errorMessage}</p> : null}

      {dashboardSummary !== null ? (
        <Dashboard summary={dashboardSummary} />
      ) : (
        <section className="dashboard dashboard--loading">Carregando dashboard...</section>
      )}

      <section className="workspace-grid" aria-label="Gerenciamento de candidaturas">
        <article className="workspace-panel">
          <ApplicationForm
            initialApplication={editingApplication}
            isSubmitting={isSaving}
            onCancel={() => setEditingApplication(null)}
            onSubmit={handleSubmit}
            submitError={errorMessage}
          />
        </article>

        <article className="workspace-panel workspace-panel--list">
          <div className="section-heading">
            <p className="eyebrow">Pipeline</p>
            <h2>Candidaturas</h2>
          </div>

          <form className="filters" onSubmit={(event) => event.preventDefault()}>
            <label>
              Filtro por status
              <select onChange={(event) => updateFilter('status', event.target.value)} value={filters.status}>
                <option value="all">Todos os status</option>
                {applicationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Filtro por modalidade
              <select onChange={(event) => updateFilter('workMode', event.target.value)} value={filters.workMode}>
                <option value="all">Todas as modalidades</option>
                {workModes.map((workMode) => (
                  <option key={workMode} value={workMode}>
                    {workModeLabels[workMode]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Filtrar por stack
              <input
                onChange={(event) => updateFilter('stack', event.target.value)}
                placeholder="React, SQL..."
                type="search"
                value={filters.stack}
              />
            </label>

            <label>
              Buscar por empresa ou vaga
              <input
                onChange={(event) => updateFilter('search', event.target.value)}
                placeholder="empresa, cargo..."
                type="search"
                value={filters.search}
              />
            </label>

            {hasActiveApplicationFilters(filters) ? (
              <button className="button-secondary" onClick={() => setFilters(emptyApplicationFilters)} type="button">
                Limpar filtros
              </button>
            ) : null}
          </form>

          {isLoading ? (
            <p className="muted">Carregando candidaturas...</p>
          ) : (
            <ApplicationList applications={applications} onDelete={handleDelete} onEdit={setEditingApplication} />
          )}
        </article>
      </section>
    </main>
  );
}
