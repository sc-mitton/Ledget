export interface Institution {
  id: string;
  name?: string;
  logo?: string;
  primary_color?: string;
  url?: string;
  oath?: string;
}

interface Account {
  id: string;
  name?: string;
  mask?: string;
  subtype?: any;
  type: string;
  verification_status?: string;
}

export interface GetPlaidTokenResponse {
  link_token: string;
}

export interface PlaidItem {
  user: string;
  id: string;
  access_token?: string;
  cursor?: string;
  login_required: boolean;
  pending_expiration: boolean;
  new_accounts_available: boolean;
  permission_revoked: boolean;
  institution?: Institution;
  accounts: Account[];
}

export interface AddNewPlaidItemPayload {
  public_token: string;
  accounts: Account[];
  institution?: Institution;
}

export type RootStateWithInstitutions = {
  institutions: {
    map: { [key: string]: string };
    institutions: { [key: string]: Institution };
  };
  [key: string]: any;
};
