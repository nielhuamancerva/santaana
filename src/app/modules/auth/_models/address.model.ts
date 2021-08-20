export class AddressModel {
    addressLine: string;
    city: string;
    state: string;
    postCode: string;
    setAddress(address: any) {
      this.addressLine = address.addressLine;
      this.city = address.city;
      this.state = address.state;
      this.postCode = address.postCode;
    }
}
