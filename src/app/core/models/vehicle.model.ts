export interface Vehicle {
  _id: string;
  brand: string;
  registrationNumber: string;
  vin: string;
  clientEmail?: string;
  clientAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  isRented: boolean;
  currentPosition: string;
}
