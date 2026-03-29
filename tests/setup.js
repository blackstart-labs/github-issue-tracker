import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Globally mock Vue Router components if needed
config.global.stubs = {
  RouterLink: true,
  RouterView: true
}

// Mock window matchMedia for usePreferredDark and other VueUse composables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock intersection observer
window.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
