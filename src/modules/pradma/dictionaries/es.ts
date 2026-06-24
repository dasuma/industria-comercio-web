export const pradmaDictEs = {
  title: 'Industria y Comercio',
  description: 'Gestión del impuesto de Industria y Comercio (PRADMA).',
  clients: {
    title: 'Contribuyentes',
    loading: 'Cargando contribuyentes...',
    empty: 'No hay contribuyentes para mostrar.',
    errorLoading: 'No se pudieron cargar los contribuyentes.',
    create: 'Crear contribuyente',
    edit: 'Editar contribuyente',
    delete: 'Eliminar contribuyente',
    deleteConfirm: '¿Está seguro de eliminar este contribuyente?',
    success: {
      created: 'Contribuyente creado correctamente.',
      updated: 'Contribuyente actualizado correctamente.',
      deleted: 'Contribuyente eliminado correctamente.'
    },
    columns: {
      id: 'ID',
      name: 'Nombre',
      documentType: 'Tipo doc.',
      email: 'Correo',
      phone: 'Teléfono',
      isCompany: 'Empresa'
    },
    fields: {
      id: 'Número de identificación',
      name: 'Nombre',
      documentType: 'Tipo de documento',
      address: 'Dirección',
      phone: 'Teléfono',
      email: 'Correo electrónico',
      isCompany: 'Es empresa'
    },
    form: {
      title: 'Datos del contribuyente',
      createTitle: 'Nuevo contribuyente',
      errors: {
        idRequired: 'El número de identificación es obligatorio',
        idOnlyNumbers: 'Solo se permiten números',
        nameRequired: 'El nombre es obligatorio',
        documentTypeRequired: 'El tipo de documento es obligatorio',
        addressRequired: 'La dirección es obligatoria',
        phoneRequired: 'El teléfono es obligatorio',
        phoneOnlyNumbers: 'El teléfono solo debe contener números',
        emailInvalid: 'Correo electrónico inválido',
        serverError: 'No se pudo guardar el contribuyente. Intentá de nuevo.'
      },
      success: {
        created: 'Contribuyente creado correctamente.',
        updated: 'Contribuyente actualizado correctamente.'
      }
    }
  },
  establishments: {
    title: 'Establecimientos',
    loading: 'Cargando establecimientos...',
    empty: 'No hay establecimientos para mostrar.',
    errorLoading: 'No se pudieron cargar los establecimientos.',
    create: 'Crear establecimiento',
    edit: 'Editar establecimiento',
    delete: 'Eliminar establecimiento',
    deleteConfirm: '¿Está seguro de eliminar este establecimiento?',
    success: {
      created: 'Establecimiento creado correctamente.',
      updated: 'Establecimiento actualizado correctamente.',
      deleted: 'Establecimiento eliminado correctamente.'
    },
    columns: {
      id: 'ID',
      registrationNumber: 'N.° registro',
      name: 'Nombre',
      clientId: 'Contribuyente',
      address: 'Dirección',
      phone: 'Teléfono',
      startDate: 'Fecha inicio'
    },
    fields: {
      name: 'Nombre',
      address: 'Dirección',
      phone: 'Teléfono',
      description: 'Descripción',
      startDate: 'Fecha inicio',
      endDate: 'Fecha fin',
      clientId: 'Número de identificación'
    },
    tabs: {
      data: 'Datos',
      client: 'Cliente',
      payments: 'Pagos',
      settlements: 'Liquidaciones',
      settle: 'Liquidar'
    },
    form: {
      errors: {
        nameRequired: 'El nombre es obligatorio',
        addressRequired: 'La dirección es obligatoria',
        startDateRequired: 'La fecha de inicio es obligatoria',
        phoneOnlyNumbers: 'El teléfono solo debe contener números',
        clientIdRequired: 'El contribuyente es obligatorio',
        serverError: 'No se pudo guardar el establecimiento.'
      },
      success: {
        created: 'Establecimiento creado correctamente.',
        updated: 'Establecimiento actualizado correctamente.'
      }
    },
    comingSoon: 'Próximamente'
  },
  activityCategories: {
    title: 'Actividades económicas',
    loading: 'Cargando actividades económicas...',
    empty: 'No hay actividades económicas para mostrar.',
    errorLoading: 'No se pudieron cargar las actividades económicas.',
    create: 'Crear actividad económica',
    edit: 'Editar actividad económica',
    delete: 'Eliminar actividad económica',
    deleteConfirm: '¿Está seguro de eliminar esta actividad económica?',
    success: {
      created: 'Actividad económica creada correctamente.',
      updated: 'Actividad económica actualizada correctamente.',
      deleted: 'Actividad económica eliminada correctamente.'
    },
    columns: {
      id: 'ID',
      activityTypeCode: 'Código tipo',
      activityTypeName: 'Nombre tipo',
      yearInitial: 'Año inicial',
      yearEnd: 'Año final'
    }
  },
  users: {
    title: 'Usuarios',
    loading: 'Cargando usuarios...',
    empty: 'No hay usuarios para mostrar.',
    errorLoading: 'No se pudieron cargar los usuarios.',
    create: 'Crear usuario',
    edit: 'Editar usuario',
    delete: 'Eliminar usuario',
    deleteConfirm: '¿Está seguro de eliminar este usuario?',
    success: {
      created: 'Usuario creado correctamente.',
      updated: 'Usuario actualizado correctamente.',
      deleted: 'Usuario eliminado correctamente.'
    },
    columns: {
      id: 'ID',
      email: 'Correo',
      role: 'Rol'
    }
  },
  settle: {
    months: 'Meses de liquidación',
    startDate: 'Fecha inicial',
    endDate: 'Fecha final',
    presentationDate: 'Fecha de presentación',
    settlementDate: 'Fecha de liquidación',
    calculate: 'Calcular',
    steps: {
      period: 'Período',
      activities: 'Actividades'
    },
    activities: {
      add: 'Agregar actividad',
      defaultActivity: 'Actividad principal',
      activity: 'Actividad',
      activityCode: 'Código de actividad',
      activityName: 'Nombre de la actividad',
      selectActivity: 'Seleccionar actividad...',
      ventasAnuales: 'Ventas anuales',
      impuestoJuegos: 'Impuesto de juegos permitidos y ambulantes',
      menosSaldo: 'Menos saldo a favor año anterior',
      menosAnticipo: 'Menos anticipo del año anterior',
      menosRetenciones: 'Menos retenciones practicadas',
      optionalTaxes: {
        title: 'Impuestos opcionales',
        avisosTableros: 'Impuesto de avisos y tableros',
        sobretasaBomberil: 'Sobretasa bomberil',
        estampillaCMGRD: 'Estampilla CMGRD',
        valorNovedad: 'Valor de novedad'
      }
    },
    baseGravable: {
      title: 'Base gravable',
      row8: '8 - Total ingresos ordinarios y extraordinarios del periodo en todo el país',
      row9: '9 - Menos ingresos fuera de este municipio o distrito',
      row10: '10 - Total ingresos en este municipio (renglón 8 menos 9)',
      row11: '11 - Menos devoluciones, rebajas y descuentos',
      row12: '12 - Menos ingresos por exportaciones',
      row13: '13 - Menos ingresos por venta de activos fijos',
      row14: '14 - Menos actividades excluidas, no sujetas y otros no gravados',
      row15: '15 - Menos otras actividades exentas en este municipio',
      row16: '16 - Total ingresos gravables (renglón 10 menos 11, 12, 13, 14 y 15)'
    },
    errors: {
      startDateRequired: 'La fecha inicial es obligatoria',
      endDateRequired: 'La fecha final es obligatoria',
      presentationDateRequired: 'La fecha de presentación es obligatoria',
      presentationDateFuture: 'La fecha de presentación no puede ser anterior a hoy',
      settlementDateRequired: 'La fecha de liquidación es obligatoria',
      settlementDateFuture: 'La fecha de liquidación no puede ser anterior a hoy'
    },
    result: {
      title: 'Resultado de la liquidación',
      newSettlement: 'Nueva liquidación',
      activitiesTitle: 'Actividades',
      tariffRate: 'Tarifa',
      icaTax: 'ICA'
    }
  },
  invoices: {
    loading: 'Cargando liquidaciones...',
    empty: 'No hay liquidaciones para este establecimiento.',
    errorLoading: 'No se pudieron cargar las liquidaciones.',
    year: 'Año',
    expirationDate: 'Vencimiento',
    kind: 'Concepto',
    amount: 'Monto',
    statuses: {
      paid: 'Pagado',
      created: 'Creado'
    }
  },
  migrations: {
    title: 'Migraciones',
    upload: 'Subir archivo DBF',
    clearData: 'Limpiar datos existentes antes de migrar',
    success: 'Migración completada correctamente.',
    error: 'Error durante la migración.',
    clients: 'Migrar contribuyentes',
    activityCategories: 'Migrar categorías de actividad',
    tariffs: 'Migrar tarifas',
    interestRates: 'Migrar tasas de interés',
    yearConfigs: 'Migrar configuraciones anuales',
    discounts: 'Migrar descuentos',
    establishments: 'Migrar establecimientos',
    establishmentTariffs: 'Migrar tarifas de establecimientos',
    invoices: 'Migrar facturas',
    wizard: {
      stepOf: 'Paso {current} de {total}',
      back: 'Atrás',
      next: 'Siguiente',
      restart: 'Iniciar de nuevo',
      steps: {
        clients: 'Contribuyentes',
        activityCategories: 'Categorías',
        tariffs: 'Tarifas',
        interestRates: 'Intereses',
        yearConfigs: 'Años',
        discounts: 'Descuentos',
        establishments: 'Establ.',
        establishmentTariffs: 'Tarifas est.',
        invoices: 'Facturas',
        summary: 'Resumen'
      },
      descriptions: {
        clients: 'Terceros.DBF → clients',
        activityCategories: 'DSTIYC.DBF → activity_categories',
        tariffs: 'FCTIYC.DBF → tariffs',
        interestRates: 'intpreacd.DBF → interest_rates',
        yearConfigs: 'años.DBF → year_configs',
        discounts: 'dsciyc.DBF → discounts',
        establishments: 'ESTIYC.DBF → establishments',
        establishmentTariffs: 'ESTIYC.DBF → establishment_tariffs',
        invoices: 'ESTIYC.DBF → invoices'
      },
      summary: {
        title: 'Resumen de migración',
        step: 'Paso',
        file: 'DBF → Tabla',
        success: 'Exitosos',
        failed: 'Fallidos',
        total: 'Total',
        totals: 'Totales',
        allSuccess: 'Todas las migraciones completadas sin errores.',
        hasErrors: 'Algunas migraciones tuvieron errores.',
        notRun: 'No ejecutado'
      }
    }
  },
  common: {
    search: 'Buscar...',
    retry: 'Reintentar',
    save: 'Guardar',
    cancel: 'Cancelar',
    back: 'Atrás',
    saving: 'Guardando...',
    serverError: 'Ocurrió un error. Intentá de nuevo.',
    yes: 'Sí',
    no: 'No',
    page: 'Página',
    of: 'de'
  }
};

export type PradmaDictionary = typeof pradmaDictEs;
