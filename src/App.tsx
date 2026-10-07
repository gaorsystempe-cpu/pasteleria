/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cake, 
  ShoppingBag, 
  Heart, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Truck, 
  MessageCircle, 
  ChevronRight, 
  Plus, 
  Minus, 
  Trash2, 
  Copy, 
  Check, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Flame
} from 'lucide-react';

interface ProductVariant {
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  category: 'tematicas' | 'clasicas' | 'cumpleanos' | 'cupcakes' | 'panetones';
  categoryLabel: string;
  price: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  ingredients: string[];
  variants?: ProductVariant[];
  isCustomizable?: boolean;
  badge?: string;
}

interface CartItem {
  cartId: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  customization?: {
    flavor: string;
    filling: string;
    message: string;
    deliveryDate: string;
    deliveryTime: string;
  };
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  advancePayment: number;
  remainingBalance: number;
  total: number;
  shippingDetails: {
    name: string;
    phone: string;
    address: string;
    date: string;
    reference: string;
  };
  paymentMethod: 'Yape' | 'BCP' | 'Plin';
  status: 'Esperando adelanto de seña' | 'Preparando en obrador' | 'Listo para despacho' | 'Entregado';
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Torta Temática de Barbie',
    category: 'tematicas',
    categoryLabel: 'Tortas Temáticas',
    price: 120,
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'Impresionante torta temática con cobertura de chantilly rosado de alta calidad, detalles en fondant artesanal y decoración dorada.',
    ingredients: ['Bizcocho húmedo de vainilla', 'Fudge de chocolate suizo', 'Manjar artesanal', 'Chantilly'],
    variants: [
      { name: '10-12 porciones', price: 120 },
      { name: '20 porciones', price: 160 },
      { name: '30 porciones', price: 210 }
    ],
    isCustomizable: true,
    badge: 'Más Vendida'
  },
  {
    id: '2',
    name: 'Torta de Mario Bros & Amigos',
    category: 'tematicas',
    categoryLabel: 'Tortas Temáticas',
    price: 135,
    rating: 5.0,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'Diseño tridimensional inspirado en el mundo de Mario Bros. Figuras modeladas a mano 100% comestibles.',
    ingredients: ['Bizcocho de chocolate intenso', 'Doble capa de fudge', 'Chispas de cacao'],
    variants: [
      { name: '15 porciones', price: 135 },
      { name: '25 porciones', price: 185 },
      { name: '40 porciones', price: 250 }
    ],
    isCustomizable: true,
    badge: 'Favorito Infantil'
  },
  {
    id: '3',
    name: 'Torta Temática Baby Shower',
    category: 'cumpleanos',
    categoryLabel: 'Cumpleaños & Bodas',
    price: 115,
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Tiernos tonos pastel con zapatitos de azúcar y detalles perlados. Ideal para celebrar la llegada del nuevo integrante.',
    ingredients: ['Queque inglés con frutos secos', 'Manjar blanco especial', 'Pasta de azúcar fina'],
    variants: [
      { name: '12 porciones', price: 115 },
      { name: '20 porciones', price: 155 }
    ],
    isCustomizable: true
  },
  {
    id: '4',
    name: 'Torta para Doctor / Nutricionista',
    category: 'tematicas',
    categoryLabel: 'Tortas Temáticas',
    price: 125,
    rating: 4.9,
    reviewsCount: 24,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    description: 'Diseño personalizado imitando una bata médica con estetoscopio y detalles esculpidos en azúcar.',
    ingredients: ['Vainilla con pecanas', 'Fudge artesanal', 'Manjarblanco de olla'],
    variants: [
      { name: '15 porciones', price: 125 },
      { name: '25 porciones', price: 175 }
    ],
    isCustomizable: true
  },
  {
    id: '5',
    name: 'Torta Elegante 50 Años',
    category: 'cumpleanos',
    categoryLabel: 'Cumpleaños & Bodas',
    price: 140,
    rating: 5.0,
    reviewsCount: 51,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'Diseño de smoking o vestido de gala con acabados en hoja de oro comestible y máxima distinción.',
    ingredients: ['Red Velvet', 'Queso crema y frambuesas', 'Bizcocho húmedo de chocolate'],
    variants: [
      { name: '20 porciones', price: 140 },
      { name: '30 porciones', price: 195 },
      { name: '50 porciones', price: 290 }
    ],
    isCustomizable: true,
    badge: 'Alta Gama'
  },
  {
    id: '6',
    name: 'Torta Temática de Sistemas & Tech',
    category: 'tematicas',
    categoryLabel: 'Tortas Temáticas',
    price: 130,
    rating: 4.8,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'Para amantes de la tecnología y programación. Detalles de código, laptop y servidor en azúcar comestible.',
    ingredients: ['Chocolate fudge belga', 'Manjarblanco', 'Cacao orgánico'],
    variants: [
      { name: '15 porciones', price: 130 },
      { name: '25 porciones', price: 180 }
    ],
    isCustomizable: true
  },
  {
    id: '7',
    name: 'Torta Paw Patrol Aventura',
    category: 'tematicas',
    categoryLabel: 'Tortas Temáticas',
    price: 120,
    rating: 4.9,
    reviewsCount: 45,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'Con los cachorros favoritos de la patrulla canina modelados artesanalmente en la cima.',
    ingredients: ['Vainilla clásica', 'Fudge de olla', 'Chantilly premium'],
    variants: [
      { name: '12 porciones', price: 120 },
      { name: '20 porciones', price: 165 }
    ],
    isCustomizable: true
  },
  {
    id: '8',
    name: 'Chocotón y Panetón Navideño Artesanal',
    category: 'panetones',
    categoryLabel: 'Panetones & Chocotones',
    price: 45,
    rating: 4.9,
    reviewsCount: 88,
    image: 'https://images.unsplash.com/photo-1549590143-a6043cad384d?auto=format&fit=crop&w=800&q=80',
    description: 'Masa madre con 48 horas de fermentación natural, abundante chocolate bitter y frutas maceradas en ron.',
    ingredients: ['Masa madre artesanal', 'Chocolate bitter 60%', 'Frutas seleccionadas', 'Mantequilla pura'],
    variants: [
      { name: 'Caja 900g Presentación Regalo', price: 45 }
    ],
    isCustomizable: false,
    badge: 'Edición Limitada'
  },
  {
    id: '9',
    name: 'Torta con Flores Naturales Botánicas',
    category: 'cumpleanos',
    categoryLabel: 'Cumpleaños & Bodas',
    price: 150,
    rating: 5.0,
    reviewsCount: 60,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Elegante acabado en crema rústica adornada con selección de flores naturales esterilizadas de estación.',
    ingredients: ['Bizcocho de almendras', 'Manjar de lúcuma', 'Ganache de chocolate blanco'],
    variants: [
      { name: '20 porciones', price: 150 },
      { name: '30 porciones', price: 210 },
      { name: '40 porciones', price: 270 }
    ],
    isCustomizable: true,
    badge: 'Bestseller Bodas'
  },
  {
    id: '10',
    name: 'Cupcakes de Profesor / Profesional (Caja x6)',
    category: 'cupcakes',
    categoryLabel: 'Cupcakes & Postres',
    price: 38,
    rating: 4.8,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80',
    description: 'Caja de 6 cupcakes finamente decorados con buttercream y toppers personalizados según la profesión.',
    ingredients: ['Keke de vainilla con chispas', 'Buttercream de vainilla', 'Toppers en fondant'],
    variants: [
      { name: 'Caja de 6 unidades', price: 38 },
      { name: 'Caja de 12 unidades', price: 70 }
    ],
    isCustomizable: true
  },
  {
    id: '11',
    name: 'Torta Monumental de 15 Años',
    category: 'cumpleanos',
    categoryLabel: 'Cumpleaños & Bodas',
    price: 220,
    rating: 5.0,
    reviewsCount: 74,
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'Imponente torta de 3 niveles con efectos perla, cascada de rosas de azúcar y detalles plateados.',
    ingredients: ['Bizcocho de novia', 'Frutos secos', 'Manjarblanco especial', 'Fudge fino'],
    variants: [
      { name: '40 porciones', price: 220 },
      { name: '60 porciones', price: 320 }
    ],
    isCustomizable: true,
    badge: 'Exclusivo'
  },
  {
    id: '12',
    name: 'Torta Clásica de Chantilly con Frutas',
    category: 'clasicas',
    categoryLabel: 'Tortas Clásicas',
    price: 95,
    rating: 4.8,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    description: 'La consentida de la casa. Bizcocho sumamente húmedo bañado en almíbar de durazno y chantilly fresco.',
    ingredients: ['Bizcocho genovés', 'Duraznos en almíbar', 'Fresas selectas', 'Chantilly artesanal'],
    variants: [
      { name: '10 porciones', price: 95 },
      { name: '20 porciones', price: 135 }
    ],
    isCustomizable: true
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<'splash' | 'main'>('splash');
  const [activeTab, setActiveTab] = useState<'inicio' | 'explorar' | 'pedidos' | 'favoritos'>('inicio');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  
  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>(['1', '8', '11']);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Customization Form State
  const [customVariant, setCustomVariant] = useState<ProductVariant | null>(null);
  const [customFlavor, setCustomFlavor] = useState<string>('Chocolate fudge');
  const [customFilling, setCustomFilling] = useState<string>('Manjar artesanal');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [customQty, setCustomQty] = useState<number>(1);

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientAddress, setClientAddress] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [selectedPayment, setSelectedPayment] = useState<'Yape' | 'BCP' | 'Plin'>('Yape');
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load initial demo order & favorites
  useEffect(() => {
    const savedOrders = localStorage.getItem('libuss_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed)) {
          setOrders(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      const sampleOrder: Order = {
        id: 'LIB-8492',
        date: '06 Oct 2026, 14:20',
        items: [
          {
            cartId: 'sample-1',
            product: PRODUCTS[0],
            quantity: 1,
            selectedVariant: PRODUCTS[0].variants?.[0],
            customization: {
              flavor: 'Chocolate fudge',
              filling: 'Manjar artesanal',
              message: '¡Feliz Cumpleaños Sofía!',
              deliveryDate: '2026-10-08',
              deliveryTime: '15:00'
            }
          }
        ],
        subtotal: 120,
        advancePayment: 60,
        remainingBalance: 60,
        total: 120,
        shippingDetails: {
          name: 'Camila Valdivia',
          phone: '+51 987 654 321',
          address: 'Av. Larco 450, Miraflores',
          date: '2026-10-08',
          reference: ''
        },
        paymentMethod: 'Yape',
        status: 'Preparando en obrador'
      };
      setOrders([sampleOrder]);
      localStorage.setItem('libuss_orders', JSON.stringify([sampleOrder]));
    }
  }, []);

  const saveOrdersToStorage = (updatedOrders: Order[]) => {
    setOrders(updatedOrders);
    localStorage.setItem('libuss_orders', JSON.stringify(updatedOrders));
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const handleAddToCart = (product: Product, variant?: ProductVariant, custom?: any) => {
    const itemVariant = variant || (product.variants ? product.variants[0] : { name: 'Estándar', price: product.price });
    const cartId = `${product.id}-${itemVariant.name}-${custom ? JSON.stringify(custom) : 'standard'}`;
    
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.cartId === cartId);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += (custom?.qty || 1);
        return newCart;
      } else {
        return [...prevCart, {
          cartId,
          product,
          quantity: custom?.qty || 1,
          selectedVariant: itemVariant,
          customization: custom ? {
            flavor: custom.flavor,
            filling: custom.filling,
            message: custom.message,
            deliveryDate: custom.deliveryDate,
            deliveryTime: custom.deliveryTime
          } : undefined
        }];
      }
    });

    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (((item.selectedVariant?.price ?? item.product?.price) || 0) * item.quantity), 0);
  const finalTotal = Math.max(0, subtotal - appliedDiscount);
  const advancePayment = Math.round(finalTotal * 0.50);
  const remainingBalance = finalTotal - advancePayment;

  const applyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'LIBUSS10') {
      const disc = Math.round(subtotal * 0.10);
      setAppliedDiscount(disc);
      setCouponMessage('¡10% de descuento aplicado!');
    } else {
      setAppliedDiscount(0);
      setCouponMessage('Cupón inválido.');
    }
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleConfirmOrder = () => {
    if (!clientName.trim() || !clientPhone.trim() || !clientAddress.trim() || !deliveryDate.trim()) {
      alert('Por favor complete su Nombre, Teléfono, Dirección y Fecha de entrega.');
      return;
    }

    const orderId = `LIB-${Math.floor(1000 + Math.random() * 9000)}` ;
    const nowStr = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId,
      date: nowStr,
      items: [...cart],
      subtotal: subtotal || 0,
      advancePayment: advancePayment || 0,
      remainingBalance: remainingBalance || 0,
      total: finalTotal || 0,
      shippingDetails: {
        name: clientName,
        phone: clientPhone,
        address: clientAddress,
        date: deliveryDate,
        reference: ''
      },
      paymentMethod: selectedPayment,
      status: 'Esperando adelanto de seña'
    };

    const updatedOrders = [newOrder, ...orders];
    saveOrdersToStorage(updatedOrders);

    const itemsList = cart.map(i => `• ${i.quantity}x *${i.product?.name || 'Producto'}* (${i.selectedVariant?.name || 'Estándar'}) - S/ ${(((i.selectedVariant?.price ?? i.product?.price) || 0) * i.quantity).toFixed(2)}${i.customization ? `\n   _Sabor: ${i.customization.flavor || 'Estándar'} / Relleno: ${i.customization.filling || 'Estándar'}_\n   _Frase en Torta: "${i.customization.message || 'Ninguna'}"_` : ''}`).join('\n');

    const waText = encodeURIComponent(
      `🎂 *SEPARACIÓN DE PEDIDO - LIBUSS*\n` +
      `----------------------------------------\n` +
      `🔢 *Pedido:* #${orderId}\n` +
      `👤 *Cliente:* ${clientName}\n` +
      `📞 *Teléfono:* ${clientPhone}\n` +
      `📍 *Dirección:* ${clientAddress}\n` +
      `📅 *Fecha de Entrega:* ${deliveryDate}\n` +
      `----------------------------------------\n` +
      `🛒 *PRODUCTOS Y PERSONALIZACIÓN:*\n${itemsList}\n` +
      `----------------------------------------\n` +
      `💰 *VALOR TOTAL:* S/ ${(finalTotal || 0).toFixed(2)}\n` +
      `🔴 *ADELANTO 50% (SEÑA PARA SEPARAR): S/ ${(advancePayment || 0).toFixed(2)}*\n` +
      `⏳ *SALDO PENDIENTE:* S/ ${(remainingBalance || 0).toFixed(2)}\n` +
      `💳 *Pago Adelanto vía:* ${selectedPayment} (${selectedPayment === 'Yape' ? '970380415' : selectedPayment === 'BCP' ? '193-77289128-0-12' : '970380415'})\n` +
      `----------------------------------------\n` +
      `_¡Hola Libuss! Adjunto mi comprobante del adelanto (50%) para confirmar y empezar a preparar mi pastel._ ✨`
    );

    window.open(`https://wa.me/51970380415?text=${waText}`, '_blank');

    setCart([]);
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setActiveTab('pedidos');
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'todas' || p.category === selectedCategory;
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-stone-950 text-stone-100' : 'bg-stone-100 text-stone-900'} transition-colors duration-300 flex flex-col items-center justify-start`}>
      
      {/* ==================== SPLASH SCREEN / PORTADA ==================== */}
      {currentView === 'splash' && (
        <div className={`fixed inset-0 z-50 ${darkMode ? 'bg-gradient-to-b from-stone-950 via-pink-950/40 to-stone-950 text-stone-100' : 'bg-gradient-to-b from-pink-50 via-rose-100/60 to-stone-100 text-stone-900'} flex flex-col items-center justify-between p-6 overflow-y-auto`}>
          
          {/* Top header controls */}
          <div className="w-full max-w-md flex justify-between items-center pt-4">
            <span className={`text-xs font-bold uppercase tracking-widest ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>Pastelería de Autor</span>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full border shadow-sm transition ${darkMode ? 'bg-stone-900 border-stone-800 text-pink-400 hover:bg-stone-800' : 'bg-white border-stone-200 text-pink-600 hover:bg-stone-50'}`}
              aria-label="Cambiar Tema"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Center Minimalist Content with REAL Cake Image Floating */}
          <div className="w-full max-w-md flex flex-col items-center text-center my-auto py-6">
            
            {/* FLOATING REAL CAKE IMAGE CARD */}
            <div className="relative mb-8">
              <div className={`absolute inset-0 rounded-full blur-3xl animate-pulse-glow ${darkMode ? 'bg-pink-600/40' : 'bg-pink-400/50'}`}></div>
              
              <div className="relative w-44 h-44 rounded-3xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-400 p-1.5 shadow-2xl animate-float-gentle flex items-center justify-center overflow-hidden">
                <div className={`w-full h-full rounded-[22px] overflow-hidden flex flex-col items-center justify-center relative ${darkMode ? 'bg-stone-950' : 'bg-white'}`}>
                  <img 
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80" 
                    alt="Torta Real LIBUSS"
                    className="w-full h-full object-cover scale-105 hover:scale-110 transition duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent pointer-events-none flex items-end justify-center pb-3">
                    <span className="font-serif tracking-widest text-sm font-bold text-pink-300 drop-shadow-md">LIBUSS</span>
                  </div>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-serif font-bold tracking-tight mb-1">
              LIBUSS
            </h1>
            <p className={`text-xs font-bold tracking-[0.25em] uppercase mb-6 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
              Repostería Artesanal de Alta Gama
            </p>

            {/* Pulsing Main CTA Button */}
            <div className="w-full relative p-1 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 animate-pulse-glow mb-6 shadow-xl">
              <button
                onClick={() => setCurrentView('main')}
                className={`w-full py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-3 transition text-base tracking-wide ${darkMode ? 'bg-stone-950 text-pink-300 hover:bg-stone-900' : 'bg-white text-pink-700 hover:bg-stone-50'}`}
              >
                <span>Ingresar al Catálogo</span>
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Quick Category Pills */}
            <div className="w-full text-left">
              <span className={`text-[11px] font-bold uppercase tracking-wider mb-2.5 block ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>
                Explorar categorías:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Temáticas', cat: 'tematicas' },
                  { label: 'Bodas/15s', cat: 'cumpleanos' },
                  { label: 'Cupcakes', cat: 'cupcakes' },
                  { label: 'Panetones', cat: 'panetones' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(item.cat);
                      setCurrentView('main');
                    }}
                    className={`p-2.5 rounded-lg border text-xs font-semibold transition text-center truncate shadow-sm ${darkMode ? 'bg-stone-900/90 border-stone-800 text-stone-200 hover:border-pink-500 hover:text-pink-400' : 'bg-white border-stone-200 text-stone-800 hover:border-pink-500 hover:text-pink-600'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center pb-2 text-[11px] font-medium text-stone-500">
            © 2026 LIBUSS
          </div>
        </div>
      )}

      {/* ==================== MAIN MOBILE APP CONTAINER ==================== */}
      {currentView === 'main' && (
        <div className={`w-full max-w-md min-h-screen pb-24 shadow-2xl relative flex flex-col ${darkMode ? 'bg-stone-950 border-x border-stone-800 text-stone-100' : 'bg-stone-50 border-x border-stone-200 text-stone-900'}`}>
          
          {/* HEADER */}
          <header className={`sticky top-0 z-30 backdrop-blur-md border-b px-4 py-3.5 flex items-center justify-between ${darkMode ? 'bg-stone-950/90 border-stone-800' : 'bg-white/90 border-stone-200'}`}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView('splash')}
                className={`p-2 rounded-full border transition ${darkMode ? 'bg-stone-900 border-stone-800 text-pink-400 hover:bg-stone-800' : 'bg-stone-100 border-stone-200 text-pink-600 hover:bg-stone-200'}`}
                title="Volver a Portada"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-lg font-serif font-bold flex items-center gap-1.5">
                  LIBUSS
                  <span className={`text-[10px] font-sans px-1.5 py-0.5 rounded font-bold ${darkMode ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-pink-100 text-pink-700'}`}>Artesanal</span>
                </h1>
                <p className={`text-[11px] ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Repostería de Alta Gama</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full border transition ${darkMode ? 'bg-stone-900 border-stone-800 text-pink-400 hover:bg-stone-800' : 'bg-stone-100 border-stone-200 text-pink-600 hover:bg-stone-200'}`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:opacity-90 transition shadow-md"
              >
                <ShoppingBag size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-stone-950 rounded-full text-[11px] font-bold flex items-center justify-center border-2 border-stone-950">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* BODY CONTENT BASED ON ACTIVE TAB */}
          <main className="flex-1 px-4 py-4 overflow-y-auto">
            
            {/* TAB 1: INICIO */}
            {activeTab === 'inicio' && (
              <div className="space-y-6">
                
                {/* Hero Banner */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 p-6 text-white shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-15">
                    <Cake size={130} />
                  </div>
                  <div className="relative z-10">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-white text-[11px] font-bold tracking-wide mb-3">
                      ✨ Obrador Exclusivo
                    </span>
                    <h2 className="text-2xl font-serif font-bold mb-2 leading-tight">
                      Pasteles Personalizados y de Autor
                    </h2>
                    <p className="text-xs text-pink-100 mb-5 leading-relaxed">
                      Separa tu pedido con adelanto y sorprende en tus celebraciones con arte en azúcar e ingredientes naturales.
                    </p>
                    <button
                      onClick={() => setActiveTab('explorar')}
                      className="px-5 py-2.5 rounded-xl bg-stone-950 text-pink-300 font-bold text-xs flex items-center gap-2 hover:bg-stone-900 transition shadow-lg"
                    >
                      <span>Ver Catálogo Completo</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Categories Horizontal */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-stone-200' : 'text-stone-800'}`}>Categorías</h3>
                    <button 
                      onClick={() => setActiveTab('explorar')} 
                      className="text-xs font-bold text-pink-500 hover:underline"
                    >
                      Ver todo
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {[
                      { id: 'todas', label: '✨ Todas' },
                      { id: 'tematicas', label: '🎂 Temáticas' },
                      { id: 'cumpleanos', label: '🎉 Bodas & 15s' },
                      { id: 'cupcakes', label: '🧁 Cupcakes' },
                      { id: 'panetones', label: '🎁 Panetones' },
                      { id: 'clasicas', label: '🍰 Clásicas' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setActiveTab('explorar');
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border shadow-sm ${selectedCategory === cat.id ? 'bg-pink-600 text-white border-pink-500' : darkMode ? 'bg-stone-900 text-stone-200 border-stone-800 hover:border-pink-500' : 'bg-white text-stone-800 border-stone-200 hover:border-pink-500'}`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Highlighted Products */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 ${darkMode ? 'text-stone-200' : 'text-stone-800'}`}>
                      <Flame size={16} className="text-pink-500" />
                      Destacados del Obrador
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {PRODUCTS.slice(0, 4).map(product => {
                      const isFav = favorites.includes(product.id);
                      return (
                        <div 
                          key={product.id}
                          className={`rounded-2xl border overflow-hidden flex flex-col justify-between group shadow-md transition ${darkMode ? 'bg-stone-900 border-stone-800 hover:border-pink-500/50' : 'bg-white border-stone-200 hover:border-pink-500/50'}`}
                        >
                          <div className="relative h-36 overflow-hidden bg-stone-900">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition duration-500"
                              referrerPolicy="no-referrer"
                            />
                            {product.badge && (
                              <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-pink-600 text-white text-[10px] font-bold tracking-tight shadow">
                                {product.badge}
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(product.id);
                              }}
                              className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-stone-950/70 backdrop-blur text-white hover:text-red-400 transition"
                            >
                              <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                            </button>
                          </div>

                          <div className="p-3 flex flex-col justify-between flex-1">
                            <div>
                              <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>{product.categoryLabel}</span>
                              <h4 className={`text-xs font-bold line-clamp-1 mt-0.5 ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>{product.name}</h4>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <span className="text-sm font-extrabold text-pink-500">S/ {(product.price || 0).toFixed(2)}</span>
                              <button
                                onClick={() => setSelectedProduct(product)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition border ${darkMode ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-600 hover:text-white' : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-600 hover:text-white'}`}
                              >
                                Ver / Pedir
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info Card */}
                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}>
                  <div className="p-3 rounded-xl bg-pink-500/20 text-pink-500">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>¿Diseño personalizado?</h4>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Separa tu torta con el 50% de adelanto para iniciar la elaboración en nuestro obrador.</p>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: EXPLORAR */}
            {activeTab === 'explorar' && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 text-pink-500" size={18} />
                  <input
                    type="text"
                    placeholder="Buscar tortas temáticas, cupcakes, panetones..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-pink-500 transition ${darkMode ? 'bg-stone-900 border-stone-800 text-stone-100 placeholder-stone-500' : 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 shadow-sm'}`}
                  />
                </div>

                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {[
                    { id: 'todas', label: 'Todas' },
                    { id: 'tematicas', label: 'Temáticas' },
                    { id: 'cumpleanos', label: 'Bodas & 15s' },
                    { id: 'cupcakes', label: 'Cupcakes' },
                    { id: 'panetones', label: 'Panetones' },
                    { id: 'clasicas', label: 'Clásicas' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border shadow-sm ${selectedCategory === cat.id ? 'bg-pink-600 text-white border-pink-500' : darkMode ? 'bg-stone-900 text-stone-200 border-stone-800 hover:border-pink-500' : 'bg-white text-stone-800 border-stone-200 hover:border-pink-500'}`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {filteredProducts.map(product => {
                    const isFav = favorites.includes(product.id);
                    return (
                      <div 
                        key={product.id}
                        className={`rounded-2xl border overflow-hidden flex flex-col justify-between group shadow-md transition ${darkMode ? 'bg-stone-900 border-stone-800 hover:border-pink-500/50' : 'bg-white border-stone-200 hover:border-pink-500/50'}`}
                      >
                        <div className="relative h-36 overflow-hidden bg-stone-900">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition duration-500"
                            referrerPolicy="no-referrer"
                          />
                          {product.badge && (
                            <span className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded bg-pink-600 text-white text-[10px] font-bold tracking-tight shadow">
                              {product.badge}
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(product.id);
                            }}
                            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-stone-950/70 backdrop-blur text-white hover:text-red-400 transition"
                          >
                            <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                          </button>
                        </div>

                        <div className="p-3 flex flex-col justify-between flex-1">
                          <div>
                            <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>{product.categoryLabel}</span>
                            <h4 className={`text-xs font-bold line-clamp-1 mt-0.5 ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>{product.name}</h4>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm font-extrabold text-pink-500">S/ {(product.price || 0).toFixed(2)}</span>
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition border ${darkMode ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-600 hover:text-white' : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-600 hover:text-white'}`}
                            >
                              Ver / Pedir
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 text-stone-500 text-xs">
                    No se encontraron pasteles con ese criterio de búsqueda.
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PEDIDOS */}
            {activeTab === 'pedidos' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-stone-200' : 'text-stone-800'}`}>Historial de Pedidos</h3>
                  <span className={`text-xs ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{orders.length} pedidos</span>
                </div>

                {orders.length === 0 ? (
                  <div className={`text-center py-16 px-4 rounded-2xl border ${darkMode ? 'bg-stone-900/50 border-stone-800' : 'bg-white border-stone-200 shadow-sm'}`}>
                    <ShoppingBag className="w-12 h-12 text-stone-500 mx-auto mb-3" />
                    <h4 className={`text-sm font-bold ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>No tienes pedidos recientes</h4>
                    <p className="text-xs text-stone-500 mt-1 mb-4">Haz tu primer pedido y sepáralo con adelanto.</p>
                    <button
                      onClick={() => setActiveTab('explorar')}
                      className="px-4 py-2 rounded-xl bg-pink-600 text-white font-bold text-xs"
                    >
                      Ver Catálogo
                    </button>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className={`p-4 rounded-2xl border space-y-3 shadow-md ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
                      <div className={`flex justify-between items-center border-b pb-2.5 ${darkMode ? 'border-stone-800' : 'border-stone-100'}`}>
                        <div>
                          <span className="text-xs font-bold text-pink-500">{order.id}</span>
                          <span className={`text-[11px] ml-2 ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>{order.date}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-bold border border-pink-500/30">
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {order.items && order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className={darkMode ? 'text-stone-300' : 'text-stone-700'}>{item.quantity}x {item.product?.name || 'Producto'} ({item.selectedVariant?.name || 'Estándar'})</span>
                            <span className={darkMode ? 'text-stone-400' : 'text-stone-600'}>S/ {(( (item.selectedVariant?.price ?? item.product?.price) || 0) * (item.quantity || 1)).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`pt-2 border-t flex justify-between items-center ${darkMode ? 'border-stone-800' : 'border-stone-100'}`}>
                        <div>
                          <span className={`text-[11px] block ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>Adelanto seña: <strong className="text-pink-500 font-bold">S/ {(order.advancePayment || 0).toFixed(2)}</strong></span>
                          <span className="text-[10px] text-stone-500">Saldo pendiente: S/ {(order.remainingBalance || 0).toFixed(2)}</span>
                        </div>

                        <button
                          onClick={() => {
                            const itemsList = order.items ? order.items.map(i => `• ${i.quantity}x *${i.product?.name || 'Producto'}* (${i.selectedVariant?.name || 'Estándar'}) - S/ ${(((i.selectedVariant?.price ?? i.product?.price) || 0) * (i.quantity || 1)).toFixed(2)}`).join('\n') : '';
                            const text = encodeURIComponent(
                              `🎂 *CONFIRMACIÓN DE ADELANTO - LIBUSS*\n` +
                              `🔢 *Pedido:* #${order.id}\n` +
                              `👤 *Cliente:* ${order.shippingDetails?.name || 'Cliente'}\n` +
                              `----------------------------------------\n` +
                              `${itemsList}\n` +
                              `----------------------------------------\n` +
                              `🔴 *Adelanto Seña:* S/ ${(order.advancePayment || 0).toFixed(2)}\n` +
                              `⏳ *Saldo:* S/ ${(order.remainingBalance || 0).toFixed(2)}\n` +
                              `_Hola Libuss, envío mi comprobante de adelanto para empezar la preparación._ ✨`
                            );
                            window.open(`https://wa.me/51970380415?text=${text}`, '_blank');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30 shadow-sm"
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: FAVORITOS */}
            {activeTab === 'favoritos' && (
              <div className="space-y-4">
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-stone-200' : 'text-stone-800'}`}>Tus Pasteles Favoritos</h3>
                
                {favorites.length === 0 ? (
                  <div className="text-center py-16 text-stone-500 text-xs">
                    No tienes productos marcados como favoritos.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {PRODUCTS.filter(p => favorites.includes(p.id)).map(product => (
                      <div 
                        key={product.id}
                        className={`rounded-2xl border overflow-hidden flex flex-col justify-between group shadow-md transition ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}
                      >
                        <div className="relative h-36 overflow-hidden bg-stone-900">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover relative z-10"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-stone-950/70 backdrop-blur text-red-500"
                          >
                            <Heart size={16} className="fill-red-500" />
                          </button>
                        </div>

                        <div className="p-3 flex flex-col justify-between flex-1">
                          <div>
                            <span className={`text-[10px] uppercase tracking-wider font-semibold ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>{product.categoryLabel}</span>
                            <h4 className={`text-xs font-bold line-clamp-1 mt-0.5 ${darkMode ? 'text-stone-100' : 'text-stone-900'}`}>{product.name}</h4>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-sm font-extrabold text-pink-500">S/ {(product.price || 0).toFixed(2)}</span>
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition border ${darkMode ? 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-600 hover:text-white' : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-600 hover:text-white'}`}
                            >
                              Ver / Pedir
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>

          {/* FLOATING CART BAR */}
          {cart.length > 0 && !isCartOpen && (
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[calc(28rem-2rem)] z-30 animate-float-gentle">
              <div 
                onClick={() => setIsCartOpen(true)}
                className="p-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 text-white shadow-2xl flex items-center justify-between cursor-pointer border border-pink-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-stone-950 text-pink-300 flex items-center justify-center font-bold text-xs">
                    {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Tu Pedido LIBUSS</span>
                    <span className="text-[11px] text-pink-100">{cart.length} productos listos</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-base font-extrabold">
                    S/ {(subtotal || 0).toFixed(2)}
                  </span>
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM NAVIGATION BAR */}
          <nav className={`fixed bottom-0 w-full max-w-md backdrop-blur-lg border-t px-4 py-2.5 z-40 flex justify-around items-center ${darkMode ? 'bg-stone-950/95 border-stone-800' : 'bg-white/95 border-stone-200'}`}>
            {[
              { id: 'inicio', label: 'Inicio', icon: Cake },
              { id: 'explorar', label: 'Explorar', icon: Search },
              { id: 'pedidos', label: 'Pedidos', icon: Clock },
              { id: 'favoritos', label: 'Favoritos', icon: Heart }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-1 transition ${isActive ? 'text-pink-500 font-bold' : darkMode ? 'text-stone-400 hover:text-stone-200' : 'text-stone-500 hover:text-stone-800'}`}
                >
                  <Icon size={20} className={isActive ? 'text-pink-500' : ''} />
                  <span className="text-[10px] tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* PRODUCT DETAIL & CUSTOMIZATION MODAL */}
          {selectedProduct && (
            <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div className={`w-full max-w-lg rounded-t-3xl sm:rounded-2xl border overflow-hidden max-h-[90vh] flex flex-col shadow-2xl ${darkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'}`}>
                
                {/* Modal Header Image */}
                <div className="relative h-56 bg-stone-900">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover relative z-10"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/80 text-white hover:bg-stone-900"
                  >
                    ✕
                  </button>
                  {selectedProduct.badge && (
                    <span className="absolute bottom-4 left-4 z-20 px-3 py-1 rounded-lg bg-pink-600 text-white text-xs font-bold shadow">
                      {selectedProduct.badge}
                    </span>
                  )}
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto space-y-5 flex-1">
                  <div>
                    <span className="text-xs text-pink-500 uppercase tracking-widest font-bold">{selectedProduct.categoryLabel}</span>
                    <h3 className="text-xl font-serif font-bold mt-0.5">{selectedProduct.name}</h3>
                    <p className={`text-xs mt-2 leading-relaxed ${darkMode ? 'text-stone-400' : 'text-stone-600'}`}>{selectedProduct.description}</p>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <span className={`text-xs font-bold block mb-2 ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>Ingredientes Principales:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.ingredients && selectedProduct.ingredients.map((ing, idx) => (
                        <span key={idx} className={`px-2.5 py-1 rounded-lg text-xs ${darkMode ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-700'}`}>
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Variants Selector */}
                  {selectedProduct.variants && (
                    <div>
                      <span className={`text-xs font-bold block mb-2 ${darkMode ? 'text-stone-300' : 'text-stone-700'}`}>Seleccione Tamaño / Porciones:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedProduct.variants.map((v, idx) => {
                          const isSel = (!customVariant && idx === 0) || (customVariant?.name === v.name);
                          return (
                            <button
                              key={idx}
                              onClick={() => setCustomVariant(v)}
                              className={`p-2.5 rounded-xl border text-center transition flex flex-col justify-between ${isSel ? 'bg-pink-500/20 border-pink-500 text-pink-400 font-bold' : darkMode ? 'bg-stone-950 border-stone-800 text-stone-300' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                            >
                              <span className="text-[11px]">{v.name}</span>
                              <span className="text-xs font-extrabold mt-1 text-pink-500">S/ {(v.price || 0).toFixed(2)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Cake Options */}
                  {selectedProduct.isCustomizable && (
                    <div className={`p-4 rounded-xl border space-y-3 ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                      <h4 className="text-xs font-bold text-pink-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles size={14} /> Personalización de Torta
                      </h4>

                      <div>
                        <label className="text-[11px] text-stone-400 block mb-1">Sabor de Bizcocho:</label>
                        <select
                          value={customFlavor}
                          onChange={(e) => setCustomFlavor(e.target.value)}
                          className={`w-full p-2.5 rounded-lg border text-xs ${darkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'}`}
                        >
                          <option value="Chocolate fudge">Chocolate fudge artesanal</option>
                          <option value="Vainilla inglesa">Vainilla inglesa con pecanas</option>
                          <option value="Red Velvet">Red Velvet con queso crema</option>
                          <option value="Maracuyá">Bizcocho de Maracuyá</option>
                          <option value="Tres Leches">Bizcocho húmedo Tres Leches</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-stone-400 block mb-1">Relleno:</label>
                        <select
                          value={customFilling}
                          onChange={(e) => setCustomFilling(e.target.value)}
                          className={`w-full p-2.5 rounded-lg border text-xs ${darkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'}`}
                        >
                          <option value="Manjar artesanal">Manjar artesanal de olla</option>
                          <option value="Fudge suizo">Fudge suizo de chocolate</option>
                          <option value="Mermelada de frutos rojos">Mermelada de frutos rojos</option>
                          <option value="Crema pastelera y duraznos">Crema pastelera y duraznos</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-amber-500 font-bold block mb-1">Nombre o Frase que irá en el Pastel (Opcional):</label>
                        <input
                          type="text"
                          placeholder="Ej: ¡Feliz 50 Años Papá! / Te amo Sofía"
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className={`w-full p-2.5 rounded-lg border text-xs ${darkMode ? 'bg-stone-900 border-stone-700 text-amber-300 placeholder-stone-500' : 'bg-amber-50 border-amber-300 text-amber-900 placeholder-stone-400'}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold">Cantidad:</span>
                    <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                      <button onClick={() => setCustomQty(Math.max(1, customQty - 1))} className="hover:text-pink-500">
                        <Minus size={16} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{customQty}</span>
                      <button onClick={() => setCustomQty(customQty + 1)} className="hover:text-pink-500">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Modal Footer CTA */}
                <div className={`p-4 border-t flex items-center justify-between ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Total:</span>
                    <span className="text-lg font-extrabold text-pink-500">
                      S/ {(( (customVariant?.price ?? selectedProduct.variants?.[0]?.price ?? selectedProduct.price) || 0) * customQty).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const variantToUse = customVariant || (selectedProduct.variants ? selectedProduct.variants[0] : { name: 'Estándar', price: selectedProduct.price });
                      handleAddToCart(selectedProduct, variantToUse, {
                        flavor: customFlavor,
                        filling: customFilling,
                        message: customMessage,
                        qty: customQty
                      });
                      setSelectedProduct(null);
                      setCustomVariant(null);
                      setCustomQty(1);
                      setCustomMessage('');
                    }}
                    className="px-6 py-3 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-500 transition shadow-lg shadow-pink-600/30 flex items-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    <span>Agregar al Pedido</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* SLIDE-OVER CART DRAWER */}
          {isCartOpen && (
            <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex justify-end">
              <div className={`w-full max-w-md h-full flex flex-col border-l shadow-2xl ${darkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'}`}>
                
                <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-pink-500" size={20} />
                    <h3 className="font-serif font-bold text-base">Tu Carrito LIBUSS</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-stone-800/20">
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 text-stone-500 text-xs">
                      Tu carrito está vacío.
                    </div>
                  ) : (
                    cart.map(item => {
                      const itemPrice = (item.selectedVariant?.price ?? item.product?.price) || 0;
                      return (
                        <div key={item.cartId} className={`p-3 rounded-xl border flex gap-3 ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                          <div className="w-16 h-16 rounded-lg bg-stone-900 relative overflow-hidden flex-shrink-0">
                            <img 
                              src={item.product?.image} 
                              alt={item.product?.name}
                              className="w-full h-full object-cover relative z-10"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="text-xs font-bold">{item.product?.name}</h4>
                                <button onClick={() => removeFromCart(item.cartId)} className="text-stone-400 hover:text-red-400">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <span className="text-[10px] text-pink-500 block">{item.selectedVariant?.name || 'Estándar'}</span>
                              {item.customization && (
                                <p className="text-[10px] text-stone-400 mt-0.5">
                                  {item.customization.flavor} / {item.customization.filling}
                                  {item.customization.message ? <span className="block text-amber-500 font-semibold">Frase: "{item.customization.message}"</span> : ''}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs font-bold text-pink-500">S/ {(itemPrice * (item.quantity || 1)).toFixed(2)}</span>
                              
                              <div className={`flex items-center gap-2 px-2 py-1 rounded-lg border ${darkMode ? 'bg-stone-900 border-stone-800' : 'bg-white border-stone-200'}`}>
                                <button onClick={() => updateCartQuantity(item.cartId, -1)} className="hover:text-pink-500">
                                  <Minus size={12} />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateCartQuantity(item.cartId, 1)} className="hover:text-pink-500">
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {cart.length > 0 && (
                  <div className={`p-4 border-t space-y-3 ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Cupón (ej. LIBUSS10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className={`flex-1 p-2 rounded-lg border text-xs uppercase ${darkMode ? 'bg-stone-900 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-900'}`}
                      />
                      <button onClick={applyCoupon} className="px-3 py-2 rounded-lg bg-pink-600 text-white text-xs font-bold">
                        Aplicar
                      </button>
                    </div>
                    {couponMessage && (
                      <span className={`text-[10px] block ${appliedDiscount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{couponMessage}</span>
                    )}

                    <div className="space-y-1 text-xs text-stone-400 pt-2 border-t border-stone-800">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold">S/ {(subtotal || 0).toFixed(2)}</span>
                      </div>
                      {appliedDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Descuento</span>
                          <span>-S/ {(appliedDiscount || 0).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold pt-1 border-t border-stone-800">
                        <span>Total del Pedido</span>
                        <span className="text-pink-500">S/ {(finalTotal || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-amber-500 pt-1">
                        <span>Adelanto (50% para separar)</span>
                        <span>S/ {(advancePayment || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                      className="w-full py-3.5 rounded-xl bg-pink-600 text-white font-bold text-xs hover:bg-pink-500 transition shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2"
                    >
                      <span>Continuar con Datos y Adelanto (50%)</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* CHECKOUT & PAYMENT MODAL */}
          {isCheckoutOpen && (
            <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div className={`w-full max-w-lg rounded-t-3xl sm:rounded-2xl border overflow-hidden max-h-[95vh] flex flex-col shadow-2xl ${darkMode ? 'bg-stone-900 border-stone-800 text-stone-100' : 'bg-white border-stone-200 text-stone-900'}`}>
                
                <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                  <div className="flex items-center gap-2">
                    <Truck className="text-pink-500" size={20} />
                    <h3 className="font-serif font-bold text-base">Datos y Adelanto para Separar</h3>
                  </div>
                  <button onClick={() => setIsCheckoutOpen(false)} className="p-2 rounded-full hover:bg-stone-800/20">
                    ✕
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  
                  {/* Required Shipping Form */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-pink-500 uppercase tracking-wider">1. Datos de Contacto y Envío</h4>
                    
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Nombre y Apellido *</label>
                      <input
                        type="text"
                        placeholder="Ej: Camila Valdivia"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-xs ${darkMode ? 'bg-stone-950 border-stone-800 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Teléfono / WhatsApp *</label>
                      <input
                        type="tel"
                        placeholder="Ej: +51 987 654 321"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-xs ${darkMode ? 'bg-stone-950 border-stone-800 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Dirección de Entrega *</label>
                      <input
                        type="text"
                        placeholder="Ej: Av. Larco 450, Miraflores"
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-xs ${darkMode ? 'bg-stone-950 border-stone-800 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Fecha de Entrega *</label>
                      <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className={`w-full p-2.5 rounded-lg border text-xs ${darkMode ? 'bg-stone-950 border-stone-800 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'}`}
                      />
                    </div>
                  </div>

                  {/* Payment & Advance Booking Section */}
                  <div className="space-y-3 pt-2 border-t border-stone-800">
                    <h4 className="text-xs font-bold text-pink-500 uppercase tracking-wider">2. Adelanto para Separar y Preparar</h4>
                    
                    <div className={`p-3 rounded-xl border bg-gradient-to-r from-pink-500/10 to-amber-500/10 border-pink-500/30 flex justify-between items-center text-xs`}>
                      <div>
                        <span className="text-stone-400 block">Total del Pastel: S/ {(finalTotal || 0).toFixed(2)}</span>
                        <strong className="text-amber-500 font-bold text-sm">Adelanto (50%): S/ {(advancePayment || 0).toFixed(2)}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-stone-400 block">Saldo contra entrega:</span>
                        <span className="font-bold">S/ {(remainingBalance || 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {(['Yape', 'BCP', 'Plin'] as const).map(method => (
                        <button
                          key={method}
                          onClick={() => setSelectedPayment(method)}
                          className={`p-3 rounded-xl border text-center font-bold text-xs transition ${selectedPayment === method ? 'bg-pink-500/20 border-pink-500 text-pink-400' : darkMode ? 'bg-stone-950 border-stone-800 text-stone-400' : 'bg-stone-50 border-stone-200 text-stone-700'}`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>

                    <div className={`p-4 rounded-xl border space-y-2 ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-50 border-stone-200'}`}>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-400">Titular:</span>
                        <strong className="font-bold">LIBUSS ARTESANAL S.A.C.</strong>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-400">
                          {selectedPayment === 'BCP' ? 'Nro. Cuenta BCP:' : `Nro. ${selectedPayment} (Celular):`}
                        </span>
                        <div className="flex items-center gap-2">
                          <strong className="text-pink-500 font-mono">
                            {selectedPayment === 'BCP' ? '193-77289128-0-12' : '970 380 415'}
                          </strong>
                          <button
                            onClick={() => copyToClipboard(selectedPayment === 'BCP' ? '19377289128012' : '970380415', selectedPayment)}
                            className="p-1 rounded bg-stone-900 text-white hover:text-pink-400"
                          >
                            {copiedKey === selectedPayment ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-amber-500 pt-1">
                        * Para iniciar la preparación en el obrador, se requiere abonar el adelanto del 50% (S/ {(advancePayment || 0).toFixed(2)}).
                      </p>
                    </div>

                  </div>

                </div>

                <div className={`p-4 border-t flex items-center justify-between ${darkMode ? 'bg-stone-950 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Adelanto a pagar hoy:</span>
                    <span className="text-lg font-extrabold text-amber-500">S/ {(advancePayment || 0).toFixed(2)}</span>
                  </div>

                  <button
                    onClick={handleConfirmOrder}
                    className="px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                  >
                    <MessageCircle size={18} />
                    <span>Enviar Pedido con Adelanto (WhatsApp)</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
