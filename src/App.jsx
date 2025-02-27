import { useState } from 'react';
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_PB_URL);

function App() {
  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState("");
  const [imagens, setImagens] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imagens.length > 20) {
      alert("Você pode enviar no máximo 20 imagens.");
      return;
    }

    try {
      await pb.admins.authWithPassword(
        import.meta.env.VITE_PB_USER,
        import.meta.env.VITE_PB_PASS
      );

      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("sexo", sexo);

      imagens.forEach((img) => formData.append("imagem", img));

      const record = await pb.collection("dogs").create(formData);
      console.log("Sucesso:", record);
      alert("Doguinho cadastrado com sucesso!");
      setNome("");
      setSexo("");
      setImagens([]);
      window.location.reload();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao cadastrar o doguinho.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Adicionar Doguinho</h2>
        <p className="text-gray-600 text-center">Envie até 20 fotos do seu doguinho para o banco de imagens do Buscão. Isso vai nos ajudar a construir uma aplicação que um dia pode te ajudar a achar o amiguinho de 4 patas.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nome do doguinho"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <select
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Selecione o sexo</option>
            <option value="Macho">Macho</option>
            <option value="Femea">Fêmea</option>
          </select>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImagens([...e.target.files])}
            className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          {imagens.length > 0 && (
            <p className="text-gray-600 text-sm text-center">{imagens.length} imagens selecionadas</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Enviar Doguinho
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
