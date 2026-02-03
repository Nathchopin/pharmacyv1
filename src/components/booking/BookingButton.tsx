import { Button, ButtonProps } from "@/components/ui/button";
import { useBookingModal } from "@/contexts/BookingModalContext";
import { cn } from "@/lib/utils";

export const BOOKING_CALENDARS: Record<string, string> = {
  // General fallback - main booking page
  general: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmx",
  
  // Category-level fallbacks
  laserHairRemoval: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmx",
  skinFacials: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmx",
  bodyWellness: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmx",
  injectables: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmx",
  hifu: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6arh69y",
  consultation: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxmzjgqv",
  
  // Laser - Full Body packages
  laserFullBody6Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyl",
  laserBikiniUnderarmsOffer: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyloweqhr",
  laser2Small1LargeOffer: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyloweqhry7qt23",
  laserMensFaceNeckOffer: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyloweqhrxoy2yk",
  
  // Laser - Face treatments
  laserEyebrows: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277re",
  laserEarlobes: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5da",
  laserUpperLip: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcn",
  laserCheeks: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8a",
  laserChin: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8aicvw53",
  laserForehead: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8aicvw53q1lapo",
  laserSideburns: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafc",
  laserJawline: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8ar55w0s",
  laserNeck: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8axs75ji",
  laserHalfFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8axs75jiggyiky",
  laserFullFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvc",
  
  // Laser - Upper Body treatments
  laserNipples: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k",
  laserNavel: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0kcp94q5",
  laserHands: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0kcp94q54g74f7",
  laserUnderarms: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0kn0u0g3",
  laserShoulders: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8as2r5xx",
  laserHalfArms: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8aa18umz",
  laserStomach: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8acqbnqb",
  laserChestStrip: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8aka1v6h",
  laserFullChest: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0kuh3d70",
  laserFullArms: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0kuh3d70mvupw6",
  laserHalfBack: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8alapapo",
  laserFullBackOrFront: "https://book.cocolas.co.uk/widget/booking/D3FsId01RxBYLi554mJG",
  
  // Laser - Lower Body treatments
  laserFeet: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8a11ui5c",
  laserBikiniLine: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8a94lob0",
  laserBrazilian: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8ajb10i8",
  laserButtocks: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8aqmylov",
  laserHollywood: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8an5tfqt",
  laserHalfLegs: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8adnrwxi",
  laserFullLegs: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8aihsrmu",

  // Skin & Facials - Lifting & Tightening
  hifuFullFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhr",
  hifuFullFaceNeck: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9",
  hifuJawline: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0x",
  hifuNeck: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xbxo8d8",
  rfSkinTighteningFaceNeck: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm1",
  rfSkinTighteningFaceNeckChest: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm18pcjxi",
  rfSkinTighteningFaceNeck3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm1twfqjn",
  iprfFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3",
  iprfFace3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq7",
  iprfScalp: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88ahotix",
  iprfScalp3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88",

  // Skin & Facials - Skin Resurfacing & Texture Refinement
  microneedlingFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53h",
  microneedlingFaceNeck: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53h8wf71q",
  microneedlingFaceNeck3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hfwey41",
  microneedlingProPowerPeelFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcv",
  microneedlingProPowerPeelFaceNeck: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8",
  dermalogicaProPowerPeelsFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571r",
  dermalogicaProPowerPeelsFace3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15f",
  dermalogicaProPowerPeelsFaceMicrodermabrasion: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6",
  dermalogicaProPowerPeelsFaceMicrodermabrasion3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15ffto0fg",
  microdermabrasionFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s",
  microdermabrasionFace3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nob8gp0",
  microdermabrasionFaceNeck: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5",
  microdermabrasionFaceNeck3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6n",
  ultrasoundOxygenFacialFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595k",
  ultrasoundOxygenFacialFace3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya2",

  // Skin & Facials - Advanced Laser & Light Therapies
  laserCarbonPeelFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdt",
  laserCarbonPeelFace3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdt5nwmlh",
  laserCarbonPeelChest: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxrj5s8hm5eyo5oxkmkabkq7pwc",
  laserCarbonPeelChest3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxrj5s8hm5eyo5oxkmkabkq7pwcacw7k1",
  laserCarbonPeelUpperBack: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxrj5s8hm5eyo5oxkmkabj1blw5",
  laserCarbonPeelUpperBack3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxrj5s8hm5eyo5oxkmkab1x93h4",
  laserCarbonPeelFullBack: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxrj5s8hm5eyo5o",
  laserCarbonPeelFullBack3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxrj5s8hm5eyo5oxkmkab",
  laserAcneTreatmentFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6",
  laserAcneTreatmentFace3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6arh69y",
  laserPhotoRejuvenationFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8aiuqrd",
  laserPhotoRejuvenationFaceNeck3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8aiuqrdrtb4dg",
  laserPhotoRejuvenationFace3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8aiuqrdcgm8tu",
  laserPhotoRejuvenationFaceNeck: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8aiuqrd3hx2h5",
  laserPhotoRejuvenationHands: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxrj5s8hm",
  laserPhotoRejuvenationHands3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxrj5s8hmpq3393",
  threadVeinRemovalFaceSmall: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8lbx0xq",
  threadVeinRemovalFaceMedium: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8lbx0xq5g1yd7",
  threadVeinRemovalFaceLarge: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8lbx0xqcioagv",
  threadVeinRemovalBodySmall: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8aiuqrdrtb4dg7a220p",
  threadVeinRemovalBodyMedium: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8aiuqrdrtb4dg7a220plab2ax",
  threadVeinRemovalBodyLarge: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8aiuqrdrtb4dg7a220p8287kd",

  // Skin & Facials - Dermalogica & Specialist Facials
  dermalogicaUltimateLuxuryFacialFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm1twfqjnjmkvze",
  dermalogicaProLuxuryFacialFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm1twfqjnjmkvzemrp0u3",
  miniFacialFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8aiuqrdbotb40wgcjl3",
  fullFacialFace: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8aiuqrdbotb40",

  // Special Offers - IV & Injectables
  offerBiotinBepanthene12Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rqnag12na3ahs",
  offerIVGlutathioneVitC3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rqnag12",
  offerFatFreeze3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05r",
  offerAntiWrinkle3Areas: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426",
  rfBodyTighteningStomach3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizj",

  mesotherapy: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprp",
  mesotherapy3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprpdbglda",
  
  // Injectables - Vitamin Injections
  vitaminB12Injection: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprpaba1uya3dll9",
  vitaminB12Injection3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprpaba1uya3dll92dcl5c",
  biotinInjection: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprpaba1uya3dll92dcl5ccd09u9",
  biotinInjection3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprpaba1uya3dll92dcl5ccd09u98hbazg",
  biotinInjection6Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprpaba1uya3dll92dcl5ccd09u98hbazgsnhyrg",
  bepanthenInjection: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprpaba1uya3dll92dcl5ccd09u9j5lpye",
  bepanthenInjection6Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprpaba1uya3dll92dcl5ccd09u9j5lpye6fcu7p",
  
  // Injectables - Anti-Wrinkle & Fillers
  antiWrinkle3Areas: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426",
  fatDissolvingTreatment: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprpaba1uy",
  dermaFillersLips: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt6",
  skinBooster: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprp0vl5ql",
  underEyeBrightening: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41r5d426jh4jt64hzprp0vl5qlwhp7fl",

  // Body & Wellness - Body Contouring & Fat Reduction
  hifuBodySculpt: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet19kmk828t8lo2",
  fatFreeze1Cup: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41",
  fatFreeze2Cups: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh",
  fatFreeze6Cups: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05r",
  ultrasoundCavitationFullStomach: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3",
  ultrasoundCavitationFullStomach3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3i5sa7d",
  ultrasoundCavitationFullThighs: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow",
  ultrasoundCavitationFullThighs3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711",

  // Body & Wellness - Radio Frequency Body Tightening
  rfBodyTighteningFullStomach: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w03",
  rfBodyTighteningFullStomach3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizj",
  rfBodyTighteningLowerStomach: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjol2x4e",
  rfBodyTighteningLowerStomach3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjol2x4evu8hrf",
  rfBodyTighteningButtocks: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjgm9lz8",
  rfBodyTighteningThighs: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxr",
  rfBodyTighteningThighs3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxrxofdlv",

  // Body & Wellness - Microneedling Body
  microneedlingChest: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxr6zjngaqvq9luqpg20jwplgxk",
  microneedlingChest3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxr6zjngaqvq9luqpg20jwplgxkvgk7mj",
  microneedlingHalfBack: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxr6zjngaqvq9luqpg20j",
  microneedlingHalfBack3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxr6zjngaqvq9luqpg20jy4js9l",
  microneedlingFullBack: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxr6zjnga",
  microneedlingFullBack3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1wf5m41v9hmhh59a05rm3csk3dhb711j1koow643w035ciizjb8ppxr6zjngaqvq9lu",

  // Body & Wellness - IV Drip Therapy
  ivDripTherapy: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet1",
  ivDripTherapy3Sessions: "https://book.cocolas.co.uk/widget/bookings/laser-full-body-tqdmxi67tyla277rea1b5dat0awcnmzcf8akccafcz01jvcby7s0k8j9uhrczocs9rs9q0xmv1mm17giha3biokq70hlz88yeb53hf8edcvobrgq8vc571rj7a15fqkggw6pm4j2s1m3cg5ejqs6nz4iya21n595ks9dsdtb9s5b6i9vet19kmk82",
};

export type CalendarType = keyof typeof BOOKING_CALENDARS | "consultation" | "hifu" | "skinFacials" | "bodyWellness" | "injectables" | "general";

const isValidBookingUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !url.includes("YOUR_");
  } catch {
    return false;
  }
};

interface BookingButtonProps extends Omit<ButtonProps, "onClick"> {
  calendarType?: CalendarType;
  calendarUrl?: string;
  showNoShowPolicy?: boolean;
  children: React.ReactNode;
}

export function BookingButton({
  calendarType = "general",
  calendarUrl,
  showNoShowPolicy = true,
  children,
  ...buttonProps
}: BookingButtonProps) {
  const { openBookingModal } = useBookingModal();

  const { className, ...restButtonProps } = buttonProps;

  const handleClick = () => {
    const url = calendarUrl || BOOKING_CALENDARS[calendarType];
    
    if (!url || !isValidBookingUrl(url)) {
      window.open("https://book.cocolas.co.uk", "_blank", "noopener,noreferrer");
      return;
    }
    
    // Hide no-show policy for free consultations
    const shouldShowPolicy = calendarType === "consultation" ? false : showNoShowPolicy;
    openBookingModal(url, shouldShowPolicy);
  };

  return (
    <Button
      onClick={handleClick}
      // Enforce consistent booking CTA styling site-wide
      className={cn(
        className,
        "bg-black text-white hover:bg-black/90 rounded-full",
      )}
      {...restButtonProps}
    >
      {children}
    </Button>
  );
}
