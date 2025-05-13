import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ReceiptGallery from './components/ReceiptGallery';
import ReceiptDetail from './components/ReceiptDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <span className="text-blue-600 text-2xl font-bold">MemoryChain</span>
                  <span className="ml-2 text-gray-500">💫</span>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2">Home</Link>
                <a 
                  href="https://github.com/yourusername/memorychain" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-700 hover:text-blue-600 px-3 py-2"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="py-8">
          <Routes>
            <Route path="/" element={<ReceiptGallery />} />
            <Route path="/receipt/:tokenId" element={<ReceiptDetail />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <span className="text-gray-600">© 2025 MemoryChain. All rights reserved.</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-blue-600">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-blue-600">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;