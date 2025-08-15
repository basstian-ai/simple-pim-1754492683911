export type AttributeGroupInput = {
  name: unknown;
  attributes?: unknown;
};

export type AttributeGroup = {
  id?: string;
  name: string;
  attributes: string[];
};

export function validateAttributeGroup(input: AttributeGroupInput) {
  const errors: Record<string, string> = {};
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!name) {
    errors.name = 'Name is required and must be a non-empty string.';
  } else if (name.length > 200) {
    errors.name = 'Name must be at most 200 characters.';
  }

  const attributes = Array.isArray(input.attributes)
    ? input.attributes.map((a) => (typeof a === 'string' ? a.trim() : '')).filter(Boolean)
    : [];

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    value: {
      name,
      attributes,
    } as AttributeGroup,
  };
}
