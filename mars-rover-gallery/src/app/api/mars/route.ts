import { NextResponse } from "next/server";

export async function GET(request:Request) {
    try{
        const url = new URL(request.url)
        const rover = url.searchParams.get("rover") ?? "curiosity"
        const camera = url.searchParams.get("camera") ?? ""
        const earth_date = url.searchParams.get("earth_date") ?? ""
        const page = url.searchParams.get("page") ?? "1"

        const apiKey = process.env.NASA_API_KEY
        // console.log("API KEY:", process.env.NASA_API_KEY);
        if(!apiKey){
            return NextResponse.json({erro: "Erro na NASA_API_KEY"}, {status:500})
        }
        

        const nasaUrl = new URL(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`)
        nasaUrl.searchParams.set("earth_date", earth_date)
        if(camera){
            nasaUrl.searchParams.set("camera", camera)
        } 
        nasaUrl.searchParams.set("page", page)
        nasaUrl.searchParams.set("api_key", apiKey)


        const res = await fetch(nasaUrl.toString(), {cache: "no-store"})

        if (!res.ok) {
            const text = await res.text();
            return NextResponse.json({ error: "Erro da API NASA", details: text }, { status: res.status });
        }

        const data = await res.json()
        return NextResponse.json(data);

    }catch(err){
        console.error("Erro na rota /api/mars:", err);
        return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
    }


}