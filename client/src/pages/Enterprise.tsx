import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';

const Enterprise: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    storeLocations: '',
    currentPOS: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Enterprise Request Received",
      description: "Our team will contact you within 24 hours to discuss your integration.",
    });
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-800 via-green-700 to-teal-600 shadow-2xl mb-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        </div>
        
        <div className="relative z-10 px-8 py-16 md:py-24 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Receipt Infrastructure
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl text-green-100">
            Cut costs, reduce waste, and enhance customer experience with blockchain-powered digital receipts
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 max-w-4xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Cost Reduction</h3>
              <p className="text-white/80">Save up to $15M annually on paper, hardware and maintenance costs</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">ESG Impact</h3>
              <p className="text-white/80">Eliminate 2,200+ tons of non-recyclable thermal paper each year</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 border border-white/20">
              <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Brand Lift</h3>
              <p className="text-white/80">Increase NPS by 8+ points with younger demographics</p>
            </div>
          </div>
          
          <div className="mt-10">
            <a href="#contact">
              <Button className="bg-white text-green-800 hover:bg-green-100 px-6 py-6 text-lg">
                Schedule Enterprise Demo
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Case Study */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Retail Partners</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Leading retailers trust BlockReceipt to transform their customer experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 order-2 lg:order-1">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">CVS Pharmacy Pilot</h3>
            </div>
            
            <blockquote className="border-l-4 border-indigo-500 pl-4 italic mb-6">
              "We've turned our infamous long receipt meme into a sustainability win. BlockReceipt has helped us eliminate paper waste while providing our customers with secure digital proof of purchase."
            </blockquote>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-32 font-bold">Paper Saved:</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div className="bg-green-600 h-4 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <div className="text-sm mt-1">87% reduction in flagship stores</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 font-bold">Return Time:</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div className="bg-amber-500 h-4 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <div className="text-sm mt-1">42% faster return processing</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-32 font-bold">NPS Change:</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div className="bg-indigo-600 h-4 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="text-sm mt-1">+7.8 point increase (Gen-Z demographic)</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-xl order-1 lg:order-2">
            <img 
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="CVS Store" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Integration Process */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Integration Process</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our 90-day implementation plan gets you from concept to enterprise-ready
          </p>
        </div>
        
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-indigo-400 to-purple-500 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 relative">
            {/* Step 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:text-right">
                <div className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-2">01</div>
                <h3 className="text-2xl font-bold mb-4">Discovery & Planning</h3>
                <p className="text-lg text-muted-foreground">
                  We analyze your current POS infrastructure and design a custom integration approach
                </p>
                <ul className="space-y-2 mt-4 md:ml-auto md:mr-0 max-w-md">
                  <li className="flex items-center md:justify-end">
                    <span>Infrastructure assessment</span>
                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0">✓</div>
                  </li>
                  <li className="flex items-center md:justify-end">
                    <span>POS system compatibility check</span>
                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0">✓</div>
                  </li>
                  <li className="flex items-center md:justify-end">
                    <span>Custom implementation roadmap</span>
                    <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0">✓</div>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="hidden md:block absolute left-0 top-1/2 w-6 h-6 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-white dark:border-gray-800"></div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <img 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Team planning" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">Initial Assessment</div>
                      <div className="text-sm text-muted-foreground">30 days</div>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2">
                <div className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-2">02</div>
                <h3 className="text-2xl font-bold mb-4">Pilot Implementation</h3>
                <p className="text-lg text-muted-foreground">
                  We launch in select flagship stores, train staff, and gather metrics
                </p>
                <ul className="space-y-2 mt-4 max-w-md">
                  <li className="flex items-center">
                    <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                    <span>API integration with your POS</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                    <span>Staff training and support</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                    <span>Data collection and analysis</span>
                  </li>
                </ul>
              </div>
              <div className="relative md:order-1">
                <div className="hidden md:block absolute right-0 top-1/2 w-6 h-6 bg-indigo-500 rounded-full transform translate-x-1/2 -translate-y-1/2 border-4 border-white dark:border-gray-800"></div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <img 
                    src="https://images.unsplash.com/photo-1556742031-c6961e8560b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Store implementation" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">In-Store Pilot</div>
                      <div className="text-sm text-muted-foreground">60 days</div>
                    </div>
                    <div className="text-indigo-600 dark:text-indigo-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="md:text-right">
                <div className="text-6xl font-bold text-gray-200 dark:text-gray-700 mb-2">03</div>
                <h3 className="text-2xl font-bold mb-4">Full-Scale Rollout</h3>
                <p className="text-lg text-muted-foreground">
                  Expand to all locations with continuous support and optimization
                </p>
                <ul className="space-y-2 mt-4 md:ml-auto md:mr-0 max-w-md">
                  <li className="flex items-center md:justify-end">
                    <span>Chain-wide deployment</span>
                    <div className="h-5 w-5 bg-purple-500 rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0">✓</div>
                  </li>
                  <li className="flex items-center md:justify-end">
                    <span>Marketing support materials</span>
                    <div className="h-5 w-5 bg-purple-500 rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0">✓</div>
                  </li>
                  <li className="flex items-center md:justify-end">
                    <span>Ongoing performance monitoring</span>
                    <div className="h-5 w-5 bg-purple-500 rounded-full flex items-center justify-center text-white ml-2 flex-shrink-0">✓</div>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="hidden md:block absolute left-0 top-1/2 w-6 h-6 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-white dark:border-gray-800"></div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <img 
                    src="https://images.unsplash.com/photo-1550177513-ccc9d9aceef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Full rollout" 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">National Rollout</div>
                      <div className="text-sm text-muted-foreground">90 days</div>
                    </div>
                    <div className="text-purple-600 dark:text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Compatibility & Enterprise Benefits */}
      <div className="mb-20">
        <Tabs defaultValue="compatibility" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2">
            <TabsTrigger value="compatibility">POS Compatibility</TabsTrigger>
            <TabsTrigger value="benefits">Enterprise Benefits</TabsTrigger>
          </TabsList>
          
          {/* Compatibility Tab */}
          <TabsContent value="compatibility" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "NCR", logo: "NCR", systems: ["NCR Emerald", "NCR Counterpoint", "NCR Silver"] },
                { name: "Oracle", logo: "Oracle", systems: ["Oracle Micros", "Oracle Retail Xstore", "Oracle OPERA"] },
                { name: "Square", logo: "Square", systems: ["Square POS", "Square for Retail", "Square Terminal"] },
                { name: "Shopify", logo: "Shopify", systems: ["Shopify POS", "Shopify Retail", "Shopify Mobile"] },
                { name: "Clover", logo: "Clover", systems: ["Clover Station", "Clover Flex", "Clover Mini"] },
                { name: "Lightspeed", logo: "Lightspeed", systems: ["Lightspeed Retail", "Lightspeed Restaurant"] },
                { name: "Toast", logo: "Toast", systems: ["Toast POS", "Toast Go", "Toast Flex"] },
                { name: "Revel", logo: "Revel", systems: ["Revel POS", "Revel iPad POS"] }
              ].map((vendor, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-gray-400">
                      {vendor.logo.charAt(0)}
                    </div>
                    <h3 className="text-xl font-bold ml-3">{vendor.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {vendor.systems.map((system, j) => (
                      <div key={j} className="flex items-center">
                        <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                        <span>{system}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-lg text-muted-foreground mb-4">Don't see your POS system? Our flexible API can integrate with any point-of-sale platform.</p>
              <Button variant="outline" size="lg">Check Compatibility</Button>
            </div>
          </TabsContent>
          
          {/* Benefits Tab */}
          <TabsContent value="benefits" className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="h-14 w-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Financial Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Eliminate thermal paper costs (avg. $0.015/receipt)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Reduce printer hardware & maintenance costs</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Lower return fraud by up to 30%</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Faster checkout transactions & shorter lines</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="h-14 w-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Environmental Impact</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Eliminate non-recyclable thermal paper waste</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Reduce BPA and other toxic chemicals</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Lower carbon footprint of retail operations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Detailed ESG metrics dashboard for reporting</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="h-14 w-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Customer Experience</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Instant digital receipts delivered to wallet</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Customer-controlled privacy permissions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Seamless returns with digital verification</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                    <span>Enhanced loyalty program integration</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/merchant-demo">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white" size="lg">
                  See Merchant Demo
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Contact Section */}
      <div id="contact" className="rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/30 shadow-xl p-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 brand-gradient-text">Ready to Transform Your Receipt Experience?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Schedule a consultation with our enterprise team to discuss how BlockReceipt can work for your business.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Schedule a call</h3>
                  <p className="text-muted-foreground mt-1">
                    Our enterprise team will walk you through a tailored demo for your business
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Pilot program</h3>
                  <p className="text-muted-foreground mt-1">
                    Test BlockReceipt in select stores with full support from our team
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Results that matter</h3>
                  <p className="text-muted-foreground mt-1">
                    Track cost savings, environmental impact, and customer satisfaction metrics
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName" 
                      name="companyName" 
                      value={formData.companyName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input 
                      id="contactName" 
                      name="contactName" 
                      value={formData.contactName}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="storeLocations">Number of Locations</Label>
                    <Input 
                      id="storeLocations" 
                      name="storeLocations" 
                      value={formData.storeLocations}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="currentPOS">Current POS System</Label>
                    <Input 
                      id="currentPOS" 
                      name="currentPOS" 
                      value={formData.currentPOS}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-6 text-lg">
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="mt-16 text-center">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link href="/">
            <Button variant="link">Home</Button>
          </Link>
          <Link href="/merchant-demo">
            <Button variant="link">Merchant Demo</Button>
          </Link>
          <Link href="/upload">
            <Button variant="link">Try It Now</Button>
          </Link>
          <Link href="/nft-browser">
            <Button variant="link">Gallery</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Enterprise;