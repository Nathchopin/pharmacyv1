// ============= Treatment Types =============
export interface TreatmentPrice {
  option: string;
  price: string;
  originalPrice?: string;
}

export interface TreatmentDetail {
  name: string;
  description: string;
  whatItTargets: string;
  whatItIs: string;
  aftercare: string;
  recommendation: string;
  duration?: string;
  prices: TreatmentPrice[];
  isClientFavourite?: boolean;
}

export interface TreatmentSubcategory {
  title: string;
  treatments: TreatmentDetail[];
}

export interface TreatmentCategory {
  id: string;
  title: string;
  description: string;
  subcategories: TreatmentSubcategory[];
}

// ============= Laser Hair Removal =============
export const laserHairRemoval: TreatmentCategory = {
  id: "laser-hair-removal",
  title: "Laser Hair Removal",
  description: "Permanent hair reduction with advanced laser technology for smooth, hair-free skin",
  subcategories: [
    {
      title: "Full Body",
      treatments: [
        {
          name: "Full Body",
          description: "Permanent hair reduction across face and body using targeted laser energy.",
          whatItTargets: "This treatment is designed to permanently reduce unwanted hair across the face and body.",
          whatItIs:
            "It uses targeted laser energy to penetrate the hair follicle, disabling the hair at the root to prevent future growth while leaving the surrounding skin undamaged.",
          aftercare:
            "We recommend avoiding sun exposure, hot baths, and strenuous exercise for 24 to 48 hours; always apply a high-factor SPF to treated areas.",
          recommendation: "Course of 6 sessions, scheduled approximately 4 to 6 weeks apart",
          duration: "90 mins",
          prices: [
            { option: "Full Body (1 Session)", price: "£189" },
            { option: "Full Body (6 Sessions)", price: "£850" },
          ],
        },
      ],
    },
    {
      title: "Face Areas",
      treatments: [
        {
          name: "Eyebrows",
          description: "Precise shaping and hair removal for clean brow lines.",
          whatItTargets: "Unwanted hair around the eyebrow area for clean, defined brows.",
          whatItIs: "Targeted laser energy removes hair at the root while leaving surrounding skin undamaged.",
          aftercare: "Avoid sun exposure and apply SPF for 24-48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£19" }],
        },
        {
          name: "Earlobes",
          description: "Remove unwanted hair from the ear area.",
          whatItTargets: "Unwanted hair on and around the earlobes.",
          whatItIs: "Gentle laser treatment for the delicate ear area.",
          aftercare: "Avoid sun exposure for 24-48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£19" }],
        },
        {
          name: "Upper Lip",
          description: "Quick and effective treatment for upper lip hair.",
          whatItTargets: "Visible upper lip hair for a smooth, hair-free appearance.",
          whatItIs: "Precise laser targeting of the upper lip area.",
          aftercare: "Apply SPF and avoid heat for 24-48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£25" }],
        },
        {
          name: "Cheeks",
          description: "Smooth, hair-free cheeks with laser precision.",
          whatItTargets: "Unwanted facial hair on the cheek area.",
          whatItIs: "Laser treatment covering both cheek areas.",
          aftercare: "Avoid sun and heat for 24-48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£29" }],
        },
        {
          name: "Chin",
          description: "Target stubborn chin hair effectively.",
          whatItTargets: "Coarse or fine hair on the chin area.",
          whatItIs: "Focused laser treatment for the chin.",
          aftercare: "Apply SPF and avoid picking at the area.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£29" }],
        },
        {
          name: "Forehead",
          description: "Remove unwanted hair from the forehead area.",
          whatItTargets: "Hair along the forehead and hairline.",
          whatItIs: "Gentle laser treatment for the forehead region.",
          aftercare: "Avoid sun exposure for 24-48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£29" }],
        },
        {
          name: "Sideburns",
          description: "Clean, defined sideburn area.",
          whatItTargets: "Sideburn hair for a cleaner facial appearance.",
          whatItIs: "Laser treatment targeting the sideburn region.",
          aftercare: "Apply SPF and avoid heat.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£29" }],
        },
        {
          name: "Jawline",
          description: "Define your jawline with hair removal.",
          whatItTargets: "Unwanted hair along the jawline.",
          whatItIs: "Precise laser treatment following the jaw contour.",
          aftercare: "Avoid sun and strenuous exercise for 24-48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£39" }],
        },
        {
          name: "Neck",
          description: "Complete neck hair removal.",
          whatItTargets: "Hair on the front and back of the neck.",
          whatItIs: "Comprehensive laser treatment for the neck area.",
          aftercare: "Apply SPF and avoid heat.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£31" }],
        },
        {
          name: "Half Face",
          description: "Treatment for upper or lower half of the face.",
          whatItTargets: "Multiple areas on either the upper or lower face.",
          whatItIs: "Combined treatment covering half the facial area.",
          aftercare: "Full aftercare as standard facial laser.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£45" }],
        },
        {
          name: "Full Face",
          description: "Complete facial hair removal treatment.",
          whatItTargets: "All unwanted facial hair for a completely smooth appearance.",
          whatItIs: "Comprehensive laser treatment covering the entire face.",
          aftercare: "Avoid sun, heat, and makeup for 24-48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "40 mins",
          prices: [{ option: "Per Session", price: "£59" }],
        },
      ],
    },
    {
      title: "Upper Body Areas",
      treatments: [
        {
          name: "Nipples",
          description: "Gentle hair removal around the nipple area.",
          whatItTargets: "Unwanted hair around the nipples.",
          whatItIs: "Careful laser treatment for a sensitive area.",
          aftercare: "Wear loose clothing and avoid friction.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£19" }],
        },
        {
          name: "Navel",
          description: "Remove hair around the belly button area.",
          whatItTargets: "Hair around and below the navel.",
          whatItIs: "Quick laser treatment for the navel region.",
          aftercare: "Avoid tight waistbands for 24 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£29" }],
        },
        {
          name: "Hands",
          description: "Smooth, hair-free hands.",
          whatItTargets: "Hair on the backs of the hands and fingers.",
          whatItIs: "Precise laser treatment for the hand area.",
          aftercare: "Apply SPF when hands are exposed.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£29" }],
        },
        {
          name: "Underarms",
          description: "Quick and effective underarm treatment.",
          whatItTargets: "Underarm hair for fresh, smooth armpits.",
          whatItIs: "Fast laser treatment for the underarm area.",
          aftercare: "Avoid deodorant for 24 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£39" }],
        },
        {
          name: "Shoulders",
          description: "Remove shoulder hair for a cleaner look.",
          whatItTargets: "Hair across the shoulder area.",
          whatItIs: "Comprehensive shoulder laser treatment.",
          aftercare: "Avoid sun exposure on treated areas.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£39" }],
        },
        {
          name: "Half Arms",
          description: "Lower or upper arm treatment.",
          whatItTargets: "Hair on either the upper or lower arms.",
          whatItIs: "Laser treatment for half the arm.",
          aftercare: "Apply SPF and avoid sun exposure.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£39" }],
        },
        {
          name: "Stomach",
          description: "Smooth stomach hair removal.",
          whatItTargets: "Hair across the stomach area.",
          whatItIs: "Complete stomach laser treatment.",
          aftercare: "Avoid tight clothing for 24 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£49" }],
        },
        {
          name: "Chest Strip",
          description: "Central chest hair removal.",
          whatItTargets: "Hair down the centre of the chest.",
          whatItIs: "Focused treatment for the chest strip area.",
          aftercare: "Avoid heat and friction.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£29" }],
        },
        {
          name: "Full Chest",
          description: "Complete chest hair removal.",
          whatItTargets: "All chest hair for a smooth appearance.",
          whatItIs: "Comprehensive chest laser treatment.",
          aftercare: "Avoid sun and exercise for 24-48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "30 mins",
          prices: [{ option: "Per Session", price: "£49" }],
        },
        {
          name: "Full Arms",
          description: "Complete arm hair removal.",
          whatItTargets: "Hair on both upper and lower arms.",
          whatItIs: "Full arm laser treatment from shoulder to wrist.",
          aftercare: "Apply SPF and avoid sun.",
          recommendation: "Course of 6 sessions",
          duration: "30 mins",
          prices: [{ option: "Per Session", price: "£59" }],
        },
        {
          name: "Half Back",
          description: "Upper or lower back treatment.",
          whatItTargets: "Hair on either the upper or lower back.",
          whatItIs: "Laser treatment for half the back area.",
          aftercare: "Avoid sun exposure and friction.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£60" }],
        },
        {
          name: "Full Back or Front",
          description: "Complete back or front torso treatment.",
          whatItTargets: "All hair on either the full back or full front.",
          whatItIs: "Comprehensive treatment for the entire back or front.",
          aftercare: "Avoid heat, sun, and tight clothing.",
          recommendation: "Course of 6 sessions",
          duration: "30 mins",
          prices: [{ option: "Per Session", price: "£99" }],
        },
      ],
    },
    {
      title: "Lower Body Areas",
      treatments: [
        {
          name: "Feet",
          description: "Remove unwanted hair from feet and toes.",
          whatItTargets: "Hair on the top of feet and toes.",
          whatItIs: "Gentle laser treatment for the feet.",
          aftercare: "Avoid tight shoes for 24 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£19" }],
        },
        {
          name: "Bikini Line",
          description: "Tidy bikini line hair removal.",
          whatItTargets: "Hair along the bikini line.",
          whatItIs: "Precise treatment for the bikini area edges.",
          aftercare: "Wear loose underwear for 24 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£39" }],
        },
        {
          name: "Brazilian",
          description: "Intimate area hair removal leaving a landing strip.",
          whatItTargets: "Most intimate area hair with a small strip remaining.",
          whatItIs: "Comprehensive treatment of the intimate area.",
          aftercare: "Avoid heat, friction, and tight clothing.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£69" }],
        },
        {
          name: "Buttocks",
          description: "Smooth, hair-free buttocks.",
          whatItTargets: "Hair on the buttock area.",
          whatItIs: "Complete buttock laser treatment.",
          aftercare: "Avoid tight clothing and friction.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£49" }],
        },
        {
          name: "Hollywood",
          description: "Complete intimate area hair removal.",
          whatItTargets: "All intimate area hair for a completely smooth result.",
          whatItIs: "Total hair removal from the entire intimate area.",
          aftercare: "Avoid heat, friction, and swimming for 48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "20 mins",
          prices: [{ option: "Per Session", price: "£75" }],
        },
        {
          name: "Half Legs",
          description: "Lower or upper leg treatment.",
          whatItTargets: "Hair on either the thighs or lower legs.",
          whatItIs: "Laser treatment for half the leg.",
          aftercare: "Apply SPF and avoid sun.",
          recommendation: "Course of 6 sessions",
          duration: "30 mins",
          prices: [{ option: "Per Session", price: "£60" }],
        },
        {
          name: "Full Legs",
          description: "Complete leg hair removal.",
          whatItTargets: "All leg hair from thigh to ankle.",
          whatItIs: "Comprehensive full leg laser treatment.",
          aftercare: "Avoid sun, heat, and exercise for 24-48 hours.",
          recommendation: "Course of 6 sessions",
          duration: "1h",
          prices: [{ option: "Per Session", price: "£89" }],
        },
      ],
    },
  ],
};

// ============= Skin & Facials =============
export const skinAndFacials: TreatmentCategory = {
  id: "skin-facials",
  title: "Skin & Facials",
  description: "Advanced facial treatments for lifting, resurfacing, and total skin rejuvenation",
  subcategories: [
    {
      title: "Lifting & Tightening",
      treatments: [
        {
          name: "HIFU Non-Surgical Face Lift",
          description:
            "Lifts sagging jowls, reduces double chin, and restores jawline definition using focused ultrasound.",
          whatItTargets:
            "This treatment focuses on lifting sagging jowls, reducing a double chin, and restoring definition to the jawline.",
          whatItIs:
            "It uses High-Intensity Focused Ultrasound to deliver energy into the deep support layers of the skin, causing an immediate tightening effect and stimulating long-term collagen production.",
          aftercare:
            "We recommend staying well-hydrated and avoiding strenuous exercise or extreme heat for at least 24 hours.",
          recommendation: "2 treatments per year to maintain a firm and lifted appearance",
          isClientFavourite: true,
          duration: "1h",
          prices: [
            { option: "Full Face (1h)", price: "£300" },
            { option: "Face and Neck (1.5h)", price: "£379" },
            { option: "Jawline (30min)", price: "£129" },
            { option: "Neck (30min)", price: "£99" },
          ],
        },
        {
          name: "Radio Frequency Skin Tightening",
          description: "Smooths fine lines and wrinkles while improving skin firmness and elasticity.",
          whatItTargets:
            "This procedure is designed to smooth fine lines and wrinkles while improving a general loss of skin firmness or elasticity.",
          whatItIs:
            "This technology uses controlled heat to reach the deeper layers of the skin, causing existing fibres to tighten and encouraging the body to produce new, elastic tissue.",
          aftercare:
            "It is essential to use SPF daily and keep the skin moisturised to support the structural changes in the skin.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [
            { option: "Full Face and Neck (1h)", price: "£79" },
            { option: "Full Face and Neck Course of 3 (15% off)", price: "£200" },
            { option: "Full Face, Neck and Chest (1h)", price: "£89" },
          ],
        },
        {
          name: "I-PRF (Injectable Platelet Rich Fibrin)",
          description: "Natural therapy using your own plasma to revitalise cells and accelerate repair.",
          whatItTargets:
            "This is highly effective for restoring lost volume, improving dull skin tone, and aiding hair restoration.",
          whatItIs:
            "This natural therapy uses your own plasma to release growth factors slowly to revitalise cells and accelerate repair and keratin production.",
          aftercare:
            "Please avoid touching the treated area for six hours and refrain from applying makeup for at least 24 hours.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          isClientFavourite: true,
          duration: "1h",
          prices: [
            { option: "Face (1h)", price: "£179", originalPrice: "£300" },
            { option: "Face Course of 3 (15% off)", price: "£455" },
            { option: "Scalp (1h)", price: "£140", originalPrice: "£250" },
            { option: "Scalp Course of 3 (15% off)", price: "£357" },
          ],
        },
      ],
    },
    {
      title: "Skin Resurfacing & Texture Refinement",
      treatments: [
        {
          name: "Microneedling",
          description: "Creates controlled micro-channels to trigger natural healing and replace damaged tissue.",
          whatItTargets: "This facial targets acne scarring, uneven pigmentation, sun spots, and visible large pores.",
          whatItIs:
            "By creating controlled micro-channels in the skin, this treatment triggers a natural healing response that replaces damaged tissue with fresh, healthy skin.",
          aftercare:
            "Avoid active skincare ingredients like retinol for three days and ensure you wear a high-factor SPF.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          isClientFavourite: true,
          duration: "1h",
          prices: [
            { option: "Face (1h)", price: "£119" },
            { option: "Face and Neck (1h)", price: "£139" },
            { option: "Face and Neck Course of 3", price: "£249" },
          ],
        },
        {
          name: "Microneedling + Dermalogica Pro Power Peel",
          description: "Dual-action treatment for deep scars, stubborn pigmentation, and advanced ageing signs.",
          whatItTargets:
            "This intensive combination targets deep acne scars, stubborn pigmentation, and advanced signs of ageing.",
          whatItIs:
            "This dual-action treatment uses microneedling to increase the absorption of a professional chemical peel, allowing for more dramatic skin renewal.",
          aftercare: "Use only gentle, hydrating products while the skin is peeling and avoid any direct sunlight.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1.5h",
          prices: [
            { option: "Face (1.5h)", price: "£149" },
            { option: "Face and Neck (1.5h)", price: "£169" },
          ],
        },
        {
          name: "Dermalogica Pro Power Peels",
          description: "Bespoke chemical exfoliation for pigmentation, scars, and rough texture.",
          whatItTargets:
            "This is ideal for addressing pigmentation, acne scars, rough skin texture, and persistent congestion.",
          whatItIs:
            "A bespoke chemical exfoliation that dissolves the bonds between dead skin cells, allowing them to shed and reveal a brighter complexion.",
          aftercare: "Avoid heat treatments such as saunas and stay out of direct sunlight for at least 48 hours.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "30min",
          prices: [
            { option: "Face (30min)", price: "£69" },
            { option: "Face Course of 3 (15% off)", price: "£175" },
            { option: "Face + Microdermabrasion (1h)", price: "£99" },
            { option: "Face + Microdermabrasion Course of 3 (15% off)", price: "£250" },
          ],
        },
        {
          name: "Microdermabrasion",
          description: "Diamond-tipped mechanical exfoliation for smoother skin and improved circulation.",
          whatItTargets:
            "This treatment is best for smoothing surface marks, removing dry or flaky skin, and softening fine lines.",
          whatItIs:
            "A mechanical exfoliation that uses a diamond-tipped vacuum to buff away the dull outer layer of skin, instantly improving circulation and skin texture.",
          aftercare: "Moisturise frequently to soothe the skin and avoid sun exposure for at least two days.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [
            { option: "Face (1h)", price: "£69" },
            { option: "Face Course of 3 (15% off)", price: "£175" },
            { option: "Face and Neck (1h)", price: "£79" },
            { option: "Face and Neck Course of 3 (15% off)", price: "£200" },
          ],
        },
        {
          name: "Ultrasound Oxygen Facial",
          description: "Deep hydration using sound waves to infuse oxygen and serums for instant plumping.",
          whatItTargets: "This is a deeply hydrating treatment for dehydrated, sallow, or sensitive skin.",
          whatItIs:
            "It uses sound waves to improve skin permeability, allowing pure oxygen and hydrating serums to be infused directly into the skin for an instant plumping effect.",
          aftercare: "There is no downtime for this treatment, making it ideal for immediate results before an event.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [
            { option: "Face (1h)", price: "£79" },
            { option: "Face Course of 3 (15% off)", price: "£200" },
          ],
        },
      ],
    },
    {
      title: "Advanced Laser & Light Therapies",
      treatments: [
        {
          name: "Laser Carbon Peel",
          description: "The 'Hollywood Peel' - deep-cleans pores and exfoliates for instant glow.",
          whatItTargets: "This targets enlarged pores, oily skin, acne scarring, and dull skin texture.",
          whatItIs:
            "A carbon layer is applied to bond with impurities, which is then vaporised by a laser to deep-clean the pores and exfoliate the surface.",
          aftercare: "Use a gentle cleanser and prioritise high-quality sun protection daily.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [
            { option: "Face (1h)", price: "£79" },
            { option: "Face Course of 3 (15% off)", price: "£200" },
          ],
        },
        {
          name: "Laser Acne Treatment",
          description: "Destroys acne-causing bacteria and reduces oil gland activity.",
          whatItTargets: "This focuses on active acne, painful cysts, inflammation, and blemish-prone skin.",
          whatItIs:
            "It uses targeted light energy to destroy acne-causing bacteria and reduce the activity of the oil glands that lead to breakouts.",
          aftercare: "Use oil-free SPF and avoid scrubbing or picking the skin while it is healing.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [
            { option: "Face (1h)", price: "£89" },
            { option: "Face Course of 3 (15% off)", price: "£225" },
          ],
        },
        {
          name: "Laser Photo Rejuvenation",
          description: "Gently breaks down excess pigment to reveal a clearer, more even complexion.",
          whatItTargets: "This treatment corrects sun damage, age spots, freckles, melasma, and hyperpigmentation.",
          whatItIs:
            "It uses light energy to gently break down excess pigment in the skin, which then fades away to reveal a clearer, more even complexion.",
          aftercare: "Strict sun avoidance and daily SPF are essential to prevent new pigment from forming.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [
            { option: "Face (1h)", price: "£89" },
            { option: "Face Course of 3 (15% off)", price: "£225" },
            { option: "Face and Neck (1h)", price: "£129" },
            { option: "Face and Neck Course of 3 (15% off)", price: "£325" },
          ],
        },
        {
          name: "Thread Vein Removal (Face)",
          description: "Laser therapy to collapse and fade visible veins for clearer skin tone.",
          whatItTargets:
            "This specifically targets thread veins, spider veins, broken capillaries, and visible vascular concerns on the face, particularly around the nose, cheeks, and chin.",
          whatItIs:
            "A targeted laser or light therapy (such as IPL) that focuses on the visible veins. The energy causes the vessel walls to collapse and gradually fade away as the body naturally reabsorbs them, resulting in a clearer, more even skin tone.",
          aftercare:
            "Avoid very hot showers, saunas, or steam rooms for 48 hours. It is essential to apply a broad-spectrum SPF 30+ daily and avoid direct sun exposure. Avoid using harsh exfoliants or active ingredients like Retinol for 3–5 days.",
          recommendation: "Course of 3 treatments, scheduled once every 4 to 6 weeks",
          duration: "20-40min",
          prices: [
            { option: "Small Area (20min)", price: "£49" },
            { option: "Medium Area (30min)", price: "£69" },
            { option: "Large Area (40min)", price: "£89" },
          ],
        },
      ],
    },
    {
      title: "Dermalogica & Specialist Facials",
      treatments: [
        {
          name: "Dermalogica The Ultimate Luxury Facial",
          description: "Our most comprehensive facial experience combining advanced techniques and premium products.",
          whatItTargets:
            "This is designed for multiple skin health concerns, high-stress skin, and total skin rejuvenation.",
          whatItIs:
            "Our most comprehensive facial experience that combines advanced techniques and premium products to deeply restore the skin.",
          aftercare: "Enjoy your glow and maintain the results with your bespoke Dermalogica home care routine.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h 20min",
          prices: [{ option: "Face", price: "£99" }],
        },
        {
          name: "Dermalogica Pro Luxury Facial",
          description: "Professional-grade treatment tailored to meet your skin's specific requirements.",
          whatItTargets:
            "This addresses changing skin needs such as seasonal dryness, occasional breakouts, or uneven tone.",
          whatItIs:
            "A professional-grade treatment that is tailored at every step to meet your skin's specific requirements on the day.",
          aftercare: "Keep the skin hydrated and protected with your recommended daily moisturiser.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [{ option: "Face", price: "£89" }],
        },
        {
          name: "Full Facial",
          description: "A thorough cleansing treatment to extract impurities and revitalise tired skin.",
          whatItTargets: "This addresses general congestion, impurities, blocked pores, and skin fatigue.",
          whatItIs:
            "A thorough cleansing treatment designed to extract impurities and revitalise tired skin for a fresh, clean feeling.",
          aftercare: "Keep the skin clean and avoid heavy makeup for the remainder of the day.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [{ option: "Face", price: "£59" }],
        },
        {
          name: "Mini Facial",
          description: "A concentrated pick-me-up providing essential hydration and brightening.",
          whatItTargets: "This is perfect for lack of radiance, surface dehydration, and those with time constraints.",
          whatItIs:
            "A concentrated 'pick-me-up' treatment that provides essential hydration and brightening in a shorter timeframe.",
          aftercare: "Apply your daily moisturiser and SPF to keep the skin glowing.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "30min",
          prices: [{ option: "Face", price: "£39" }],
        },
      ],
    },
  ],
};

// ============= Body & Wellness =============
export const bodyAndWellness: TreatmentCategory = {
  id: "body-wellness",
  title: "Body & Wellness",
  description: "Comprehensive body treatments for contouring, firming, and internal rejuvenation",
  subcategories: [
    {
      title: "Internal Rejuvenation",
      treatments: [
        {
          name: "IV Drip Therapy",
          description: "Specialised vitamin infusion delivered directly into the bloodstream for immediate absorption.",
          whatItTargets:
            "This treatment is designed to combat fatigue, dehydration, reduced immunity, and dull skin while addressing nutrient deficiencies for holistic rejuvenation.",
          whatItIs:
            "A specialised infusion that delivers essential vitamins and minerals directly into the bloodstream for immediate absorption, helping to revitalise your system from the inside out.",
          aftercare:
            "We recommend drinking plenty of water and avoiding alcohol for 24 hours to maximise the benefits of the nutrients.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          isClientFavourite: true,
          duration: "1h",
          prices: [
            { option: "Starting From (1h)", price: "£99+" },
            { option: "Course of 3 (15% off)", price: "Call for pricing" },
          ],
        },
      ],
    },
    {
      title: "Body Contouring & Firming",
      treatments: [
        {
          name: "HIFU Non-Surgical Body Sculpt",
          description: "Targets fat cells and tightens skin's deeper layers for a sculpted appearance.",
          whatItTargets:
            "This focuses on reducing localised fat deposits, improving skin laxity, and firming areas where there is a loss of body contour.",
          whatItIs:
            "It uses High-Intensity Focused Ultrasound to target fat cells and tighten the skin's deeper layers, providing a sculpted appearance without the need for invasive procedures.",
          aftercare:
            "Maintain a healthy diet and increase your water intake to help the body naturally process and flush away the treated fat cells.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [{ option: "Price on Consultation (1h)", price: "Call" }],
        },
        {
          name: "Fat Freeze (Cryolipolysis)",
          description: "Controlled cooling technology that crystallises and eliminates stubborn fat cells.",
          whatItTargets:
            "This treatment is ideal for stubborn fat resistant to diet and exercise, focusing on body sculpting and long-term fat reduction.",
          whatItIs:
            "A controlled cooling technology that targets and crystallises fat cells; these cells are then naturally eliminated by the body over the following weeks.",
          aftercare:
            "Gently massaging the treated area can help the process, and staying active will support your body's natural elimination of the fat.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          isClientFavourite: true,
          prices: [
            { option: "1 Cup (1h)", price: "£79" },
            { option: "2 Cups (1h)", price: "£139" },
            { option: "6 Cups (1h)", price: "£279" },
          ],
        },
        {
          name: "Ultrasound Cavitation",
          description: "Low-frequency sound waves break down fat cell membranes for natural elimination.",
          whatItTargets:
            "This targets localised fat pockets, the appearance of cellulite, uneven body contours, and fluid retention.",
          whatItIs:
            "It uses low-frequency sound waves to break down fat cell membranes, allowing the contents to be processed naturally through your lymphatic system.",
          aftercare:
            "To see the best results, we recommend light exercise and staying very well-hydrated to help your system flush the released fat.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "40min",
          prices: [
            { option: "Full Stomach (40min)", price: "£99" },
            { option: "Full Stomach Course of 3 (15% off)", price: "£250" },
            { option: "Full Thighs (40min)", price: "£89" },
            { option: "Full Thighs Course of 3 (15% off)", price: "£225" },
          ],
        },
        {
          name: "Radio Frequency Body Tightening",
          description: "Heat energy contracts collagen fibres for improved smoothness and firmness.",
          whatItTargets:
            "This procedure addresses loose or crepey skin, cellulite, and a reduction in skin elasticity.",
          whatItIs:
            "It uses heat energy to reach the deep layers of the skin, causing collagen fibres to contract and firm while improving the overall smoothness and firmness of the skin.",
          aftercare:
            "Apply a firming moisturiser daily and protect any exposed treated areas with SPF to support the new tissue growth.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          isClientFavourite: true,
          duration: "40min",
          prices: [
            { option: "Full Stomach (40min)", price: "£129" },
            { option: "Full Stomach Course of 3 (15% off)", price: "£279" },
            { option: "Lower Stomach (40min)", price: "£99" },
            { option: "Lower Stomach Course of 3 (15% off)", price: "£250" },
            { option: "Buttocks (40min)", price: "£99" },
            { option: "Buttocks Course of 3 (15% off)", price: "£250" },
            { option: "Thighs (40min)", price: "£99" },
            { option: "Thighs Course of 3 (15% off)", price: "£250" },
          ],
        },
      ],
    },
    {
      title: "Advanced Laser & Light Therapies (Body)",
      treatments: [
        {
          name: "Laser Photo Rejuvenation (Body)",
          description: "Light energy breaks down excess pigment on body areas for clearer skin.",
          whatItTargets:
            "This treatment corrects sun damage, age spots, freckles, melasma, and hyperpigmentation on the body.",
          whatItIs:
            "It uses light energy to gently break down excess pigment in the skin, which then fades away to reveal a clearer, more even complexion.",
          aftercare: "Strict sun avoidance and daily SPF are essential to prevent new pigment from forming.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "30min",
          prices: [
            { option: "Hands (30min)", price: "£59" },
            { option: "Hands Course of 3 (15% off)", price: "£150" },
          ],
        },
        {
          name: "Laser Carbon Peel (Body)",
          description: "Deep-clean pores and refresh skin surface on body areas.",
          whatItTargets:
            "This is effective for congested skin, enlarged pores, uneven texture, and dull skin on the body.",
          whatItIs:
            "A layer of liquid carbon is applied to the skin to bond with impurities, which is then vaporised by a laser to deep-clean the pores and refresh the skin surface.",
          aftercare:
            "Use a gentle, fragrance-free body wash and ensure the area is kept moisturised and protected from the sun.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "45min-1h",
          prices: [
            { option: "Full Back (1h)", price: "£199" },
            { option: "Full Back Course of 3 (15% off)", price: "£505" },
            { option: "Upper Back (45min)", price: "£129" },
            { option: "Upper Back Course of 3 (15% off)", price: "£330" },
            { option: "Chest (45min)", price: "£99" },
            { option: "Chest Course of 3 (15% off)", price: "£250" },
          ],
        },
        {
          name: "Thread Vein Removal (Body)",
          description: "Targeted laser therapy to collapse and fade visible veins on the body.",
          whatItTargets:
            "This specifically targets thread veins, spider veins, broken capillaries, and visible vascular concerns on the body.",
          whatItIs:
            "A targeted laser or light therapy that focuses on the visible veins, causing them to collapse and gradually fade away as the body reabsorbs them.",
          aftercare:
            "Avoid very hot baths or showers for 48 hours and wear support hosiery if the legs have been treated.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "20-40min",
          prices: [
            { option: "Small Area (20min)", price: "£79" },
            { option: "Medium Area (30min)", price: "£109" },
            { option: "Large Area (40min)", price: "£149" },
          ],
        },
      ],
    },
    {
      title: "Clinical Body Skin Resurfacing",
      treatments: [
        {
          name: "Microneedling (Body)",
          description: "Controlled micro-channels trigger natural healing for scarring and stretch marks.",
          whatItTargets:
            "This is highly effective for treating scarring, stretch marks, uneven skin texture, and reduced skin firmness.",
          whatItIs:
            "By creating controlled micro-channels in the skin, this treatment triggers a natural healing response that remodels tissue and improves the appearance of stretch marks and scars.",
          aftercare:
            "Avoid sun exposure on the area for at least a week and use a nourishing, gentle body oil to support the healing process.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "1h",
          prices: [
            { option: "Full Back (1h)", price: "£199" },
            { option: "Full Back Course of 3 (15% off)", price: "£505" },
            { option: "Half Back (1h)", price: "£149" },
            { option: "Half Back Course of 3 (15% off)", price: "£380" },
            { option: "Chest (1h)", price: "£149" },
            { option: "Chest Course of 3 (15% off)", price: "£380" },
          ],
        },
      ],
    },
  ],
};

// ============= Injectables =============
export const injectables: TreatmentCategory = {
  id: "injectables",
  title: "Injectables",
  description: "Precision injectable treatments delivered by qualified medical professionals for natural enhancement",
  subcategories: [
    {
      title: "Wrinkle Reduction & Volume",
      treatments: [
        {
          name: "Anti-Wrinkle Treatment",
          description: "Precision injectable that relaxes facial muscles for a smoother, refreshed appearance.",
          whatItTargets:
            "This treatment focuses on dynamic wrinkles, expression lines, forehead lines, frown lines, and crow's feet.",
          whatItIs:
            "It is a precision injectable treatment that relaxes the specific facial muscles responsible for creating deep expression lines, resulting in a smoother and more refreshed appearance.",
          aftercare:
            "You should remain upright for at least four hours after treatment and avoid strenuous exercise or extreme heat for 24 hours.",
          recommendation: "Follow-up every 3 to 4 months to maintain results",
          isClientFavourite: true,
          duration: "30min",
          prices: [{ option: "3 Areas (30min)", price: "£250" }],
        },
        {
          name: "Dermal Fillers",
          description: "Gel-like substance injected to restore volume, smooth folds, and enhance features.",
          whatItTargets:
            "This procedure addresses volume loss, facial asymmetry, deep lines, and loss of contour definition.",
          whatItIs:
            "A gel-like substance is expertly injected beneath the skin to restore lost volume, smooth out deep folds, and enhance your natural facial features.",
          aftercare:
            "Avoid touching the treated area for six hours and refrain from intense heat or alcohol for the first 24 hours to minimise swelling.",
          recommendation: "Review every 6 to 12 months depending on the area treated",
          isClientFavourite: true,
          duration: "30min",
          prices: [{ option: "Lips (30min)", price: "£250" }],
        },
      ],
    },
    {
      title: "Skin Rejuvenation",
      treatments: [
        {
          name: "Mesotherapy",
          description: "Micro-injections of vitamins, minerals, and hyaluronic acid for intense hydration.",
          whatItTargets:
            "This is ideal for dehydrated skin, dull complexions, fine lines, and reduced skin elasticity.",
          whatItIs:
            "It involves micro-injections of a specialised cocktail containing vitamins, minerals, and hyaluronic acid to intensely hydrate and revitalize the skin.",
          aftercare:
            "Keep the skin clean and hydrated; avoid direct sun exposure and swimming for 48 hours following the procedure.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          prices: [
            { option: "Starting At", price: "£129+" },
            { option: "Course of 3", price: "15% off" },
          ],
        },
        {
          name: "Skin Booster",
          description: "Injectable treatment delivering intense hydration directly into the skin.",
          whatItTargets:
            "This treatment focuses on deep hydration, improving skin quality, and enhancing skin elasticity.",
          whatItIs:
            "An injectable treatment designed to deliver intense hydration directly into the skin to revitalise dull skin and restore a youthful glow.",
          aftercare:
            "Please avoid touching the treated area for at least six hours and refrain from applying makeup for 24 hours. You should also avoid strenuous exercise and extreme heat (like saunas) for 48 hours.",
          recommendation: "Course of 2 to 3 treatments, spaced 4 weeks apart",
          prices: [{ option: "Starting From", price: "£120+" }],
        },
        {
          name: "Under Eye Brightening",
          description: "Targeted injectable to revitalise the delicate under-eye area.",
          whatItTargets:
            "This specifically targets darkness, fine lines, and a tired appearance in the delicate area under the eyes.",
          whatItIs: "A targeted injectable treatment to revitalise the under eye area and improve skin tone.",
          aftercare:
            "Avoid touching or rubbing the eyes for six hours. Do not apply eye makeup for 24 hours, and try to sleep with your head slightly elevated on the first night to minimise any potential swelling.",
          recommendation: "Course of 3 treatments, scheduled once every 3 to 4 weeks",
          prices: [{ option: "Starting From", price: "£129+" }],
        },
      ],
    },
    {
      title: "Fat Reduction",
      treatments: [
        {
          name: "Fat Dissolving Treatment",
          description: "Specialised solution injected to break down stubborn fat cell membranes.",
          whatItTargets:
            "This treatment targets localised fat deposits, such as a double chin, jawline fullness, and small, resistant fat pockets.",
          whatItIs:
            "A specialised solution is injected into areas of stubborn fat to break down the fat cell membranes, allowing the body to naturally eliminate them.",
          aftercare:
            "Wear a compression garment if recommended and drink plenty of water to help your lymphatic system flush away the broken-down fat.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          isClientFavourite: true,
          duration: "30min",
          prices: [
            { option: "Starting From (30min)", price: "£59+" },
          ],
        },
      ],
    },
    {
      title: "Vitamin Injections",
      treatments: [
        {
          name: "Vitamin B12",
          description: "Direct injection for maximum absorption to boost energy and support nervous system.",
          whatItTargets:
            "This focuses on combating fatigue, low energy levels, and reduced concentration caused by vitamin deficiency.",
          whatItIs:
            "A direct injection of Vitamin B12 into the muscle, which allows for maximum absorption to boost energy levels and support your nervous system.",
          aftercare: "No downtime is required; however, you should avoid massaging the injection site for a few hours.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "30min",
          prices: [
            { option: "1 Injection (30min)", price: "£30" },
            { option: "Course of 3", price: "£60" },
          ],
        },
        {
          name: "Biotin",
          description: "Vitamin B7 injection supporting keratin production for stronger hair and nails.",
          whatItTargets: "This specifically addresses hair thinning, brittle nails, and reduced hair strength.",
          whatItIs:
            "Also known as Vitamin B7, this injection supports your body's keratin production, leading to stronger hair, nails, and improved skin health.",
          aftercare:
            "There is no recovery time; you can resume your normal daily activities immediately after the injection.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "30min",
          prices: [
            { option: "1 Injection (30min)", price: "£50" },
            { option: "Course of 3 Injections", price: "£60" },
            { option: "Course of 6 Injections", price: "£199" },
          ],
        },
        {
          name: "Bepanthen",
          description: "Vitamin B5 injection for deep hydration and improved skin barrier.",
          whatItTargets: "This targets skin dryness, reduced hydration levels, and a dull or weakened skin condition.",
          whatItIs:
            "An injection of Vitamin B5 that helps to deeply hydrate the skin from the inside out, improving the skin's barrier and overall radiance.",
          aftercare:
            "Avoid intense heat or exercise for the remainder of the day to let the vitamin settle into your system.",
          recommendation: "Course of 3 treatments, scheduled once a month",
          duration: "30min",
          prices: [
            { option: "1 Injection (30min)", price: "£50" },
            { option: "Course of 6 Injections", price: "£199" },
          ],
        },
      ],
    },
  ],
};

// ============= All Categories Export =============
export const treatmentCategories: TreatmentCategory[] = [
  laserHairRemoval,
  skinAndFacials,
  bodyAndWellness,
  injectables,
];

// ============= Offers =============
export const offers = [
  {
    title: "Full Body Package",
    subtitle: "Laser Hair Removal",
    description: "6 full body laser hair removal sessions for just £850. Save over £280 on individual sessions.",
    badge: "Save £280+",
    price: "£850",
  },
  {
    title: "Bikini and Underarms",
    subtitle: "Laser Hair Removal",
    description: "Complete 6-session course for bikini and underarms at a special package price.",
    badge: "Popular",
    price: "£300",
  },
  {
    title: "2 Small + 1 Large Area",
    subtitle: "Laser Hair Removal",
    description: "Combine 2 small areas and 1 large area for comprehensive hair removal at a discounted rate.",
    badge: "Best Value",
    price: "£499",
  },
  {
    title: "Men's Upper Body",
    subtitle: "Laser Hair Removal",
    description: "Complete 6-session course for men's upper body laser hair removal.",
    badge: "Popular",
    price: "£699",
  },
  {
    title: "Men's Full Face and Neck",
    subtitle: "Laser Hair Removal",
    description: "6-session course for complete facial and neck hair removal for men.",
    badge: "Popular",
    price: "£285",
  },
  {
    title: "Microneedling Package",
    subtitle: "3 Sessions",
    description: "Complete course of 3 microneedling sessions for optimal skin renewal results.",
    badge: "Course Offer",
    price: "£249",
  },
  {
    title: "Fat Freeze Package",
    subtitle: "3 Sessions",
    description: "Course of 3 Fat Freeze sessions for effective body contouring and fat reduction.",
    badge: "Course Offer",
    price: "£279",
  },
  {
    title: "Radio Frequency Stomach",
    subtitle: "3 Sessions",
    description: "Complete course of 3 Radio Frequency treatments for stomach tightening.",
    badge: "Course Offer",
    price: "£279",
  },
  {
    title: "IV Glutathione & Vitamin C",
    subtitle: "3 Sessions",
    description: "Powerful antioxidant IV therapy course for skin brightening and immunity boost.",
    badge: "Wellness",
    price: "£249",
    note: "Single session: £129",
  },
  {
    title: "15% OFF",
    subtitle: "Course of 3 Treatments",
    description: "Save 15% when you book a course of 3 treatments. Applicable to most skin and body treatments.",
    badge: "Popular",
  },
];

// ============= Team =============
export const team = [
  {
    name: "Mrs Kay",
    role: "Clinic Director & Level 7 Aesthetic Practitioner",
    experience: "25+ years experience",
    description:
      "Mrs Kay holds a postgraduate qualification in aesthetic practice. She specialises in medical-grade aesthetic and wellness treatments, including injectable procedures, phlebotomy, IV nutritional therapy, and laser treatments. She delivers advanced facial aesthetics and body treatments with a focus on patient safety and quality of care.",
    image: "mrs-kay",
  },
  {
    name: "Dr Mila",
    role: "Medical Doctor, Laser Specialist",
    experience: "30+ years experience",
    description:
      "Dr Mila is a medical doctor specialising in the clinical application of advanced laser technology. She provides corrective laser treatments and medical-grade laser hair removal for the face and body, applying medical training and expertise in laser physics to ensure safe and effective outcomes.",
    image: "dr-mila",
  },
  {
    name: "Miss Elissa",
    role: "Skin Specialist",
    experience: "4+ years experience",
    description:
      "Miss Elissa specialises in dermal health and advanced facial treatments. She delivers non-invasive skin rejuvenation and regenerative facial therapies using tailored clinical protocols. Professionally trained with Dermalogica, she focuses on addressing complex skin concerns while supporting long-term skin health.",
    image: "miss-eliisa",
  },
];

// ============= Reviews =============
export const reviews = {
  treatwell: [
    {
      name: "Sarah M.",
      rating: 5,
      text: "Absolutely amazing experience! The team is so professional and made me feel completely at ease. The results from my HIFU treatment are incredible.",
      date: "December 2025",
    },
    {
      name: "Emma K.",
      rating: 5,
      text: "Best clinic in North London! I've been coming here for years and wouldn't go anywhere else. The staff are knowledgeable and the results speak for themselves.",
      date: "November 2025",
    },
    {
      name: "Jennifer L.",
      rating: 5,
      text: "Had my first microneedling session and was blown away by how thorough the consultation was. Already seeing improvements in my skin texture!",
      date: "November 2025",
    },
  ],
  google: [
    {
      name: "Charlotte R.",
      rating: 5,
      text: "Exceptional service from start to finish. Dr Mila is incredibly skilled and really takes the time to understand what you want to achieve.",
      date: "January 2026",
    },
    {
      name: "Olivia T.",
      rating: 5,
      text: "I was nervous about getting fillers but the team put me at ease. Natural looking results and I couldn't be happier!",
      date: "December 2025",
    },
    {
      name: "Sophie H.",
      rating: 5,
      text: "The Dermalogica facials here are next level. My skin has never looked better. Highly recommend the Ultimate Luxury Facial!",
      date: "December 2025",
    },
  ],
};

// Legacy export for backward compatibility
export const treatments = {
  lifting: skinAndFacials.subcategories[0],
  injectables: injectables.subcategories[0],
  resurfacing: skinAndFacials.subcategories[1],
  laser: skinAndFacials.subcategories[2],
  facials: skinAndFacials.subcategories[3],
  body: bodyAndWellness.subcategories[1],
  laserHair: laserHairRemoval.subcategories[0],
};
