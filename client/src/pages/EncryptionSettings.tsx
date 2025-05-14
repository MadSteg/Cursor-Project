import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EncryptionKeyManager } from "@/components/encryption/EncryptionKeyManager";
import { SharedAccessManager } from "@/components/encryption/SharedAccessManager";

export default function EncryptionSettings() {
  return (
    <main className="flex-1 p-6 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Encryption Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your encryption keys and shared receipt access
        </p>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="keys">Encryption Keys</TabsTrigger>
          <TabsTrigger value="shared">Shared Access</TabsTrigger>
        </TabsList>

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