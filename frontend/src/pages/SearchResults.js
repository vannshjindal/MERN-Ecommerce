import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  console.log("SearchResults component mounted/updated. Value of 'query':", query);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define your backend URL here (or import from a config file)
  const backendURL = 'http://localhost:8080';

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      setResults([]);

      try {
        const response = await fetch(`${backendURL}/api/products/search?query=${encodeURIComponent(query)}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Backend response was not OK. Status:", response.status, "Text:", errorText);
          throw new Error(`Server responded with status: ${response.status}. Expected JSON, got HTML/Error.`);
        }

        const data = await response.json();
        console.log("Search API response data (from frontend):", data);

        if (data.success && Array.isArray(data.products)) {
          setResults(data.products);
        } else {
          console.error("Unexpected search response format or backend reported failure:", data);
          setError(data.message || "Failed to fetch results due to unexpected data format.");
        }
      } catch (err) {
        console.error("Search fetch error (from frontend):", err);
        setError(err.message || "An unexpected error occurred during search.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error component
  const ErrorState = ({ error }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  // Empty state component
  const EmptyState = ({ query }) => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-500 mb-4">
          We couldn't find any products matching <span className="font-medium">"{query}"</span>
        </p>
        <p className="text-sm text-gray-400">
          Try adjusting your search terms or browse our categories
        </p>
      </div>
    </div>
  );

  // Product card component
  const ProductCard = ({ product }) => (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer">
      <div className="relative overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400"
          style={{ display: product.image ? 'none' : 'flex' }}
        >
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        {product.category && (
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full text-gray-600">
              {product.category}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {product.price && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-green-600">
              ₹{product.price.toFixed(2)}
            </span>
          </div>
        )}
        
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mr-2">
            View Details
          </button>
          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Search Results
              </h1>
              {query && (
                <p className="text-gray-600 mt-1">
                  Showing results for <span className="font-medium text-gray-900">"{query}"</span>
                </p>
              )}
            </div>
            
            {!loading && !error && results.length > 0 && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {results.length} product{results.length !== 1 ? 's' : ''} found
                </span>
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Sort by relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Name: A to Z</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <LoadingSkeleton />}
        
        {error && <ErrorState error={error} />}
        
        {!loading && !error && results.length === 0 && query && (
          <EmptyState query={query} />
        )}
        
        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;