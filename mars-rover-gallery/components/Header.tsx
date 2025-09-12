"use client"

export default function Header() {
  return (
    <header className="w-full text-gray-300 py-4 px-6 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <div className="w-20" />

        <h1 className="flex-1 text-center text-3xl md:text-4xl font-semibold tracking-tight">
          Galeria de Fotos de Marte
        </h1>

        <nav className="w-20 text-right">
          <a href="/" className="text-sm text-gray-600 hover:text-black">
            Home
          </a>
        </nav>
      </div>
    </header>
  )
}
