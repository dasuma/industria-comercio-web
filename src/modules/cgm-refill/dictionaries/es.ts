export const cgmRefillDictEs = {
  title: 'Consumo CGM',
  refreshCache: 'Actualizar consumos',
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
  form: {
    title: 'Configurar refill',
    startDateLabel: 'Fecha inicio',
    endDateLabel: 'Fecha fin',
    reasonLabel: 'Motivo',
    reasonPlaceholder: 'Motivo o detalle del refill…',
    deleteOnlyLabel: 'Solo eliminar (sin reinsertar)',
    submit: 'Ejecutar refill',
    cancel: 'Cancelar',
    success: 'Refill iniciado correctamente',
    error: 'Error al ejecutar el refill',
    selectContractFirst: 'Seleccioná un contrato para continuar'
  }
};

export type CgmRefillDictionary = typeof cgmRefillDictEs;
