export const reportTitoDictEs = {
  title: 'Análisis CGM',
  search: {
    label: 'Buscar contrato'
  },
  form: {
    startDateLabel: 'Fecha inicio',
    endDateLabel: 'Fecha fin',
    periodLabel: 'Período',
    periods: {
      '15m': '15 minutos',
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual'
    },
    submit: 'Generar informe',
    selectContractFirst: 'Seleccioná un contrato para continuar',
    error: 'Error al generar el informe'
  },
  pdf: {
    title: 'Informe generado',
    download: 'Descargar PDF'
  }
};

export type ReportTitoDictionary = typeof reportTitoDictEs;
