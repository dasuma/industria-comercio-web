export const cgmAnalysisDictEs = {
  title: 'Análisis',
  refreshTooltip: 'Actualizar consumos',
  refreshSuccess: 'Consumos actualizados',
  cacheError: 'Error al actualizar consumos',
  monthLabel: 'Mes',
  selectContractFirst: 'Seleccioná un contrato para continuar',
  search: {
    label: 'Buscar contrato',
    placeholder: 'Ingresá un valor…',
    noResults: 'Sin resultados',
    searching: 'Buscando…',
    fields: {
      id: 'ID',
      name: 'Nombre',
      sic: 'SIC'
    }
  },
  contractInfo: {
    title: 'Información del contrato',
    name: 'Nombre',
    sic: 'SIC',
    id: 'ID contrato',
    sicAgpe: 'SIC AGPE',
    startsAt: 'Fecha inicio',
    billingEndsAt: 'Fin de facturación',
    consumptionAverage: 'Promedio de consumo'
  },
  refill: {
    button: 'Refill',
    modalTitle: 'Configurar refill',
    startDateLabel: 'Fecha inicio',
    endDateLabel: 'Fecha fin',
    reasonLabel: 'Motivo',
    reasonPlaceholder: 'Motivo o detalle del refill…',
    deleteOnlyLabel: 'Solo eliminar (sin reinsertar)',
    submit: 'Ejecutar refill',
    cancel: 'Cancelar',
    success: 'Refill iniciado correctamente',
    error: 'Error al ejecutar el refill'
  },
  analysis: {
    button: 'Informe',
    buttonLoading: 'Generando reporte',
    buttonReady: 'Ver reporte',
    modalTitle: 'Generar reporte',
    dateRangeLabel: 'Fechas',
    dateRangePlaceholder: 'Seleccioná un rango de fechas',
    periodLabel: 'Período',
    periods: {
      '15m': '15 minutos',
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual'
    },
    submit: 'Generar',
    cancel: 'Cancelar',
    error: 'Error al generar el informe',
    rangeError: 'Seleccioná un rango de fechas',
    pdf: {
      title: 'Reporte generado',
      download: 'Descargar PDF',
      regenerate: 'Generar nuevo reporte'
    }
  }
};

export type CgmAnalysisDictionary = typeof cgmAnalysisDictEs;
