export const createAddressObject = (
  parts: {
    long_name: string;
    short_name: string;
    types: string[];
  }[],
  placeId: string
) => {
  const street_number = parts.find((item) =>
    item.types.includes('street_number')
  );
  const route = parts.find((item) => item.types.includes('route'));
  const city = parts.find((item) => item.types.includes('locality'));
  const state = parts.find((item) =>
    item.types.includes('administrative_area_level_1')
  );
  const zip = parts.find((item) => item.types.includes('postal_code'));
  const country = parts.find((item) => item.types.includes('country'));
  //const region = parts.find((item) => item.types.includes('region'));
  return {
    street: route?.short_name,
    street_number: street_number?.short_name,
    city: city?.short_name,
    region: state?.short_name,
    line1:
      street_number && route
        ? `${street_number ? `${street_number?.long_name!} ` : ''}${
            route ? route?.long_name! : ''
          }`
        : '',
    state: state?.short_name!,
    zip: zip?.short_name!,
    placeId,
    country: country?.short_name!,
    deliveryInstructions: "",
  };
};
