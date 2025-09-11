export type Camera = {
  id: number;
  name: string
  full_name: string 
  rover_id: number
}

export type Rover = {
  id: number
  name: "Curiosity" | "Opportunity" | "Spirit" | string
}

export type Photo = {
  id: number
  img_src: string
  earth_date: string
  camera: Camera;
  rover: Rover
}

export type MarsPhotosResponse = {
  photos: Photo[]
}