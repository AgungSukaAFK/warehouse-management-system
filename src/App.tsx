import React from "react";
import { Database, TrendingUp, Truck, Lock, Package } from "lucide-react";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 font-inter text-gray-800 antialiased">
      {/* Header/Navbar */}
      <header className="py-4 px-6 md:px-12 bg-white/80 backdrop-blur-sm shadow-sm rounded-b-xl">
        <nav className="container mx-auto flex justify-between items-center">
          <a
            href="#"
            className="text-2xl font-bold text-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            WMS Pro
          </a>
          <ul className="flex space-x-6">
            <li>
              <a
                href="#features"
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Fitur
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Tentang
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Kontak
              </a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 lg:py-36 text-center">
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 mb-6 drop-shadow-sm">
            Optimalkan <span className="text-indigo-600">Manajemen Gudang</span>{" "}
            Anda
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Sistem Manajemen Gudang berbasis web yang komprehensif untuk
            efisiensi operasional dan visibilitas stok{" "}
            <strong>real-time</strong>.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg
                       text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Mulai Sekarang
          </a>
        </div>
        {/* Abstract shapes for background visual appeal */}
        <div className="absolute top-0 left-0 w-3/4 h-3/4 bg-indigo-200 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob -z-0"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-blue-300 opacity-20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 -z-0"></div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 md:py-28 bg-white shadow-inner rounded-t-xl"
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Fitur Unggulan Kami
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1: Data Management */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-6 mx-auto">
                <Database size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Manajemen Data Lengkap
              </h3>
              <p className="text-gray-600 text-center">
                Kelola data MR, PR, PO, Delivery, dan Stok dengan mudah dalam
                satu platform terpusat.
              </p>
            </div>

            {/* Feature Card 2: Real-time Data Update */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6 mx-auto">
                <TrendingUp size={32} /> {/* Using TrendingUp for real-time */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Update Data Real-time
              </h3>
              <p className="text-gray-600 text-center">
                Perubahan data stok dan transaksi tercermin secara instan untuk
                keputusan yang lebih cepat.
              </p>
            </div>

            {/* Feature Card 3: Access Control */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-6 mx-auto">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Manajemen Hak Akses
              </h3>
              <p className="text-gray-600 text-center">
                Sistem hak akses fleksibel memastikan setiap peran hanya melihat
                atau mengedit data yang relevan.
              </p>
            </div>

            {/* Feature Card 4: Inventory Management */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-6 mx-auto">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Kontrol Stok Akurat
              </h3>
              <p className="text-gray-600 text-center">
                Lacak setiap item, lokasi, dan kuantitas stok dengan presisi
                tinggi.
              </p>
            </div>

            {/* Feature Card 5: Delivery Tracking */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-6 mx-auto">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Pelacakan Pengiriman
              </h3>
              <p className="text-gray-600 text-center">
                Monitor status pengiriman dari gudang hingga sampai ke tangan
                pelanggan.
              </p>
            </div>

            {/* Feature Card 6: Reporting and Analytics (using Chart icon) */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 bg-pink-100 text-pink-600 rounded-full mb-6 mx-auto">
                <TrendingUp size={32} />{" "}
                {/* Changed to Chart for specific request */}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                Laporan & Analisis
              </h3>
              <p className="text-gray-600 text-center">
                Dapatkan insight berharga dari data gudang Anda dengan laporan
                visual interaktif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 md:py-28">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img
              src="https://placehold.co/600x400/add8e6/000000?text=Tentang+WMS"
              alt="Warehouse Management System Illustration"
              className="rounded-xl shadow-lg w-full h-auto object-cover border-4 border-white transform hover:scale-102 transition-transform duration-300"
            />
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Tentang <span className="text-indigo-600">WMS Pro</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              WMS Pro adalah solusi ERP berbasis website yang dirancang khusus
              untuk memenuhi kebutuhan kompleks manajemen gudang. Kami memahami
              tantangan dalam melacak inventaris, mengelola pesanan, dan
              memastikan pengiriman tepat waktu.
            </p>
            <p className="text-lg text-gray-700">
              Dengan tim ahli yang dipimpin oleh Pak Alin dan didukung oleh Mas
              Angga, Mas Yoga, dan Mas Agung, kami berkomitmen untuk menyediakan
              sistem yang intuitif, efisien, dan andal untuk bisnis Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action / Contact Section */}
      <section
        id="contact"
        className="py-20 md:py-28 bg-indigo-600 text-white text-center rounded-t-xl"
      >
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Mengoptimalkan Gudang Anda?
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-90">
            Hubungi kami sekarang untuk mendapatkan demonstrasi gratis dan
            temukan bagaimana WMS Pro dapat mengubah operasional gudang Anda.
          </p>
          <a
            href="mailto:info@wmspro.com"
            className="inline-flex items-center justify-center px-10 py-5 border border-transparent text-lg font-medium rounded-xl shadow-lg
                       text-indigo-600 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            Hubungi Kami
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-300 text-center text-sm rounded-t-xl">
        <div className="container mx-auto px-6">
          <p>
            &copy; {new Date().getFullYear()} WMS Pro. Hak Cipta Dilindungi
            Undang-Undang.
          </p>
          <p className="mt-2">Dikembangkan dengan ❤️ oleh Tim WMS</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
