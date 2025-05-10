export const ENUMS = {
  AUTO_MODE: {
    NORMAL: 0,
    AUTO_ACCEPT: 1,
    AUTO_REJECT: 2,
  },
  ORDER_STATUS: {
    DRAFT: 1,
    PROCESSING: 2,
    ACCEPTED: 3,
    REJECTED: 4,
  },
  ADMIN_STATUS: {
    OFFLINE: 1,
    ONLINE: 2,
    DISABLED: 3,
  },
  PRODUCT_PURCHASE_MODE: {
    VALUE: 1,
    VOLUME: 2,
  },
  ORDER_SIDE: {
    BUY: 1,
    SELL: 2,
  },
  PRODUCT_STATUS: {
    DISABLED: 0,
    BUY_ONLY: 1,
    SELL_ONLY: 2,
    BUY_AND_SELL: 3,
  },
}

export const PERSIAN_ENUMS = {
  ADMIN_STATUS: { 1: "آفلاین", 2: "آنلاین", 3: "غیرفعال" },
  AUTO_MODE: ["عادی", "تایید خودکار", "رد خودکار"],
  ORDER_SIDE: { 1: "خرید", 2: "فروش" },
  ORDER_STATUS: { 1: "پیش‌نویس", 2: "درحال‌ پردازش", 3: "قبول‌شده", 4: "ردشده" },
  PRODUCT_STATUS: {
    0: "غیرفعال",
    1: "قابل خرید توسط مشتری",
    2: "قابل فروش توسط مشتری",
    3: "قابل خرید و فروش",
  },
  USER_STATUS: ["فعال", "مسدودشده", "غیرفعال"],
  USER_TYPE: { 8: "مدیر", 7: "کاربر", 3: "ادمین" },
  PRODUCT_PURCHASE_MODE: { 1: "ریالی", 2: "وزنی" },
}

const UNKNOWN = "نامعلوم"

export const enumToText = (enumName: keyof typeof PERSIAN_ENUMS, code: string | number) =>
  PERSIAN_ENUMS[enumName][code] || UNKNOWN
