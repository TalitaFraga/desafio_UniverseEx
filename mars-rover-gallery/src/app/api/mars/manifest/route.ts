import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server"

const BASE = "https://api.nasa.gov/mars-photos/api/v1"


export async function GET (req:NextRequest){
    const { searchParams } = new URL(req.url)
    const rover = searchParams.get("rover") ?? "curiosity"

    const key = process.env.NASA_API_KEY;
    if(!key){
        return NextResponse.json({error: "Missing API key"}, {status: 500})
    }

    const urlNasa = new URL(`${BASE}/manifests/${rover}`)
    urlNasa.searchParams.set("api_key", key)

    const res = await fetch(urlNasa.toString(), {cache: "no-store"})
    const data = await res.json()
    return NextResponse.json(data, {status: res.status})
}