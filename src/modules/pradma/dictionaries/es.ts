export const pradmaDictEs = {
  title: 'Industria y Comercio',
  description: 'Gestión del impuesto de Industria y Comercio (PRADMA).',
  clients: {
    title: 'Contribuyentes',
    loading: 'Cargando contribuyentes...',
    empty: 'No hay contribuyentes para mostrar.',
    errorLoading: 'No se pudieron cargar los contribuyentes.',
    create: 'Crear contribuyente',
    searchPlaceholder: 'Buscar por nombre o identificación',
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
    searchPlaceholder: 'Buscar por nombre o ID',
    new: 'Nuevo establecimiento',
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
      clientId: 'Contribuyente',
      clientPlaceholder: 'Buscar contribuyente...',
      clientNoResults: 'No se encontraron contribuyentes',
      registrationNumber: 'Número de registro',
      numberIdentification: 'Número de identificación',
      documentType: 'Tipo de documento'
    },
    tabs: {
      data: 'Datos',
      client: 'Contribuyente',
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
        serverError: 'No se pudo guardar el establecimiento.',
        deleteError: 'No se pudo eliminar el establecimiento.'
      },
      success: {
        created: 'Establecimiento creado correctamente.',
        updated: 'Establecimiento actualizado correctamente.',
        deleted: 'Establecimiento eliminado correctamente.'
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
    searchPlaceholder: 'Buscar por código o nombre',
    columns: {
      id: 'ID',
      activityTypeCode: 'Código tipo',
      activityTypeName: 'Nombre tipo',
      yearInitial: 'Año inicial',
      yearEnd: 'Año final'
    },
    fields: {
      activityTypeCode: 'Código de actividad',
      activityTypeName: 'Nombre de la actividad',
      yearInitial: 'Año inicial',
      yearEnd: 'Año final'
    },
    form: {
      errors: {
        codeRequired: 'El código es obligatorio',
        nameRequired: 'El nombre es obligatorio',
        yearRequired: 'El año es obligatorio',
        yearInvalid: 'Ingresá un año de 4 dígitos',
        yearEndBeforeStart: 'El año final debe ser mayor o igual al inicial',
        serverError: 'No se pudo guardar la actividad económica. Intentá de nuevo.'
      },
      success: {
        created: 'Actividad económica creada correctamente.',
        updated: 'Actividad económica actualizada correctamente.'
      }
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
    searchPlaceholder: 'Buscar por correo',
    columns: {
      id: 'ID',
      email: 'Correo',
      role: 'Rol'
    },
    fields: {
      id: 'UID',
      idHint: 'UID de Firebase Authentication del usuario',
      email: 'Correo electrónico',
      role: 'Rol'
    },
    roles: {
      ADMIN: 'Administrador',
      OPERATOR: 'Operador'
    },
    form: {
      errors: {
        idRequired: 'El UID es obligatorio',
        emailRequired: 'El correo es obligatorio',
        emailInvalid: 'Correo electrónico inválido',
        roleRequired: 'El rol es obligatorio',
        serverError: 'No se pudo guardar el usuario. Intentá de nuevo.'
      },
      success: {
        created: 'Usuario creado correctamente.',
        updated: 'Usuario actualizado correctamente.'
      }
    }
  },
  settle: {
    year: 'Año a liquidar',
    noYearAvailable: 'Este establecimiento está al día con sus liquidaciones.',
    months: 'Meses de liquidación',
    startDate: 'Fecha inicial',
    endDate: 'Fecha final',
    presentationDate: 'Fecha de presentación',
    settlementDate: 'Fecha de liquidación',
    calculate: 'Calcular',
    month: 'mes',
    monthsPlural: 'meses',
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
      settlementDateFuture: 'La fecha de liquidación no puede ser anterior a hoy',
      activitiesInvalid: 'Completá el código y las ventas de todas las actividades'
    },
    result: {
      title: 'Resultado de la liquidación',
      newSettlement: 'Nueva liquidación',
      downloadPdf: 'Guardar liquidación',
      activitiesTitle: 'Actividades',
      tariffRate: 'Tarifa',
      icaTax: 'ICA',
      saved: 'Liquidación guardada correctamente.',
      saveError: 'No se pudo guardar la liquidación. Intentá de nuevo.',
      savingPdf: 'Guardando PDF…',
      discardTitle: '¿Descartar esta liquidación?',
      discardDescription:
        'El cálculo no se guardó. Si cerrás, vas a tener que calcularlo de nuevo.',
      discardConfirm: 'Descartar'
    }
  },
  migrations: {
    title: 'Migraciones',
    upload: 'Subir archivo DBF',
    clearData: 'Limpiar datos existentes antes de migrar',
    success: 'Migración completada correctamente.',
    error: 'Error durante la migración.',
    migrating: 'Migrando archivo, puede tardar unos minutos…',
    recordsMigrated: '{success}/{total} registros migrados',
    moreErrors: '… y {count} errores más',
    invalidFile: 'Solo se aceptan archivos .dbf',
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
        notRun: 'No ejecutado',
        skipped: 'Omitido'
      }
    }
  },
  invoices: {
    title: 'Liquidaciones',
    loading: 'Cargando liquidaciones...',
    empty: 'No hay liquidaciones para mostrar.',
    emptyHint: 'Las liquidaciones se generan desde el detalle de cada establecimiento.',
    errorLoading: 'No se pudieron cargar las liquidaciones.',
    searchPlaceholder: 'Buscar por año, ID o establecimiento',
    filters: {
      all: 'Todos'
    },
    sheet: {
      draft: 'Borrador',
      detail: 'Detalle',
      pdf: 'PDF',
      pdfTitle: 'Liquidación en PDF',
      activities: 'Actividades',
      settlement: 'Liquidación',
      activity: 'Actividad',
      tariff: 'Tarifa ‰',
      ica: 'ICA',
      months: 'meses'
    },
    columns: {
      id: 'ID',
      establishment: 'Establecimiento',
      year: 'Año',
      status: 'Estado',
      total: 'Total',
      presentationDate: 'Fecha presentación'
    },
    status: {
      draft: 'Borrador',
      created: 'Creado',
      pending: 'Pendiente',
      paid: 'Pagada',
      overdue: 'Vencida',
      expired: 'Expirada'
    },
    expirationDate: 'Vence'
  },
  sanctions: {
    title: 'Sanciones',
    loading: 'Cargando sanciones...',
    empty: 'No hay sanciones para mostrar.',
    errorLoading: 'No se pudieron cargar las sanciones.',
    create: 'Crear sanción',
    edit: 'Editar sanción',
    delete: 'Eliminar sanción',
    deleteConfirm: '¿Está seguro de eliminar esta sanción?',
    success: {
      created: 'Sanción creada correctamente.',
      updated: 'Sanción actualizada correctamente.',
      deleted: 'Sanción eliminada correctamente.'
    },
    columns: {
      id: 'ID',
      year: 'Año',
      percentage: 'Porcentaje',
      minSanction: 'Mínima sanción',
      minSanctionAlt: 'Mínima sanción alt.'
    },
    fields: {
      year: 'Año',
      percentage: 'Porcentaje (%)',
      minSanction: 'Mínima sanción',
      minSanctionAlt: 'Mínima sanción alternativa'
    },
    form: {
      errors: {
        yearRequired: 'El año es obligatorio',
        yearInvalid: 'El año debe ser un número válido',
        percentageRequired: 'El porcentaje es obligatorio',
        percentageInvalid: 'El porcentaje debe ser un número válido',
        minSanctionRequired: 'La mínima sanción es obligatoria',
        minSanctionInvalid: 'Debe ser un número válido',
        minSanctionAltRequired: 'La mínima sanción alternativa es obligatoria',
        minSanctionAltInvalid: 'Debe ser un número válido',
        serverError: 'No se pudo guardar la sanción. Intentá de nuevo.'
      },
      success: {
        created: 'Sanción creada correctamente.',
        updated: 'Sanción actualizada correctamente.'
      }
    }
  },
  interestRates: {
    title: 'Tasas de interés',
    loading: 'Cargando tasas de interés...',
    empty: 'No hay tasas de interés para mostrar.',
    errorLoading: 'No se pudieron cargar las tasas de interés.',
    create: 'Crear tasa de interés',
    edit: 'Editar tasa de interés',
    delete: 'Eliminar tasa de interés',
    deleteConfirm: '¿Está seguro de eliminar esta tasa de interés?',
    success: {
      created: 'Tasa de interés creada correctamente.',
      updated: 'Tasa de interés actualizada correctamente.',
      deleted: 'Tasa de interés eliminada correctamente.'
    },
    columns: {
      id: 'ID',
      year: 'Año',
      startDate: 'Fecha inicio',
      endDate: 'Fecha fin',
      percentage: 'Porcentaje',
      interestPercentage: 'Interés'
    },
    fields: {
      year: 'Año',
      startDate: 'Fecha inicio',
      endDate: 'Fecha fin',
      rateValue1: 'Valor tasa 1',
      rateValue2: 'Valor tasa 2',
      rateValue3: 'Valor tasa 3',
      percentage: 'Porcentaje (%)',
      surchargePercentage: 'Porcentaje recargo (%)',
      interestPercentage: 'Porcentaje interés (%)',
      rateValuesHint: 'Valores de referencia usados por la liquidación según el tramo de mora'
    },
    form: {
      sections: {
        validity: 'Vigencia',
        rateValues: 'Valores de tasa',
        percentages: 'Porcentajes'
      },
      errors: {
        yearRequired: 'El año es obligatorio',
        yearInvalid: 'El año debe ser un número válido',
        startDateRequired: 'La fecha inicio es obligatoria',
        endDateRequired: 'La fecha fin es obligatoria',
        endDateBeforeStart: 'La fecha fin debe ser posterior a la fecha inicio',
        percentageRequired: 'El porcentaje es obligatorio',
        percentageInvalid: 'Debe ser un número válido',
        serverError: 'No se pudo guardar la tasa de interés. Intentá de nuevo.'
      },
      success: {
        created: 'Tasa de interés creada correctamente.',
        updated: 'Tasa de interés actualizada correctamente.'
      }
    }
  },
  discounts: {
    title: 'Descuentos',
    loading: 'Cargando descuentos...',
    empty: 'No hay descuentos para mostrar.',
    errorLoading: 'No se pudieron cargar los descuentos.',
    create: 'Crear descuento',
    edit: 'Editar descuento',
    delete: 'Eliminar descuento',
    deleteConfirm: '¿Está seguro de eliminar este descuento?',
    success: {
      created: 'Descuento creado correctamente.',
      updated: 'Descuento actualizado correctamente.',
      deleted: 'Descuento eliminado correctamente.'
    },
    columns: {
      id: 'ID',
      year: 'Año',
      startDate: 'Fecha inicio',
      endDate: 'Fecha fin',
      percentage: 'Porcentaje'
    },
    fields: {
      year: 'Año',
      startDate: 'Fecha inicio',
      endDate: 'Fecha fin',
      percentage: 'Porcentaje (%)'
    },
    form: {
      errors: {
        yearRequired: 'El año es obligatorio',
        yearInvalid: 'El año debe ser un número válido',
        startDateRequired: 'La fecha inicio es obligatoria',
        endDateRequired: 'La fecha fin es obligatoria',
        percentageRequired: 'El porcentaje es obligatorio',
        percentageInvalid: 'Debe ser un número válido',
        endDateBeforeStart: 'La fecha fin debe ser posterior a la fecha inicio',
        serverError: 'No se pudo guardar el descuento. Intentá de nuevo.'
      },
      success: {
        created: 'Descuento creado correctamente.',
        updated: 'Descuento actualizado correctamente.'
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
    of: 'de',
    close: 'Cerrar',
    edit: 'Editar',
    delete: 'Eliminar',
    deleting: 'Eliminando...',
    actions: 'Acciones',
    clearSearch: 'Limpiar búsqueda',
    searchByYear: 'Buscar por año',
    noResultsTitle: 'Sin resultados',
    noResultsDescription: 'No encontramos nada para "{query}". Probá con otro término.',
    emptyHint: 'Cuando crees el primero va a aparecer acá.',
    errorTitle: 'No se pudo cargar la información',
    rangeLabel: '{from}–{to} de {total}',
    prevPage: 'Página anterior',
    nextPage: 'Página siguiente',
    selectPlaceholder: 'Seleccionar...',
    deleteTitle: '¿Eliminar este registro?',
    deleteDescription: 'Esta acción no se puede deshacer.',
    deleteError: 'No se pudo eliminar. Intentá de nuevo.',
    optional: 'Opcional',
    notAvailable: '—'
  }
};

export type PradmaDictionary = typeof pradmaDictEs;
