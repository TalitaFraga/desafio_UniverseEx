
# Mars Rover Gallery 🚀

Aplicação desenvolvida como parte do **desafio front-end UniverseEx**.  
O objetivo é consumir a [NASA Mars Rover Photos API](https://api.nasa.gov/#mars-rover-photos) e exibir fotos tiradas em Marte, com filtros por rover, câmera e data.


## ✅ Funcionalidades

- **Galeria de fotos** com data, nome do rover e câmera.  
- **Filtros dinâmicos**:  
  - Seleção de rover  
  - Seleção de câmera  
  - Seleção de data terrestre  
- **Paginação** (anterior / próxima página).  
- **Manifest do rover**: garante que só datas válidas sejam usadas.  
- **Componentização**:  
  - `Gallery` (controle principal da galeria)  
  - `Filters` (formulário de filtros)  
  - `PhotoCard` (cada foto)  
  - `Header` e `Footer` (layout básico).  
- **TypeScript + Next.js 15 (App Router)**.  

## ✅ Como executar o projeto 

### 1. Clonar o repositório
```bash
git clone https://github.com/TalitaFraga/desafio_UniverseEx
cd desafio_UniverseEx
npm install
```

### 2. Criar API KEY
```bash
Na raiz do projeto crie o arquivo .env.local e adicione sua chave da NASA:
NASA_API_KEY=SUA_CHAVE_AQUI
Gere sua chave gratuita no site oficial: https://api.nasa.gov/#mars-rover-photos
```

### 3. Executando o projeto
```bash
Acesse a pasta mars-rover-gallery: cd mars-rover-gallery
Execute o projeto: npm run dev
Aplicação: http://localhost:3000/
Exemplo de chamada API interna: http://localhost:3000/api/mars?rover=curiosity&earth_date=2020-03-21&page=1
```
