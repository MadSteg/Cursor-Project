import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncryptionKeyManager } from "@/components/encryption/EncryptionKeyManager";
import { SharedAccessManager } from "@/components/encryption/SharedAccessManager";
import { TacoKeyManager } from "@/components/encryption/TacoKeyManager";
import { TacoSharedReceiptManager } from "@/components/encryption/TacoSharedReceiptManager";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ShieldIcon } from "lucide-react";

export default function EncryptionSettings() {
  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Encryption Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your encryption keys and shared receipt access
        </p>
      </div>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <ShieldIcon className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-700">Taco Integration Available</AlertTitle>
        <AlertDescription className="text-blue-600">
          We've integrated with Taco (formerly NuCypher) for enhanced threshold encryption capabilities.
          This enables secure, selective sharing of your encrypted receipts with fine-grained access control.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="taco" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="taco">Taco Threshold</TabsTrigger>
          <TabsTrigger value="taco-shared">Taco Sharing</TabsTrigger>
          <TabsTrigger value="keys">Standard Keys</TabsTrigger>
          <TabsTrigger value="shared">Standard Sharing</TabsTrigger>
        </TabsList>

        <TabsContent value="taco">
          <TacoKeyManager />
        </TabsContent>

        <TabsContent value="taco-shared">
          <TacoSharedReceiptManager />
        </TabsContent>

        <TabsContent value="keys">
          <EncryptionKeyManager />
        </TabsContent>

        <TabsContent value="shared">
          <SharedAccessManager />
        </TabsContent>
      </Tabs>
    </main>
  );
}