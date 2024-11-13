import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import NavBar from './NavBar';
import { Calendar, Clock, Users, MessageSquare, ChevronRight } from 'lucide-react';

export default function Index() {
  const [activeTab, setActiveTab] = useState('services');
  const [showLecheDetails, setShowLecheDetails] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="mt-[60px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative bg-blue-600 rounded-b-lg overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-0 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Cuidando de ti y</span>{' '}
                    <span className="block text-blue-200 xl:inline">tu familia</span>
                  </h1>
                  <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Cecosf San Miguel está comprometido con brindar atención médica de calidad y bienestar a nuestra comunidad.
                  </p>
                </div>
              </main>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="medicos.png"
              alt="Equipo médico en acción"
            />
          </div>
        </section>

        {/* Registro y Login Section */}
        <section className="mt-12 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Necesitas pedir una hora?</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Regístrate aquí
            </Link>
            <Login/>
          </div>
        </section>

        {/* Tabs Section */}
        <section className="mt-12">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">
              Selecciona una sección
            </label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              defaultValue={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="services">Servicios</option>
              <option value="testimonials">Testimonios</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {['services', 'testimonials'].map((tab) => (
                  <button
                    key={tab}
                    className={`${
                      activeTab === tab
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        {activeTab === 'services' && (
          <section className="mt-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Nuestros Servicios</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Atención médica</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">Lunes a Viernes, 8:00 AM - 5:00 PM</div>
                          <div className="text-sm text-gray-500">Atención preferencial: 8:00 AM - 12:00 PM</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Distribución de Comida</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">12:00 PM - 2:00 PM</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Distribución de Leche</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">9:00 AM - 11:00 AM</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <button 
                      onClick={() => setShowLecheDetails(!showLecheDetails)}
                      className="font-medium text-blue-700 hover:text-blue-900"
                    >
                      {showLecheDetails ? 'Ocultar detalles' : 'Ver detalles'}
                    </button>
                  </div>
                </div>
                {showLecheDetails && (
                  <div className="px-5 py-3 bg-gray-100">
                    <h4 className="text-sm font-medium text-gray-900">Documentos necesarios:</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-600">
                      <li>RUT (Rol Único Tributario)</li>
                      <li>Nombre completo y apellidos</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'testimonials' && (
          <section className="mt-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Testimonios de Pacientes</h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-500">"Excelente atención y cuidado. Me sentí en buenas manos."</p>
                      <div className="mt-2">
                        <div className="text-sm font-medium text-gray-900">María González</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-500">"Gran equipo de profesionales, muy amables y dedicados."</p>
                      <div className="mt-2">
                        <div className="text-sm font-medium text-gray-900">Carlos López</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <p className="text-base text-gray-500">"Muy agradecido con la atención recibida en urgencias."</p>
                      <div className="mt-2">
                        <div className="text-sm font-medium text-gray-900">Laura Mejía</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Preguntas Frecuentes */}
        <section className="mt-12 bg-white shadow-md p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Preguntas Frecuentes</h2>
          <p className="text-lg text-gray-700 mb-4">
            ¿Tienes dudas sobre nuestros servicios? Visita nuestra sección de preguntas frecuentes para obtener más información.
          </p>
          <Link to="/Faq" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Ver Preguntas Frecuentes
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">&copy; 2024 Cecosf San Miguel. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Renderiza el componente en el elemento con id 'root'
const root = createRoot(document.getElementById('root'));
root.render(<Index />);