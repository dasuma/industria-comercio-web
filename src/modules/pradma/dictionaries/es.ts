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
    }
  },
  establishmentActivities: {
    title: 'Actividades de establecimiento',
    loading: 'Cargando actividades...',
    empty: 'No hay actividades para mostrar.',
    errorLoading: 'No se pudieron cargar las actividades.',
    create: 'Crear actividad',
    edit: 'Editar actividad',
    delete: 'Eliminar actividad',
    deleteConfirm: '¿Está seguro de eliminar esta actividad?',
    success: {
      created: 'Actividad creada correctamente.',
      updated: 'Actividad actualizada correctamente.',
      deleted: 'Actividad eliminada correctamente.'
    }
  },
  activityTypes: {
    title: 'Tipos de actividad',
    loading: 'Cargando tipos de actividad...',
    empty: 'No hay tipos de actividad para mostrar.',
    errorLoading: 'No se pudieron cargar los tipos de actividad.',
    create: 'Crear tipo de actividad',
    edit: 'Editar tipo de actividad',
    delete: 'Eliminar tipo de actividad',
    deleteConfirm: '¿Está seguro de eliminar este tipo de actividad?',
    success: {
      created: 'Tipo de actividad creado correctamente.',
      updated: 'Tipo de actividad actualizado correctamente.',
      deleted: 'Tipo de actividad eliminado correctamente.'
    }
  },
  activityCategories: {
    title: 'Categorías de actividad',
    loading: 'Cargando categorías...',
    empty: 'No hay categorías para mostrar.',
    errorLoading: 'No se pudieron cargar las categorías.',
    create: 'Crear categoría',
    edit: 'Editar categoría',
    delete: 'Eliminar categoría',
    deleteConfirm: '¿Está seguro de eliminar esta categoría?',
    success: {
      created: 'Categoría creada correctamente.',
      updated: 'Categoría actualizada correctamente.',
      deleted: 'Categoría eliminada correctamente.'
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
    establishmentTariffs: 'Migrar tarifas de establecimientos'
  },
  common: {
    search: 'Buscar...',
    retry: 'Reintentar',
    save: 'Guardar',
    cancel: 'Cancelar',
    saving: 'Guardando...',
    serverError: 'Ocurrió un error. Intentá de nuevo.'
  }
};

export type PradmaDictionary = typeof pradmaDictEs;
