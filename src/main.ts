/**
 * Punto de entrada de la aplicación
 */

import './styles/main.css';
import { App } from './app';

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const app = new App();
    await app.init();
    
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
});
