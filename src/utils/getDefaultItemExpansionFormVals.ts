import { OuterMenu, IItemExpansionForm } from '../interfaces';
// This is used to get the defaults for the ItemExpansion form if now
// previous selections are provided
export function getDefaultItemExpansionFormVals(
  modifiersGroupReferences: string[],
  menu: OuterMenu,
  unavailableSet: Set<string>
) {
  const formDefaults: IItemExpansionForm = {};
  for (const groupId of modifiersGroupReferences) {
    const groupObj = menu.modifierGroupReferences[groupId];
    const filteredGroup = groupObj.modifierOptionReferences.filter(
      (opt) => !unavailableSet.has(opt)
    );
    if (filteredGroup.length) {
      if (groupObj.isMultiSelect) {
        formDefaults[groupId] = {};
      } else {
        // If the group is a single select, default to the first option.
        const firstOption = menu.modifierOptionReferences[filteredGroup[0]];
        formDefaults[groupId] = { [firstOption.referenceId]: firstOption };
      }
    }
  }
  return formDefaults;
}
