import { Address } from "./address";

export interface Member {
    id: number | null;
    firstName: string;
    name: string;
    dob: Date;
    dateOfSubscription: Date;
    imageName: string;
    address: Address;
}
