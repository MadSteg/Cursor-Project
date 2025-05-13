import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet } from "react-helmet";

createRoot(document.getElementById("root")!).render(
  <>
    <Helmet>
      <title>BlockReceipt - Blockchain Receipts for Your Purchases</title>
      <meta name="description" content="Convert your credit card purchases into blockchain receipts with categorization and spending analytics. Never lose a receipt again." />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
    </Helmet>
    <App />
  </>
);
