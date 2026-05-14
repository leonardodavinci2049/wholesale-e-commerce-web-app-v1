export const WHOLESALE_CUSTOMER_TYPE_ID = 1;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CustomerUserCandidate = {
  customerTypeId: number;
  email: string;
};

export function isValidCustomerUserEmail(email: string) {
  return EMAIL_PATTERN.test(email.trim());
}

export function getCustomerUserValidationMessage(
  customer: CustomerUserCandidate,
) {
  if (!isValidCustomerUserEmail(customer.email)) {
    return "O cliente não tem um e-mail válido";
  }

  if (customer.customerTypeId !== WHOLESALE_CUSTOMER_TYPE_ID) {
    return "Somente Clientes ATACADO pode ser adicionado";
  }

  return null;
}
