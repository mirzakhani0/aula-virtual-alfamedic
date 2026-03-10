/**
 * Punto de entrada de la aplicación
 */

import { App } from './app';
import { setupPWA } from './utils/device.utils';

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const app = new App();
    await app.init();
    
    // Configurar PWA
    setupPWA();
    
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
  }
});
