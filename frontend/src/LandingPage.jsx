import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Scissors, 
  Shield, 
  Zap, 
  LayoutGrid,
  ArrowRight
} from 'lucide-react';

const tools = [
  {
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: <Scissors size={32} />,
    color: "bg-red-500", // Smallpdf-ish red
    lightColor: "bg-red-50",
    textColor: "text-red-600"
  },
  {
    title: "PDF Converter",
    description: "Convert Word, PowerPoint and Excel files to and from PDF.",
    icon: <FileText size={32} />,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600"
  },
  {
    title: "Edit PDF",
    description: "Add text, shapes, images and freehand annotations to your PDF.",
    icon: <ImageIcon size={32} />,
    color: "bg-yellow-500",
    lightColor: "bg-yellow-50",
    textColor: "text-yellow-600"
  },
  {
    title: "Protect PDF",
    description: "Encrypt your PDF with a password to keep sensitive data confidential.",
    icon: <Shield size={32} />,
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-600"
  },
  {
    title: "Merge PDF",
    description: "Combine multiple PDFs into one unified document instantly.",
    icon: <LayoutGrid size={32} />,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600"
  },
  {
    title: "eSign PDF",
    description: "Create your signature and sign your PDF files electronically.",
    icon: <Zap size={32} />,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600"
  }
];

const Navbar = () => (
  <nav className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
        P
      </div>
      <span className="text-xl font-bold tracking-tight text-gray-900">PreranTools</span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
      <a href="#" className="hover:text-gray-900 transition-colors">Tools</a>
      <a href="#" className="hover:text-gray-900 transition-colors">Compress</a>
      <a href="#" className="hover:text-gray-900 transition-colors">Convert</a>
    </div>
    <div className="flex items-center gap-4">
      <button className="text-gray-600 font-medium hover:text-gray-900">Log in</button>
      <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
        Get Started
      </button>
    </div>
  </nav>
);

const ToolCard = ({ tool }) => (
  <div className="group relative bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
    <div className={`w-16 h-16 rounded-2xl ${tool.lightColor} ${tool.textColor} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
      {tool.icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
      {tool.title}
    </h3>
    <p className="text-gray-500 leading-relaxed text-sm">
      {tool.description}
    </p>
    <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
      <ArrowRight className="text-gray-400" size={20} />
    </div>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC]"> {/* Slight blue-grey background is key */}
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          We make PDF easy.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-12">
          All the tools you need to be more productive and work smarter with documents. 
          100% free and easy to use.
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <ToolCard key={index} tool={tool} />
          ))}
        </div>
      </div>
      
      {/* Footer Teaser */}
      <div className="bg-white border-t border-gray-100 py-12 text-center">
        <p className="text-gray-400 text-sm">© 2026 Preran Projects. Made with React.</p>
      </div>
    </div>
  );
};

export default LandingPage;