import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchAPI } from '../services/api';
import { Post } from '../types';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [workEnvironment, setWorkEnvironment] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get('q');
    const envParam = urlParams.get('env');
    
    if (queryParam) {
      setQuery(queryParam);
      if (envParam) {
        setWorkEnvironment(envParam);
        performSearch(queryParam, envParam);
      } else {
        performSearch(queryParam);
      }
    }
  }, [location.search]);

  const performSearch = async (searchQuery: string, workEnv: string = '') => {
    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const workEnvArray = workEnv
        .split(',')
        .map(env => env.trim())
        .filter(env => env);

      const response = await searchAPI.search({
        query: searchQuery,
        workEnvironment: workEnvArray
      });

      setResults(response.posts || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, workEnvironment);
  };

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
        {/* Search Header - Compact when results exist */}
        <div className={`mb-8 ${hasSearched ? 'pb-6' : 'pb-12'}`}>
          {!hasSearched && (
            <div className="mb-12 text-center">
              <h1 className="mb-4 text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Find APIs & Modules
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-gray-600">
                Discover the perfect tools and libraries for your projects, recommended by experienced developers.
              </p>
            </div>
          )}
          
          <div className={`${hasSearched ? 'max-w-4xl' : 'max-w-3xl'} mx-auto`}>
            <form onSubmit={handleSearch} className="p-6 bg-white shadow-xl rounded-2xl">
              {hasSearched && (
                <h2 className="mb-4 text-xl font-semibold text-center text-gray-900">
                  Refine your search
                </h2>
              )}
              
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1">
                  <label htmlFor="query" className="block mb-2 text-sm font-medium text-gray-700">
                    Search Query
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="query"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="block w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., React authentication library"
                      required
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label htmlFor="workEnvironment" className="block mb-2 text-sm font-medium text-gray-700">
                    Work Environment <span className="text-gray-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                      </svg>
                    </div>
                    <select
                      id="workEnvironment"
                      value={workEnvironment}
                      onChange={(e) => setWorkEnvironment(e.target.value)}
                      className="block w-full py-3 pl-10 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select environment...</option>
                      <option value="React">React</option>
                      <option value="Vue.js">Vue.js</option>
                      <option value="Angular">Angular</option>
                      <option value="Node.js">Node.js</option>
                      <option value="Express.js">Express.js</option>
                      <option value="Next.js">Next.js</option>
                      <option value="Nuxt.js">Nuxt.js</option>
                      <option value="Python">Python</option>
                      <option value="Django">Django</option>
                      <option value="Flask">Flask</option>
                      <option value="FastAPI">FastAPI</option>
                      <option value="Java">Java</option>
                      <option value="Spring Boot">Spring Boot</option>
                      <option value="PHP">PHP</option>
                      <option value="Laravel">Laravel</option>
                      <option value="Ruby on Rails">Ruby on Rails</option>
                      <option value="Go">Go</option>
                      <option value="Rust">Rust</option>
                      <option value="C#">C#</option>
                      <option value=".NET">.NET</option>
                      <option value="MongoDB">MongoDB</option>
                      <option value="PostgreSQL">PostgreSQL</option>
                      <option value="MySQL">MySQL</option>
                      <option value="Redis">Redis</option>
                      <option value="Docker">Docker</option>
                      <option value="Kubernetes">Kubernetes</option>
                      <option value="AWS">AWS</option>
                      <option value="Azure">Azure</option>
                      <option value="Google Cloud">Google Cloud</option>
                      <option value="Firebase">Firebase</option>
                      <option value="Vercel">Vercel</option>
                      <option value="Netlify">Netlify</option>
                      <option value="Mobile">Mobile</option>
                      <option value="React Native">React Native</option>
                      <option value="Flutter">Flutter</option>
                      <option value="iOS">iOS</option>
                      <option value="Android">Android</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-8 py-3 font-medium text-white transition-all duration-200 rounded-lg shadow-lg lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="px-4 py-3 mt-4 text-red-700 border-l-4 border-red-500 bg-red-50 rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results
              </h2>
              <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full">
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {results.map((post) => (
                <div
                  key={post.id}
                  className="transition-all duration-200 bg-white border border-gray-100 shadow-lg cursor-pointer rounded-xl hover:shadow-xl group hover:border-blue-200"
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600 line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center flex-shrink-0 ml-4 space-x-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{post.click_count || 0}</span>
                      </div>
                    </div>

                    {post.summary && (
                      <p className="mb-4 leading-relaxed text-gray-600 line-clamp-3">
                        {post.summary}
                      </p>
                    )}

                    {/* APIs/Modules */}
                    {post.apis_modules && post.apis_modules.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-700">APIs & Modules:</h4>
                        <div className="flex flex-wrap gap-2">
                          {post.apis_modules.map((api, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 border border-blue-200 rounded-full"
                            >
                              {api}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Work Environment */}
                    {post.work_environment && post.work_environment.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-medium text-gray-700">Environment:</h4>
                        <div className="flex flex-wrap gap-2">
                          {post.work_environment.map((env, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 border border-green-200 rounded-full"
                            >
                              {env}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 transition-colors bg-gray-100 rounded hover:bg-gray-200"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Post Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                          <span className="text-xs font-medium text-white">
                            {(post as any).username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {(post as any).username || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {results.length === 0 && hasSearched && !loading && (
          <div className="py-16 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.706 0-5.174 1.347-6.586 3.409M18.364 5.636L5.636 18.364m12.728-12.728a9 9 0 11-12.728 12.728" />
            </svg>
            <h3 className="mt-6 text-lg font-medium text-gray-900">No results found</h3>
            <p className="max-w-md mx-auto mt-2 text-gray-600">
              We couldn't find any posts matching your search. Try using different keywords or check your spelling.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setQuery('');
                  setWorkEnvironment('');
                  setResults([]);
                  setHasSearched(false);
                }}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Start a new search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;