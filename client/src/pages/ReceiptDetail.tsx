import React from "react";
import { useParams } from "wouter";
import ReceiptDetailComponent from "@/components/receipts/ReceiptDetail";

const ReceiptDetail: React.FC = () => {
  const { id } = useParams();
  
  if (!id) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 text-center">
        <p>Invalid receipt ID</p>
      </div>
    );
  }

  return <ReceiptDetailComponent />;
};

export default ReceiptDetail;
