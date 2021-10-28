import {
  MenuItem,
  OuterMenu,
  MenuGroup,
  ModifierGroup,
  ModifierOption,
  OLMenus,
  OLCategory,
} from '../interfaces/menuInterfaces';
import { SearchResults } from '../interfaces/locationInterfaces';

export const makeOlMenuUsable = (menu: OLMenus): OuterMenu => {
  const catMap: { [catId: number]: OLCategory } = {};
  menu.categories.forEach((cat) => (catMap[cat.id] = cat));
  const itemMap: { [itemId: string]: MenuItem | ModifierOption } = {};
  const modMap: { [itemId: string]: ModifierOption } = {};
  menu.items.forEach((item) => {
    const temp = {
      guid: item.id.toString(),
      price: item.pricing.default_price / 100,
      partnerSystemId: item.partner_system_id,
      barcode: item.barcode,
      quantity: 1,
      description: item.description,
      name: item.name,
      image: item.image,
      isDefault: false,
      referenceId: item.id.toString(),
      isAlcoholic: item.alcoholic_items > 0,
      modifierGroupReferences: item.modifier_groups
        ? item.modifier_groups.map((id) => id.toString())
        : [],
    };
    itemMap[item.id.toString()] = temp;
    modMap[item.id.toString()] = temp;
  });
  const modGroupMap: { [modId: string]: ModifierGroup } = {};
  menu.modifier_groups.forEach(
    (group) =>
      (modGroupMap[group.id] = {
        isMultiSelect: !(
          group.minimum_quantity === 1 &&
          group.minimum_quantity === group.maximum_quantity
        ),
        maxSelections: group.maximum_quantity || Infinity,
        minSelections: group.minimum_quantity || 0,
        modifierOptionReferences: group.modifiers
          ? group.modifiers.map((mod) => mod.id.toString())
          : [],
        name: group.name,
        referenceId: group.id.toString(),
      })
  );
  const catArray: MenuGroup[] =
    menu.menus[0] && menu.menus[0].categories
      ? menu.menus[0].categories.map((catName, idx) => {
          const category = catMap[catName];
          return {
            displayOrder: idx,
            description: category.description,
            guid: category.id.toString(),
            image: null,
            name: category.name,
            menuItems: category.items
              ? category.items.map((itemId): MenuItem => {
                  const item = itemMap[itemId] as MenuItem;
                  return {
                    isAlcoholic: item.isAlcoholic,
                    partnerSystemId: item.partnerSystemId,
                    barcode: item.barcode,
                    description: item.description,
                    guid: item.guid.toString(),
                    image: item.image,
                    modifierGroupReferences: item.modifierGroupReferences || [],
                    name: item.name,
                    price: item.price,
                  };
                })
              : [],
          };
        })
      : [];
  const transformed = {
    menus: [
      {
        availability: { alwaysAvailable: true },
        description: '',
        highResImage: null,
        image: null,
        menuGroups: catArray,
        name: menu.menus[0] && menu.menus[0].name,
      },
    ],
    modifierGroupReferences: modGroupMap,
    modifierOptionReferences: modMap,
    restaurantGuid: '',
    restaurantTimeZone: '',
  };
  return transformed;
};

/**
 *
 * @param location
 * @returns
 * Transforms all menus on a given SearchResults object
 */
export function transformLocationMenus(
  searchResults: SearchResults
): SearchResults {
  const newBrands = [];
  for (const brand of searchResults.brands) {
    if (brand.menu) {
      brand.transformedMenu = makeOlMenuUsable(brand.menu);
      newBrands.push(brand);
    }
  }
  searchResults.brands = newBrands;
  return searchResults;
}
