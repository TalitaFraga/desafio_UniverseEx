import Gallery from "../../components/Gallery";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function Home(){
  return(
    <main className="p-6 max-w-6xl mx-auto">
      <Header />
      <Gallery />
      <Footer />

    </main>
  )
}
export default Home