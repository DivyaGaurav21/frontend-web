import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Product type based on your MongoDB document structure
interface Product {
  _id: string
  name: string
  description: string
  specifications: string
  price: number
  discount: number
  category: string
  brand: string
  stock: number
  images: string[]
  createdAt: string
  updatedAt: string
  __v: number
}

// Cart item extends Product with quantity and addedAt timestamp
interface CartItem extends Product {
  quantity: number
  addedAt: string
}

// Cart summary interface
interface CartSummary {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  originalPrice: number
  totalDiscount: number
  savings: number
}

// Cart store state interface
interface CartStore {
  // State
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  incrementQuantity: (productId: string) => void
  decrementQuantity: (productId: string) => void
  clearCart: () => void
  
  // UI Actions
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  
  // Getters
  getTotalCartItemsNumber: () => number
  getTotalItems: () => number
  getTotalPrice: () => number
  getOriginalPrice: () => number
  getTotalDiscount: () => number
  getItemById: (productId: string) => CartItem | undefined
  isInCart: (productId: string) => boolean
  getCartSummary: () => CartSummary
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Cart state
      items: [],
      isOpen: false,
      
      // Cart actions
      addToCart: (product: Product, quantity: number = 1) => {
        const { items } = get()
        const existingItem = items.find(item => item._id === product._id)
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map(item =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          // Add new item to cart
          set({
            items: [...items, { 
              ...product, 
              quantity,
              addedAt: new Date().toISOString()
            }]
          })
        }
      },
      
      removeFromCart: (productId: string) => {
        set({
          items: get().items.filter(item => item._id !== productId)
        })
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item._id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      incrementQuantity: (productId: string) => {
        const item = get().items.find(item => item._id === productId)
        if (item && item.quantity < item.stock) {
          get().updateQuantity(productId, item.quantity + 1)
        }
      },
      
      decrementQuantity: (productId: string) => {
        const item = get().items.find(item => item._id === productId)
        if (item && item.quantity > 1) {
          get().updateQuantity(productId, item.quantity - 1)
        } else if (item && item.quantity === 1) {
          get().removeFromCart(productId)
        }
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      // Cart UI state
      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },
      
      openCart: () => {
        set({ isOpen: true })
      },
      
      closeCart: () => {
        set({ isOpen: false })
      },
      
      // Computed values (getters)
      getTotalItems: (): number => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalCartItemsNumber: (): number => {
        return get().items.length
      },
       
      getTotalPrice: (): number => {
        return get().items.reduce((total, item) => {
          const discountedPrice = item.price * (1 - item.discount / 100)
          return total + (discountedPrice * item.quantity)
        }, 0)
      },
      
      getOriginalPrice: (): number => {
        return get().items.reduce((total, item) => {
          return total + (item.price * item.quantity)
        }, 0)
      },
      
      getTotalDiscount: (): number => {
        return get().getOriginalPrice() - get().getTotalPrice()
      },
      
      getItemById: (productId: string): CartItem | undefined => {
        return get().items.find(item => item._id === productId)
      },
      
      isInCart: (productId: string): boolean => {
        return get().items.some(item => item._id === productId)
      },
      
      getCartSummary: (): CartSummary => {
        const { items } = get()
        const totalItems = get().getTotalItems()
        const totalPrice = get().getTotalPrice()
        const originalPrice = get().getOriginalPrice()
        const totalDiscount = get().getTotalDiscount()
        
        return {
          items,
          totalItems,
          totalPrice: Math.round(totalPrice * 100) / 100,
          originalPrice: Math.round(originalPrice * 100) / 100,
          totalDiscount: Math.round(totalDiscount * 100) / 100,
          savings: Math.round((totalDiscount / originalPrice) * 100) || 0
        }
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist cart items and isOpen state
      partialize: (state: CartStore) => ({ 
        items: state.items,
        isOpen: state.isOpen 
      }),
    }
  )
)

export default useCartStore
export type { Product, CartItem, CartSummary, CartStore }