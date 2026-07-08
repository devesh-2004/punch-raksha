export interface PincodeLookupResult {
  city: string;
  state: string;
}

export async function lookupPincode(pincode: string): Promise<PincodeLookupResult | null> {
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    const postOffice = data?.[0]?.PostOffice?.[0];
    if (!postOffice) return null;
    return { city: postOffice.District, state: postOffice.State };
  } catch {
    return null;
  }
}
