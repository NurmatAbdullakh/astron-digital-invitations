export const invitationTemplates = [
  {
    id: "botanical",
    name: { uz: "Botanika", ru: "Ботаника", en: "Botanical" },
    description: { uz: "Nafis va tabiiy", ru: "Нежный и природный", en: "Soft and natural" },
    theme: "sage",
    marker: "✳",
  },
  {
    id: "editorial",
    name: { uz: "Editorial", ru: "Редакционный", en: "Editorial" },
    description: { uz: "Zamonaviy va dadil", ru: "Современный и выразительный", en: "Modern and bold" },
    theme: "sand",
    marker: "A",
  },
  {
    id: "minimal",
    name: { uz: "Minimal", ru: "Минимализм", en: "Minimal" },
    description: { uz: "Sodda va ixcham", ru: "Просто и лаконично", en: "Simple and clean" },
    theme: "rose",
    marker: "✧",
  },
] as const;

export type InvitationTemplateId = (typeof invitationTemplates)[number]["id"];
export type InvitationTheme = (typeof invitationTemplates)[number]["theme"];

export function isInvitationTemplateId(value: unknown): value is InvitationTemplateId {
  return invitationTemplates.some((template) => template.id === value);
}

export function getInvitationTemplate(id: InvitationTemplateId) {
  return invitationTemplates.find((template) => template.id === id) ?? invitationTemplates[0];
}
