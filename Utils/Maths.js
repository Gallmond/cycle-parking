export const latitudeDeltaToMetres = latitudeDelta => {
  const miles = latitudeDelta * 69; // 1 degree is approx 69 miles
  const metres = miles / 0.00062137; // 0.00001° = 1.11 m
  return metres;
};