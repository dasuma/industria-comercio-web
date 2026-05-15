import type { BianetworkDictionary } from './es';

export const bianetworkDictEn: BianetworkDictionary = {
  tabs: {
    users: 'Users',
    users_pro: 'Pro users',
    accounts: 'Accounts',
    transactions: 'Transactions',
    invoices: 'Invoices'
  },
  search: {
    open_label: 'Search',
    placeholder: 'Referral code ({tab})'
  },
  shared: {
    status_filters: {
      all: 'All',
      pending: 'Pending',
      approved: 'Approved',
      denied: 'Denied',
      on_hold: 'On hold',
      action_required_user: 'Signature missing'
    },
    status_labels: {
      PENDING: 'Pending',
      APPROVED: 'Approved',
      DENIED: 'Denied',
      ON_HOLD: 'On hold',
      IN_TRANSIT: 'In transit',
      ACTION_REQUIRED_USER: 'User signature missing'
    },
    person_type_labels: {
      Natural: 'Natural',
      Legal: 'Legal'
    },
    pagination: {
      previous: 'Previous',
      next: 'Next'
    },
    compact_mode: 'Compact mode',
    btn_cancel: 'Cancel',
    btn_confirm: 'Confirm',
    btn_close: 'Close',
    btn_approve: 'Approve',
    btn_deny: 'Deny',
    btn_on_hold: 'On hold',
    reason_placeholder: 'Type the reason…'
  },
  users: {
    title: 'Users',
    subtitle: 'Bianetwork users management: review identity, change status and upgrade to Pro.',
    referral_search_placeholder: 'Search by referral code',
    referral_search_submit: 'Search',
    referral_search_clear: 'Clear',
    upgrade_to_pro: 'Upgrade to Pro',
    empty: 'No users found.',
    columns: {
      id: 'ID',
      date: 'Date',
      name: 'Name',
      email: 'Email',
      document: 'Document',
      type: 'Type',
      status: 'Status',
      action: 'Action'
    },
    pagination: {
      previous: 'Previous',
      next: 'Next',
      page_of: 'Page {current} of {total}'
    },
    status_filters: {
      all: 'All',
      pending: 'Pending',
      approved: 'Approved',
      denied: 'Denied',
      on_hold: 'On hold'
    },
    status_labels: {
      PENDING: 'Pending',
      APPROVED: 'Approved',
      DENIED: 'Denied',
      ON_HOLD: 'On hold',
      IN_TRANSIT: 'In transit',
      ACTION_REQUIRED_USER: 'User signature missing'
    },
    person_type_labels: {
      Natural: 'Natural',
      Legal: 'Legal'
    },
    detail_modal: {
      title_natural: 'User detail',
      title_legal: 'User detail (Legal)',
      section_user_info: 'User information',
      section_identification: 'Identification',
      section_legal_representative: 'Legal representative information',
      section_company: 'Company information',
      field_full_name: 'Full name',
      field_status: 'Status',
      field_register_date: 'Registration date',
      field_email: 'Email',
      field_person_type: 'Person type',
      field_referral_code: 'Referral code',
      field_id_type: 'ID type',
      field_id_number: 'ID number',
      field_earnings: 'Earnings per kWh',
      field_laft_warning: 'LAFT warning',
      field_legal_rep_phone: 'Representative phone',
      field_legal_rep_laft: 'Representative LAFT warning',
      field_company_name: 'Company name',
      field_nit: 'NIT',
      field_city: 'City',
      field_address: 'Address',
      btn_approve: 'Approve',
      btn_on_hold: 'On hold',
      btn_deny: 'Deny',
      btn_cancel: 'Cancel',
      btn_confirm: 'Confirm',
      btn_updating: 'Updating…',
      reason_placeholder: 'Type the reason…',
      success: 'User status updated successfully.',
      error: 'Could not update user status.'
    },
    upgrade_modal: {
      title: 'Upgrade user to Pro',
      description:
        'Confirm that user {name} should be upgraded to Pro? This action cannot be undone.',
      btn_cancel: 'Cancel',
      btn_confirm: 'Upgrade to Pro',
      success: 'User is now Pro.',
      error: 'Could not upgrade user to Pro.'
    },
    list_error: 'Could not load users.'
  },
  users_pro: {
    title: 'Pro users',
    subtitle: 'Users belonging to the Pro tier.',
    referral_search_placeholder: 'Search by referral code',
    referral_search_submit: 'Search',
    empty: 'No Pro users found.',
    list_error: 'Could not load Pro users.'
  },
  accounts: {
    title: 'Accounts',
    subtitle: 'Bank accounts registered by users.',
    referral_search_placeholder: 'Search by referral code',
    referral_search_submit: 'Search',
    empty: 'No accounts found.',
    columns: {
      id: 'ID',
      date: 'Date',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      type: 'Type',
      status: 'Status'
    },
    detail_modal: {
      title: 'Account detail',
      section_user: 'User information',
      section_bank: 'Bank information',
      field_full_name: 'Full name',
      field_email: 'Email',
      field_phone: 'Phone',
      field_status: 'Status',
      field_id_type: 'ID type',
      field_id_number: 'ID number',
      field_referral_code: 'Referral code',
      field_bank: 'Bank',
      field_account_type: 'Account type',
      field_account_number: 'Account number',
      field_city: 'City',
      field_address: 'Address',
      field_laft_warning: 'LAFT warning',
      field_notes: 'Notes',
      success: 'Account status updated successfully.',
      error: 'Could not update account status.'
    },
    list_error: 'Could not load accounts.'
  },
  transactions: {
    title: 'Transactions',
    subtitle: 'Transactions and deposits performed by users.',
    referral_search_placeholder: 'Search by referral code',
    referral_search_submit: 'Search',
    btn_create_manual: 'Create',
    btn_upload_excel: 'Upload',
    empty: 'No transactions found.',
    columns: {
      id: 'ID',
      date: 'Date',
      name: 'Name',
      email: 'Email',
      amount: 'Amount',
      type: 'Type',
      status: 'Status'
    },
    detail_modal: {
      title: 'Transaction detail',
      field_full_name: 'Full name',
      field_email: 'Email',
      field_phone: 'Phone',
      field_amount: 'Amount',
      field_status: 'Status',
      field_referral_code: 'Referral code',
      field_date: 'Date',
      success: 'Transaction status updated successfully.',
      error: 'Could not update transaction status.'
    },
    list_error: 'Could not load transactions.'
  },
  generate_deposit_modal: {
    title: 'Generate deposit',
    description: 'Select how you want to generate deposits.',
    tab_manual: 'Manual',
    tab_excel: 'Excel',
    manual_description: 'Create a deposit by entering the data manually.',
    excel_description: 'Upload an Excel file with the deposits.',
    field_referral_code: 'Referral code',
    field_amount: 'Amount',
    field_note: 'Note (optional)',
    btn_add_row: 'Add row',
    btn_remove_row: 'Remove row',
    btn_choose_file: 'Choose file',
    btn_replace_file: 'Replace file',
    btn_submit: 'Generate',
    btn_cancel: 'Cancel',
    file_selected: 'Selected file: {name}',
    excel_format_error: 'Only .xlsx or .xls files are allowed',
    success: 'Deposits generated successfully.',
    success_partial: 'Deposits generated: {succeeded} OK, {failed} with errors.',
    error: 'Could not generate deposits.',
    validation_required: 'Complete at least one valid row.'
  },
  invoices: {
    title: 'Invoices',
    subtitle: 'Invoices linked to leads and referred companies.',
    empty: 'No invoices found.',
    columns: {
      id: 'ID',
      date: 'Date',
      name: 'Name',
      company: 'Company',
      amount: 'Amount',
      status: 'Status',
      document: 'Document'
    },
    detail_modal: {
      title: 'Invoice detail',
      field_full_name: 'Full name',
      field_company: 'Company',
      field_nit: 'NIT',
      field_amount: 'Amount',
      field_referral_code: 'Referral code',
      field_status: 'Status',
      field_date: 'Date',
      field_document: 'Document',
      field_view_document: 'View document',
      field_denied_reason: 'Denial reason',
      denied_reason_placeholder: 'State the denial reason…',
      success: 'Invoice status updated successfully.',
      error: 'Could not update invoice status.'
    },
    list_error: 'Could not load invoices.'
  }
};
