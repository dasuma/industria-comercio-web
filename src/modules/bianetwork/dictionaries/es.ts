export const bianetworkDictEs = {
  tabs: {
    users: 'Usuarios',
    users_pro: 'Usuarios Pro',
    accounts: 'Cuentas',
    transactions: 'Transacciones',
    invoices: 'Facturas'
  },
  search: {
    open_label: 'Buscar',
    placeholder: 'Código de referido ({tab})'
  },
  shared: {
    status_filters: {
      all: 'Todos',
      pending: 'Pendientes',
      approved: 'Aprobados',
      denied: 'Negados',
      on_hold: 'En espera',
      action_required_user: 'Falta firmar'
    },
    status_labels: {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobado',
      DENIED: 'Negado',
      ON_HOLD: 'En espera',
      IN_TRANSIT: 'En tránsito',
      ACTION_REQUIRED_USER: 'Usuario falta firmar'
    },
    person_type_labels: {
      Natural: 'Natural',
      Legal: 'Jurídica'
    },
    pagination: {
      previous: 'Anterior',
      next: 'Siguiente'
    },
    compact_mode: 'Modo compacto',
    btn_cancel: 'Cancelar',
    btn_confirm: 'Confirmar',
    btn_close: 'Cerrar',
    btn_approve: 'Aprobar',
    btn_deny: 'Negar',
    btn_on_hold: 'En espera',
    reason_placeholder: 'Escribe el motivo…'
  },
  users: {
    title: 'Usuarios',
    subtitle:
      'Gestión de usuarios de Bianetwork: revisa identidad, cambia estado y promueve a Pro.',
    referral_search_placeholder: 'Buscar por código de referido',
    referral_search_submit: 'Buscar',
    referral_search_clear: 'Limpiar',
    upgrade_to_pro: 'Pasar a Pro',
    empty: 'No se encontraron usuarios.',
    columns: {
      id: 'ID',
      date: 'Fecha',
      name: 'Nombre',
      email: 'Email',
      document: 'Documento',
      type: 'Tipo',
      status: 'Estado',
      action: 'Acción'
    },
    pagination: {
      previous: 'Anterior',
      next: 'Siguiente',
      page_of: 'Página {current} de {total}'
    },
    status_filters: {
      all: 'Todos',
      pending: 'Pendientes',
      approved: 'Aprobados',
      denied: 'Negados',
      on_hold: 'En espera'
    },
    status_labels: {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobado',
      DENIED: 'Negado',
      ON_HOLD: 'En espera',
      IN_TRANSIT: 'En tránsito',
      ACTION_REQUIRED_USER: 'Usuario falta firmar'
    },
    person_type_labels: {
      Natural: 'Natural',
      Legal: 'Jurídica'
    },
    detail_modal: {
      title_natural: 'Detalle del usuario',
      title_legal: 'Detalle del usuario (Jurídica)',
      section_user_info: 'Información del usuario',
      section_identification: 'Identificación',
      section_legal_representative: 'Información del representante legal',
      section_company: 'Información de la empresa',
      field_full_name: 'Nombre completo',
      field_status: 'Estado',
      field_register_date: 'Fecha de registro',
      field_email: 'Email',
      field_person_type: 'Tipo de persona',
      field_referral_code: 'Código de referido',
      field_id_type: 'Tipo de identificación',
      field_id_number: 'Número de identificación',
      field_earnings: 'Ganancias por kWh',
      field_laft_warning: 'Alerta LAFT',
      field_legal_rep_phone: 'Teléfono representante',
      field_legal_rep_laft: 'Alerta LAFT representante',
      field_company_name: 'Nombre empresa',
      field_nit: 'NIT',
      field_city: 'Ciudad',
      field_address: 'Dirección',
      btn_approve: 'Aprobar',
      btn_on_hold: 'En espera',
      btn_deny: 'Negar',
      btn_cancel: 'Cancelar',
      btn_confirm: 'Confirmar',
      btn_updating: 'Actualizando…',
      reason_placeholder: 'Escribe el motivo…',
      success: 'Estado del usuario actualizado correctamente.',
      error: 'No se pudo actualizar el estado del usuario.'
    },
    upgrade_modal: {
      title: 'Pasar usuario a Pro',
      description:
        '¿Confirmas que el usuario {name} debe pasar a la categoría Pro? Esta acción no se puede deshacer.',
      btn_cancel: 'Cancelar',
      btn_confirm: 'Pasar a Pro',
      success: 'El usuario ahora es Pro.',
      error: 'No se pudo promover el usuario a Pro.'
    },
    list_error: 'No se pudieron cargar los usuarios.'
  },
  users_pro: {
    title: 'Usuarios Pro',
    subtitle: 'Usuarios que pertenecen a la categoría Pro.',
    referral_search_placeholder: 'Buscar por código de referido',
    referral_search_submit: 'Buscar',
    empty: 'No se encontraron usuarios Pro.',
    list_error: 'No se pudieron cargar los usuarios Pro.'
  },
  accounts: {
    title: 'Cuentas',
    subtitle: 'Cuentas bancarias registradas por los usuarios.',
    referral_search_placeholder: 'Buscar por código de referido',
    referral_search_submit: 'Buscar',
    empty: 'No se encontraron cuentas.',
    columns: {
      id: 'ID',
      date: 'Fecha',
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      type: 'Tipo',
      status: 'Estado'
    },
    detail_modal: {
      title: 'Detalle de la cuenta',
      section_user: 'Información del usuario',
      section_bank: 'Información bancaria',
      field_full_name: 'Nombre completo',
      field_email: 'Email',
      field_phone: 'Teléfono',
      field_status: 'Estado',
      field_id_type: 'Tipo de identificación',
      field_id_number: 'Número de identificación',
      field_referral_code: 'Código de referido',
      field_bank: 'Banco',
      field_account_type: 'Tipo de cuenta',
      field_account_number: 'Número de cuenta',
      field_city: 'Ciudad',
      field_address: 'Dirección',
      field_laft_warning: 'Alerta LAFT',
      field_notes: 'Notas',
      success: 'Estado de la cuenta actualizado correctamente.',
      error: 'No se pudo actualizar el estado de la cuenta.'
    },
    list_error: 'No se pudieron cargar las cuentas.'
  },
  transactions: {
    title: 'Transacciones',
    subtitle: 'Transacciones y depósitos realizados por los usuarios.',
    referral_search_placeholder: 'Buscar por código de referido',
    referral_search_submit: 'Buscar',
    btn_create_manual: 'Crear',
    btn_upload_excel: 'Cargar',
    empty: 'No se encontraron transacciones.',
    columns: {
      id: 'ID',
      date: 'Fecha',
      name: 'Nombre',
      email: 'Email',
      amount: 'Monto',
      type: 'Tipo',
      status: 'Estado'
    },
    detail_modal: {
      title: 'Detalle de la transacción',
      field_full_name: 'Nombre completo',
      field_email: 'Email',
      field_phone: 'Teléfono',
      field_amount: 'Monto',
      field_status: 'Estado',
      field_referral_code: 'Código de referido',
      field_date: 'Fecha',
      success: 'Estado de la transacción actualizado correctamente.',
      error: 'No se pudo actualizar el estado de la transacción.'
    },
    list_error: 'No se pudieron cargar las transacciones.'
  },
  generate_deposit_modal: {
    title: 'Generar depósito',
    description: 'Selecciona cómo deseas generar los depósitos.',
    tab_manual: 'Manual',
    tab_excel: 'Excel',
    manual_description: 'Crea un depósito ingresando manualmente los datos.',
    excel_description: 'Carga un archivo Excel con los depósitos.',
    field_referral_code: 'Código de referido',
    field_amount: 'Monto',
    field_note: 'Nota (opcional)',
    btn_add_row: 'Agregar fila',
    btn_remove_row: 'Eliminar fila',
    btn_choose_file: 'Elegir archivo',
    btn_replace_file: 'Reemplazar archivo',
    btn_submit: 'Generar',
    btn_cancel: 'Cancelar',
    file_selected: 'Archivo seleccionado: {name}',
    excel_format_error: 'Solo se permiten archivos .xlsx o .xls',
    success: 'Depósitos generados correctamente.',
    success_partial: 'Depósitos generados: {succeeded} OK, {failed} con errores.',
    error: 'No se pudieron generar los depósitos.',
    validation_required: 'Completa al menos una fila válida.'
  },
  invoices: {
    title: 'Facturas',
    subtitle: 'Facturas asociadas a leads y empresas referidas.',
    empty: 'No se encontraron facturas.',
    columns: {
      id: 'ID',
      date: 'Fecha',
      name: 'Nombre',
      company: 'Empresa',
      amount: 'Monto',
      status: 'Estado',
      document: 'Documento'
    },
    detail_modal: {
      title: 'Detalle de la factura',
      field_full_name: 'Nombre completo',
      field_company: 'Empresa',
      field_nit: 'NIT',
      field_amount: 'Monto',
      field_referral_code: 'Código de referido',
      field_status: 'Estado',
      field_date: 'Fecha',
      field_document: 'Documento',
      field_view_document: 'Ver documento',
      field_denied_reason: 'Motivo de rechazo',
      denied_reason_placeholder: 'Indica el motivo del rechazo…',
      success: 'Estado de la factura actualizado correctamente.',
      error: 'No se pudo actualizar el estado de la factura.'
    },
    list_error: 'No se pudieron cargar las facturas.'
  }
};

export type BianetworkDictionary = typeof bianetworkDictEs;
