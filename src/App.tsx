import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ListPage } from "./pages/ListPage";
import { DetailPage } from "./pages/DetailPage";
import { NotFound } from "./pages/404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/listings/:id" element={<DetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
