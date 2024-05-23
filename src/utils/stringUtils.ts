export const keyReplace = (str: string, data: Record<string, string>): string => {
  return Object.entries(data).reduce((s, [k, v]) => {
    return s.replace(new RegExp(`{{${k}}}`, 'g'), v)
  }, str)
}