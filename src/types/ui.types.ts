/**
 * Tipos relacionados con la interfaz de usuario
 */

import type { CourseItem } from './api.types';

/** Opciones para mostrar un toast */
export interface ToastOptions {
  message: string;
  duration?: number;
}

/** Evento de navegación */
export interface NavigationEvent {
  direction: -1 | 1;
  currentIndex: number;
  totalItems: number;
}

/** Datos para renderizar el sidebar */
export interface SidebarRenderData {
  grouped: Map<string, Map<string, CourseItem[]>>;
  activeId: string | null;
  isCollapsed: boolean;
}

/** Datos para renderizar el player */
export interface PlayerRenderData {
  item: CourseItem;
  canEmbed: boolean;
}

/** Configuración de gestos táctiles */
export interface TouchGestureConfig {
  threshold: number;
  enableSwipe: boolean;
  enableEdgeSwipe: boolean;
}

/** Información de breadcrumb */
export interface BreadcrumbInfo {
  folder: string;
  subfolder: string;
}

/** Elementos DOM principales */
export interface DOMElements {
  // Header
  menuToggle: HTMLButtonElement;
  courseSelect: HTMLSelectElement;
  btnRefresh: HTMLButtonElement;
  btnHome: HTMLAnchorElement;

  // Sidebar
  sidebar: HTMLElement;
  sidebarOverlay?: HTMLElement;
  sidebarToggle: HTMLButtonElement;
  searchInput: HTMLInputElement;
  courseTitle: HTMLElement;
  progressFill: HTMLElement;
  navContainer: HTMLElement;

  // Main content
  contentTitle: HTMLElement;
  contentIcon: HTMLElement;
  contentBreadcrumb: HTMLElement;
  player: HTMLElement;

  // Navigation
  prevBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
  navInfo: HTMLElement;

  // Mobile navigation
  mobileMenuBtn?: HTMLButtonElement;
  mobilePrevBtn?: HTMLButtonElement;
  mobileNextBtn?: HTMLButtonElement;
  mobileHomeBtn?: HTMLButtonElement;
  mobileRefreshBtn?: HTMLButtonElement;
  resourceCounter?: HTMLElement;

  // Toast
  toast: HTMLElement;
}
