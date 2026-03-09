/**
 * Entry Point - Aula Virtual MIRZAKHANI PREU
 * Punto de entrada principal de la aplicación
 */

import { App } from './app';
import './styles/main.css';

// Inicializar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

async function initApp() {
  try {
    const app = new App();
    await app.init();
    console.log('✅ Aula Virtual MIRZAKHANI PREU iniciada correctamente');
    
    // --- Lógica de Administración ---
    setupAdmin();

  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
  }
}

function setupAdmin() {
  const btnAdmin = document.getElementById('btnAdmin');
  const adminModal = document.getElementById('adminModal');
  const btnCloseAdmin = document.getElementById('btnCloseAdmin');
  const btnLogin = document.getElementById('btnLogin');
  const btnUpload = document.getElementById('btnUpload');
  
  const loginSection = document.getElementById('loginSection');
  const uploadSection = document.getElementById('uploadSection');
  const uploadStatus = document.getElementById('uploadStatus');

  if (!btnAdmin || !adminModal || !btnCloseAdmin || !btnLogin || !btnUpload) return;

  btnAdmin.onclick = () => {
    adminModal.style.display = 'flex';
  };

  btnCloseAdmin.onclick = () => {
    adminModal.style.display = 'none';
    // Resetear al cerrar
    loginSection!.style.display = 'block';
    uploadSection!.style.display = 'none';
    (document.getElementById('adminPass') as HTMLInputElement).value = '';
    uploadStatus!.innerText = '';
  };

  btnLogin.onclick = () => {
    const user = (document.getElementById('adminUser') as HTMLInputElement).value;
    const pass = (document.getElementById('adminPass') as HTMLInputElement).value;

    if (user === 'mirzakhani@gmail.com' && pass === 'YOSOYSUPERIOR&#MIRZAKHANI') {
      loginSection!.style.display = 'none';
      uploadSection!.style.display = 'block';
      uploadStatus!.innerText = '✅ Autenticado';
      uploadStatus!.style.color = 'green';
    } else {
      alert('Credenciales incorrectas');
    }
  };

  btnUpload.onclick = async () => {
    const sheetName = (document.getElementById('targetSheet') as HTMLInputElement).value;
    const fileInput = document.getElementById('excelFile') as HTMLInputElement;
    const pass = 'YOSOYSUPERIOR&#MIRZAKHANI';

    if (!sheetName || !fileInput.files?.[0]) {
      alert('Por favor, ingresa el nombre de la hoja y selecciona un archivo.');
      return;
    }

    uploadStatus!.innerText = '⏳ Procesando Excel...';
    uploadStatus!.style.color = 'blue';

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = (window as any).XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.SheetNames[0];
        const rows = (window as any).XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1 });

        uploadStatus!.innerText = '🚀 Subiendo a Google Sheets...';

        const response = await fetch('https://script.google.com/macros/s/AKfycbwdb4ToRIuHsfkfB5cXuQisJUY-qlUYxvX0d8mpkX9iGaH4eSj4QLNxhRCpRkDPQPbG/exec', {
          method: 'POST',
          mode: 'no-cors', // Necesario para Google Apps Script POST desde web
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateData',
            sheetName: sheetName,
            rows: rows,
            password: pass
          })
        });

        uploadStatus!.innerText = '✅ ¡Actualización enviada! (Verifica en unos segundos)';
        uploadStatus!.style.color = 'green';
        
        setTimeout(() => location.reload(), 3000);

      } catch (err) {
        console.error(err);
        uploadStatus!.innerText = '❌ Error al procesar: ' + err;
        uploadStatus!.style.color = 'red';
      }
    };

    reader.readAsArrayBuffer(file);
  };
}
