export const ROVERS = ["curiosity", "opportunity", "spirit"] as const

export const CAMERAS_BY_ROVER = {
  curiosity: ["FHAZ","RHAZ","MAST","CHEMCAM","MAHLI","MARDI","NAVCAM", "CHEMCAM_RMI"],
  opportunity: ["FHAZ","RHAZ","NAVCAM","PANCAM","MINITES"],
  spirit: ["FHAZ","RHAZ","NAVCAM","PANCAM","MINITES"],
} as const

export type RoverKey = typeof ROVERS[number]
export type CameraCode = typeof CAMERAS_BY_ROVER[keyof typeof CAMERAS_BY_ROVER][number]


