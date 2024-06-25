export type SearchParams = Record<string, string>;

export type XSollaUser = {
  id: string;
  username: string | null;
  nickname: string | null;
  name: string | null;
  tag: string | null;
  picture: string | null;
  birthday: string | null;
  first_name: string | null;
  last_name: string | null;
  gender: string | null;
  email: string | null;
  phone: string | null;
  phone_auth: string | null;
  groups: {
    id: number;
    name: string;
    is_default: boolean;
    is_deletable: boolean;
  }[];
  registered: string;
  external_id: string | null;
  last_login: string;
  ban:
    | {
        date_from: string;
        date_to: string;
        reason: string;
      }[]
    | null;
  country: string | null;
  connection_information: string | null;
  is_anonymous: boolean;
  devices: {
    id: number;
    type: string;
    device: string;
    last_used_at: string;
  };
  is_last_email_confirmed: boolean | null;
  is_user_active: boolean;
};
