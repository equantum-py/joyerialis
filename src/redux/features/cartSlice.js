import { createSlice } from "@reduxjs/toolkit";
import { getLocalStorage, setLocalStorage } from "@/utils/localstorage";
import { notifyError, notifySuccess } from "@/utils/toast";

const initialState = {
  cart_products: [],
  orderQuantity: 1,
  cartMiniOpen:false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add_cart_product: (state, { payload }) => {
      const isExist = state.cart_products.some((i) => i._id === payload._id);
      if (!isExist) {
        const newItem = {
          ...payload,
          orderQuantity: state.orderQuantity,
        };
        state.cart_products.push(newItem);
        notifySuccess(`${state.orderQuantity} ${payload.title} agregado al carrito`);
      } else {
        state.cart_products.map((item) => {
          if (item._id === payload._id) {
            if (item.quantity >= item.orderQuantity + state.orderQuantity) {
              item.orderQuantity = state.orderQuantity !== 1 ? state.orderQuantity + item.orderQuantity : item.orderQuantity + 1;
              notifySuccess(`${state.orderQuantity} ${item.title} agregado al carrito`);
            } else {
              notifyError("No hay más unidades disponibles de este producto");
              state.orderQuantity = 1;
            }
          }
          return { ...item };
        });
      }
      setLocalStorage("cart_products", state.cart_products);
    },
    increment: (state) => { state.orderQuantity = state.orderQuantity + 1; },
    decrement: (state) => { state.orderQuantity = state.orderQuantity > 1 ? state.orderQuantity - 1 : 1; },
    quantityIncrement: (state, { payload }) => {
      state.cart_products = state.cart_products.map((item) => item._id === payload._id ? {...item,orderQuantity:Math.min(item.orderQuantity+1,item.quantity || 99)} : item);
      setLocalStorage("cart_products", state.cart_products);
    },
    quantityDecrement: (state, { payload }) => {
      state.cart_products = state.cart_products.map((item) => item._id === payload._id ? {...item,orderQuantity:Math.max(1,item.orderQuantity-1)} : item);
      setLocalStorage("cart_products", state.cart_products);
    },
    remove_product: (state, { payload }) => {
      state.cart_products = state.cart_products.filter((item) => item._id !== payload.id);
      setLocalStorage("cart_products", state.cart_products);
      notifyError(`${payload.title} eliminado del carrito`);
    },
    get_cart_products: (state) => { state.cart_products = getLocalStorage("cart_products"); },
    initialOrderQuantity: (state) => { state.orderQuantity = 1; },
    clearCart:(state) => { state.cart_products = []; setLocalStorage("cart_products", state.cart_products); },
    openCartMini:(state) => { state.cartMiniOpen = true; },
    closeCartMini:(state) => { state.cartMiniOpen = false; },
  },
});

export const { add_cart_product, increment, decrement, get_cart_products, remove_product, quantityIncrement, quantityDecrement, initialOrderQuantity, clearCart, closeCartMini, openCartMini } = cartSlice.actions;
export default cartSlice.reducer;
