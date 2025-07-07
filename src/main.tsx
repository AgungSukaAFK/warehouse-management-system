import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./views/login/index.tsx";
import Dashboard from "./views/dashboard/index.tsx";
import Dokumentasi from "./views/dokumentasi/index.tsx";
import MaterialRequest from "./views/material-request/index.tsx";
import PurchaseOrder from "./views/purchase-order/index.tsx";
import PurchaseRequest from "./views/purchase-request/index.tsx";
import ReceiveItem from "./views/receive-item/index.tsx";
import Setting from "./views/setting/index.tsx";
import TentangApp from "./views/tentang-app/index.tsx";
import UserManagement from "./views/user-management/index.tsx";
import BarangDanStok from "./views/barang-dan-stok/index.tsx";
import NotFound from "./views/not-found/index.tsx";
import Register from "./views/register/index.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import VerifyEmailPage from "./views/verify-email/index.tsx";
import PendingApprovalPage from "./views/unassigned/index.tsx";
import ForgetPassword from "./views/forget-password/index.tsx";
import { MaterialRequestDetail } from "./views/material-request/[kode]/index.tsx";
import { PurchaseRequestDetail } from "./views/purchase-request/[kode]/index.tsx";
import DeliveryPage from "./views/delivery/index.tsx";
import { DeliveryDetail } from "./views/delivery/[kode]/index.tsx";
import { PurchaseOrderDetail } from "./views/purchase-order/[kode]/index.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <StrictMode>
      <Toaster richColors closeButton theme="system" />

      <BrowserRouter>
        <Routes>
          {/* AUTH */}

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/not-verified" element={<VerifyEmailPage />} />

          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route path="/forget-password" element={<ForgetPassword />} />

          <Route path="/unassigned" element={<PendingApprovalPage />} />

          {/* END AUTH */}

          {/* MENU */}

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/delivery" element={<DeliveryPage />} />

          <Route path="/delivery/:kode" element={<DeliveryDetail />} />

          <Route path="/barang-dan-stok" element={<BarangDanStok />} />

          <Route path="/dokumentasi" element={<Dokumentasi />} />

          <Route path="/material-request" element={<MaterialRequest />} />

          <Route
            path="/material-request/:kode"
            element={<MaterialRequestDetail />}
          />

          <Route path="/purchase-order" element={<PurchaseOrder />} />

          <Route
            path="/purchase-order/:kode"
            element={<PurchaseOrderDetail />}
          />

          <Route path="/purchase-request" element={<PurchaseRequest />} />

          <Route
            path="/purchase-request/:kode"
            element={<PurchaseRequestDetail />}
          />

          <Route path="/receive-item" element={<ReceiveItem />} />

          <Route path="/setting" element={<Setting />} />

          <Route path="/tentang-app" element={<TentangApp />} />

          <Route path="/user-management" element={<UserManagement />} />

          {/* END MENU */}

          {/* HOMEPAGE */}
          <Route path="/" element={<App />} />

          {/* NOT FOUND PAGE HANDLER */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </ThemeProvider>
);
