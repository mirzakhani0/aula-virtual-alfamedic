/**
 * Componente Player
 * Maneja la visualización de contenido (videos, PDFs, forms, etc.)
 */

import type { CourseItem } from '../types/api.types';
import { escapeHtml } from '../utils/dom.utils';
import { canEmbedUrl, getPlatformName, getPlatformIcon } from '../utils/helpers';

export class Player {
  private zoomLevel: number = 1;
  private currentIframe: HTMLIFrameElement | null = null;
  private controlsHideTimer: number | null = null;
  private initialPinchDistance: number = 0;
  private lastTapTime: number = 0;

  constructor(
    private playerElement: HTMLElement,
    private contentTitle: HTMLElement,
    private contentIcon: HTMLElement,
    private contentBreadcrumb: HTMLElement
  ) {
    this.setupFullscreenListener();
    this.setupPinchZoom();
    this.setupDoubleTap();
  }

  /**
   * Renderiza un item en el player
   */
  render(item: CourseItem, currentIndex: number = -1, totalItems: number = 0): void {
    // Actualizar header
    this.contentTitle.textContent = item.name || 'Sin nombre';
    this.contentIcon.className = `${item.icon || 'fas fa-play-circle'} content-icon`;

    // Actualizar breadcrumb y progreso
    let infoHtml = '';
    if (item.folder) {
      infoHtml += `<span class="badge-week"><i class="fas fa-folder"></i> ${escapeHtml(item.folder)}</span>`;
    }
    if (item.subfolder) {
      infoHtml += `<span class="badge-sub"><i class="fas fa-folder-open"></i> ${escapeHtml(item.subfolder)}</span>`;
    }
    
    // Añadir contador de progreso
    if (currentIndex >= 0 && totalItems > 0) {
      infoHtml += `<span class="badge-progress"><i class="fas fa-list-ol"></i> Recurso ${currentIndex + 1} de ${totalItems}</span>`;
    }

    this.contentBreadcrumb.innerHTML = infoHtml || 'Recurso principal';

    // Renderizar contenido
    const canEmbed = canEmbedUrl(item.url);

    if (canEmbed && item.embedUrl) {
      this.renderEmbedded(item);
    } else if (item.url) {
      this.renderExternal(item);
    } else {
      this.renderNoPreview();
    }
  }

  /**
   * Renderiza contenido embebido
   */
  private renderEmbedded(item: CourseItem): void {
    let embedUrl = item.embedUrl;

    // Forzar el formato más compatible para Google Drive
    if (item.url.includes('drive.google.com')) {
      const fileId = item.url.match(/\/d\/([^/]+)/);
      if (fileId && fileId[1]) {
        embedUrl = `https://docs.google.com/file/d/${fileId[1]}/preview`;
      } else {
        // Si no hay ID válido, mostrar mensaje de error en lugar de iframe roto
        this.renderNoPreview();
        return;
      }
    }

    if (!embedUrl || embedUrl === 'undefined') {
      this.renderNoPreview();
      return;
    }

    this.playerElement.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.src = embedUrl;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    this.playerElement.appendChild(iframe);
    this.currentIframe = iframe;

    if (window.innerWidth <= 768) {
      this.addFloatingControls();
    }
  }

  /**
   * Renderiza enlace externo
   */
  private renderExternal(item: CourseItem): void {
    const platformName = getPlatformName(item.url);
    const platformIcon = getPlatformIcon(item.url);

    this.playerElement.innerHTML = `
      <div class="player-empty">
        <i class="${platformIcon}" aria-hidden="true"></i>
        <h3>${escapeHtml(item.name)}</h3>
        <p>Este contenido se abre en una nueva ventana</p>
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">
          <span>Abrir ${platformName}</span>
          <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    `;
  }

  /**
   * Renderiza mensaje de "sin vista previa"
   */
  private renderNoPreview(): void {
    this.playerElement.innerHTML = `
      <div class="player-empty">
        <i class="fas fa-exclamation-circle" aria-hidden="true"></i>
        <p>No hay vista previa disponible</p>
      </div>
    `;
  }

  /**
   * Renderiza estado vacío inicial
   */
  renderEmpty(): void {
    this.contentTitle.textContent = 'Sin recursos disponibles';
    this.contentBreadcrumb.innerHTML = 'No hay recursos que coincidan';

    this.playerElement.innerHTML = `
      <div class="player-empty">
        <i class="fas fa-search" aria-hidden="true"></i>
        <p>No se encontraron recursos</p>
      </div>
    `;
  }

  /**
   * Renderiza estado de bienvenida
   */
  renderWelcome(): void {
    this.playerElement.innerHTML = `
      <div class="player-empty">
        <i class="fas fa-rocket" aria-hidden="true"></i>
        <h3>¡Comienza tu aprendizaje!</h3>
        <p>Selecciona un recurso del menú para empezar</p>
      </div>
    `;
  }

  /**
   * Renderiza estado de carga
   */
  renderLoading(): void {
    this.playerElement.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; gap: 16px; padding: 16px;">
        <div class="skeleton skeleton-player" style="flex: 1;"></div>
        <div style="display: flex; gap: 12px; align-items: center;">
          <div class="skeleton skeleton-icon" style="width: 32px; height: 32px;"></div>
          <div style="flex: 1;">
            <div class="skeleton" style="width: 60%; height: 12px; margin-bottom: 8px;"></div>
            <div class="skeleton" style="width: 30%; height: 8px;"></div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Agrega controles flotantes (solo fullscreen)
   */
  private addFloatingControls(): void {
    // Crear contenedor de controles
    const controls = document.createElement('div');
    controls.className = 'player-controls';

    // Botón de fullscreen
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.className = 'player-control-btn fullscreen';
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullscreenBtn.setAttribute('aria-label', 'Pantalla completa');
    fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    controls.appendChild(fullscreenBtn);

    this.playerElement.appendChild(controls);
  }

  /**
   * Aplicar zoom al iframe (usado por pinch-to-zoom)
   */
  private applyZoom(): void {
    if (this.currentIframe) {
      this.currentIframe.style.transform = `scale(${this.zoomLevel})`;
      this.currentIframe.style.transformOrigin = 'center center';
      this.currentIframe.style.width = `${100 / this.zoomLevel}%`;
      this.currentIframe.style.height = `${100 / this.zoomLevel}%`;

      // Permitir scroll cuando hay zoom
      if (this.zoomLevel > 1) {
        this.playerElement.style.overflow = 'auto';
      } else {
        this.playerElement.style.overflow = 'hidden';
      }
    }
  }

  /**
   * Activar/desactivar pantalla completa
   */
  private toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      this.playerElement.requestFullscreen().catch((err) => {
        console.error('Error al activar pantalla completa:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * Configurar listener para cambios de fullscreen
   */
  private setupFullscreenListener(): void {
    document.addEventListener('fullscreenchange', () => {
      const fullscreenBtn = this.playerElement.querySelector('.fullscreen');
      if (fullscreenBtn) {
        const icon = fullscreenBtn.querySelector('i');
        if (icon) {
          icon.className = document.fullscreenElement ? 'fas fa-compress' : 'fas fa-expand';
        }
      }
    });
  }

  /**
   * Configurar pinch-to-zoom con 2 dedos
   */
  private setupPinchZoom(): void {
    this.playerElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        this.initialPinchDistance = this.getDistanceBetweenTouches(e.touches);
      }
    }, { passive: false });

    this.playerElement.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.initialPinchDistance > 0) {
        e.preventDefault();

        const currentDistance = this.getDistanceBetweenTouches(e.touches);
        const scale = currentDistance / this.initialPinchDistance;

        // Aplicar zoom incremental
        const newZoomLevel = this.zoomLevel * scale;

        // Limitar entre 0.5x y 3x
        if (newZoomLevel >= 0.5 && newZoomLevel <= 3) {
          this.zoomLevel = newZoomLevel;
          this.applyZoom();
        }

        this.initialPinchDistance = currentDistance;
      }
    }, { passive: false });

    this.playerElement.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        this.initialPinchDistance = 0;
      }
    });
  }

  /**
   * Calcular distancia entre 2 puntos táctiles
   */
  private getDistanceBetweenTouches(touches: TouchList): number {
    const touch1 = touches[0];
    const touch2 = touches[1];

    const dx = touch2.clientX - touch1.clientX;
    const dy = touch2.clientY - touch1.clientY;

    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Configurar doble-tap para mostrar controles fullscreen
   */
  private setupDoubleTap(): void {
    this.playerElement.addEventListener('touchend', (e) => {
      // Solo con 1 dedo
      if (e.touches.length > 0 || e.changedTouches.length !== 1) return;

      const target = e.target as HTMLElement;
      if (target.closest('.player-control-btn')) return;

      const currentTime = Date.now();
      const timeSinceLastTap = currentTime - this.lastTapTime;

      // Doble tap detectado (menos de 300ms entre taps)
      if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        this.showControls();
        this.lastTapTime = 0;
      } else {
        this.lastTapTime = currentTime;
      }
    });
  }

  /**
   * Mostrar controles temporalmente
   */
  private showControls(): void {
    const controls = this.playerElement.querySelector('.player-controls');
    if (!controls || window.innerWidth > 768) return;

    // Mostrar controles
    controls.classList.add('visible');

    // Vibración corta para feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    // Cancelar timer anterior
    if (this.controlsHideTimer) {
      window.clearTimeout(this.controlsHideTimer);
    }

    // Ocultar después de 4 segundos
    this.controlsHideTimer = window.setTimeout(() => {
      controls.classList.remove('visible');
    }, 4000);
  }
}
