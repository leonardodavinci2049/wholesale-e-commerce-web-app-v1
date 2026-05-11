export type OrganizationMemberRole =
  | "owner"
  | "manager"
  | "salesperson"
  | "operator"
  | "cashier"
  | "finance"
  | "shipping"
  | "customer";

export type Account = {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AgendaEntry = {
  id: string;
  organizationId?: string | null;
  userId: string;
  entryType: string;
  title: string;
  notes?: string | null;
  status: string;
  priority: string;
  scheduledAt: Date;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AgendaNotification = {
  id: string;
  agendaEntryId: string;
  organizationId?: string | null;
  userId: string;
  title: string;
  message?: string | null;
  notifyAt: Date;
  readAt?: Date | null;
  deliveredAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CrmActivity = {
  id: string;
  lead_id: string;
  organization_id: string;
  activity_type: string;
  description: string;
  metadata_json?: string | null;
  created_by: string;
  created_at: Date;
};

export type CrmDeal = {
  id: string;
  lead_id: string;
  organization_id: string;
  budget_id?: string | null;
  order_id?: string | null;
  amount: number;
  status: string;
  closed_at?: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type CrmLead = {
  id: string;
  organization_id: string;
  customer_id?: string | null;
  assigned_user_id: string;
  assigned_user_name: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  source: string;
  status: string;
  current_stage_key: string;
  score: number;
  estimated_value?: number | null;
  last_contact_at?: Date | null;
  next_follow_up_at?: Date | null;
  lost_reason?: string | null;
  notes?: string | null;
  created_by: string;
  updated_by: string;
  created_at: Date;
  updated_at: Date;
};

export type CrmLeadStageHistory = {
  id: string;
  lead_id: string;
  from_stage_key?: string | null;
  to_stage_key: string;
  changed_by: string;
  changed_at: Date;
  notes?: string | null;
};

export type CrmStage = {
  id: string;
  stage_key: string;
  name: string;
  sort_order: number;
  probability: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
};

export type CrmTask = {
  id: string;
  lead_id: string;
  organization_id: string;
  assigned_user_id: string;
  title: string;
  description?: string | null;
  due_date: Date;
  status: string;
  priority: string;
  completed_at?: Date | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
};

export type Invitation = {
  id: string;
  organizationId: string;
  teamId?: string | null;
  email: string;
  role?: string | null;
  status: string;
  expiresAt: Date;
  inviterId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Member = {
  id: string;
  organizationId: string;
  userId: string;
  personId?: number | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  active_organization?: number | null;
  user?: User;
};

export type Organization = {
  id: string;
  system_id?: number | null;
  name: string;
  slug?: string | null;
  logo?: string | null;
  metadata?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  member?: Member[];
};

export type OrganizationMeta = {
  organizationId: string;
  metaKey: string;
  metaValue?: string | null;
};

export type OrganizationRole = {
  id: string;
  organizationId: string;
  organizationRolecol?: string | null;
  role?: string | null;
  permission?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type Session = {
  id: string;
  systemId?: number | null;
  expiresAt: Date;
  token?: string | null;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
  impersonatedBy?: string | null;
  activeOrganizationId?: string | null;
  activeTeamId?: string | null;
};

export type Subscription = {
  id: string;
  userId: string;
  plan: string;
  status: string;
  approvedAt?: Date | null;
  createdAt: Date;
};

export type TblApp = {
  id: number;
  name?: string | null;
  url?: string | null;
  description?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type TblConfig = {
  CONFIG_ID: number;
  PROJECT_ID?: number | null;
  UUID?: string | null;
  CUSTOMER_NAME?: string | null;
  TELEGRAM_BOT_NAME?: string | null;
  TELEGRAM_BOT_LINK?: string | null;
  TELEGRAM_BOT_TOKEN?: string | null;
  TELEGRAM_BOT_CHATID?: string | null;
  WEBHOOK_URL?: string | null;
  WEBHOOK_LOCAL_PORT?: number | null;
  OPENAI_API_KEY?: string | null;
  SHOPEE_CREDENTIAL?: string | null;
  SHOPEE_SECRET_KEY?: string | null;
  SHOPEE_AFFILIATE_ENDPOINT?: string | null;
  SHOPEE_AFFILIATE_TIMEOUT?: string | null;
  SHOPEE_AFFILIATE_SUBIDS?: string | null;
  CREATEDAT?: Date | null;
  UPDATEDAT?: Date | null;
};

export type TblLinkGeneration = {
  ID: number;
  UUID?: string | null;
  APP_ID?: number | null;
  CLIENT_ID?: number | null;
  LINK_DESTINATION?: string | null;
  AFFILIATE_LINK?: string | null;
  FLAG_CLICK?: number | null;
  ITEM_ID?: number | null;
  PRODUCT_NAME?: string | null;
  SHOP_NAME?: string | null;
  SHOP_ID?: number | null;
  PRICE_MIN?: number | null;
  PRICE_MAX?: number | null;
  COMMISSION_RATE?: number | null;
  COMMISSION?: number | null;
  SALES?: number | null;
  RATING_STAR?: number | null;
  IMAGE_URL?: string | null;
  PRODUCT_LINK?: string | null;
  OFFER_LINK?: string | null;
  CURRENCY?: string | null;
  DISCOUNT_PERCENT?: number | null;
  ORIGINAL_PRICE?: number | null;
  CATEGORY?: string | null;
  CATEGORY_ID?: number | null;
  BRAND_NAME?: string | null;
  IS_OFFICIAL?: boolean | null;
  FREE_SHIPPING?: boolean | null;
  LOCATION?: string | null;
  CREATEDAT?: Date | null;
  UPDATEDAT?: Date | null;
};

export type TblLogLogin = {
  log_id: number;
  app_id?: number | null;
  organization_Id?: string | null;
  user_id?: string | null;
  module_id?: number | null;
  record_id?: string | null;
  log?: string | null;
  NOTE?: string | null;
  createdAt?: Date | null;
};

export type TblLogOperation = {
  ID_LOG: number;
  UUID?: string | null;
  MODULE_ID?: number | null;
  RECORD_ID?: number | null;
  LOG?: string | null;
  NOTE?: string | null;
  CREATEDAT?: Date | null;
};

export type TblMemberRole = {
  id: number;
  uuid?: string | null;
  role?: string | null;
  name?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type TblMetadata = {
  ID: number;
  APP_ID?: number | null;
  META_KEY?: string | null;
  META_VALUE?: string | null;
  CREATEDAT?: Date | null;
};

export type TblModule = {
  module_id: number;
  userId?: string | null;
  module?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type TblPromoLink = {
  ID: number;
  UUID?: string | null;
  CLIENT_ID?: number | null;
  APP_ID?: number | null;
  LINK1?: string | null;
  LINK2?: string | null;
  LINK3?: string | null;
  LINK_NAME1?: string | null;
  LINK_NAME2?: string | null;
  LINK_NAME3?: string | null;
  SECRET_KEY1?: string | null;
  SECRET_KEY2?: string | null;
  SECRET_KEY3?: string | null;
  NOTES?: string | null;
  CREATEDAT?: Date | null;
  UPDATEDAT?: Date | null;
};

export type TblSystemConfiguration = {
  ID_CONFIGURATION: number;
  UUID?: string | null;
  APP_ID?: number | null;
  SYSTEM_CLIENT_ID?: number | null;
  STORE_ID?: number | null;
  ORGANIZATION_ID?: string | null;
  MEMBER_ID?: string | null;
  USER_ID?: string | null;
  COMPANY_NAME?: string | null;
  COMPANY_TITLE?: string | null;
  COMPANY_CNPJ?: string | null;
  COMPANY_PHONE?: string | null;
  COMPANY_WHATSAPP?: string | null;
  COMPANY_EMAIL?: string | null;
  COMPANY_ABOUT_SHORT1?: string | null;
  COMPANY_ABOUT_SHORT2?: string | null;
  COMPANY_OPENING_HOURS?: string | null;
  COMPANY_ADDRESS1?: string | null;
  COMPANY_ADDRESS2?: string | null;
  COMPANY_ADDRESS3?: string | null;
  COMPANY_MAPS?: string | null;
  COMPANY_INTERNE1?: string | null;
  COMPANY_INTERNE2?: string | null;
  COMPANY_INTERNE3?: string | null;
  COMPANY_INTERNE4?: string | null;
  COMPANY_INTERNE5?: string | null;
  SLOGAN1?: string | null;
  SLOGAN2?: string | null;
  SLOGAN3?: string | null;
  SLOGAN4?: string | null;
  SLOGAN5?: string | null;
  CALLTO_ACTION1?: string | null;
  CALLTO_ACTION2?: string | null;
  CALLTO_ACTION3?: string | null;
  CALLTO_ACTION4?: string | null;
  CALLTO_ACTION5?: string | null;
  DEVELOPER_LOGO_DARK?: string | null;
  DEVELOPER_LOGO_WHITE?: string | null;
  DEVELOPER_NAME?: string | null;
  DEVELOPER_URL?: string | null;
  CONFIGURATION_KEY?: string | null;
  CONFIGURATION_VALUE?: string | null;
  CONFIGURATION_NOTES?: string | null;
  CREATEDAT?: Date | null;
  UPDATEDAT?: Date | null;
};

export type TblTelegramChat = {
  ID: number;
  UUID?: string | null;
  PROJECT_ID?: number | null;
  CONFIG_ID?: number | null;
  CHAT_ID?: string | null;
  MESSAGE_RECEIVED?: string | null;
  MESSAGE_SENT?: string | null;
  JSON_OBJECT?: string | null;
  UPDATEDAT?: Date | null;
  CREATEDAT?: Date | null;
};

export type Team = {
  id: string;
  name?: string | null;
  organizationId: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type TeamMember = {
  id: string;
  teamId: string;
  userId: string;
  createdAt?: Date | null;
};

export type TwoFactor = {
  id: string;
  userId: string;
  secret?: string | null;
  backupCodes: string;
};

export type User = {
  id: string;
  personId?: number | null;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  twoFactorEnabled: boolean;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;
};

export type UserMeta = {
  userId: string;
  metaKey: string;
  metaValue?: string | null;
};

export type Verification = {
  id: string;
  identifier?: string | null;
  value?: string | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type LogLogin = TblLogLogin;
export type LogOperation = TblLogOperation;
