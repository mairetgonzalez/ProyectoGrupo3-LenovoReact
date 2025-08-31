// src/pages/HomePage.jsx (o Home.jsx)
import HomeCategories from "../components/categorias/HomeCategorias";
import HomeFeatured from "../components/featured/HomeFeatured"; 
import HomePromocoes from "../components/promocoes/HomePromocoes";
import PaymentMethods from "../components/payments/PaymentMethods";


export default function Home() {
  return (
    <main>
      {/* Hero … */}
      <HomeCategories />

      {/* Produtos Destacados */}
      <HomeFeatured />

      {/* Promocoes … */}
      <HomePromocoes />

      {/* Forma de Pagamento */}
      <PaymentMethods />
    </main>
  );
}
