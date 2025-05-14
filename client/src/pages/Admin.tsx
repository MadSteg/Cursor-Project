import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BlockchainStatus from "@/components/blockchain/BlockchainStatus";
import { Activity, Database, Lock, Settings, Shield, Terminal } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Admin() {
  return (
    <main className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System monitoring and administration
          </p>
        </div>
      </div>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Server Status
                </CardTitle>
                <div className="h-4 w-4 rounded-full bg-green-500" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Online</div>
                <p className="text-xs text-muted-foreground">
                  Last restart: 2 days ago
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Services Status
                </CardTitle>
                <div className="flex space-x-1">
                  <div className="h-4 w-4 rounded-full bg-green-500" aria-hidden />
                  <div className="h-4 w-4 rounded-full bg-amber-500" aria-hidden />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4/5 Services</div>
                <p className="text-xs text-muted-foreground">
                  Blockchain connectivity issues detected
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  API Health
                </CardTitle>
                <div className="h-4 w-4 rounded-full bg-green-500" aria-hidden />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground">
                  All endpoints responding normally
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="my-6">
            <h2 className="text-xl font-semibold mb-4">Blockchain Network Status</h2>
            <BlockchainStatus />
          </div>
          
          <div className="my-6">
            <h2 className="text-xl font-semibold mb-4">Memory Usage</h2>
            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
                <CardDescription>
                  Current server resource utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Memory</div>
                      <div className="text-sm text-muted-foreground">45%</div>
                    </div>
                    <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                      <div className="h-full bg-primary rounded-full w-[45%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">CPU</div>
                      <div className="text-sm text-muted-foreground">22%</div>
                    </div>
                    <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                      <div className="h-full bg-primary rounded-full w-[22%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">Disk</div>
                      <div className="text-sm text-muted-foreground">68%</div>
                    </div>
                    <div className="h-2 w-full bg-secondary overflow-hidden rounded-full">
                      <div className="h-full bg-primary rounded-full w-[68%]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Security Status
              </CardTitle>
              <CardDescription>
                System security and encryption status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="font-medium">Encryption</div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="text-sm text-green-600 font-medium">Active</span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-sm text-muted-foreground">Key Rotation</span>
                      <span className="text-sm font-medium">30 days</span>
                    </div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="font-medium">Authentication</div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-sm text-muted-foreground">2FA</span>
                      <span className="text-sm text-green-600 font-medium">Enabled</span>
                    </div>
                    <div className="mt-1 flex justify-between">
                      <span className="text-sm text-muted-foreground">Login Attempts</span>
                      <span className="text-sm font-medium">5 max</span>
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Recent Security Events</h3>
                  <div className="space-y-2">
                    <div className="text-sm rounded-md bg-muted p-2">
                      <div className="font-medium">System Update</div>
                      <div className="text-xs text-muted-foreground">Today at 02:15 AM</div>
                    </div>
                    <div className="text-sm rounded-md bg-muted p-2">
                      <div className="font-medium">Encryption Key Rotation</div>
                      <div className="text-xs text-muted-foreground">May 10, 2025 at 11:30 PM</div>
                    </div>
                    <div className="text-sm rounded-md bg-yellow-50 p-2">
                      <div className="font-medium text-yellow-800">Failed Login Attempt</div>
                      <div className="text-xs text-yellow-700">May 9, 2025 at 3:22 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Database Status
              </CardTitle>
              <CardDescription>
                Monitor and manage database performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3">
                    <div className="font-medium">Status</div>
                    <div className="mt-1 text-green-600 font-semibold">Connected</div>
                    <div className="text-xs text-muted-foreground">Uptime: 7 days</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="font-medium">Active Connections</div>
                    <div className="mt-1 font-semibold">12</div>
                    <div className="text-xs text-muted-foreground">Max: 100</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="font-medium">Storage</div>
                    <div className="mt-1 font-semibold">248 MB</div>
                    <div className="text-xs text-muted-foreground">Total: 1 GB</div>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Table Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Receipts</span>
                      <span className="text-sm">1,256 rows</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Users</span>
                      <span className="text-sm">324 rows</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Transactions</span>
                      <span className="text-sm">5,842 rows</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Inventory Items</span>
                      <span className="text-sm">827 rows</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system parameters and options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="font-medium">Environment</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div className="flex justify-between py-1">
                        <span>Node.js Version</span>
                        <span className="font-mono">20.18.1</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Environment</span>
                        <span className="font-mono">Production</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Database Type</span>
                        <span className="font-mono">PostgreSQL</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="font-medium">Blockchain Config</div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <div className="flex justify-between py-1">
                        <span>Primary Network</span>
                        <span className="font-mono">Polygon Amoy</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Fallback Network</span>
                        <span className="font-mono">Polygon Mumbai</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>RPC Providers</span>
                        <span className="font-mono">3</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">System Logs</h3>
                  <div className="font-mono text-xs bg-black text-green-500 p-4 rounded-md h-48 overflow-y-auto">
                    <div className="mb-1">[2025-05-14 06:19:38] [INFO] Server started on port 5000</div>
                    <div className="mb-1">[2025-05-14 06:19:38] [INFO] Connected to database</div>
                    <div className="mb-1">[2025-05-14 06:19:39] [INFO] Initializing crypto payment service</div>
                    <div className="mb-1">[2025-05-14 06:19:39] [INFO] Initializing blockchain service</div>
                    <div className="mb-1">[2025-05-14 06:19:40] [WARN] Could not connect to Mumbai blockchain network</div>
                    <div className="mb-1">[2025-05-14 06:19:40] [INFO] Falling back to mock mode for blockchain</div>
                    <div className="mb-1">[2025-05-14 06:19:41] [INFO] Taco service initialized successfully</div>
                    <div className="mb-1">[2025-05-14 06:19:42] [INFO] Stripe payment service initialized successfully</div>
                    <div className="mb-1">[2025-05-14 06:20:12] [INFO] GET /api/blockchain/status 200</div>
                    <div className="mb-1">[2025-05-14 06:20:15] [INFO] GET /api/inventory 200</div>
                    <div className="mb-1">[2025-05-14 06:20:28] [INFO] GET /api/receipts/recent 200</div>
                    <div className="mb-1">[2025-05-14 06:20:35] [INFO] GET /api/stats/2025/5/breakdown 200</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}