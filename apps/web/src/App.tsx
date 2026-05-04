const plannedFeatures = [
  'Cadastro e acompanhamento de candidaturas',
  'Filtros por status, modalidade, stack e texto',
  'Próximas ações para follow-up',
  'Dashboard com métricas simples da busca',
];

export function App() {
  return (
    <main className="page-shell">
      <section className="hero-card" aria-labelledby="page-title">
        <p className="eyebrow">Portfólio ADS • MVP em construção</p>
        <h1 id="page-title">JobTrack ADS</h1>
        <p className="hero-copy">
          Um tracker de candidaturas para estudantes de ADS/TI organizarem oportunidades de estágio e vagas júnior por status, stack, modalidade e próximas ações.
        </p>

        <ul className="feature-list" aria-label="Funcionalidades planejadas para o MVP">
          {plannedFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
