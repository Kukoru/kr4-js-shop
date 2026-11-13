// js/data.js

const products = [
  {
    id: 1,
    title: 'Кофемашина Barista Home',
    category: 'kitchen',
    price: 19990,
    discountPercent: 10,
    rating: 4.7,
    isAvailable: true,
    image: 'images/product-1.jpg',
    description: 'Кофемашина для приготовления эспрессо и капучино дома.'
  },
  {
    id: 2,
    title: 'Электрический чайник SmartHeat',
    category: 'kitchen',
    price: 4990,
    discountPercent: 0,
    rating: 4.5,
    isAvailable: true,
    image: 'images/product-2.jpg',
    description: 'Умный чайник с поддержанием температуры.'
  },
  {
    id: 3,
    title: 'Робот-пылесос CleanBot',
    category: 'home',
    price: 24990,
    discountPercent: 15,
    rating: 4.8,
    isAvailable: false,
    image: 'images/product-3.jpg',
    description: 'Автоматический робот-пылесос с влажной уборкой.'
  },
  {
    id: 4,
    title: 'Умная лампа LightSpace',
    category: 'home',
    price: 2990,
    discountPercent: 5,
    rating: 4.4,
    isAvailable: true,
    image: 'images/product-4.jpg',
    description: 'Лампа с управлением со смартфона и сменой цвета.'
  },
  {
    id: 5,
    title: 'Наушники SoundPro',
    category: 'electronics',
    price: 7990,
    discountPercent: 10,
    rating: 4.6,
    isAvailable: true,
    image: 'images/product-5.jpg',
    description: 'Беспроводные наушники с шумоподавлением.'
  },
  {
    id: 6,
    title: 'Портативная колонка BassBox',
    category: 'electronics',
    price: 5990,
    discountPercent: 0,
    rating: 4.3,
    isAvailable: false,
    image: 'images/product-6.jpg',
    description: 'Мощная колонка для вечеринок и прогулок.'
  },
  {
    id: 7,
    title: 'Умные часы FitTrack',
    category: 'electronics',
    price: 12990,
    discountPercent: 0,
    rating: 4.9,
    isAvailable: true,
    image: 'images/product-7.jpg',
    description: 'Фитнес-браслет с пульсометром и шагомером.'
  },
  {
    id: 8,
    title: 'Микроволновая печь HeatWave',
    category: 'kitchen',
    price: 8990,
    discountPercent: 20,
    rating: 4.2,
    isAvailable: true,
    image: 'images/product-8.jpg',
    description: 'Компактная микроволновка для быстрого разогрева.'
  }
];

window.productsData = products;