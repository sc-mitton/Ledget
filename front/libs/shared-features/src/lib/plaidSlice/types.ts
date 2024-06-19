interface Institution {
  id: string;
  name: string;
  logo?: string;
  primary_color?: string;
  url?: string;
  oath?: string;
}

interface Account {
  id: string;
  name: string;
  mask: string;
  subtype?: string;
  type: string;
  verification_status?: string;
}

export interface PlaidItem {
  user: string;
  id: string;
  access_token?: string;
  cursor?: string;
  login_required: boolean;
  new_accounts_available: boolean;
  permission_revoked: boolean;
  institution: Institution;
  accounts: Account[];
}
