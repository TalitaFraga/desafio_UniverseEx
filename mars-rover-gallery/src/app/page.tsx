import Gallery from "../../components/Gallery";

function Home(){
  return(
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-center mb-6">
        Galeria de Fotos de Marte
      </h1>
      <Gallery />
    </main>
  )
}
export default Home