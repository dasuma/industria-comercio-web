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
    }
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
    establishmentTariffs: 'Migrar tarifas de establecimientos',
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
        establishmentTariffs: 'Establ.',
        summary: 'Resumen'
      },
      descriptions: {
        clients: 'Terceros.DBF → clients',
        activityCategories: 'DSTIYC.DBF → activity_categories',
        tariffs: 'FCTIYC.DBF → tariffs',
        interestRates: 'intpreacd.DBF → interest_rates',
        yearConfigs: 'años.DBF → year_configs',
        discounts: 'dsciyc.DBF → discounts',
        establishmentTariffs: 'ESTIYC.DBF → establishment_tariffs'
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
    saving: 'Guardando...',
    serverError: 'Ocurrió un error. Intentá de nuevo.',
    yes: 'Sí',
    no: 'No',
    page: 'Página',
    of: 'de'
  }
};

export type PradmaDictionary = typeof pradmaDictEs;
