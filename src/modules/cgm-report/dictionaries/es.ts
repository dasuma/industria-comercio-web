export const cgmReportDictEs = {
  title: 'Reportes CGM',
  createReport: 'Reporte',
  filterAll: 'Todos',
  filterTypeLabel: 'Tipo',
  filterKindLabel: 'Kind',
  filterTypePlaceholder: 'Tipo de reporte',
  filterKindPlaceholder: 'Kind de reporte',
  reportTypes: {
    DAILY: 'Diario',
    MONTHLY: 'Mensual'
  },
  reportKinds: {
    DEFAULT: 'Default',
    COMMERCIALIZATION: 'Comercialización',
    COMMERCIALIZATION_BACKUP: 'Comercialización Backup',
    AGPE: 'AGPE',
    AGPE_BACKUP: 'AGPE Backup'
  },
  reportStatus: {
    PENDING: 'Pendiente',
    PROCESSING: 'Procesando',
    COMPLETED: 'Completado',
    FAILED: 'Fallido',
    NOTIFIED: 'Notificado'
  },
  columns: {
    id: 'ID',
    reportDate: 'Fecha reporte',
    createdAt: 'Fecha envío',
    type: 'Tipo',
    kind: 'Kind',
    status: 'Estado',
    contracts: 'Contratos',
    download: 'Descargar'
  },
  modal: {
    title: 'Crear nuevo reporte',
    description: 'El reporte se procesará de forma asíncrona. Recibirás el resultado en la lista.',
    contractIdsLabel: 'IDs de contratos',
    contractIdsPlaceholder: 'Ej: 101, 102, 103',
    contractIdsHint: 'Ingresá los IDs separados por comas.',
    typeLabel: 'Tipo de reporte',
    typePlaceholder: 'Seleccioná un tipo',
    kindLabel: 'Kind',
    kindPlaceholder: 'Seleccioná un kind',
    dateLabel: 'Fecha',
    submit: 'Crear',
    cancel: 'Cancelar',
    success: 'Reporte en proceso',
    error: 'Error al crear el reporte'
  },
  pagination: {
    previous: 'Anterior',
    next: 'Siguiente'
  },
  compactMode: 'Modo compacto',
  empty: 'No hay reportes disponibles'
};

export type CgmReportDictionary = typeof cgmReportDictEs;
