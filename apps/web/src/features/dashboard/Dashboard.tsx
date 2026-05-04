import { applicationStatuses, statusLabels } from '../applications/application.types';
import type { DashboardSummary } from './dashboard.types';

type DashboardProps = {
  summary: DashboardSummary;
};

const stackCountText = (count: number) => `${count} ${count === 1 ? 'vaga' : 'vagas'}`;

export function Dashboard({ summary }: DashboardProps) {
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <div className="section-heading">
        <p className="eyebrow">Resumo</p>
        <h2 id="dashboard-title">Dashboard da busca</h2>
      </div>

      <div className="dashboard-grid">
        <article className="metric-card metric-card--total">
          <span>Total de candidaturas</span>
          <strong>{summary.total}</strong>
        </article>

        {applicationStatuses.map((status) => (
          <article className="metric-card" key={status}>
            <span>{statusLabels[status]}</span>
            <strong>{summary.statusCounts[status]}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-details">
        <article className="panel-card">
          <h3>Próximas ações</h3>
          {summary.upcomingActions.length === 0 ? (
            <p className="muted">Nenhuma próxima ação nos próximos 7 dias.</p>
          ) : (
            <ul className="detail-list">
              {summary.upcomingActions.map((action) => (
                <li className={action.isOverdue ? 'is-overdue' : undefined} key={action.id}>
                  <span>{`${action.company} — ${action.role}`}</span>
                  <strong>{action.nextActionDate}</strong>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="panel-card">
          <h3>Stacks frequentes</h3>
          {summary.frequentStacks.length === 0 ? (
            <p className="muted">Nenhuma stack registrada ainda.</p>
          ) : (
            <ul className="detail-list">
              {summary.frequentStacks.map((stack) => (
                <li key={stack.stack}>
                  <span>{stack.stack}</span>
                  <strong>{stackCountText(stack.count)}</strong>
                </li>
              ))}
            </ul>
          )}
        </article>
      </div>
    </section>
  );
}
