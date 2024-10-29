export const DATA_ATTRIBUTES = {
  ITEM_ID: 'data-particle-effect-item-id',
};

export const eventNames = {
  particleStart: (id: string) => `particle-effect-start-${id}`,
};

export const selectors = {
  getItemById: (id: string) => {
    return `[${DATA_ATTRIBUTES.ITEM_ID}="${id}"]`;
  },
};
