export const retentionDictEs = {
  tabs: {
    contracts: 'Contratos'
  },
  contracts: {
    search: {
      title: 'Contratos',
      placeholder: 'Seleccioná un contrato para ver sus detalles'
    },
    detail: {
      tabs: {
        basics: 'Datos básicos',
        company: 'Compañía',
        technical: 'Datos técnicos',
        contractRates: 'Contract Rates',
        recs: 'RECs',
        vas: 'VAs',
        users: 'Usuarios'
      },
      sections: {
        contract: 'Contrato',
        admin: 'Administrador',
        company: 'Empresa',
        technical: 'Datos técnicos',
        users: 'Usuarios'
      },
      fields: {
        id: 'ID',
        address: 'Dirección',
        city: 'Ciudad',
        country: 'País',
        niu: 'NIU',
        sui: 'SUI',
        sic: 'SIC',
        source: 'Fuente',
        startsAt: 'Inicio',
        internalCode: 'Código BIA',
        isCurrent: 'Vigente',
        isCommercial: 'Comercial',
        isUrban: 'Urbano',
        documentType: 'Tipo doc.',
        documentNumber: 'Documento',
        email: 'Email',
        phone: 'Teléfono',
        name: 'Nombre',
        status: 'Estado',
        meterId: 'Medidor',
        meterIntegrated: 'Integrado',
        meterRealtime: 'Tiempo real',
        tensionLevel: 'Nivel de tensión',
        nominalVoltage: 'Tensión nominal',
        phaseCount: 'Fases',
        timezone: 'Zona horaria',
        factorCurrent: 'Factor corriente',
        factorEnergy: 'Factor energía',
        factorPower: 'Factor potencia',
        factorVoltage: 'Factor tensión',
        solarCapacity: 'Capacidad solar',
        hasRenewable: 'Renovable',
        consumptionAverage: 'Consumo promedio',
        lastMarketer: 'Última comercializadora',
        withReactiveCharges: 'Cargos reactivos',
        serviceCut: 'Corte de servicio',
        role: 'Rol',
        billingEmail: 'Facturación'
      },
      yes: 'Sí',
      no: 'No',
      recs: {
        id: 'ID',
        recValue: 'Valor REC',
        startDate: 'Inicio',
        endDate: 'Fin',
        userId: 'Usuario',
        createdAt: 'Creado',
        empty: 'Sin RECs para este contrato'
      },
      edit: 'Editar',
      save: 'Guardar',
      saving: 'Guardando…',
      cancel: 'Cancelar',
      saveSuccess: 'Contrato actualizado',
      saveError: 'Error al guardar el contrato'
    }
  }
};

export type RetentionDictionary = typeof retentionDictEs;
