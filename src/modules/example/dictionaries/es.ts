export const exampleDictEs = {
  title: 'Ejemplos',
  description:
    'Módulo de ejemplo. Demuestra el patrón completo: data layer, form, i18n, estados de UI. Borrable cuando arranquen los módulos reales.',
  list: {
    loading: 'Cargando ejemplos...',
    empty: 'No hay ejemplos para mostrar.',
    errorLoading: 'No se pudieron cargar los ejemplos.',
    retry: 'Reintentar'
  },
  form: {
    title: 'Crear nuevo ejemplo',
    fields: {
      title: 'Título',
      body: 'Contenido'
    },
    actions: {
      submit: 'Crear',
      submitting: 'Creando...'
    },
    errors: {
      titleRequired: 'El título es obligatorio',
      titleTooLong: 'Máximo 100 caracteres',
      bodyRequired: 'El contenido es obligatorio',
      bodyTooLong: 'Máximo 500 caracteres',
      serverError: 'No se pudo crear el ejemplo. Intentá de nuevo.'
    },
    success: 'Ejemplo creado correctamente'
  }
};

export type ExampleDictionary = typeof exampleDictEs;
