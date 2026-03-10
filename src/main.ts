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
    
    // --- Lógica del Dashboard ---
    renderDashboard(app);
    
    // --- Lógica de Administración ---
    setupAdmin();

  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
  }
}

async function renderDashboard(app: any) {
  const courseCards = document.getElementById('courseCards');
  const dashboard = document.getElementById('dashboard');
  const contentHeader = document.getElementById('contentHeader');
  const courseSelect = document.getElementById('courseSelect') as HTMLSelectElement;

  if (!courseCards || !dashboard) return;

  try {
    // Obtener la lista de cursos (hojas)
    const sheets = await app.apiService.getSheets();
    courseCards.innerHTML = ''; // Limpiar skeletons

    sheets.forEach((sheet: any) => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.innerHTML = `
        <i class="fas fa-book-medical"></i>
        <h3>${sheet.name}</h3>
        <span style="font-size: 12px; color: var(--text-secondary);">Ver contenidos</span>
      `;
      
      card.onclick = () => {
        dashboard.style.display = 'none';
        if (contentHeader) contentHeader.style.display = 'flex';
        courseSelect.value = sheet.name;
        courseSelect.dispatchEvent(new Event('change'));
      };
      
      courseCards.appendChild(card);
    });

    // Botón Home para volver al Dashboard
    const btnHome = document.getElementById('btnHome');
    const mobileHomeBtn = document.getElementById('mobileHomeBtn');
    
    const showDashboard = (e: Event) => {
      e.preventDefault();
      dashboard.style.display = 'block';
      if (contentHeader) contentHeader.style.display = 'none';
      const player = document.getElementById('player');
      if (player) {
        player.innerHTML = '';
        player.appendChild(dashboard);
      }
    };

    if (btnHome) btnHome.onclick = showDashboard;
    if (mobileHomeBtn) mobileHomeBtn.onclick = showDashboard;

  } catch (err) {
    console.error('Error cargando dashboard:', err);
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

        await fetch('https://script.google.com/macros/s/AKfycbxpQLMAswkrbx9F3zC5YbWa9OG6jraZBHhzYffJjR2jyXR2P5GWOzkywdTRwd0ckTw6rw/exec', {
          method: 'POST',
          mode: 'no-cors', 
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
