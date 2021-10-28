import { SearchResults } from './locationInterfaces';
/**
 * Holds necessary information for a single brand.
 */
export interface Brand {
  locationBrandId: string;
  id: string;
  name: string;
  menu: OLMenus;
  transformedMenu?: OuterMenu;
  menuId: number;
  brandId?: string;
  hoursOfOperation: HoursOfOperation;
  timeZone?: string;
  isOpen?: boolean;
  location: SearchResults;
  distance?: number;
  integrationId?: string | number;
  newApi?: boolean;
  vessel: string;
}
/**
 * The object that holds hours in a week and holiday hours
 */
export interface HoursOfOperation {
  holiday_hours: HoursObject;
  opening_hours: HoursObject;
}
/**
 * The object used for storing hours of operation in a week
 */
export interface HoursObject {
  [weekday: string]: OperationHours[];
}
/**
 * The object used for storing the operation hours for a day
 */
export interface OperationHours {
  start_time: string;
  end_time: string;
}
/**
 * Holds a list of menus for a particular brand.
 */
export interface OuterMenu {
  lastUpdated?: string;
  menus: Menu[];
  modifierGroupReferences: {
    [key: string]: ModifierGroup;
  };
  modifierOptionReferences: {
    [key: string]: ModifierOption;
  };
  restaurantGuid: string;
  restaurantTimeZone: string;
}
/**
 * A single menu for a brand.
 */
export interface Menu {
  availability: { alwaysAvailable: boolean };
  description: string;
  highResImage: string | null;
  image: string | null;
  menuGroups: MenuGroup[];
  name: string;
}
/**
 * A group within the menu object.
 */
export interface MenuGroup {
  displayOrder?: number;
  description: string;
  image: null;
  menuItems: MenuItem[];
  name: string;
  guid: string;
}
/**
 * A single item within a menu group.
 */
export interface MenuItem {
  cartId?: string;
  partnerSystemId: string;
  barcode: string | null;
  description: string;
  guid: string | number;
  image: string | null;
  modifierGroupReferences: string[];
  name: string;
  price: number;
  isAlcoholic: boolean;
  modifiers?: {
    [key: string]: { [key: string]: ModifierOption };
  };
  note?: string;
}
/**
 * A group of modifiers for a menu item that can be used fro multiple items.
 */
export interface ModifierGroup {
  isMultiSelect: boolean;
  maxSelections: number;
  minSelections: number;
  modifierOptionReferences: string[];
  name: string;
  referenceId: string | number;
}
/**
 * The interface for an object within a modifier group.
 */
export interface ModifierOption {
  partnerSystemId: string;
  barcode: string | null;
  description: string;
  guid: string | number;
  image: string | null;
  isDefault: boolean;
  //modifierGroupReferences: [];
  name: string;
  price: number;
  referenceId: string | number;
  quantity: number;
}

export interface OLMenus {
  menus: OLMenu[];
  modifier_groups: OLModifierGroup[];
  categories: OLCategory[];
  items: OLItem[];
}

export interface OLMenu {
  id: number;
  name: string;
  categories: number[];
  availability_hours: OLHours;
}

export interface OLModifierGroup {
  id: number;
  name: string;
  description: string;
  minimum_quantity?: number;
  maximum_quantity?: number;
  modifiers: OLModifierGroupItem[];
}

export interface OLModifierGroupItem {
  id: 2517111;
  overrides: {
    price: number;
  };
}

export interface OLCategory {
  id: number;
  name: string;
  description: string;
  subcategories: number[];
  items: number[];
  display_order?: number;
}

export interface OLItem {
  id: number;
  partner_system_id: string;
  barcode: string | null;
  active: boolean;
  prep_time: number;
  name: string;
  description: string;
  tax_rate: number;
  image: string;
  modifier_groups: number[];
  display_order?: number;
  price: number;
  alcoholic_items: number;
  pricing: {
    default_price: number;
    default_tax_rate: number;
    delivery_price: number;
    delivery_tax_rate: number;
    collection_price: number;
    collection_tax_rate: number;
    store_price: number;
    store_tax_rate: number;
    additional_price: number;
  };
}

export interface OLHours {
  regular: {
    [day: string]: OLInterval;
  };
  special: {
    [date: string]: OLInterval; // If start == end == "00:00", brand closed all day
  };
}

export interface OLInterval {
  start: string;
  end: string;
}
