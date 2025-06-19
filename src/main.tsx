import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/login/index.tsx";
import Dashboard from "./views/dashboard/index.tsx";
import Delivery from "./views/delivery/index.tsx";
import Dokumentasi from "./views/dokumentasi/index.tsx";
import MaterialRequest from "./views/material-request/index.tsx";
import PurchaseOrder from "./views/purchase-order/index.tsx";
import PurchaseRequest from "./views/purchase-request/index.tsx";
import ReceiveItem from "./views/receive-item/index.tsx";
import Setting from "./views/setting/index.tsx";
import TentangApp from "./views/tentang-app/index.tsx";
import UserManagement from "./views/user-management/index.tsx";
import BarangDanStok from "./views/barang-dan-stok/index.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/delivery" element={<Delivery />} />

        <Route path="/barang-dan-stok" element={<BarangDanStok />} />

        <Route path="/dokumentasi" element={<Dokumentasi />} />

        <Route path="/material-request" element={<MaterialRequest />} />

        <Route path="/purchase-order" element={<PurchaseOrder />} />

        <Route path="/purchase-request" element={<PurchaseRequest />} />

        <Route path="/receive-item" element={<ReceiveItem />} />

        <Route path="/setting" element={<Setting />} />

        <Route path="/tentang-app" element={<TentangApp />} />

        <Route path="/user-management" element={<UserManagement />} />

        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
