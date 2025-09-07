import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { Post } from '../types';

const EditPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    imports: '',
    tags: '',
    apisModules: '',
    workEnvironment: '',
    status: 'draft',
    type: 'module'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await postsAPI.getPostById(parseInt(id));
        const post = response.post;

        // Split content by separator to get imports and content
        const contentParts = (post.content || '').split('\n\n---\n\n');
        const imports = contentParts.length > 1 ? contentParts[0] : '';
        const content = contentParts.length > 1 ? contentParts[1] : post.content || '';

        setFormData({
          title: post.title || '',
          content: content,
          summary: post.summary || '',
          imports: imports,
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
          apisModules: Array.isArray(post.apis_modules) ? post.apis_modules.join(', ') : '',
          workEnvironment: Array.isArray(post.work_environment) ? post.work_environment.join(', ') : '',
          status: post.status || 'draft',
          type: post.work_environment && post.work_environment.length > 0 ? 'module' : 'api'
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSubmitting(true);
    setError('');

    try {
      const postData = {
        ...formData,
        content: `${formData.imports}\n\n---\n\n${formData.content}`,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        apis_modules: formData.apisModules.split(',').map(api => api.trim()).filter(api => api),
        work_environment: formData.type === 'api' ? [] : formData.workEnvironment.split(',').map(env => env.trim()).filter(env => env),
        status: formData.status as 'draft' | 'published' | 'archived'
      };

      await postsAPI.updatePost(parseInt(id), postData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !formData.title) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Edit Post
          </h3>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type *
              </label>
              <select
                name="type"
                id="type"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="module">Module - A library/package you install (npm, pip, gem, etc.)</option>
                <option value="api">API - A web service you call over HTTP</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {formData.type === 'api' 
                  ? 'APIs are web services (like Stripe API, SendGrid API) - work environment is not needed.' 
                  : 'Modules are packages you install (like React, Express, Pandas) - specify work environment.'
                }
              </p>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.title}
                onChange={handleChange}
                placeholder={formData.type === 'api' ? 'e.g., API: Payment Processing for E-commerce' : 'e.g., Module: Form Handling in React Applications'}
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                목표/목적 *
              </label>
              <textarea
                name="summary"
                id="summary"
                rows={3}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.summary}
                onChange={handleChange}
                placeholder={formData.type === 'api' 
                  ? '이 API를 사용하면 무엇을 달성할 수 있는지 설명하세요.\n예: "결제 처리를 안전하고 간편하게 구현할 수 있습니다. PCI 규정 준수 없이도 신용카드, 디지털 지갑 결제를 지원하며, 국제 결제도 가능합니다."'
                  : '이 모듈을 사용하면 무엇을 달성할 수 있는지 설명하세요.\n예: "폼 검증과 에러 처리를 효율적으로 수행할 수 있습니다. 재렌더링을 최소화하여 성능을 향상시키고, 복잡한 폼도 쉽게 관리할 수 있습니다."'
                }
              />
              <p className="mt-1 text-xs text-gray-500">
                이 도구를 사용했을 때 달성할 수 있는 목표나 해결되는 문제를 구체적으로 설명하세요.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="imports" className="block text-sm font-medium text-gray-700">
                  Import/Include 구문 *
                </label>
                <textarea
                  name="imports"
                  id="imports"
                  rows={3}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  value={formData.imports || ''}
                  onChange={handleChange}
                  placeholder={formData.type === 'api' 
                    ? '// API 호출을 위한 라이브러리 import\nimport axios from \'axios\';\n// 또는 fetch 사용 (built-in)'
                    : '// 모듈 import 예시\nimport React from \'react\';\nimport { useForm } from \'react-hook-form\';'
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  사용하기 위한 import문이나 include 구문을 작성하세요.
                </p>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  사용 코드 예시 *
                </label>
                <textarea
                  name="content"
                  id="content"
                  rows={8}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder={formData.type === 'api' 
                    ? '// API 사용 예시\nconst response = await axios.post(\'https://api.stripe.com/v1/charges\', {\n  amount: 2000,\n  currency: \'usd\',\n  source: token.id\n}, {\n  headers: {\n    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`\n  }\n});'
                    : '// 모듈 사용 예시\nconst { register, handleSubmit, formState: { errors } } = useForm();\n\nconst onSubmit = (data) => {\n  console.log(data);\n};\n\nreturn (\n  <form onSubmit={handleSubmit(onSubmit)}>\n    <input {...register("email", { required: true })} />\n  </form>\n);'
                  }
                />
                <p className="mt-1 text-xs text-gray-500">
                  실제 사용하는 코드 예시를 작성하세요.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="apisModules" className="block text-sm font-medium text-gray-700">
                  {formData.type === 'api' ? 'APIs *' : 'Modules *'}
                </label>
                <input
                  type="text"
                  name="apisModules"
                  id="apisModules"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.apisModules}
                  onChange={handleChange}
                  placeholder={formData.type === 'api' 
                    ? 'Stripe API, Stripe Checkout API (comma-separated)'
                    : 'react-hook-form, yup, @hookform/resolvers (comma-separated)'
                  }
                />
              </div>

              {formData.type === 'module' && (
                <div>
                  <label htmlFor="workEnvironment" className="block text-sm font-medium text-gray-700">
                    Work Environment *
                  </label>
                  <select
                    name="workEnvironment"
                    id="workEnvironment"
                    required={formData.type === 'module'}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.workEnvironment}
                    onChange={handleChange}
                  >
                    <option value="">Select environment...</option>
                    <option value="React,JavaScript">React + JavaScript</option>
                    <option value="React,TypeScript">React + TypeScript</option>
                    <option value="Vue.js,JavaScript">Vue.js + JavaScript</option>
                    <option value="Vue.js,TypeScript">Vue.js + TypeScript</option>
                    <option value="Angular,TypeScript">Angular + TypeScript</option>
                    <option value="Node.js,JavaScript">Node.js + JavaScript</option>
                    <option value="Node.js,TypeScript">Node.js + TypeScript</option>
                    <option value="Express.js,JavaScript">Express.js + JavaScript</option>
                    <option value="Express.js,TypeScript">Express.js + TypeScript</option>
                    <option value="Next.js,JavaScript">Next.js + JavaScript</option>
                    <option value="Next.js,TypeScript">Next.js + TypeScript</option>
                    <option value="Python,Django">Python + Django</option>
                    <option value="Python,Flask">Python + Flask</option>
                    <option value="Python,FastAPI">Python + FastAPI</option>
                    <option value="Java,Spring Boot">Java + Spring Boot</option>
                    <option value="C#,.NET">C# + .NET</option>
                    <option value="PHP,Laravel">PHP + Laravel</option>
                    <option value="Ruby,Rails">Ruby on Rails</option>
                    <option value="Go">Go</option>
                    <option value="Rust">Rust</option>
                  </select>
                </div>
              )}

              {formData.type === 'api' && (
                <div className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-md p-4">
                  <div className="text-center text-gray-500">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">APIs work across all environments</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.tags}
                onChange={handleChange}
                placeholder="web development, api, backend (comma-separated)"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                id="status"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;