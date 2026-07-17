export type SavedAddress = {
  id: string;
  label: string;
  zip: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  isDefault?: boolean;
};

export type SavedPaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault?: boolean;
};

export type PublicUserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  addresses: SavedAddress[];
  paymentMethods: SavedPaymentMethod[];
};
