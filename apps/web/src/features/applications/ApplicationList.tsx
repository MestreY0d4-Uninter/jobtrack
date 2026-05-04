import type { JobApplication } from './application.types';
import { statusLabels, workModeLabels } from './application.types';

type ApplicationListProps = {
  applications: JobApplication[];
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
};

const optionalMeta = (label: string, value: string | undefined) =>
  value === undefined || value === '' ? null : (
    <span>
      {label}: {value}
    </span>
  );

export function ApplicationList({ applications, onDelete, onEdit }: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        <p>Nenhuma candidatura encontrada.</p>
        <span>Crie uma candidatura ou limpe os filtros para ver o pipeline.</span>
      </div>
    );
  }

  return (
    <ul className="application-list" aria-label="Candidaturas cadastradas">
      {applications.map((application) => (
        <li className="application-card" key={application.id}>
          <div className="application-card__header">
            <div>
              <h3>{application.company}</h3>
              <p>{application.role}</p>
            </div>
            <span className={`status-pill status-pill--${application.status}`}>
              {statusLabels[application.status]}
            </span>
          </div>

          <div className="application-meta">
            <span>{workModeLabels[application.workMode]}</span>
            {optionalMeta('Local', application.location)}
            {optionalMeta('Fonte', application.source)}
            {application.nextActionDate !== undefined ? (
              <span>Próxima ação: {application.nextActionDate}</span>
            ) : null}
          </div>

          {application.stacks.length > 0 ? (
            <ul className="tag-list" aria-label={`Stacks da candidatura ${application.company}`}>
              {application.stacks.map((stack) => (
                <li key={stack}>{stack}</li>
              ))}
            </ul>
          ) : null}

          {application.notes !== undefined && application.notes !== '' ? (
            <p className="application-notes">{application.notes}</p>
          ) : null}

          <div className="card-actions">
            {application.jobUrl !== undefined && application.jobUrl !== '' ? (
              <a href={application.jobUrl} rel="noreferrer" target="_blank">
                Abrir vaga
              </a>
            ) : null}
            <button type="button" onClick={() => onEdit(application)} aria-label={`Editar candidatura ${application.company}`}>
              Editar
            </button>
            <button
              className="button-danger"
              type="button"
              onClick={() => onDelete(application)}
              aria-label={`Excluir candidatura ${application.company}`}
            >
              Excluir
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
